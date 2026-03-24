import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { LeadEditForm } from "@/components/lead-edit-form";
import { SectionCard } from "@/components/section-card";
import { getLeadDetail } from "@/lib/repositories/leads";

export default async function EditLeadPage({
  params
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const lead = await getLeadDetail(id);

  if (!lead) {
    notFound();
  }

  return (
    <DashboardShell activePath="/leads">
      <section className="page-banner">
        <span className="eyebrow">Lead Maintenance</span>
        <h2>Update Pancardia patient lead details</h2>
        <p>Ownership, source, status aur patient record quality ko yahan se clean rakho.</p>
      </section>

      <section className="hero">
        <div>
          <span className="eyebrow">Edit Lead</span>
          <h2>{lead.patientName}</h2>
          <p>Owner, source aur stage ko update karo.</p>
        </div>
      </section>

      <SectionCard title="Lead Settings" subtitle="Structured update panel for counselors and admin.">
        <LeadEditForm lead={lead} />
      </SectionCard>
    </DashboardShell>
  );
}
