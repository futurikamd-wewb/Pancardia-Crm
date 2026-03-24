import { NextResponse } from "next/server";
import { updateUser } from "@/lib/repositories/users";

type UpdateUserPayload = {
  fullName?: string;
  role?: "ADMIN" | "MARKETING" | "COUNSELOR" | "CONTENT";
  isActive?: boolean;
};

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payload = (await request.json()) as UpdateUserPayload;
  const updated = await updateUser(id, payload);

  if (!updated) {
    return NextResponse.json({ error: "User nahi mila." }, { status: 404 });
  }

  return NextResponse.json({ item: updated });
}
