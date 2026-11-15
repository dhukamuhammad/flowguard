import { NextResponse } from "next/server";
import { getSingleAdmin, updateSingleAdmin } from "@/lib/adminDb";
import { decryptSecret } from "@/lib/password";
import {
  ADMIN_COOKIE_NAME,
  buildAdminCookieOptions,
  signAdminToken,
  verifyAdminToken,
} from "@/lib/jwt";

async function authenticateRequest(request) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminToken(token);
}

function serializeAdminProfile(row) {
  const decrypted = decryptSecret(row?.password_encrypted);
  return {
    id: row.id,
    username: row.username,
    password: decrypted || "",
    has_viewable_password: Boolean(decrypted),
    updated_at: row.updated_at,
  };
}

export async function GET(request) {
  try {
    const session = await authenticateRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const admin = await getSingleAdmin({ includeEncrypted: true });
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Admin account not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: serializeAdminProfile(admin),
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const session = await authenticateRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const username =
      typeof body?.username === "string" ? body.username.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!username || username.length < 3) {
      return NextResponse.json(
        {
          success: false,
          error: "Username must be at least 3 characters long.",
        },
        { status: 400 }
      );
    }

    if (password.length > 0 && password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 6 characters long.",
        },
        { status: 400 }
      );
    }

    const updated = await updateSingleAdmin({ username, password });
    const freshToken = await signAdminToken(updated);

    const response = NextResponse.json({
      success: true,
      admin: serializeAdminProfile(updated),
    });
    response.cookies.set(
      ADMIN_COOKIE_NAME,
      freshToken,
      buildAdminCookieOptions()
    );
    return response;
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update settings." },
      { status: 500 }
    );
  }
}

export function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "Creating new admin accounts is disabled. Only editing is allowed.",
    },
    { status: 405 }
  );
}

export function DELETE() {
  return NextResponse.json(
    {
      success: false,
      error: "Deleting the admin account is disabled.",
    },
    { status: 405 }
  );
}
