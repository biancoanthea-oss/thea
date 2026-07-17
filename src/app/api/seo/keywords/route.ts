import { NextResponse } from "next/server";
import { keywordIdeas } from "@/lib/seo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/seo/keywords?q=seed — free related-keyword ideas (Google Autocomplete).
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (!q) return NextResponse.json({ ideas: [] });
  const ideas = await keywordIdeas(q);
  // Drop the exact seed if echoed back; de-duplicate.
  const filtered = Array.from(new Set(ideas)).filter(
    (k) => k.toLowerCase() !== q.toLowerCase(),
  );
  return NextResponse.json({ ideas: filtered });
}
