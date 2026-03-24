import { NextResponse } from "next/server";
import { getTestimonialDetail } from "@/lib/repositories/testimonials";
import { upsertMockTestimonialOverride } from "@/lib/mock-store";

type UpdateTestimonialPayload = {
  type?: string;
  requestStatus?: string;
  consent?: string;
  approval?: string;
  publicationStatus?: string;
  owner?: string;
  notes?: string;
};

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payload = (await request.json()) as UpdateTestimonialPayload;
  const existing = await getTestimonialDetail(id);

  if (!existing) {
    return NextResponse.json({ error: "Testimonial nahi mila." }, { status: 404 });
  }

  if (!process.env.DATABASE_URL) {
    const item = await upsertMockTestimonialOverride({
      id,
      type: payload.type?.trim() || existing.type,
      requestStatus: payload.requestStatus?.trim() || existing.requestStatus,
      consent: payload.consent?.trim() || existing.consent,
      approval: payload.approval?.trim() || existing.approval,
      publicationStatus: payload.publicationStatus?.trim() || existing.publicationStatus,
      owner: payload.owner?.trim() || existing.owner,
      notes: payload.notes?.trim() || existing.notes
    });

    return NextResponse.json({ item, persisted: true });
  }

  const { prisma } = await import("@/lib/prisma");
  const testimonial = await prisma.testimonial.update({
    where: { id },
    data: {
      testimonialType: payload.type?.trim() || existing.type,
      requestStatus: payload.requestStatus?.trim() || existing.requestStatus,
      consentStatus: payload.consent?.trim() || existing.consent,
      approvalStatus: payload.approval?.trim() || existing.approval,
      publicationStatus: payload.publicationStatus?.trim() || existing.publicationStatus,
      notes: payload.notes?.trim() || existing.notes
    }
  });

  return NextResponse.json({ item: testimonial, persisted: true });
}
