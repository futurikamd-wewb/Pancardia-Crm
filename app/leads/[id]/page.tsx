import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { FollowUpForm } from "@/components/follow-up-form";
import { SectionCard } from "@/components/section-card";
import { getLeadDetail } from "@/lib/repositories/leads";

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
        <span className="eyebrow">Patient CRM Record</span>
        <h2>Pancardia lead profile and counseling history</h2>
        <p>
          Is page par patient context, assignment, status progression aur follow-up notes ek saath
          dikhte hain.
        </p>
      </section>

      <section className="hero">
        <div>
          <span className="eyebrow">Lead Detail</span>
          <h2>{lead.patientName}</h2>
          <p>
            {lead.treatmentInterest} | {lead.city} | {lead.source}
          </p>
        </div>
        <div className="hero-actions">
          <Link className="pill-button" href={`/leads/${lead.id}/edit`}>
            Edit Lead
          </Link>
          <Link className="ghost-button" href="/leads">
            Back to Leads
          </Link>
        </div>
      </section>

      <section className="grid content-grid">
        <div className="section-stack">
          <SectionCard title="Patient Snapshot" subtitle="Lead owner, stage aur next action yahan visible hai.">
            <div className="meta-grid">
              <div className="meta-card">
                <strong>Phone</strong>
                <div className="muted">{lead.phone}</div>
              </div>
              <div className="meta-card">
                <strong>Status</strong>
                <div className="tag">{lead.status}</div>
              </div>
              <div className="meta-card">
                <strong>Assigned Counselor</strong>
                <div className="muted">{lead.assignedTo}</div>
              </div>
              <div className="meta-card">
                <strong>Pipeline Stage</strong>
                <div className="tag">{lead.pipelineStage}</div>
              </div>
              <div className="meta-card">
                <strong>Next Follow-up</strong>
                <div className="muted">{lead.nextFollowUp}</div>
              </div>
              <div className="meta-card">
                <strong>City / Department</strong>
                <div className="muted">
                  {lead.city} | {lead.treatmentInterest}
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Follow-up Timeline" subtitle="Latest notes upar dikhengi.">
            <div className="list">
              {lead.notes.map((note) => (
                <div className="list-item" key={note.id}>
                  <div>
                    <strong>{note.noteText}</strong>
                    <div className="muted">
                      {note.createdAt} | {note.nextFollowUp}
                    </div>
                  </div>
                  <span className="tag">{note.callOutcome}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Add Follow-up" subtitle="Har call ke baad note aur next reminder record karo.">
          <FollowUpForm leadId={lead.id} />
          <p className="inline-note">
            Database connect hone par notes persist honge. Mock mode me flow test ke liye ready hai.
          </p>
        </SectionCard>
      </section>
    </DashboardShell>
  );
}
