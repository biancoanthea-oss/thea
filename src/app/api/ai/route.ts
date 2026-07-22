import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type AiTask = "improve" | "formal" | "concise" | "expand" | "tailor" | "draft";

interface AiRequest {
  task: AiTask;
  text: string;
  /** Extra instruction, e.g. the tender question to answer or the client to tailor for. */
  instruction?: string;
  /** Optional supporting material (library blocks) for the "draft" task. */
  context?: string;
}

const SYSTEM = `You are an expert bid and tender writer working for a company called Stacked.
You write clear, credible, professional tender responses that win work.
Rules:
- Write in UK English, in a confident but not boastful tone.
- Be specific and evidence-led; avoid empty marketing filler and clichés.
- Preserve any factual details, figures, names and placeholders (e.g. [year], [figure]) that appear in the source — never invent facts, certifications, or numbers that were not provided.
- Return ONLY the finished text. No preamble, no explanation, no markdown headings unless the source used them.`;

function buildPrompt(body: AiRequest): string {
  const { task, text, instruction, context } = body;
  switch (task) {
    case "improve":
      return `Improve the writing quality of the tender content below — sharper, more persuasive and better structured — while keeping the same meaning and all factual details.\n\n---\n${text}`;
    case "formal":
      return `Rewrite the tender content below in a more formal, professional register suitable for a public-sector or corporate evaluator.\n\n---\n${text}`;
    case "concise":
      return `Tighten the tender content below so it is more concise and punchy, cutting redundancy while keeping every substantive point.\n\n---\n${text}`;
    case "expand":
      return `Expand the tender content below with more depth, detail and supporting evidence, keeping it grounded and avoiding invented facts.\n\n---\n${text}`;
    case "tailor":
      return `Tailor the tender content below to this specific opportunity: ${
        instruction || "(no specifics provided — keep it general but adaptable)"
      }. Adjust emphasis and language to fit, without inventing facts.\n\n---\n${text}`;
    case "draft":
      return `Draft a strong tender response to the following requirement or question:\n\n"${
        instruction || text
      }"\n\n${
        context
          ? `Use the following material from our content library as source facts and phrasing where relevant:\n\n${context}\n\n`
          : ""
      }Write a polished, self-contained answer. Do not invent facts, certifications or figures beyond what the source material supports; use placeholders like [figure] where a specific detail is needed.`;
    default:
      return text;
  }
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        reason: "no-key",
        message:
          "AI assistance is not set up yet. Add an ANTHROPIC_API_KEY to enable the writing helpers.",
      },
      { status: 200 }
    );
  }

  let body: AiRequest;
  try {
    body = (await req.json()) as AiRequest;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  if (!body?.task || (!body.text && !body.instruction)) {
    return NextResponse.json(
      { ok: false, message: "Nothing to work with — add some text first." },
      { status: 400 }
    );
  }

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 8000,
      system: SYSTEM,
      messages: [{ role: "user", content: buildPrompt(body) }],
    });

    const result = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return NextResponse.json({ ok: true, result });
  } catch (err) {
    const message =
      err instanceof Anthropic.APIError
        ? `AI request failed (${err.status ?? "error"}). ${err.message}`
        : "The AI request failed. Please try again.";
    return NextResponse.json({ ok: false, message }, { status: 200 });
  }
}
