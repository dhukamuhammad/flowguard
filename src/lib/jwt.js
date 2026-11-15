import { SignJWT, jwtVerify } from "jose";

export const ADMIN_COOKIE_NAME = "fg_admin_token";
export const LEGACY_ADMIN_COOKIE_NAME = "admin_auth";
const ADMIN_TOKEN_TTL = "24h";

function getJwtSecretBytes() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("Server auth configuration error: missing JWT_SECRET.");
  }
  return new TextEncoder().encode(secret);
}

/**
 * Signs an HS256 JWT token for the single authenticated admin account.
 */
export async function signAdminToken(admin) {
  return new SignJWT({
    sub: String(admin.id),
    username: admin.username,
    role: "admin",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ADMIN_TOKEN_TTL)
    .sign(getJwtSecretBytes());
}

/**
 * Verifies an admin JWT token and returns its payload or null if invalid/expired.
 */
export async function verifyAdminToken(token) {
  if (!token || typeof token !== "string") return null;
  try {
    const { payload } = await jwtVerify(token, getJwtSecretBytes(), {
      algorithms: ["HS256"],
    });
    if (payload?.role !== "admin" || !payload?.sub || !payload?.username) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Standard HttpOnly cookie attributes for admin JWT storage.
 */
export function buildAdminCookieOptions(maxAgeSeconds = 60 * 60 * 24) {
  return {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
    secure: process.env.NODE_ENV === "production",
  };
}

