import { NextResponse } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "./lib/auth";

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  const isProtectedPage =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/admin-query-panel");

  const isProtectedQueryApi =
    pathname.startsWith("/api/queries") && method !== "POST";

  if (!session && isProtectedQueryApi) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  if (!session && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/login") && session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin-query-panel/:path*",
    "/api/queries/:path*",
    "/login",
  ],
};