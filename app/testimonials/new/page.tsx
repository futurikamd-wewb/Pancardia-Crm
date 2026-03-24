import { DashboardShell } from "@/components/dashboard-shell";
import { SectionCard } from "@/components/section-card";
import { TestimonialRequestForm } from "@/components/testimonial-request-form";
import { getLeadList } from "@/lib/repositories/leads";

export const dynamic = "force-dynamic";

export default async function NewTestimonialPage() {
  const leads = await getLeadList();
  const leadOptions = leads.map((lead) => ({
    id: lead.id,
    label: `${lead.patientName} - ${lead.treatmentInterest}`
  }));

  return (
    <DashboardShell activePath="/testimonials">
      <section className="hero">
        <div>
          <span className="eyebrow">New Testimonial Request</span>
          <h2>Eligible patient ko structured testimonial workflow me lao.</h2>
          <p>
            Request, consent aur approval ko ek jagah track karne se marketing team ka messy follow-up
            reduce hota hai.
          </p>
        </div>
      </section>

      <SectionCard
        title="Create Testimonial Request"
        subtitle="Agle phase me yahi flow media upload aur consent proof se connect hoga."
      >
        <TestimonialRequestForm leads={leadOptions} />
      </SectionCard>
    </DashboardShell>
  );
}
