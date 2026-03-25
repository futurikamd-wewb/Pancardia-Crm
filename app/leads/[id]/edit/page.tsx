import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { LeadEditForm } from "@/components/lead-edit-form";
import { SectionCard } from "@/components/section-card";
import { getLeadDetail } from "@/lib/repositories/leads";

export const dynamic = "force-dynamic";

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
        <span className="eyebrow">Edit Patient Form</span>
        <h2>Update patient lead details from one form</h2>
        <p>Change patient information, source, status, stage, and follow-up details here.</p>
      </section>

      <section className="hero">
        <div>
          <span className="eyebrow">Edit Lead</span>
          <h2>{lead.patientName}</h2>
          <p>
            {lead.treatmentInterest} | {lead.city} | {lead.source}
          </p>
        </div>

        <div className="hero-actions">
          <Link className="ghost-button" href={`/leads/${lead.id}`}>
            Back to Lead
          </Link>
        </div>
      </section>

      <SectionCard title="Lead Edit Form" subtitle="Update the patient record">
        <LeadEditForm lead={lead} />
      </SectionCard>
    </DashboardShell>
  );
}
