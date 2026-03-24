import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

type UploadResult = {
  url: string;
  storage: "cloudinary" | "local";
};

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function stripExtension(fileName: string) {
  const dotIndex = fileName.lastIndexOf(".");
  return dotIndex > 0 ? fileName.slice(0, dotIndex) : fileName;
}

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return { cloudName, apiKey, apiSecret };
}

async function uploadToCloudinary(file: File, folder: string): Promise<UploadResult> {
  const config = getCloudinaryConfig();
  if (!config) {
    throw new Error("Cloudinary config missing");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = `${folder}/${timestamp}-${sanitizeFileName(stripExtension(file.name))}`;
  const signatureBase = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${config.apiSecret}`;
  const signature = createHash("sha1").update(signatureBase).digest("hex");

  const payload = new FormData();
  payload.append("file", file);
  payload.append("api_key", config.apiKey);
  payload.append("timestamp", String(timestamp));
  payload.append("folder", folder);
  payload.append("public_id", publicId);
  payload.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/auto/upload`,
    {
      method: "POST",
      body: payload
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Cloudinary upload failed: ${body}`);
  }

  const data = (await response.json()) as { secure_url: string };
  return {
    url: data.secure_url,
    storage: "cloudinary"
  };
}

async function saveLocally(file: File, folder: string): Promise<UploadResult> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadsDir, { recursive: true });
  const safeName = sanitizeFileName(file.name);
  const storedName = `${Date.now()}-${crypto.randomUUID()}-${safeName}`;
  await writeFile(path.join(uploadsDir, storedName), Buffer.from(await file.arrayBuffer()));
  return {
    url: `/uploads/${folder}/${storedName}`,
    storage: "local"
  };
}

export async function saveUploadedFile(file: File | null, folder: string) {
  if (!file || file.size === 0) {
    return null;
  }

  const cloudinaryConfig = getCloudinaryConfig();
  if (cloudinaryConfig) {
    return uploadToCloudinary(file, folder);
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Storage is not configured for production. Set Cloudinary environment variables.");
  }

  return saveLocally(file, folder);
}
