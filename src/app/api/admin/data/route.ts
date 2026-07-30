import { NextRequest, NextResponse } from "next/server";
import { getSiteData, getSiteDataForUpdate, saveSiteData, type SiteData } from "@/lib/data";

// Always read fresh data from blob store — never cache at the edge
export const dynamic = "force-dynamic";

function isAuthed(req: NextRequest) {
  return req.headers.get("x-admin-password") === process.env.ADMIN_PASSWORD;
}

// Prevent caching so public pages always get fresh data
const NO_STORE = { "Cache-Control": "no-store, no-cache, must-revalidate" };

/**
 * GET is intentionally open — the public pages read their content from here.
 * The contact inbox is not public content: submissions carry visitors' names,
 * email addresses and phone numbers, so they are stripped unless the caller
 * authenticates. The key is omitted rather than emptied, so a client that ever
 * round-trips this response back through PUT cannot blank the stored inbox.
 */
export async function GET(req: NextRequest) {
  const data = await getSiteData();
  if (isAuthed(req)) return NextResponse.json(data, { headers: NO_STORE });

  const publicData: Partial<SiteData> = { ...data };
  delete publicData.contactSubmissions;
  return NextResponse.json(publicData, { headers: NO_STORE });
}

export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();

  // Read strictly: a partial update is merged into whatever is read here, so a
  // failed read must abort the save rather than merge into placeholder defaults
  // and overwrite the live site.
  let data: SiteData;
  try {
    data = await getSiteDataForUpdate();
  } catch (err) {
    console.error("PUT /api/admin/data — refusing to save, could not read current data:", err);
    return NextResponse.json(
      { error: "Could not read current site data, so nothing was saved. Try again in a moment." },
      { status: 503 }
    );
  }

  try {
    await saveSiteData({ ...data, ...body });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed";
    console.error("PUT /api/admin/data — save failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
