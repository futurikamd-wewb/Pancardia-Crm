import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: Readonly<{ params: Promise<{ id: string }> }>
) {
  const { id } = await params;

  try {
    const body = await request.json();

    const updated = await prisma.lead.update({
      where: { id },
      data: {
        patientName: body.patientName,
        phone: body.phone,
        city: body.city || null,
        treatmentInterest: body.treatmentInterest || null,
        status: body.status,
        pipelineStage: body.pipelineStage
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: Readonly<{ params: Promise<{ id: string }> }>
) {
  const { id } = await params;

  try {
    await prisma.lead.delete({
      where: { id }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Delete failed" },
      { status: 500 }
    );
  }
}

