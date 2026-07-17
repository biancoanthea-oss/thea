import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabaseAdmin";
import { DEAL_STAGES } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json().catch(() => ({}));
    const patch: Record<string, unknown> = {};

    if (typeof body?.title === "string" && body.title.trim()) patch.title = body.title.trim();
    if ("value" in body) {
      const value = Number(body.value);
      patch.value = Number.isFinite(value) && value >= 0 ? value : 0;
    }
    if ("stage" in body) {
      if (!DEAL_STAGES.includes(body.stage)) {
        return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
      }
      patch.stage = body.stage;
    }
    if ("contact_id" in body) {
      patch.contact_id = typeof body.contact_id === "string" && body.contact_id ? body.contact_id : null;
    }
    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("deals")
      .update(patch)
      .eq("id", params.id)
      .select("*, contact:contacts(id, name, company)")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ deal: data });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = getAdminClient();
    const { error } = await supabase.from("deals").delete().eq("id", params.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
