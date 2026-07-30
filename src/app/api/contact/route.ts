import { NextRequest, NextResponse } from "next/server";
import { getSiteDataForUpdate, saveSiteData } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, projectType, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Strict read: the whole site record is rewritten below with this
    // submission prepended. Merging into defaults after a failed read would
    // replace every project, page and prior enquiry with placeholder content.
    const data = await getSiteDataForUpdate();
    const submission = {
      id: `sub_${Date.now()}`,
      name,
      email,
      phone: phone || "",
      projectType: projectType || "",
      message,
      submittedAt: new Date().toISOString(),
      read: false,
    };

    const updated = {
      ...data,
      contactSubmissions: [submission, ...(data.contactSubmissions || [])],
    };

    await saveSiteData(updated);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    console.error("Failed to save submission:", errorMsg);
    return NextResponse.json({ error: "Failed to save submission: " + errorMsg }, { status: 500 });
  }
}
