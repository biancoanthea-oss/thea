---
description: Technical, on-page, or content SEO audit with P0/P1/P2 findings
---

Run an SEO audit. Type: $ARGUMENTS (`technical`, `page <url>`, or `content`).
If no type is given, run `technical`.

Follow `marketing/seo/audit-playbook.md` for the checks and the report format.
Load `marketing/brief.md` and `marketing/seo/keyword-clusters.md` for context.

**For `technical`:** this is a Next.js App Router project — inspect the actual
source in `src/`, don't audit in the abstract. Check for leaked `noindex`,
missing `metadata` / `generateMetadata` exports, money-page content that only
renders client-side, unsized images, and missing `robots.txt` / `sitemap.xml`.
Report file paths and line numbers for anything fixable in code.

**For `page <url>`:** work through the on-page table in the playbook, every row.
Fetch the live page if the URL is public; otherwise read the source.

**For `content`:** requires Search Console data via the `search-console` MCP
server. Sort every URL into the four buckets (winning / striking distance /
impressions-no-clicks / nothing) and act on each per the playbook. The
striking-distance bucket is the priority — say so. If GSC is not connected, say
what you cannot assess rather than guessing at rankings.

Save to `marketing/reports/YYYY-MM-DD-seo-<type>.md`, ranked P0/P1/P2, with the
"Checked and healthy" section so scope is visible. Never assert a ranking or a
traffic number you have not read from data.
