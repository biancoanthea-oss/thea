import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, expectedToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let password = "";
  try {
    const body = await req.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) {
    return NextResponse.json(
      { error: "Admin password is not configured on the server." },
      { status: 500 },
    );
  }

  if (password !== configured) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const token = await expectedToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token!, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}

// Logout
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
