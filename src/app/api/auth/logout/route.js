import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  LEGACY_ADMIN_COOKIE_NAME,
  buildAdminCookieOptions,
} from "@/lib/jwt";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE_NAME, "", buildAdminCookieOptions(0));
  response.cookies.set(LEGACY_ADMIN_COOKIE_NAME, "", buildAdminCookieOptions(0));
  return response;
}

