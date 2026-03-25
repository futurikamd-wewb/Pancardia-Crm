import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { MediaAssetManager } from "@/components/media-asset-manager";
import { MediaUploadForm } from "@/components/media-upload-form";
import { SectionCard } from "@/components/section-card";
import { getTestimonialDetail } from "@/lib/repositories/testimonials";

export const dynamic = "force-dynamic";

export default async function TestimonialDetailPage({
  params
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const testimonial = await getTestimonialDetail(id);

  if (!testimonial) {
    notFound();
  }

  return (
    <DashboardShell activePath="/testimonials">
      <section className="page-banner">
        <span className="eyebrow">Patient Story Record</span>
        <h2>Pancardia testimonial review and media control</h2>
        <p>
          Consent state, approval, publication readiness aur attached media ko yahan se monitor karo.
        </p>
      </section>

      <section className="hero">
        <div>
          <span className="eyebrow">Testimonial Detail</span>
          <h2>{testimonial.patientName}</h2>
          <p>
            {testimonial.treatment} | {testimonial.type} | {testimonial.owner}
          </p>
        </div>
        <div className="hero-actions">
          <Link className="pill-button" href={`/testimonials/${testimonial.id}/edit`}>
            Edit Testimonial
          </Link>
          <Link className="ghost-button" href="/testimonials">
            Back to Testimonials
          </Link>
        </div>
      </section>

      <section className="grid content-grid">
        <div className="section-stack">
          <SectionCard
            title="Request Snapshot"
            subtitle="Consent aur approval state ko yahan se clearly monitor karo."
          >
            <div className="meta-grid">
              <div className="meta-card">
                <strong>Request Status</strong>
                <div className="muted">{testimonial.requestStatus}</div>
              </div>
              <div className="meta-card">
                <strong>Consent</strong>
                <div className={`tag${testimonial.consent === "Pending" ? " danger" : ""}`}>
                  {testimonial.consent}
                </div>
              </div>
              <div className="meta-card">
                <strong>Approval</strong>
                <div className={`tag${testimonial.approval === "Approved" ? "" : " warn"}`}>
                  {testimonial.approval}
                </div>
              </div>
              <div className="meta-card">
                <strong>Publication</strong>
                <div className="muted">{testimonial.publicationStatus}</div>
              </div>
              <div className="meta-card">
                <strong>Owner</strong>
                <div className="muted">{testimonial.owner}</div>
              </div>
              <div className="meta-card">
                <strong>Type</strong>
                <div className="muted">{testimonial.type}</div>
              </div>
              <div className="meta-card" style={{ gridColumn: "1 / -1" }}>
                <strong>Notes</strong>
                <div className="muted">{testimonial.notes || "No notes yet"}</div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Attached Media" subtitle="Preview, edit, share, and delete media here.">
            <MediaAssetManager assets={testimonial.media} />
          </SectionCard>
        </div>

        <SectionCard
          title="Attach Media"
          subtitle="Upload file and keep consent and media in one place."
        >
          <MediaUploadForm testimonialId={testimonial.id} />
        </SectionCard>
      </section>
    </DashboardShell>
  );
}
