import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Lists all uploaded media, newest first.
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

// Deletes one upload (the database row + the stored file).
// Optional protection: if ADMIN_DELETE_KEY is set in the environment, the
// request must send a matching `x-admin-key` header. If it's not set,
// deletion is open (handy while it's just you testing).
export async function DELETE(req: Request) {
  try {
    const requiredKey = process.env.ADMIN_DELETE_KEY;
    if (requiredKey && req.headers.get("x-admin-key") !== requiredKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const id = typeof body?.id === "string" ? body.id : "";
    const fileUrl = typeof body?.file_url === "string" ? body.file_url : "";
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const supabase = getAdminClient();

    // Remove the stored file too (best-effort).
    const marker = "/storage/v1/object/public/uploads/";
    const idx = fileUrl.indexOf(marker);
    if (idx !== -1) {
      const path = decodeURIComponent(fileUrl.slice(idx + marker.length));
      await supabase.storage.from("uploads").remove([path]);
    }

    const { error } = await supabase.from("uploads").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
