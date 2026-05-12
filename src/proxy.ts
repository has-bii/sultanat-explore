import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/admin/dashboard"];
const authPaths = ["/admin/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if path matches protected or auth routes
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isAuth = authPaths.some((p) => pathname === p);

  if (!isProtected && !isAuth) {
    return NextResponse.next();
  }

  // Better Auth sets a session cookie called "better-auth.session_token"
  const sessionCookie = request.cookies.get("better-auth.session_token");
  const hasSession = !!sessionCookie?.value;

  // Protected route without session → redirect to login
  if (isProtected && !hasSession) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Auth route with session → redirect to dashboard
  if (isAuth && hasSession) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}
