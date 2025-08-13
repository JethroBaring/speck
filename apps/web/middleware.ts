import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ["/projects"];

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const sessionCookie = request.cookies.get("better-auth.session_token");

    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/projects/:path*"],
};