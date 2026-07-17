import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TYPES = ["note", "call", "email", "task"];

// GET /api/crm/activities?contact_id=... — timeline for one contact.
export async function GET(req: Request) {
  try {
    const contactId = new URL(req.url).searchParams.get("contact_id") ?? "";
    if (!contactId) return NextResponse.json({ error: "Missing contact_id" }, { status: 400 });

    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("contact_id", contactId)
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ activities: data ?? [] });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const contactId = typeof body?.contact_id === "string" ? body.contact_id : "";
    const bodyText = typeof body?.body === "string" ? body.body.trim() : "";
    if (!contactId) return NextResponse.json({ error: "Missing contact_id" }, { status: 400 });
    if (!bodyText) return NextResponse.json({ error: "Activity body is required" }, { status: 400 });

    const type = TYPES.includes(body?.type) ? body.type : "note";
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("activities")
      .insert({ contact_id: contactId, type, body: bodyText })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ activity: data });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
