import { NextResponse } from "next/server";

// Optional AI parsing. When ANTHROPIC_API_KEY is set, we ask Claude to turn
// messy free text ("stuff for a fry, some fruit, and milk") into clean line
// items. When it isn't set — or anything fails — we return 501 and the client
// falls back to its built-in local parser, so the feature always works.

export const runtime = "nodejs";

interface AiItem {
  qty: number;
  query: string;
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI parsing not configured" },
      { status: 501 },
    );
  }

  let text = "";
  try {
    const body = await req.json();
    text = typeof body?.text === "string" ? body.text : "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!text.trim()) {
    return NextResponse.json({ items: [] as AiItem[] });
  }

  const prompt = `You turn a shopper's free-typed grocery request into a clean list.
Return ONLY a JSON array. Each element is {"qty": <integer>, "query": "<generic item name>"}.
Rules:
- Split combined requests (e.g. "stuff for a fry") into the individual groceries a Dublin shopper would buy (rashers, sausages, eggs, beans, bread, etc).
- "query" must be a short generic grocery name (e.g. "milk", "chicken fillets", "toilet roll"), no brands, no quantities inside it.
- qty is how many units/packs they want; default to 1.
- No prose, no markdown, JSON array only.

Shopper's request:
${text}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Upstream error" },
        { status: 502 },
      );
    }

    const data = await res.json();
    const raw: string = data?.content?.[0]?.text ?? "";
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) {
      return NextResponse.json({ items: [] as AiItem[] });
    }

    const parsed = JSON.parse(match[0]);
    const items: AiItem[] = Array.isArray(parsed)
      ? parsed
          .map((p) => ({
            qty: Number.isFinite(p?.qty) && p.qty > 0 ? Math.floor(p.qty) : 1,
            query: typeof p?.query === "string" ? p.query.trim() : "",
          }))
          .filter((p) => p.query)
      : [];

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "Parse failed" }, { status: 502 });
  }
}
