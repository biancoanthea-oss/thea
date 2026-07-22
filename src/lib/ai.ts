"use client";

export type AiTask = "improve" | "formal" | "concise" | "expand" | "tailor" | "draft";

export interface AiResult {
  ok: boolean;
  result?: string;
  message?: string;
  reason?: string;
}

export async function runAi(payload: {
  task: AiTask;
  text: string;
  instruction?: string;
  context?: string;
}): Promise<AiResult> {
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return (await res.json()) as AiResult;
  } catch {
    return { ok: false, message: "Could not reach the AI service." };
  }
}
