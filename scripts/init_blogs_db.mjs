import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { STATIC_BLOGS } from "../src/data/staticBlogs.js";

const req = createRequire(path.resolve(process.cwd(), "package.json"));
const { Client } = req("pg");

for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const idx = line.indexOf("=");
  if (idx > 0 && !line.trim().startsWith("#")) {
    const k = line.slice(0, idx).trim();
    const v = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[k]) process.env[k] = v;
  }
}

async function migrateAndSeed() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("Connected to Supabase Postgres.");

  // 1. Create table
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.blogs (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      cover_image TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      status SMALLINT NOT NULL DEFAULT 1 CHECK (status IN (0, 1)),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  console.log("Table public.blogs verified / created.");

  // 2. Create indexes
  await client.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs (slug);
    CREATE INDEX IF NOT EXISTS idx_blogs_status_created ON public.blogs (status, created_at DESC);
  `);
  console.log("Indexes verified / created.");

  // 3. RLS & Policy
  await client.query(`
    ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'blogs' AND policyname = 'Allow public full access for blogs'
      ) THEN
        CREATE POLICY "Allow public full access for blogs" ON public.blogs FOR ALL TO public USING (true) WITH CHECK (true);
      END IF;
    END $$;
  `);
  console.log("RLS & Policies verified / created.");

  // 4. Seed initial 6 static blogs if table is empty
  const countRes = await client.query("SELECT COUNT(*) AS total FROM public.blogs");
  const total = Number(countRes.rows[0]?.total || 0);
  console.log(`Current blogs count in DB: ${total}`);

  if (total === 0) {
    console.log("Seeding initial 6 blogs into public.blogs...");
    for (const blog of STATIC_BLOGS) {
      await client.query(
        `INSERT INTO public.blogs (title, slug, cover_image, description, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, 1, $5, $5)
         ON CONFLICT (slug) DO NOTHING`,
        [
          blog.title,
          blog.slug,
          blog.cover_image,
          blog.description.trim(),
          blog.created_at || new Date().toISOString(),
        ]
      );
    }
    console.log("Successfully seeded 6 blogs into public.blogs.");
  } else {
    console.log("Table already contains blogs. Skipping seed.");
  }

  // 5. Query back to verify
  const verifyRes = await client.query(
    "SELECT id, title, slug, status, created_at FROM public.blogs ORDER BY id ASC"
  );
  console.log("VERIFIED BLOGS IN DB:", verifyRes.rows);

  await client.end();
}

migrateAndSeed().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

