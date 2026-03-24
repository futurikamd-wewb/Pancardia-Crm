import { NextResponse } from "next/server";
import { getEnvStatus } from "@/lib/env";

export async function GET() {
  const env = getEnvStatus();

  return NextResponse.json({
    ok: true,
    app: "Pancardia Multisuperspecility Hospital CRM",
    timestamp: new Date().toISOString(),
    env,
    mode: process.env.NODE_ENV || "development"
  });
}

