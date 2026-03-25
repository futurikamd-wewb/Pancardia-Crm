import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: Readonly<{ params: Promise<{ id: string }> }>
) {
  const { id } = await params;

  try {
    const body = (await request.json()) as {
      department?: string;
      treatmentTag?: string;
      approvalStatus?: string;
      consentAttached?: boolean;
    };

    const updated = await prisma.mediaAsset.update({
      where: { id },
      data: {
        department: body.department?.trim() || null,
        treatmentTag: body.treatmentTag?.trim() || null,
        approvalStatus: body.approvalStatus ?? "Pending",
        consentAttached: Boolean(body.consentAttached)
      }
    });

    return NextResponse.json({
      id: updated.id,
      approvalStatus: updated.approvalStatus
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update media" },
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
    await prisma.mediaAsset.delete({
      where: { id }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete media" },
      { status: 500 }
    );
  }
}
