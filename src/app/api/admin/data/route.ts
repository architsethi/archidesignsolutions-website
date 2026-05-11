import { NextRequest, NextResponse } from "next/server";
import { getSiteData, saveSiteData } from "@/lib/data";

function isAuthed(req: NextRequest) {
  return req.headers.get("x-admin-password") === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  const data = await getSiteData();
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const data = await getSiteData();
  // Merge partial updates
  const updated = { ...data, ...body };
  await saveSiteData(updated);
  return NextResponse.json({ success: true });
}
