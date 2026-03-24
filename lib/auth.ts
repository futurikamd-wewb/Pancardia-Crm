import { cookies } from "next/headers";
import { AUTH_COOKIE, getDemoUsers, type SessionUser } from "@/lib/auth-session";

export { AUTH_COOKIE, getDemoUsers };
export type { AppRole, DemoUser, SessionUser } from "@/lib/auth-session";
export { decodeSession, encodeSession } from "@/lib/auth-session";

export async function authenticateUser(email: string, password: string): Promise<SessionUser | null> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!process.env.DATABASE_URL) {
    const user = getDemoUsers().find(
      (item) => item.email.toLowerCase() === normalizedEmail && item.password === password
    );

    if (!user) {
      return null;
    }

    return {
      email: user.email,
      fullName: user.fullName,
      role: user.role
    };
  }

  const { prisma } = await import("@/lib/prisma");
  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail
    }
  });

  if (!user || !user.passwordHash || user.passwordHash !== password) {
    return null;
  }

  return {
    email: user.email,
    fullName: user.fullName,
    role: user.role as SessionUser["role"]
  };
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const { decodeSession } = await import("@/lib/auth-session");
  return decodeSession(cookieStore.get(AUTH_COOKIE)?.value);
}

export async function isAuthenticated() {
  return Boolean(await getSessionUser());
}
