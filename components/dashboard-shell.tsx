import Link from "next/link";
import type { Route } from "next";
import { LogoutButton } from "@/components/logout-button";
import { getSessionUser } from "@/lib/auth";

const navigation = [
  { href: "/" as Route, label: "Overview" },
  { href: "/users" as Route, label: "Users" },
  { href: "/leads" as Route, label: "Leads" },
  { href: "/leads/new" as Route, label: "Add Lead" },
  { href: "/testimonials" as Route, label: "Testimonials" },
  { href: "/testimonials/new" as Route, label: "Add Testimonial" }
] as const;

export async function DashboardShell({
  activePath,
  children
}: Readonly<{ activePath: string; children: React.ReactNode }>) {
  const sessionUser = await getSessionUser();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">Pancardia CRM</div>
          <h1>Pancardia Multisuperspecility Hospital</h1>
          <p>Patient acquisition, counseling, follow-up aur testimonial control ek hi CRM me.</p>
        </div>

        <nav className="nav-group" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              className={`nav-item${activePath === item.href ? " active" : ""}`}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-note">
          {sessionUser ? (
            <p>
              <strong>{sessionUser.fullName}</strong>
              <br />
              {sessionUser.role}
            </p>
          ) : null}
          <strong>Hospital rule</strong>
          <p>
            Consent aur internal approval complete hue bina koi bhi testimonial ya patient media publish
            nahi hoga.
          </p>
          <div style={{ marginTop: "12px" }}>
            <LogoutButton />
          </div>
        </div>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}
