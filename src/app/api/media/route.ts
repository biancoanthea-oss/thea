import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin-only (gated by middleware). Lists all uploaded media, newest first.
export async function GET() {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("uploads")
      .select("id, file_url, file_type, uploader_name, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ media: data ?? [] });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
