import { NextResponse } from "next/server";
import { getTestimonialList } from "@/lib/repositories/testimonials";

export async function GET() {
  const testimonials = await getTestimonialList();
  return NextResponse.json({ items: testimonials });
}

type CreateTestimonialPayload = {
  leadId?: string;
  testimonialType?: string;
  requestStatus?: string;
  consentStatus?: string;
  approvalStatus?: string;
  notes?: string;
};

function createId() {
  return crypto.randomUUID();
}

export async function POST(request: Request) {
  const payload = (await request.json()) as CreateTestimonialPayload;

  if (!payload.leadId?.trim()) {
    return NextResponse.json({ error: "Patient lead select karna required hai." }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      {
        item: {
          id: createId(),
          leadId: payload.leadId.trim(),
          testimonialType: payload.testimonialType?.trim() ?? "Video",
          requestStatus: payload.requestStatus?.trim() ?? "Requested",
          consentStatus: payload.consentStatus?.trim() ?? "Pending",
          approvalStatus: payload.approvalStatus?.trim() ?? "Pending",
          notes: payload.notes?.trim() ?? ""
        },
        persisted: false
      },
      { status: 201 }
    );
  }

  const { prisma } = await import("@/lib/prisma");
  const lead = await prisma.lead.findUnique({
    where: { id: payload.leadId.trim() }
  });

  if (!lead) {
    return NextResponse.json({ error: "Selected lead nahi mila." }, { status: 404 });
  }

  const testimonial = await prisma.testimonial.create({
    data: {
      id: createId(),
      leadId: lead.id,
      testimonialType: payload.testimonialType?.trim() || "Video",
      requestStatus: payload.requestStatus?.trim() || "Requested",
      consentStatus: payload.consentStatus?.trim() || "Pending",
      approvalStatus: payload.approvalStatus?.trim() || "Pending",
      notes: payload.notes?.trim() || null
    }
  });

  return NextResponse.json({ item: testimonial, persisted: true }, { status: 201 });
}
