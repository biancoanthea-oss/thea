# Audit playbook

Three audits, run at different cadences. Each produces a **P0/P1/P2** ranked
report in `../reports/YYYY-MM-DD-<name>.md`. The point of the tiers is that an
audit listing 90 undifferentiated issues gets ignored; one with four P0s gets
acted on.

| Audit | Cadence | Command |
| --- | --- | --- |
| Technical | Monthly, and after any deploy touching routing/rendering | `/seo-audit technical` |
| On-page | Per page, before publishing | `/seo-audit page <url>` |
| Content | Quarterly | `/seo-audit content` |

## Priority definitions

- **P0** — actively costing traffic or money right now. Pages not indexable,
  broken canonical, site down for crawlers, tracking broken.
- **P1** — meaningful gain within a month. Missing metadata on money pages, slow
  LCP, thin content on a target cluster, missing internal links.
- **P2** — worth doing eventually. Alt text on decorative images, schema on
  low-priority pages, minor heading hierarchy.

Anything that cannot be argued into P0 or P1 is P2, and P2 lists should be short.

---

## 1. Technical audit

### Indexability — always P0 when broken
- `robots.txt` — is anything important disallowed?
- `sitemap.xml` — exists, submitted to Search Console, contains only canonical
  200-status URLs?
- `noindex` tags — check none leaked from a staging config into production.
  **This is the single most common catastrophic SEO bug**, and on a Next.js app
  it hides in a layout's metadata export.
- Canonical tags — self-referencing on every page, absolute URLs.
- Redirect chains — every redirect should be one hop, 301 not 302.

### Rendering — matters more on this stack
This is a **Next.js App Router** app, so ask specifically:
- Is the target page server-rendered or client-rendered? Content that only
  appears after client-side JS is crawled unreliably. Money pages and articles
  must be server components or statically generated.
- Does `view-source:` show the actual copy, or an empty div? That is the test.
- Are there route segments marked `'use client'` that don't need to be?
- Is `generateMetadata` or a static `metadata` export present on every public
  page? Next.js will not invent a title for you.

### Core Web Vitals
- **LCP** — largest element, usually the hero image. Under 2.5s.
  Use `next/image` with explicit width/height and `priority` on the hero.
- **CLS** — under 0.1. Almost always unsized images or a late-loading font.
- **INP** — under 200ms.
- Check on **mobile**, throttled. The audience is on a phone, often on venue
  wifi or 4G.

### Other
- HTTPS everywhere, no mixed content.
- One `www`/non-`www` version, the other redirected.
- 404 page returns an actual 404 status, not a 200 with a "not found" message.
- Structured data on articles (`Article`) and product/pricing (`Product`,
  `FAQPage` where an FAQ genuinely exists).

**Never** add schema describing things that aren't on the page. Google treats it
as spam and it earns a manual action.

---

## 2. On-page audit (per page, pre-publish)

| Check | Rule |
| --- | --- |
| Title tag | ≤ 60 chars, target term near the front, reads like a human wrote it |
| Meta description | ≤ 155 chars, contains the benefit and an implicit CTA |
| H1 | Exactly one, contains the target term or a close variant |
| Heading hierarchy | H2/H3 nest properly, no skipped levels |
| URL | Short, lowercase, hyphenated, no dates, no stop words |
| Target term | In the first 100 words, naturally. Do not count densities |
| Internal links | 2+ out, and at least one **up** to a money page with descriptive anchor |
| External links | 1–2 to genuinely authoritative sources where a claim needs backing |
| Images | Descriptive alt text, `next/image`, compressed, correct dimensions |
| Search intent match | Does the page format match what ranks? A listicle query wants a list |
| Uniqueness | What does this page have that the top 3 results don't? If nothing, don't publish |
| Claims | Every claim passes `../brand-voice.md → Claims policy` |
| CTA | Present, appropriate to intent (soft on informational, direct on money pages) |

---

## 3. Content audit (quarterly)

Needs Search Console connected (`../mcp-setup.md`). For every published URL:

1. **Pull impressions, clicks, average position** for the last 90 days.
2. Sort into four buckets and act:

| Bucket | Signal | Action |
| --- | --- | --- |
| **Winning** | Position 1–5, clicks growing | Leave alone. Add internal links from new content |
| **Striking distance** | Position 5–15, decent impressions | **Highest ROI work on the site.** Expand, improve, add internal links. Moving 8→4 roughly triples clicks |
| **Impressions, no clicks** | Ranking, CTR under 2% | Title and meta description problem, not a content problem. Rewrite them, don't rewrite the page |
| **Nothing** | No impressions after 90 days live | Wrong intent, no demand, or not indexed. Check indexing first, then consider merging or deleting |

3. **Cannibalisation check:** any query where two URLs both rank? Merge them or
   differentiate the intent. Two half-strength pages lose to one strong one.
4. **Decay check:** anything that lost more than 30% of clicks quarter over
   quarter? Usually a competitor updated theirs and yours went stale.

## Report format

```markdown
# <Audit type> — YYYY-MM-DD
Scope: <what was checked>  ·  Data source: <MCP live / CSV export / crawl>

## P0 — fix now
### 1. <Finding>
**Evidence:** <the actual number or the actual tag>
**Why it matters:** <impact in traffic or revenue terms>
**Fix:** <specific, actionable — file and line where it's a code change>
**Expected effect:** <honest estimate, with the uncertainty stated>

## P1 — this month
## P2 — backlog
## Checked and healthy
<so the reader knows the scope was covered, not skipped>
```

The last section matters. An audit that only lists problems leaves you unable to
tell "fine" from "not looked at".
