import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, authenticateUser, encodeSession } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };

  if (!body.email?.trim() || !body.password) {
    return NextResponse.json({ error: "Email aur password required hai." }, { status: 400 });
  }

  const user = await authenticateUser(body.email, body.password);
  if (!user) {
    return NextResponse.json({ error: "Credentials galat hain." }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, encodeSession(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });

  return NextResponse.json({ ok: true, user });
}
