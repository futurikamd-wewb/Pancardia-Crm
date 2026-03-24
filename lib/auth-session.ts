export const AUTH_COOKIE = "hospital_crm_session";

export type AppRole = "ADMIN" | "MARKETING" | "COUNSELOR" | "CONTENT";

export type SessionUser = {
  email: string;
  fullName: string;
  role: AppRole;
};

export type DemoUser = SessionUser & {
  password: string;
};

const demoUsers: DemoUser[] = [
  {
    email: "admin@hospitalcrm.local",
    fullName: "Admin User",
    role: "ADMIN",
    password: "admin123"
  },
  {
    email: "marketing@hospitalcrm.local",
    fullName: "Marketing Lead",
    role: "MARKETING",
    password: "market123"
  },
  {
    email: "counselor@hospitalcrm.local",
    fullName: "Lead Counselor",
    role: "COUNSELOR",
    password: "counsel123"
  },
  {
    email: "content@hospitalcrm.local",
    fullName: "Content Manager",
    role: "CONTENT",
    password: "content123"
  }
];

export function encodeSession(user: SessionUser) {
  return Buffer.from(JSON.stringify(user), "utf8").toString("base64url");
}

export function decodeSession(value?: string | null): SessionUser | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as SessionUser;
    if (!parsed.email || !parsed.fullName || !parsed.role) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function getDemoUsers() {
  return demoUsers;
}
