import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

/**
 * Demo authentication.
 *
 * This is a front-end showcase, so auth is intentionally lightweight: any
 * valid-looking email + non-empty password is accepted and a session cookie is
 * set. Replace with a real identity provider (e.g. Supabase Auth) when wiring
 * up a backend — the middleware and cookie name can stay the same.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const email = (body.email ?? "").trim();
  const password = body.password ?? "";

  if (!EMAIL_RE.test(email) || password.length < 1) {
    return NextResponse.json({ ok: false, error: "Enter a valid email and password." }, { status: 422 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}
