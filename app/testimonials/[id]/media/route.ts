import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: Readonly<{ params: Promise<{ id: string }> }>
) {
  const { id: testimonialId } = await params;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const department = String(formData.get("department") ?? "").trim();
    const treatmentTag = String(formData.get("treatmentTag") ?? "").trim();
    const doctorTag = String(formData.get("doctorTag") ?? "").trim();
    const approvalStatus = String(formData.get("approvalStatus") ?? "Pending").trim();
    const consentAttached = String(formData.get("consentAttached") ?? "false") === "true";

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDirectory = path.join(process.cwd(), "public", "uploads", "testimonials");
    await mkdir(uploadDirectory, { recursive: true });

    const safeName = file.name.replace(/\s+/g, "-");
    const storedFileName = `${Date.now()}-${safeName}`;
    const filePath = path.join(uploadDirectory, storedFileName);

    await writeFile(filePath, buffer);

    const media = await prisma.mediaAsset.create({
      data: {
        id: randomUUID(),
        testimonialId,
        fileName: file.name,
        fileType: file.type || "application/octet-stream",
        fileUrl: `/uploads/testimonials/${storedFileName}`,
        department: department || null,
        treatmentTag: treatmentTag || null,
        doctorTag: doctorTag || null,
        approvalStatus: approvalStatus || "Pending",
        consentAttached
      }
    });

    return NextResponse.json({
      id: media.id,
      fileName: media.fileName,
      fileUrl: media.fileUrl
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}

