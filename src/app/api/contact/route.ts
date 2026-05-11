import { NextRequest, NextResponse } from "next/server";
import { getSiteData, saveSiteData } from "@/lib/data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, projectType, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const data = await getSiteData();
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
  } catch {
    return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
  }
}
