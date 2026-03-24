import { NextResponse } from "next/server";
import { getLeadList } from "@/lib/repositories/leads";
import { saveUploadedFile } from "@/lib/storage";

export async function GET() {
  const leads = await getLeadList();
  return NextResponse.json({ items: leads });
}

type CreateLeadPayload = {
  patientName?: string;
  phone?: string;
  age?: string;
  gender?: string;
  address?: string;
  city?: string;
  treatmentInterest?: string;
  doctorName?: string;
  patientVisitType?: string;
  caseType?: string;
  conditionSeverity?: string;
  bedWard?: string;
  disease?: string;
  treatmentPlan?: string;
  visitDate?: string;
  insurance?: string;
  source?: string;
  assignedTo?: string;
  status?: string;
  pipelineStage?: string;
  note?: string;
};

function createId() {
  return crypto.randomUUID();
}

function buildStructuredNote(payload: CreateLeadPayload, attachmentUrl?: string) {
  const summaryLines = [
    `Age: ${payload.age?.trim() || "Unknown"}`,
    `Gender: ${payload.gender?.trim() || "Unknown"}`,
    `Address: ${payload.address?.trim() || "Not provided"}`,
    `Visit Type: ${payload.patientVisitType?.trim() || "OPD"}`,
    `Case Type: ${payload.caseType?.trim() || "Routine Checkup"}`,
    `Priority: ${payload.conditionSeverity?.trim() || "Low"}`,
    `Doctor Name: ${payload.doctorName?.trim() || "Not assigned"}`,
    `Bed / Ward: ${payload.bedWard?.trim() || "Not assigned"}`,
    `Disease: ${payload.disease?.trim() || "Not specified"}`,
    `Treatment: ${payload.treatmentPlan?.trim() || "Not specified"}`,
    `Visit Date: ${payload.visitDate?.trim() || "Not scheduled"}`,
    `Insurance: ${payload.insurance?.trim() || "Not provided"}`
  ];

  if (attachmentUrl) {
    summaryLines.push(`Attachment: ${attachmentUrl}`);
  }

  if (payload.note?.trim()) {
    summaryLines.push(`Notes: ${payload.note.trim()}`);
  }

  return summaryLines.join("\n");
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const attachment = formData.get("attachment");
  const payload = Object.fromEntries(formData.entries()) as CreateLeadPayload;

  if (!payload.patientName?.trim() || !payload.phone?.trim()) {
    return NextResponse.json(
      { error: "Patient name aur phone number required hai." },
      { status: 400 }
    );
  }

  let attachmentUrl = "";
  try {
    const storedAttachment = await saveUploadedFile(
      attachment instanceof File ? attachment : null,
      "leads"
    );
    attachmentUrl = storedAttachment?.url ?? "";
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Attachment upload failed."
      },
      { status: 500 }
    );
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      {
        item: {
          id: createId(),
          patientName: payload.patientName.trim(),
          phone: payload.phone.trim(),
          city: payload.city?.trim() ?? "",
          treatmentInterest: payload.treatmentInterest?.trim() ?? "",
          source: payload.source?.trim() ?? "Unknown",
          assignedTo: payload.assignedTo?.trim() ?? "Unassigned",
          status: payload.status?.trim() ?? "New",
          pipelineStage: payload.pipelineStage?.trim() ?? "Inquiry",
          nextFollowUp: payload.visitDate?.trim() ?? "Not set",
          note: buildStructuredNote(payload, attachmentUrl),
          attachmentUrl
        },
        persisted: true
      },
      { status: 201 }
    );
  }

  const { prisma } = await import("@/lib/prisma");

  const sourceName = payload.source?.trim() || "Unknown";
  const counselorName = payload.assignedTo?.trim() || "Unassigned";

  const source = await prisma.leadSource.upsert({
    where: { name: sourceName },
    update: {},
    create: {
      id: createId(),
      name: sourceName,
      channelType: "Digital"
    }
  });

  let assignedUser = await prisma.user.findFirst({
    where: {
      fullName: counselorName
    }
  });

  if (!assignedUser && counselorName !== "Unassigned") {
    assignedUser = await prisma.user.create({
      data: {
        id: createId(),
        fullName: counselorName,
        email: `${counselorName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        role: "COUNSELOR"
      }
    });
  }

  const lead = await prisma.lead.create({
    data: {
      id: createId(),
      patientName: payload.patientName.trim(),
      phone: payload.phone.trim(),
      city: payload.city?.trim() || null,
      treatmentInterest: payload.treatmentInterest?.trim() || null,
      sourceId: source.id,
      assignedToId: assignedUser?.id,
      status: payload.status?.trim() || "New",
      pipelineStage: payload.pipelineStage?.trim() || "Inquiry",
      notes: {
        create: {
          id: createId(),
          noteText: buildStructuredNote(payload, attachmentUrl),
          nextFollowUpAt: payload.visitDate ? new Date(payload.visitDate) : null
        }
      }
    }
  });

  return NextResponse.json({ item: lead, persisted: true }, { status: 201 });
}
