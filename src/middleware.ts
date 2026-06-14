import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, expectedToken } from "@/lib/auth";

// Protect the admin areas (and their data APIs) behind the password gate.
const PROTECTED_PREFIXES = [
  "/gallery",
  "/slideshow",
  "/guestbook",
  "/api/media",
  "/api/messages",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const expected = await expectedToken();

  if (expected && token && token === expected) {
    return NextResponse.next();
  }

  // API requests get a 401; page requests get redirected to login.
  if (pathname.startsWith("/api/")) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/gallery/:path*",
    "/slideshow/:path*",
    "/guestbook/:path*",
    "/api/media/:path*",
    "/api/messages/:path*",
  ],
};
