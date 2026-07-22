// Ready-to-paste prompt templates for Claude (analysis/content) and
// Lovable (shipping the fix). Each takes real numbers from the uploaded
// GSC export so the prompt lands with full context.

import { Analysis, CannibalGroup, CtrProblem, GscRow, formatNum, formatPct } from "./gsc";

function siteLabel(site: string): string {
  return site.trim() || "my site";
}

export function contentBriefPrompt(site: string, row: GscRow): string {
  return `You are my SEO content strategist for ${siteLabel(site)}.

Google Search Console shows the query "${row.key}" got ${formatNum(row.impressions)} impressions in the last period but only ${formatNum(row.clicks)} clicks (average position ${row.position.toFixed(1)}). People are searching for this and we have nothing that ranks well for it.

Write a complete article that targets this query. Requirements:
1. Answer the query directly in the first paragraph — no throat-clearing intro.
2. Suggest a title tag under 60 characters with the keyword near the front, and a meta description of 140–160 characters that earns the click.
3. Use H2/H3 headings that match related long-tail variations of the query.
4. Include an FAQ section at the end with 3–5 questions people also ask, suitable for FAQPage schema.
5. Write for a developer audience: specific, practical, zero fluff. Real steps, real commands, real file paths where relevant.
6. Add a short "Sources / further reading" placeholder list I can fill in.
7. Finish with the JSON-LD (Article + FAQPage) snippet for this page.

Mark any spot where I should add a screenshot with [SCREENSHOT: description].`;
}

export function ctrFixPrompt(site: string, row: CtrProblem, isPage: boolean): string {
  const target = isPage ? `The page ${row.key}` : `The query "${row.key}"`;
  return `You are my SEO copywriter for ${siteLabel(site)}.

${target} ranks at position ${row.position.toFixed(1)} with ${formatNum(row.impressions)} impressions but the CTR is only ${formatPct(row.ctr)} — a position like that should earn roughly ${formatPct(row.expectedCtr)}. The title tag and meta description are not winning the click.

Do the following:
1. Diagnose the most likely reasons (truncated title, missing benefit, no differentiation vs. the SERP competitors, weak meta description, missing structured data for rich results).
2. Write 3 alternative title tags, each under 60 characters, keyword near the front, with a clear differentiator.
3. Write 2 meta descriptions, 140–160 characters, each with a concrete benefit and an implicit call to action.
4. Recommend which combination to ship and why.

Then output the change as a short, precise instruction I can paste into Lovable to update the page's <title> and meta description (mention the exact route/page it applies to).`;
}

export function strikingDistancePrompt(site: string, row: GscRow): string {
  return `You are my SEO strategist for ${siteLabel(site)}.

The query "${row.key}" sits at position ${row.position.toFixed(1)} with ${formatNum(row.impressions)} impressions and ${formatNum(row.clicks)} clicks. It's in striking distance — a small push moves it to page 1 / top 3 and multiplies the traffic.

Give me a concrete action plan to move it up:
1. What on-page changes to make on the ranking page (title, H1, first paragraph, headings, internal anchor text).
2. What sections or FAQs to add so the page fully covers the query's intent — list them with one-line descriptions.
3. Which existing pages should add an internal link to this page, and with what anchor text.
4. Any schema markup that would help (and the JSON-LD for it).

Then write the exact Lovable prompt to implement the on-page changes, so I can ship them today.`;
}

export function cannibalizationPrompt(site: string, group: CannibalGroup): string {
  const pageLines = group.pages
    .map(
      (p) =>
        `- ${p.page ?? p.key}: ${formatNum(p.impressions)} impressions, ${formatNum(p.clicks)} clicks, position ${p.position.toFixed(1)}`
    )
    .join("\n");
  return `You are my technical SEO consultant for ${siteLabel(site)}.

The query "${group.query}" is being served by multiple pages, which splits authority and confuses Google about which one to rank:

${pageLines}

Recommend a consolidation plan:
1. Which page should be the canonical winner for this query, and why.
2. For each losing page: 301 redirect it, canonical-tag it to the winner, or re-target it to a different query (say which and to what).
3. Internal linking changes so the winner gets the anchors.
4. Any content worth merging from the losers into the winner.

Then write the exact Lovable prompt to implement the redirects/canonicals, so I can ship it today.`;
}

export function weeklyAnalysisPrompt(site: string, analysis: Analysis): string {
  const t = analysis.totals;
  const lines: string[] = [];
  lines.push(`You are my SEO growth analyst for ${siteLabel(site)}. Below is a pre-processed summary of this week's Google Search Console export. Analyze it and give me a prioritized action list for the week — highest traffic impact first, each with the concrete fix and the effort level.`);
  lines.push("");
  lines.push(`## Totals (${analysis.kind} export, ${formatNum(t.rows)} rows)`);
  lines.push(`- Clicks: ${formatNum(t.clicks)}`);
  lines.push(`- Impressions: ${formatNum(t.impressions)}`);
  lines.push(`- Average CTR: ${formatPct(t.avgCtr)}`);
  lines.push(`- Average position (impression-weighted): ${t.avgPosition.toFixed(1)}`);

  if (analysis.contentGaps.length > 0) {
    lines.push("");
    lines.push("## Content gaps (impressions but almost no clicks — nothing ranks well)");
    for (const r of analysis.contentGaps.slice(0, 15)) {
      lines.push(`- "${r.key}" — ${formatNum(r.impressions)} impressions, ${formatNum(r.clicks)} clicks, position ${r.position.toFixed(1)}`);
    }
  }

  if (analysis.strikingDistance.length > 0) {
    lines.push("");
    lines.push("## Striking distance (position 4–15, worth a push)");
    for (const r of analysis.strikingDistance.slice(0, 15)) {
      lines.push(`- "${r.key}" — position ${r.position.toFixed(1)}, ${formatNum(r.impressions)} impressions, ${formatNum(r.clicks)} clicks`);
    }
  }

  if (analysis.ctrProblems.length > 0) {
    lines.push("");
    lines.push("## CTR underperformers (ranking fine, title/meta not earning the click)");
    for (const r of analysis.ctrProblems.slice(0, 15)) {
      lines.push(`- "${r.key}" — position ${r.position.toFixed(1)}, CTR ${formatPct(r.ctr)} vs ~${formatPct(r.expectedCtr)} expected, ${formatNum(r.impressions)} impressions`);
    }
  }

  if (analysis.cannibalization.length > 0) {
    lines.push("");
    lines.push("## Possible cannibalization (one query, multiple pages)");
    for (const g of analysis.cannibalization.slice(0, 10)) {
      lines.push(`- "${g.query}" — ${g.pages.length} pages competing, ${formatNum(g.totalImpressions)} combined impressions`);
    }
  }

  lines.push("");
  lines.push("For each recommended action, tell me: (a) the expected traffic impact, (b) the fix, and (c) — when it's a site change — the exact prompt I should paste into Lovable to ship it.");
  return lines.join("\n");
}
