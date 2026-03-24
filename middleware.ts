import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE, decodeSession } from "@/lib/auth-session";

const publicPaths = ["/login"];
const publicApiPaths = ["/api/login", "/api/logout"];

const routePermissions: Array<{ prefix: string; roles: string[] }> = [
  { prefix: "/users", roles: ["ADMIN"] },
  { prefix: "/leads/new", roles: ["ADMIN", "MARKETING", "COUNSELOR"] },
  { prefix: "/leads/", roles: ["ADMIN", "MARKETING", "COUNSELOR"] },
  { prefix: "/testimonials/new", roles: ["ADMIN", "MARKETING", "CONTENT"] },
  { prefix: "/testimonials/", roles: ["ADMIN", "MARKETING", "CONTENT"] }
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    publicPaths.includes(pathname) ||
    publicApiPaths.includes(pathname)
  ) {
    return NextResponse.next();
  }

  const session = decodeSession(request.cookies.get(AUTH_COOKIE)?.value);
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const matchedRule = routePermissions.find((rule) => pathname.startsWith(rule.prefix));
  if (matchedRule && !matchedRule.roles.includes(session.role)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"]
};
