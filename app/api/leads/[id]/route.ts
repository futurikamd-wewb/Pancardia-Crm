import { NextResponse } from "next/server";
import { getLeadDetail } from "@/lib/repositories/leads";
import { upsertMockLeadOverride } from "@/lib/mock-store";

type UpdateLeadPayload = {
  patientName?: string;
  phone?: string;
  city?: string;
  treatmentInterest?: string;
  source?: string;
  assignedTo?: string;
  status?: string;
  pipelineStage?: string;
  nextFollowUp?: string;
};

function createId() {
  return crypto.randomUUID();
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payload = (await request.json()) as UpdateLeadPayload;
  const existing = await getLeadDetail(id);

  if (!existing) {
    return NextResponse.json({ error: "Lead nahi mila." }, { status: 404 });
  }

  if (!process.env.DATABASE_URL) {
    const item = await upsertMockLeadOverride({
      id,
      patientName: payload.patientName?.trim() || existing.patientName,
      phone: payload.phone?.trim() || existing.phone,
      city: payload.city?.trim() || existing.city,
      treatmentInterest: payload.treatmentInterest?.trim() || existing.treatmentInterest,
      source: payload.source?.trim() || existing.source,
      assignedTo: payload.assignedTo?.trim() || existing.assignedTo,
      status: payload.status?.trim() || existing.status,
      pipelineStage: payload.pipelineStage?.trim() || existing.pipelineStage,
      nextFollowUp: payload.nextFollowUp?.trim() || existing.nextFollowUp
    });

    return NextResponse.json({ item, persisted: true });
  }

  const { prisma } = await import("@/lib/prisma");
  const sourceName = payload.source?.trim() || existing.source;
  const assigneeName = payload.assignedTo?.trim() || existing.assignedTo;

  const source = await prisma.leadSource.upsert({
    where: { name: sourceName },
    update: {},
    create: { id: createId(), name: sourceName, channelType: "Digital" }
  });

  let assignedUser = await prisma.user.findFirst({ where: { fullName: assigneeName } });
  if (!assignedUser && assigneeName !== "Unassigned") {
    assignedUser = await prisma.user.create({
      data: {
        id: createId(),
        fullName: assigneeName,
        email: `${assigneeName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        role: "COUNSELOR"
      }
    });
  }

  const lead = await prisma.lead.update({
    where: { id },
    data: {
      patientName: payload.patientName?.trim() || existing.patientName,
      phone: payload.phone?.trim() || existing.phone,
      city: payload.city?.trim() || null,
      treatmentInterest: payload.treatmentInterest?.trim() || null,
      sourceId: source.id,
      assignedToId: assignedUser?.id,
      status: payload.status?.trim() || existing.status,
      pipelineStage: payload.pipelineStage?.trim() || existing.pipelineStage,
      notes:
        payload.nextFollowUp?.trim()
          ? {
              create: {
                id: createId(),
                noteText: "Lead settings updated",
                nextFollowUpAt: new Date(payload.nextFollowUp)
              }
            }
          : undefined
    }
  });

  return NextResponse.json({ item: lead, persisted: true });
}
