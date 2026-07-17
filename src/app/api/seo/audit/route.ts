import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabaseAdmin";
import {
  analyzeHtml,
  fetchPage,
  fetchPageSpeed,
  normalizeUrl,
} from "@/lib/seo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET — list saved audits (newest first).
export async function GET() {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("seo_audits")
      .select("id, url, score, result, created_at")
      .order("created_at", { ascending: false })
      .limit(25);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ audits: data ?? [] });
  } catch (e) {
    // Supabase not configured yet — return an empty history rather than 500.
    return NextResponse.json({ audits: [] });
  }
}

// POST — run an audit for { url, pagespeed? }, save it, return the result.
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    let url: string;
    try {
      url = normalizeUrl(typeof body?.url === "string" ? body.url : "");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Invalid URL";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    let page;
    try {
      page = await fetchPage(url);
    } catch (e) {
      return NextResponse.json(
        { error: `Could not fetch the page. It may be down or blocking bots.` },
        { status: 502 },
      );
    }

    const result = analyzeHtml(page.finalUrl, page.statusCode, page.html);

    if (body?.pagespeed) {
      result.pageSpeed = await fetchPageSpeed(page.finalUrl);
    }

    // Best-effort save to history (skipped silently if Supabase isn't set up).
    let saved = false;
    try {
      const supabase = getAdminClient();
      const { error } = await supabase
        .from("seo_audits")
        .insert({ url: result.url, score: result.score, result });
      saved = !error;
    } catch {
      saved = false;
    }

    return NextResponse.json({ result, saved });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
