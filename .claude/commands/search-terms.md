---
description: Weekly search term review — waste to negative, winners to promote
---

Review search terms and produce this week's negative keyword additions.

**Context:** `marketing/brief.md` (especially §5 Protected terms),
`marketing/google-ads/negative-keywords.md`, `marketing/google-ads/keyword-map.md`.

**Data:** last 30 days of search terms via the `google-ads` MCP `search` tool
(query the `search_term_view` resource — confirm fields with
`get_resource_metadata`), or the most recent CSV in `marketing/reports/data/`.
Name the source and date range in the output.

Produce four sections:

**1. Add as negatives.** For each wasteful query, identify which of the four
waste families it belongs to (wrong buyer / wrong product / free intent /
research intent) and propose the **root word**, not the full query. Show the
spend each root would have saved over the period. Never propose a negative that
appears in a protected term, or that would block `wedding`, `photo`, `guest`,
`share`, `app`, or `qr`.

**2. Promote to exact match.** Queries that converted, or that show strong
intent with good CTR, and aren't already exact keywords. Say which ad group each
belongs in and why.

**3. New ad group candidates.** Clusters of related queries that don't fit any
existing ad group's ad and landing page. These are the interesting ones — a
cluster here is a gap in the keyword map.

**4. New content ideas.** Informational queries that shouldn't be bought but
should be written. Cross-reference `marketing/seo/keyword-clusters.md` and flag
anything not already covered.

Output as a report at `marketing/reports/YYYY-MM-DD-search-terms.md`, plus a
plain copy-pasteable block of the negatives for the Google Ads UI. Flag any
query with fewer than 5 clicks as too small to judge.
