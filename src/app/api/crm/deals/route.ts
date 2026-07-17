import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabaseAdmin";
import { DEAL_STAGES } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("deals")
      .select("*, contact:contacts(id, name, company)")
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ deals: data ?? [] });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const value = Number(body?.value);
    const stage = DEAL_STAGES.includes(body?.stage) ? body.stage : "lead";
    const row = {
      title,
      value: Number.isFinite(value) && value >= 0 ? value : 0,
      stage,
      contact_id: typeof body?.contact_id === "string" && body.contact_id ? body.contact_id : null,
    };

    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("deals")
      .insert(row)
      .select("*, contact:contacts(id, name, company)")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ deal: data });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
