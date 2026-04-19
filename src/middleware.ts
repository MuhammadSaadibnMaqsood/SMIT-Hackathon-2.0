/**
 * Middleware — Helplytics AI
 * ==========================
 * Protects /dashboard routes by checking for a valid auth cookie.
 * Redirects unauthenticated users to /login.
 * Redirects authenticated users away from /login and /signup.
 * Handles onboarding redirect for new users.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

/** Routes that require authentication */
const protectedPaths = ["/dashboard"];

/** Routes only for unauthenticated users */
const authPaths = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  // Decode token (returns null if invalid/missing)
  const user = token ? await verifyToken(token) : null;

  // Protect dashboard routes
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from login/signup
  if (authPaths.some((path) => pathname.startsWith(path))) {
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup", "/onboarding"],
};
