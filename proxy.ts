import { auth } from "@/lib/auth.config";
import { NextResponse } from "next/server";

// Routes that require authentication
const PROTECTED = ["/dashboard"];

// Next.js 16 uses `proxy` as the named middleware export.
// Wrapping with auth() injects req.auth (the NextAuth session).
export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));

  if (!isProtected) return NextResponse.next();

  if (!req.auth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
