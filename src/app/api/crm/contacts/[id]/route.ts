import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabaseAdmin";
import { CONTACT_STATUSES } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json().catch(() => ({}));
    const patch: Record<string, unknown> = {};

    if (typeof body?.name === "string" && body.name.trim()) patch.name = body.name.trim();
    for (const field of ["email", "company", "phone", "notes"] as const) {
      if (field in body) {
        const s = typeof body[field] === "string" ? body[field].trim() : "";
        patch[field] = s ? s : null;
      }
    }
    if ("status" in body) {
      if (!CONTACT_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      patch.status = body.status;
    }
    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("contacts")
      .update(patch)
      .eq("id", params.id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ contact: data });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = getAdminClient();
    const { error } = await supabase.from("contacts").delete().eq("id", params.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
