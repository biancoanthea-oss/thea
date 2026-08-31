# Live data via MCP

Verified 2026-08-31. This connects Claude directly to Google Ads, Search
Console, and GA4 so you stop exporting CSVs.

## Read this first: what the official server can and cannot do

Google publishes a **first-party, open-source Google Ads MCP server** at
[`googleads/google-ads-mcp`](https://github.com/googleads/google-ads-mcp), built
on the Google Ads API. It is **read-only** and deliberately narrow — it exposes
three tools:

| Tool | Does |
| --- | --- |
| `list_accessible_customers` | Returns the customer IDs your credentials can reach |
| `search` | Runs a GAQL query against the account — this is where all reporting happens |
| `get_resource_metadata` | Describes a resource type (e.g. `campaign`) so queries can be written against real field names |

**There is no write path.** Claude reads the account, produces a change list or
a bulk-upload CSV, and you apply it in the Google Ads UI or via Google Ads
Editor. Third-party servers offer writes; do not use one until the read-only
loop has been running for a few weeks and you trust the recommendations.

Everything is driven by GAQL, so `get_resource_metadata` is worth calling once
per new report type rather than guessing field names.

## Step 1 — Google Ads API access (start now, it gates everything)

1. **Google Ads Manager (MCC) account.** The developer token lives on a manager
   account, not a normal one. Create one at ads.google.com if you don't have it,
   and link your ads account to it.
2. **Request a developer token**: Manager account → **Tools → Setup → API Center**.
   Tokens are issued at three access levels:
   - *Test account* — sandbox only, cannot touch real accounts
   - *Basic* — real accounts, capped API operations
   - *Standard* — production, no meaningful cap

   Apply for Basic access. Approval typically takes **1–2 business days** but can
   take longer if the application form is vague — describe the actual use
   ("internal reporting and campaign analysis for our own advertising account").
3. **Google Cloud project**: create one, enable the **Google Ads API**, and note
   the project ID.
4. **Credentials**: either OAuth client credentials (`Desktop app` type) or
   Application Default Credentials via `gcloud auth application-default login`.
   ADC is simpler for a single user on one machine.

## Step 2 — Install and configure

The server runs straight from the repo via `pipx` (needs Python and `pipx`):

```bash
pipx run --spec git+https://github.com/googleads/google-ads-mcp.git google-ads-mcp
```

Environment variables it reads:

| Variable | Required | What |
| --- | --- | --- |
| `GOOGLE_PROJECT_ID` | yes | Your Google Cloud project ID |
| `GOOGLE_ADS_DEVELOPER_TOKEN` | yes | From API Center |
| `GOOGLE_ADS_LOGIN_CUSTOMER_ID` | if using a manager account | MCC ID, digits only, no dashes |
| `GOOGLE_APPLICATION_CREDENTIALS` | if using ADC/service account | Path to the credentials JSON |

Put them in `.env.marketing` (gitignored — see below), then either register the
server with:

```bash
claude mcp add google-ads --scope project -- \
  pipx run --spec git+https://github.com/googleads/google-ads-mcp.git google-ads-mcp
```

…or use the `.mcp.json` already committed at the repo root, which references the
variables by name so no secret is ever written into the file.

**Verify:** start a session and ask Claude to call `list_accessible_customers`.
If it returns your customer ID, you are connected. If it returns
`DEVELOPER_TOKEN_NOT_APPROVED`, the token is still pending.

## Step 3 — Search Console (for the SEO half)

Google ships an official **GA4** MCP server, but **not** one for Search Console —
every GSC option is community-built, so read the source before installing and
prefer a read-only scope. A widely used one is
[`AminForou/mcp-gsc`](https://github.com/AminForou/mcp-gsc), which runs via
`uvx mcp-search-console` and exposes ~20 tools (top queries, CTR trends, period
comparison, URL inspection, indexing status, sitemaps).

It authenticates either as **you** (OAuth client secrets JSON, browser consent on
first run) or as a **service account** (add the service-account email as a user
on the GSC property). Service account is better here — no browser, no expiring
consent.

For GA4, use Google's official `analytics-mcp` server if you want session and
conversion data in the same session.

## Security rules for this repo

- Credential JSONs and `.env.marketing` are gitignored. **Never** commit a
  developer token, client secret, or service-account key.
- If a key is ever committed, it is burned: rotate it in Google Cloud
  immediately — removing the commit is not sufficient.
- Grant the narrowest access that works: read-only Ads, read-only GSC.
- The developer token identifies you to Google. It is not a shared credential;
  do not paste it into third-party hosted MCP services.

## What "connected" unlocks

Once `search` works, these become one-sentence requests instead of export jobs:

- "Pull the last 30 days of search terms with cost, conversions and CPA, and
  flag anything spending over £20 with zero conversions."
- "Compare this week's spend against a linear pace for the monthly budget."
- "List every ad group where the RSA ad strength is Poor or Average."
- "Find campaigns whose CPA rose more than 40% week over week."

Those four are already wired up as slash commands — see `.claude/commands/`.

## If the developer token is still pending

Everything except the live pull works without it. Export from Google Ads
(**Reports → download CSV**) into `marketing/reports/data/` and every playbook
here still applies — the analysis commands read either source.

Sources: [googleads/google-ads-mcp](https://github.com/googleads/google-ads-mcp) ·
[AminForou/mcp-gsc](https://github.com/AminForou/mcp-gsc)
