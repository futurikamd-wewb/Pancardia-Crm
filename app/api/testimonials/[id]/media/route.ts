import { NextResponse } from "next/server";
import { appendMockMediaAsset } from "@/lib/mock-store";
import { saveUploadedFile } from "@/lib/storage";

export const runtime = "nodejs";

function createId() {
  return crypto.randomUUID();
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const formData = await request.formData();
  const file = formData.get("file");
  const department = String(formData.get("department") ?? "").trim();
  const treatmentTag = String(formData.get("treatmentTag") ?? "").trim();
  const approvalStatus = String(formData.get("approvalStatus") ?? "Pending").trim();
  const consentAttached = String(formData.get("consentAttached") ?? "no") === "yes";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Actual file required hai." }, { status: 400 });
  }

  let fileUrl = "";
  try {
    const storedFile = await saveUploadedFile(file, "testimonials");
    fileUrl = storedFile?.url ?? "";
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Media upload failed."
      },
      { status: 500 }
    );
  }

  if (!process.env.DATABASE_URL) {
    const media = await appendMockMediaAsset({
      id: createId(),
      testimonialId: id,
      fileName: file.name,
      fileType: file.type || "application/octet-stream",
      fileUrl,
      department: department || "-",
      treatmentTag: treatmentTag || "-",
      approvalStatus: approvalStatus || "Pending",
      consentAttached
    });

    return NextResponse.json({ item: media, persisted: true }, { status: 201 });
  }

  const { prisma } = await import("@/lib/prisma");
  const testimonial = await prisma.testimonial.findUnique({
    where: { id }
  });

  if (!testimonial) {
    return NextResponse.json({ error: "Testimonial request nahi mila." }, { status: 404 });
  }

  const media = await prisma.mediaAsset.create({
    data: {
      id: createId(),
      testimonialId: id,
      leadId: testimonial.leadId,
      fileName: file.name,
      fileType: file.type || "application/octet-stream",
      fileUrl,
      department: department || null,
      treatmentTag: treatmentTag || null,
      approvalStatus: approvalStatus || "Pending",
      consentAttached
    }
  });

  return NextResponse.json({ item: media, persisted: true }, { status: 201 });
}
