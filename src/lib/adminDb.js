import { Pool } from "pg";
import { encryptSecret, hashPassword } from "@/lib/password";

const globalForPg = globalThis;

function getPool() {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Missing database connection URL on server.");
  }

  if (!globalForPg.__flowGuardPgPool) {
    globalForPg.__flowGuardPgPool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
  }
  return globalForPg.__flowGuardPgPool;
}

const DEFAULT_ADMIN_USERNAME =
  process.env.DEFAULT_ADMIN_USERNAME || "admin@flowguard.com";
const DEFAULT_ADMIN_PASSWORD =
  process.env.DEFAULT_ADMIN_PASSWORD || "admin123";

/**
 * Retrieves the single admin user row, automatically seeding the default
 * admin account cleanly if the table has not been initialized yet.
 */
export async function getSingleAdmin({
  includeHash = false,
  includeEncrypted = false,
} = {}) {
  const pool = getPool();
  const fields = ["id", "username", "updated_at"];
  if (includeHash) fields.push("password_hash");
  if (includeEncrypted) fields.push("password_encrypted");
  const cols = fields.join(", ");

  let result = await pool.query(
    `SELECT ${cols} FROM public.admin_users ORDER BY id ASC LIMIT 1`
  );

  if (result.rows.length === 0) {
    const initialHash = hashPassword(DEFAULT_ADMIN_PASSWORD);
    const initialEncrypted = encryptSecret(DEFAULT_ADMIN_PASSWORD);
    await pool.query(
      `INSERT INTO public.admin_users (username, password_hash, password_encrypted)
       VALUES ($1, $2, $3)
       ON CONFLICT (username) DO NOTHING`,
      [DEFAULT_ADMIN_USERNAME, initialHash, initialEncrypted]
    );
    result = await pool.query(
      `SELECT ${cols} FROM public.admin_users ORDER BY id ASC LIMIT 1`
    );
  }

  return result.rows[0] || null;
}

/**
 * Populates password_encrypted on login if an account predated the encrypted column.
 */
export async function backfillEncryptedPassword(id, plainPassword) {
  const encrypted = encryptSecret(plainPassword);
  if (!encrypted) return;
  const pool = getPool();
  await pool.query(
    `UPDATE public.admin_users
     SET password_encrypted = $1
     WHERE id = $2 AND password_encrypted IS NULL`,
    [encrypted, id]
  );
}

/**
 * Updates the existing single admin user's username and/or password.
 */
export async function updateSingleAdmin({ username, password }) {
  const pool = getPool();
  const existing = await getSingleAdmin({
    includeHash: true,
    includeEncrypted: true,
  });
  if (!existing) {
    throw new Error("Admin account record could not be initialized.");
  }

  const nextUsername = username.trim();
  const hasNewPassword = typeof password === "string" && password.length > 0;
  const nextPasswordHash = hasNewPassword
    ? hashPassword(password)
    : existing.password_hash;
  const nextPasswordEncrypted = hasNewPassword
    ? encryptSecret(password)
    : existing.password_encrypted;

  const { rows } = await pool.query(
    `UPDATE public.admin_users
     SET username = $1,
         password_hash = $2,
         password_encrypted = $3,
         updated_at = now()
     WHERE id = $4
     RETURNING id, username, password_encrypted, updated_at`,
    [nextUsername, nextPasswordHash, nextPasswordEncrypted, existing.id]
  );

  return rows[0] || null;
}
