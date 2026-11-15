import fs from "node:fs";
import path from "node:path";
import pg from "pg";

const { Client } = pg;

/**
 * Loads key=value pairs from .env.local without extra dependencies.
 */
function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    throw new Error(".env.local file not found");
  }
  const content = fs.readFileSync(envPath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eqIndex = line.indexOf("=");
    if (eqIndex === -1) continue;
    const key = line.slice(0, eqIndex).trim();
    let val = line.slice(eqIndex + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

async function main() {
  loadEnvLocal();
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Missing DIRECT_URL or DATABASE_URL in .env.local");
  }

  const schemaPath = path.resolve(process.cwd(), "supabase/schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    await client.query(sql);
    await client.query("NOTIFY pgrst, 'reload schema';");
    console.log("SUCCESS: supabase/schema.sql pushed to Supabase Postgres!");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("Schema push failed:", err.message);
  process.exit(1);
});

