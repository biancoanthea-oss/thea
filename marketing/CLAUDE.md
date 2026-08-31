# Marketing workspace — operating rules

These rules apply to any session doing marketing, SEO, or Google Ads work in
this repo. Read `brief.md` before answering anything. If a question depends on
a number that is still a `TODO` in `brief.md`, say so instead of inventing one.

## Guardrails

1. **Never flag a core category term as waste.** Terms in
   `brief.md → Protected terms` are the business. They may look expensive or
   low-converting in a 30-day window; that is a signal to fix landing pages,
   match types, or bids — not to pause the term. Recommend pausing a protected
   term only with 90+ days of data and an explicit cost-per-conversion argument.
2. **Judge against target CPA and LTV, not CPC or CTR.** A £4 click that
   converts at 8% beats a £0.60 click that converts at 0.2%. Always convert a
   recommendation into an expected effect on CPA, conversions, or contribution
   margin.
3. **No unverifiable claims.** See `brand-voice.md → Claims policy`. Never write
   "#1", "best", awards, review counts, customer counts, or press mentions
   unless the number appears in `brief.md`.
4. **Geo and language discipline.** Only recommend targeting listed in
   `brief.md → Regions`. Never suggest "all countries" or Display expansion by
   default.
5. **Statistical honesty.** Do not draw conclusions from ad groups with fewer
   than ~30 clicks or ~100 impressions. Label every such read
   `INSUFFICIENT DATA` and say what volume would be needed.
6. **Read-only by default.** The Google Ads MCP connection is read-only
   (see `mcp-setup.md`). Produce diffs, bulk-upload CSVs, and change lists for a
   human to apply in the Google Ads UI. Never claim a change was made in the
   account.
7. **Money is real.** Any recommendation that increases spend states the daily
   budget delta and the worst case for a 14-day test.

## Output conventions

- Recommendations are ranked **P0 / P1 / P2** (P0 = losing money or broken now,
  P1 = meaningful gain this month, P2 = worth doing eventually).
- Every finding carries: what, evidence (the number), why it matters, the fix,
  and the expected effect.
- Ad copy is always emitted with character counts. Headlines ≤ 30, descriptions
  ≤ 90, path fields ≤ 15. Run `npm run ads:lint` before presenting copy.
- Reports go in `marketing/reports/` as `YYYY-MM-DD-<name>.md`. CSV exports you
  are given go in `marketing/reports/data/` and are gitignored.

## Where things live

| File | What it is |
| --- | --- |
| `brief.md` | The single source of truth. Product, ICP, economics, regions. **Edit this first.** |
| `brand-voice.md` | Tone, vocabulary, claims policy |
| `mcp-setup.md` | Live Google Ads / Search Console / GA4 connection setup |
| `google-ads/strategy.md` | Account structure, budget phasing, Search → PMax |
| `google-ads/keyword-map.md` | Ad groups, keywords, match types, landing pages |
| `google-ads/negative-keywords.md` | Shared negative lists and the logic behind them |
| `google-ads/rsa-copy.md` | Responsive Search Ad assets, length-checked |
| `google-ads/pmax-asset-groups.md` | Asset groups, audience signals, PMax guardrails |
| `google-ads/measurement.md` | Conversion actions, values, benchmarks |
| `seo/keyword-clusters.md` | Search intent clusters and priority |
| `seo/content-plan.md` | Pages to write, in order, with briefs |
| `seo/audit-playbook.md` | How to run on-page, technical, and content audits |
| `seo/competitor-analysis.md` | Competitor set and how to analyse them |

Slash commands in `.claude/commands/` wrap the recurring workflows.
