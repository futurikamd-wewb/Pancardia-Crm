import { getDemoUsers } from "@/lib/auth-session";
import { getMockUsers, upsertMockUser, type MockUser } from "@/lib/mock-store";

export type UserListItem = {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "MARKETING" | "COUNSELOR" | "CONTENT";
  isActive: boolean;
};

function makeId(email: string) {
  return email.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export async function getUserList(): Promise<UserListItem[]> {
  if (!process.env.DATABASE_URL) {
    const stored = await getMockUsers();
    const defaults: MockUser[] = getDemoUsers().map((user) => ({
      id: makeId(user.email),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isActive: true,
      passwordHash: user.password
    }));

    const merged = defaults.map((user) => stored.find((item) => item.id === user.id) ?? user);
    const extras = stored.filter((user) => !merged.some((item) => item.id === user.id));
    return [...merged, ...extras].map(({ passwordHash: _passwordHash, ...rest }) => rest);
  }

  const { prisma } = await import("@/lib/prisma");
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "asc"
    }
  });

  return users.map((user) => ({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role as UserListItem["role"],
    isActive: user.isActive
  }));
}

export async function updateUser(
  id: string,
  payload: Partial<Pick<UserListItem, "fullName" | "role" | "isActive">>
) {
  if (!process.env.DATABASE_URL) {
    const users = await getUserList();
    const existing = users.find((user) => user.id === id);
    if (!existing) {
      return null;
    }

    const demo = getDemoUsers().find((user) => makeId(user.email) === id);
    const updated = await upsertMockUser({
      id,
      fullName: payload.fullName ?? existing.fullName,
      email: existing.email,
      role: payload.role ?? existing.role,
      isActive: payload.isActive ?? existing.isActive,
      passwordHash: demo?.password ?? "changeme123"
    });

    const { passwordHash: _passwordHash, ...rest } = updated;
    return rest;
  }

  const { prisma } = await import("@/lib/prisma");
  const updated = await prisma.user.update({
    where: { id },
    data: {
      fullName: payload.fullName,
      role: payload.role,
      isActive: payload.isActive
    }
  });

  return {
    id: updated.id,
    fullName: updated.fullName,
    email: updated.email,
    role: updated.role as UserListItem["role"],
    isActive: updated.isActive
  };
}
