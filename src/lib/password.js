import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

const KEY_LENGTH = 64;
const AES_ALGO = "aes-256-gcm";

function getEncryptionKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("Server encryption configuration error: missing JWT_SECRET.");
  }
  return createHash("sha256").update(secret).digest();
}

/**
 * Hashes a plaintext password with a random 16-byte salt using Node scrypt.
 */
export function hashPassword(plainPassword) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(plainPassword, salt, KEY_LENGTH).toString("hex");
  return `scrypt:${salt}:${derived}`;
}

/**
 * Compares a plaintext candidate against a stored scrypt hash in constant time.
 */
export function verifyPassword(plainPassword, storedHash) {
  if (typeof plainPassword !== "string" || typeof storedHash !== "string") {
    return false;
  }
  const parts = storedHash.split(":");
  if (parts.length !== 3 || parts[0] !== "scrypt") {
    return false;
  }
  const [, salt, originalHex] = parts;
  if (!salt || !originalHex) return false;

  const originalBuf = Buffer.from(originalHex, "hex");
  const derivedBuf = scryptSync(plainPassword, salt, originalBuf.length);
  if (derivedBuf.length !== originalBuf.length) {
    return false;
  }
  return timingSafeEqual(derivedBuf, originalBuf);
}

/**
 * Encrypts a string using AES-256-GCM for authenticated admin-only retrieval.
 */
export function encryptSecret(plainText) {
  if (typeof plainText !== "string" || !plainText) return null;
  const iv = randomBytes(12);
  const cipher = createCipheriv(AES_ALGO, getEncryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return `aes256gcm:${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

/**
 * Decrypts an AES-256-GCM encrypted secret, returning null if absent or invalid.
 */
export function decryptSecret(storedCipher) {
  if (typeof storedCipher !== "string" || !storedCipher.startsWith("aes256gcm:")) {
    return null;
  }
  try {
    const [, ivHex, tagHex, dataHex] = storedCipher.split(":");
    if (!ivHex || !tagHex || !dataHex) return null;

    const decipher = createDecipheriv(
      AES_ALGO,
      getEncryptionKey(),
      Buffer.from(ivHex, "hex")
    );
    decipher.setAuthTag(Buffer.from(tagHex, "hex"));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(dataHex, "hex")),
      decipher.final(),
    ]);
    return decrypted.toString("utf8");
  } catch {
    return null;
  }
}
