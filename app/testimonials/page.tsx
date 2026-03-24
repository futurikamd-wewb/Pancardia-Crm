import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { SectionCard } from "@/components/section-card";
import { TestimonialsTableClient } from "@/components/testimonials-table-client";
import { getTestimonialList } from "@/lib/repositories/testimonials";

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const testimonialBoard = await getTestimonialList();

  return (
    <DashboardShell activePath="/testimonials">
      <section className="hero">
        <div>
          <span className="eyebrow">Testimonial Control</span>
          <h2>Happy patient identify karo, consent lo, phir hi media approve karo.</h2>
          <p>
            Is workflow ka goal hai ki testimonial requests random WhatsApp chats me lose na ho aur
            marketing-ready assets structured form me milen.
          </p>
        </div>
        <div className="hero-actions">
          <Link className="pill-button" href="/testimonials/new">
            Add Testimonial
          </Link>
        </div>
      </section>

      <SectionCard
        title="Active Testimonial Requests"
        subtitle="Search aur consent filters se content queue ko fast handle karo."
      >
        <TestimonialsTableClient testimonials={testimonialBoard} />
      </SectionCard>
    </DashboardShell>
  );
}
