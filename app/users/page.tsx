import { DashboardShell } from "@/components/dashboard-shell";
import { SectionCard } from "@/components/section-card";
import { UsersTableClient } from "@/components/users-table-client";
import { getUserList } from "@/lib/repositories/users";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await getUserList();

  return (
    <DashboardShell activePath="/users">
      <section className="page-banner">
        <span className="eyebrow">Admin Control</span>
        <h2>Pancardia team access management</h2>
        <p>
          Roles aur account status ko yahan se maintain karo taaki marketing, counseling aur content
          workflows controlled rahen.
        </p>
      </section>

      <section className="hero">
        <div>
          <span className="eyebrow">User Management</span>
          <h2>Team access aur roles ko yahan se control karo.</h2>
          <p>
            Admin yahan se role assignment, active status, aur operational ownership structure manage
            kar sakta hai.
          </p>
        </div>
      </section>

      <SectionCard title="Users" subtitle="Editable role matrix for internal staff. Admin-only access.">
        <UsersTableClient users={users} />
      </SectionCard>
    </DashboardShell>
  );
}
