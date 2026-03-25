import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: Readonly<{ params: Promise<{ id: string }> }>
) {
  const { id: leadId } = await params;

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

    const uploadFormData = new FormData();
    uploadFormData.append("file", new Blob([buffer]), file.name);
    uploadFormData.append("upload_preset", "ml_default");

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary environment variables are missing" },
        { status: 500 }
      );
    }

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: "POST",
        body: uploadFormData
      }
    );

    const cloudinaryPayload = (await cloudinaryResponse.json()) as {
      secure_url?: string;
      original_filename?: string;
      error?: { message?: string };
    };

    if (!cloudinaryResponse.ok || !cloudinaryPayload.secure_url) {
      return NextResponse.json(
        {
          error:
            cloudinaryPayload.error?.message ??
            "Cloudinary upload failed"
        },
        { status: 500 }
      );
    }

    const media = await prisma.mediaAsset.create({
      data: {
        id: randomUUID(),
        leadId,
        fileName: file.name || cloudinaryPayload.original_filename || "uploaded-file",
        fileType: file.type || "application/octet-stream",
        fileUrl: cloudinaryPayload.secure_url,
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
