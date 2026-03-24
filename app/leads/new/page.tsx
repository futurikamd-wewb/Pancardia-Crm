import { DashboardShell } from "@/components/dashboard-shell";
import { SectionCard } from "@/components/section-card";
import { LeadIntakeForm } from "@/components/lead-intake-form";

export default function NewLeadPage() {
  return (
    <DashboardShell activePath="/leads">
      <section className="page-banner">
        <span className="eyebrow">Patient Intake</span>
        <h2>Pancardia patient registration</h2>
        <p>Use this form to register a patient and create a lead record.</p>
      </section>

      <section className="hero">
        <div>
          <span className="eyebrow">New Patient</span>
          <h2>Enter patient and case details.</h2>
          <p>Keep the form simple, complete, and easy for staff to use.</p>
        </div>
      </section>

      <SectionCard
        title="Patient Intake Form"
        subtitle="Basic hospital form with patient, case, visit, and CRM details."
      >
        <LeadIntakeForm />
      </SectionCard>
    </DashboardShell>
  );
}
