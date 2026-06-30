import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { CATEGORIES, type ExtractionResult } from "@/lib/types";

// Vision + a few frames can take a bit; give the function room on Vercel.
export const runtime = "nodejs";
export const maxDuration = 60;

type IncomingImage = { mediaType: string; data: string };

type ExtractBody = {
  images?: IncomingImage[];
  caption?: string;
  sourceUrl?: string;
};

const SUPPORTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

// JSON schema the model must fill. additionalProperties:false + required on
// every object is required for structured outputs to compile cleanly.
const OUTPUT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    servings: { type: "string" },
    ingredients: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          quantity: { type: "string" },
          category: { type: "string", enum: [...CATEGORIES] },
          note: { type: "string" },
        },
        required: ["name", "quantity", "category", "note"],
      },
    },
    notes: { type: "array", items: { type: "string" } },
  },
  required: ["title", "servings", "ingredients", "notes"],
} as const;

const SYSTEM_PROMPT = `You are a kitchen assistant that turns a recipe — shown as screenshots, video frames, and/or pasted caption text — into a clean grocery shopping list.

You will receive one or more images (these may be screenshots of a recipe, or frames sampled from a cooking video) and optionally some caption or description text. Read everything: on-screen text, captions, ingredient overlays, and what is visibly being cooked.

Produce the consolidated list of ingredients someone needs to BUY to make this recipe.

Rules:
- One entry per distinct grocery item. Merge duplicates that appear across multiple frames (the same dish filmed at different moments will repeat ingredients — do not list them twice).
- "name" is the shopping item as you'd write it on a list (e.g. "Chicken breast", "Garlic", "Parmesan"). Keep it generic enough to find in a store.
- "quantity" is how much to buy, with units when known (e.g. "500 g", "2", "1 cup", "1 can"). If the recipe shows an amount, use it. If not, give a sensible shopping amount and rely on the notes to flag that it was estimated. Use "to taste" for things like salt and pepper.
- "category" must be one of the allowed grocery aisles.
- "note" is a short optional prep or usage hint (e.g. "diced", "for garnish"); use "" when there's nothing useful to add.
- Do NOT include water, or basic equipment, or steps — only things you would buy.
- "title" is your best guess at the recipe name; "" if you truly can't tell.
- "servings" is the yield if stated (e.g. "Serves 4"); "" otherwise.
- Use "notes" to flag anything the shopper should know: quantities you had to estimate, ingredients you were unsure about, or "Could not find any recipe content" if the images don't show a recipe.

Only describe ingredients you can actually justify from the provided content. Don't invent a different recipe.`;

function extractJson(message: Anthropic.Beta.Messages.BetaMessage): string | null {
  for (const block of message.content) {
    if (block.type === "text") return block.text;
  }
  return null;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error:
          "The server is missing its ANTHROPIC_API_KEY. Add it to your environment and restart.",
      },
      { status: 500 },
    );
  }

  let body: ExtractBody;
  try {
    body = (await req.json()) as ExtractBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const images = (body.images ?? []).filter(
    (img) => img && img.data && SUPPORTED_IMAGE_TYPES.has(img.mediaType),
  );
  const caption = (body.caption ?? "").trim();
  const sourceUrl = (body.sourceUrl ?? "").trim();

  if (images.length === 0 && !caption) {
    return NextResponse.json(
      {
        error:
          "Add a screenshot or a video of the recipe, or paste the recipe text, so I have something to read.",
      },
      { status: 400 },
    );
  }

  // Guardrail so one request can't balloon: cap the number of images.
  const cappedImages = images.slice(0, 8);

  const content: Anthropic.Beta.Messages.BetaContentBlockParam[] = [];

  for (const img of cappedImages) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: img.mediaType as
          | "image/jpeg"
          | "image/png"
          | "image/webp"
          | "image/gif",
        data: img.data,
      },
    });
  }

  const textParts: string[] = [];
  if (cappedImages.length > 0) {
    textParts.push(
      `I've attached ${cappedImages.length} image(s) from a recipe${
        cappedImages.length > 1 ? " (some may be frames from a video)" : ""
      }.`,
    );
  }
  if (caption) {
    textParts.push(`Recipe caption / description text:\n"""\n${caption}\n"""`);
  }
  if (sourceUrl) {
    textParts.push(`Source URL (context only): ${sourceUrl}`);
  }
  textParts.push(
    "Give me the shopping list of ingredients I need to buy to make this.",
  );
  content.push({ type: "text", text: textParts.join("\n\n") });

  const client = new Anthropic();

  try {
    const message = await client.beta.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      // Structured outputs — the SDK adds the required beta header automatically.
      output_format: { type: "json_schema", schema: OUTPUT_SCHEMA },
      messages: [{ role: "user", content }],
    });

    if (message.stop_reason === "refusal") {
      return NextResponse.json(
        {
          error:
            "I wasn't able to process that content. Try a clearer screenshot of the recipe.",
        },
        { status: 422 },
      );
    }

    const raw = extractJson(message);
    if (!raw) {
      return NextResponse.json(
        { error: "I couldn't read a recipe from that. Try another screenshot." },
        { status: 422 },
      );
    }

    let result: ExtractionResult;
    try {
      result = JSON.parse(raw) as ExtractionResult;
    } catch {
      return NextResponse.json(
        { error: "Something went wrong reading the recipe. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json(result);
  } catch (err) {
    const status =
      err instanceof Anthropic.APIError && typeof err.status === "number"
        ? err.status
        : 500;
    const message =
      status === 401
        ? "The Anthropic API key was rejected. Check that it's valid."
        : status === 429
          ? "The recipe service is busy right now. Wait a moment and try again."
          : "I couldn't reach the recipe service. Please try again.";
    return NextResponse.json({ error: message }, { status });
  }
}
