import { NextResponse } from "next/server";
import { getUserList } from "@/lib/repositories/users";

export async function GET() {
  const items = await getUserList();
  return NextResponse.json({ items });
}
