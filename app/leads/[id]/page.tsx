import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { FollowUpForm } from "@/components/follow-up-form";
import { SectionCard } from "@/components/section-card";
import { getLeadDetail } from "@/lib/repositories/leads";
import { LeadDetailActions } from "@/components/lead-detail-actions";

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
        <span className="eyebrow">Patient Form</span>
        <h2>Lead form with patient details, follow-up, and media</h2>
        <p>View, edit, share, download, and manage this patient record from one place.</p>
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
          <a className="ghost-button" href={`/leads/${lead.id}?print=1`} target="_blank" rel="noreferrer">
            Download
          </a>
          <LeadDetailActions leadId={lead.id} />
        </div>
      </section>

      <section className="grid content-grid">
        <div className="section-stack">
          <SectionCard title="Patient Information" subtitle="Main patient and lead details">
            <div className="meta-grid">
              <div className="meta-card">
                <strong>Patient Name</strong>
                <div className="muted">{lead.patientName}</div>
              </div>

              <div className="meta-card">
                <strong>Phone</strong>
                <div className="muted">{lead.phone}</div>
              </div>

              <div className="meta-card">
                <strong>City</strong>
                <div className="muted">{lead.city}</div>
              </div>

              <div className="meta-card">
                <strong>Department / Treatment</strong>
                <div className="muted">{lead.treatmentInterest}</div>
              </div>

              <div className="meta-card">
                <strong>Source</strong>
                <div className="muted">{lead.source}</div>
              </div>

              <div className="meta-card">
                <strong>Assigned Counselor</strong>
                <div className="muted">{lead.assignedTo}</div>
              </div>

              <div className="meta-card">
                <strong>Status</strong>
                <div className="tag">{lead.status}</div>
              </div>

              <div className="meta-card">
                <strong>Pipeline Stage</strong>
                <div className="tag">{lead.pipelineStage}</div>
              </div>

              <div className="meta-card">
                <strong>Next Follow-up</strong>
                <div className="muted">{lead.nextFollowUp}</div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Follow-up Timeline" subtitle="All counseling notes in one place">
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

          <SectionCard title="Media and Documents" subtitle="Preview, edit, share, download, and delete files">
            <div className="list-item">
              <div>
                <strong>No lead media section connected yet</strong>
                <div className="muted">
                  Next step me yahan uploaded lead files ka preview, edit, delete, share, and download
                  add karenge.
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Add Follow-up" subtitle="Update the patient form after every call">
          <FollowUpForm leadId={lead.id} />
        </SectionCard>
      </section>
    </DashboardShell>
  );
}
