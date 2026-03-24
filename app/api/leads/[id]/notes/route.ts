import { NextResponse } from "next/server";

type CreateNotePayload = {
  noteText?: string;
  callOutcome?: string;
  nextFollowUp?: string;
};

function createId() {
  return crypto.randomUUID();
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payload = (await request.json()) as CreateNotePayload;

  if (!payload.noteText?.trim()) {
    return NextResponse.json({ error: "Follow-up note required hai." }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      {
        item: {
          id: createId(),
          leadId: id,
          noteText: payload.noteText.trim(),
          callOutcome: payload.callOutcome?.trim() ?? "Interested",
          nextFollowUp: payload.nextFollowUp?.trim() ?? "Not set"
        },
        persisted: false
      },
      { status: 201 }
    );
  }

  const { prisma } = await import("@/lib/prisma");
  const lead = await prisma.lead.findUnique({
    where: {
      id
    }
  });

  if (!lead) {
    return NextResponse.json({ error: "Lead nahi mila." }, { status: 404 });
  }

  const note = await prisma.leadNote.create({
    data: {
      id: createId(),
      leadId: id,
      noteText: payload.noteText.trim(),
      callOutcome: payload.callOutcome?.trim() || "Interested",
      nextFollowUpAt: payload.nextFollowUp ? new Date(payload.nextFollowUp) : null
    }
  });

  return NextResponse.json({ item: note, persisted: true }, { status: 201 });
}

