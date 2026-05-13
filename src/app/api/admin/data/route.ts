import { NextRequest, NextResponse } from "next/server";
import { getSiteData, saveSiteData } from "@/lib/data";

// Always read fresh data from blob store — never cache at the edge
export const dynamic = "force-dynamic";

function isAuthed(req: NextRequest) {
  return req.headers.get("x-admin-password") === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  const data = await getSiteData();
  // Prevent caching so public pages always get fresh data
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
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
