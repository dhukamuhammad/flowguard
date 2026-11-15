import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/jwt";

const STATIC_ASSET_EXT = /\.(?:png|jpe?g|gif|svg|webp|ico|css|js|map|woff2?)$/i;

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Allow static assets stored under public/admin/ (e.g. /admin/flowguard-logo.png)
  if (STATIC_ASSET_EXT.test(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifyAdminToken(token);

  // Logged-in admins visiting /admin/login go straight to dashboard
  if (pathname === "/admin/login") {
    if (session) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Protect admin API endpoints with 401 JSON when unauthenticated
  if (pathname.startsWith("/api/admin")) {
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // Protect all other /admin/* pages by redirecting to /admin/login
  if (pathname.startsWith("/admin")) {
    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
