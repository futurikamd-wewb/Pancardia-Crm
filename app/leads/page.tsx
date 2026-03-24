import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { LeadsTableClient } from "@/components/leads-table-client";
import { SectionCard } from "@/components/section-card";
import { getLeadList } from "@/lib/repositories/leads";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leadsBoard = await getLeadList();

  return (
    <DashboardShell activePath="/leads">
      <section className="hero">
        <div>
          <span className="eyebrow">Lead Management</span>
          <h2>Har inquiry ka owner, stage, aur next action clear rakho.</h2>
          <p>
            Duplicate numbers, missing callbacks, aur unclear source attribution ko ek single lead
            board me control karo.
          </p>
        </div>
        <div className="hero-actions">
          <Link className="pill-button" href="/leads/new">
            Add New Lead
          </Link>
        </div>
      </section>

      <SectionCard
        title="Lead Pipeline"
        subtitle="Search aur stage filters ke saath team ko fast triage milta hai."
      >
        <LeadsTableClient leads={leadsBoard} />
      </SectionCard>
    </DashboardShell>
  );
}
