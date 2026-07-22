"use client";

const STEPS = [
  {
    title: "Export the data",
    body: "Google Search Console → Performance → set the date range (last 28 days, compared week over week works well) → Export → CSV. Grab both Queries.csv and Pages.csv. If you can, pull a combined query+page export via the API or Looker Studio — it's the only way to catch cannibalization.",
  },
  {
    title: "Run it through the analyzer",
    body: "Drop the CSV into the Analyzer tab. Skim the four finding lists: content gaps, striking distance, CTR underperformers, cannibalization. The analyzer pre-sorts by traffic impact so the top rows are the week's priorities.",
  },
  {
    title: "Ask Claude for the plan",
    body: "Copy the weekly analysis prompt (one click, includes all the findings with real numbers) and paste it into Claude. Ask follow-ups until you have a ranked action list you believe in. Claude will catch patterns across findings that no single row shows — duplicate schema, template-level title truncation, redirect chains.",
  },
  {
    title: "Ship the fixes same-day",
    body: "For each technical fix, copy the finding's prompt — it ends with a Lovable-ready instruction. Paste, ship, move on. No sprint planning. Title/meta rewrites and redirect consolidations are usually minutes each.",
  },
  {
    title: "Draft content for the gaps",
    body: "For each content gap worth writing, copy the article brief prompt. Claude drafts the article with title tag, meta description, FAQ section, and JSON-LD included. Edit it, add screenshots where marked, publish. Answers to real developer questions beat generic content every time.",
  },
  {
    title: "Close the loop",
    body: "Request indexing for changed pages in Search Console. Run the audit checklist monthly. Next week, compare the same queries — striking-distance keywords that moved up confirm the fixes worked; ones that didn't go back on the list.",
  },
];

export default function Workflow() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        The weekly growth routine, start to finish. One session a week is enough — the compounding
        comes from never skipping it.
      </p>
      <ol className="space-y-3">
        {STEPS.map((step, i) => (
          <li
            key={step.title}
            className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 font-bold text-indigo-300">
              {i + 1}
            </span>
            <div>
              <h2 className="font-semibold text-slate-100">{step.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
