# Marketing workspace

Google Ads (Search + Performance Max) and SEO, run out of the repo with Claude
Code against live account data.

## Start here

1. **Fill in `brief.md`.** Everything else derives from it. The `TODO` fields —
   price, target CPA, region, conversion action — are the ones that matter; the
   playbooks give wrong advice without them.
2. **Connect the data.** `mcp-setup.md`. The Google Ads developer token takes
   1–2 business days to approve, so request it first and read the rest while
   waiting. Everything works from CSV exports in the meantime.
3. **Build the landing page.** `seo/content-plan.md` item 1. This blocks all ad
   spend — the app's `/` is the *guest* upload screen, not a page that sells to
   a couple.
4. **Set up conversion tracking.** `google-ads/measurement.md`. Smart Bidding
   without conversion data is random spending.
5. **Then launch Search.** `google-ads/strategy.md` Phase 1.

Performance Max comes at month 3+, not at launch — the entry criteria are in
`strategy.md → Phase 4`.

## Commands

| Command | Does |
| --- | --- |
| `/ads-audit` | Full account audit, ranked P0/P1/P2 |
| `/search-terms` | Weekly waste review → negative keywords to add |
| `/weekly-report` | The five weekly numbers and one recommended action |
| `/rsa <ad group>` | Write or refresh ad copy, length-checked |
| `/seo-audit [technical\|page <url>\|content]` | SEO audit with ranked findings |
| `/competitors <name>` | Competitor analysis from live pages |

## Checks

```bash
npm run ads:lint    # every ad asset against Google's character limits
```

Reports land in `reports/`. CSV exports go in `reports/data/` (gitignored).
Credentials go in `.env.marketing` (gitignored) — never in a committed file.

`CLAUDE.md` in this directory holds the guardrails Claude follows in marketing
sessions: don't flag category terms as waste, judge against CPA not CPC, no
unverifiable claims, no conclusions from 12 clicks.
