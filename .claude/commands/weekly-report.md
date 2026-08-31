---
description: The five weekly numbers — spend pace, CPA, waste, and anomalies
---

Produce the weekly Google Ads report. Answer only these five questions, in
order, from `marketing/google-ads/measurement.md`. Do not browse the account
and report whatever is interesting — answer the five.

1. **Spend vs pace.** Month-to-date spend against a linear pace for the monthly
   budget in `marketing/brief.md`. Over-pacing early in a month is a real risk:
   say what daily spend is needed for the rest of the month.
2. **CPA vs target**, per campaign, this week vs last week. Target is in
   `brief.md §3`. If it is still `TODO`, say so and report CPA without a verdict.
3. **Search terms** — the top 5 wasteful queries by spend. Full review is
   `/search-terms`; here just name the worst.
4. **Zero-conversion spenders** — any keyword or ad group above 3× target CPA
   with no conversions.
5. **Anomalies** — anything that moved more than 40% week over week, in either
   direction, with a hypothesis for why. Rises matter as much as falls.

Then: **one recommended action for the coming week.** One, not a list. Say what
it is, what it should do, and how you will know if it worked.

Data via the `google-ads` MCP `search` tool, or the latest CSV in
`marketing/reports/data/`. Name the source and date range.

Keep it under one page. Save to `marketing/reports/YYYY-MM-DD-weekly.md`.
Anything under 30 clicks is `INSUFFICIENT DATA`, not a trend.
