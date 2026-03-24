import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { SectionCard } from "@/components/section-card";
import { TestimonialEditForm } from "@/components/testimonial-edit-form";
import { getTestimonialDetail } from "@/lib/repositories/testimonials";

export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({
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
        <span className="eyebrow">Testimonial Maintenance</span>
        <h2>Update consent, approval and publication state</h2>
        <p>
          Content aur marketing team yahan se testimonial workflow ko clean aur compliant rakh sakte hain.
        </p>
      </section>

      <section className="hero">
        <div>
          <span className="eyebrow">Edit Testimonial</span>
          <h2>{testimonial.patientName}</h2>
          <p>Consent, approval aur publication state update karo.</p>
        </div>
      </section>

      <SectionCard
        title="Testimonial Settings"
        subtitle="Structured update panel for content and marketing teams."
      >
        <TestimonialEditForm testimonial={testimonial} />
      </SectionCard>
    </DashboardShell>
  );
}
