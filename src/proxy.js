import { NextResponse } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "./lib/auth";

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname.startsWith("/login")) {
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};