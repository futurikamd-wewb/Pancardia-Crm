import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { LeadDetailActions } from "@/components/lead-detail-actions";
import { LeadRecordTabs } from "@/components/lead-record-tabs";
import { getLeadDetail } from "@/lib/repositories/leads";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
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
        <span className="eyebrow">Patient Record</span>
        <h2>Clean patient form with follow-ups and media</h2>
        <p>Use tabs to switch between details, follow-ups, and patient media.</p>
      </section>

      <section className="hero">
        <div>
          <span className="eyebrow">Lead Form</span>
          <h2>{lead.patientName}</h2>
          <p>
            {lead.treatmentInterest} | {lead.city} | {lead.source}
          </p>
        </div>

        <div className="hero-actions">
          <Link className="pill-button" href={`/leads/${lead.id}/edit`}>
            Edit
          </Link>
          <LeadDetailActions leadId={lead.id} />
        </div>
      </section>

      <LeadRecordTabs lead={lead} />
    </DashboardShell>
  );
}
