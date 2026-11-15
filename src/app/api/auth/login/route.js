import { NextResponse } from "next/server";
import { backfillEncryptedPassword, getSingleAdmin } from "@/lib/adminDb";
import { verifyPassword } from "@/lib/password";
import {
  ADMIN_COOKIE_NAME,
  LEGACY_ADMIN_COOKIE_NAME,
  buildAdminCookieOptions,
  signAdminToken,
} from "@/lib/jwt";

export async function POST(request) {
  try {
    const body = await request.json();
    const username =
      typeof body?.username === "string" ? body.username.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required." },
        { status: 400 }
      );
    }

    const admin = await getSingleAdmin({
      includeHash: true,
      includeEncrypted: true,
    });
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Admin account is unavailable." },
        { status: 500 }
      );
    }

    const usernameMatches =
      admin.username.toLowerCase() === username.toLowerCase();
    const passwordMatches = verifyPassword(password, admin.password_hash);

    if (!usernameMatches || !passwordMatches) {
      return NextResponse.json(
        { success: false, error: "Invalid username or password." },
        { status: 401 }
      );
    }

    if (!admin.password_encrypted) {
      await backfillEncryptedPassword(admin.id, password);
    }

    const token = await signAdminToken(admin);
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
      },
    });

    response.cookies.set(ADMIN_COOKIE_NAME, token, buildAdminCookieOptions());
    response.cookies.set(LEGACY_ADMIN_COOKIE_NAME, "", buildAdminCookieOptions(0));
    return response;
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message || "Authentication failed." },
      { status: 500 }
    );
  }
}
