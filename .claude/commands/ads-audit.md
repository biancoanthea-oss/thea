---
description: Full Google Ads account audit — structure, waste, and ranked fixes
---

Run a full Google Ads account audit.

**Context to load first:** `marketing/brief.md`, `marketing/CLAUDE.md`,
`marketing/google-ads/strategy.md`, `marketing/google-ads/negative-keywords.md`.

**Data source:** use the `google-ads` MCP server if connected — call
`list_accessible_customers`, then `search` with GAQL. Use
`get_resource_metadata` to confirm field names rather than guessing them. If the
server is not connected, look for CSV exports in `marketing/reports/data/` and
say which files you used. If neither exists, say so and stop — do not analyse
hypothetical data.

Audit these, in order:

1. **Settings hygiene** — Search Partners off? Display Network off on Search
   campaigns? Location set to Presence (not Presence-or-interest)? Geos match
   `brief.md`? Ad schedule sane?
2. **Structure** — one intent per ad group? One landing page per ad group?
   Ad groups with more than ~20 keywords, or fewer than 3?
3. **Waste** — every search term, keyword, and ad group with spend above 3× the
   target CPA and zero conversions. Check each against `brief.md §5 Protected
   terms` before calling it waste.
4. **Negatives** — which of the four waste families in
   `negative-keywords.md` are leaking? Propose root negatives, not query-level ones.
5. **Ad copy** — ad groups with fewer than 2 RSAs, ad strength Poor, or fewer
   than 12 headlines.
6. **Bidding** — strategy appropriate to conversion volume? Any tCPA changed in
   the last 14 days (still learning)?
7. **Budget** — pace against month-to-date. Any campaign limited by budget while
   at or below target CPA (that is a missed-money finding, not a problem)?
8. **Conversion tracking** — one primary action? Counting "One"? Any action with
   zero conversions in 30 days (probably broken)?

**Output:** a report at `marketing/reports/YYYY-MM-DD-ads-audit.md` in the
format from `marketing/seo/audit-playbook.md → Report format`, ranked P0/P1/P2,
including the "Checked and healthy" section.

Rules: label anything under 30 clicks `INSUFFICIENT DATA` rather than analysing
it. Every finding needs the actual number as evidence. State the expected effect
on CPA or conversions, with the uncertainty. You have read-only access — produce
a change list for a human to apply, never claim to have changed the account.
