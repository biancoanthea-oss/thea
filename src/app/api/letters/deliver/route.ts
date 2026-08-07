import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabaseAdmin";
import { COUPLE_NAME } from "@/lib/config";
import type { Letter } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// How many due letters to deliver per run. The cron runs daily, so a backlog
// larger than this simply drains over the following days.
const BATCH_SIZE = 50;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function letterEmail(letter: Letter) {
  const writtenOn = new Date(letter.created_at).toLocaleDateString("en-US", {
    dateStyle: "long",
  });
  const greeting = letter.sender_name?.trim()
    ? `Dear ${letter.sender_name.trim()},`
    : "Hello,";
  const intro = `On ${writtenOn}, at ${COUPLE_NAME}'s wedding, you sealed a letter to be delivered today. Here it is:`;
  return {
    subject: `A letter from ${COUPLE_NAME}'s wedding — written by you ✉️`,
    text: `${greeting}\n\n${intro}\n\n----------------------------------------\n\n${letter.message}\n\n----------------------------------------\n\nWith love,\n${COUPLE_NAME}`,
    html: `<div style="font-family: Georgia, 'Times New Roman', serif; color: #44403c; max-width: 560px; margin: 0 auto; padding: 24px;">
  <p>${escapeHtml(greeting)}</p>
  <p>${escapeHtml(intro)}</p>
  <blockquote style="border-left: 3px solid #6f7a4f; margin: 24px 0; padding: 12px 20px; background: #faf7f0; white-space: pre-wrap;">${escapeHtml(letter.message)}</blockquote>
  <p>With love,<br/>${escapeHtml(COUPLE_NAME)}</p>
</div>`,
  };
}

// Invoked by the daily Vercel cron (see vercel.json). Finds letters whose
// delivery date has arrived, emails each one to its writer via Resend, and
// stamps sent_at so a letter is never delivered twice.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LETTER_FROM_EMAIL;
  if (!apiKey || !from) {
    return NextResponse.json(
      { error: "Missing RESEND_API_KEY or LETTER_FROM_EMAIL" },
      { status: 500 },
    );
  }

  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("letters")
      .select("id, sender_name, email, message, deliver_at, sent_at, created_at")
      .is("sent_at", null)
      .lte("deliver_at", new Date().toISOString())
      .order("deliver_at", { ascending: true })
      .limit(BATCH_SIZE);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const due = (data ?? []) as Letter[];
    let sent = 0;
    const failed: string[] = [];

    for (const letter of due) {
      const { subject, text, html } = letterEmail(letter);
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to: [letter.email], subject, text, html }),
      });

      if (!res.ok) {
        failed.push(letter.id);
        continue;
      }

      const { error: updateError } = await supabase
        .from("letters")
        .update({ sent_at: new Date().toISOString() })
        .eq("id", letter.id);
      if (updateError) {
        // Email went out but the stamp failed; report it so the duplicate
        // send on the next run can be traced.
        failed.push(letter.id);
        continue;
      }
      sent += 1;
    }

    return NextResponse.json({ due: due.length, sent, failed });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
