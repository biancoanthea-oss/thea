import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin-only (gated by middleware). Lists all guestbook messages, newest first.
export async function GET() {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("messages")
      .select("id, guest_name, message, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ messages: data ?? [] });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
