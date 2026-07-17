# Stacked Marketing Hub

A full-stack dashboard for managing **SEO & analytics across multiple sites**.
Three tools plus a site manager:

| Tool | What it does |
| --- | --- |
| **Dashboard** | Multi-site metrics table — sessions & conversions (GA4), clicks, impressions & average position (Search Console). Pulls live from Google, or manual entry. |
| **SEO Audit Tracker** | Page-level audit rows — title tags, meta descriptions, status, priority, issues. |
| **Keyword Planner** | Target keywords — search volume, difficulty, current position, content status. |
| **Site Manager** | Add/edit your sites and connect each to GA4 + Search Console. |

**Stack:** Vite + React (frontend) · Node + Express (backend) · SQLite (`better-sqlite3`) ·
Google Analytics Data API (GA4) + Search Console API, authenticated **server-side** with a
service account. Every site can be **connected to Google** for automatic data, or left on
**manual entry** — you can mix and match.

---

## Quick start

```bash
npm install          # once
npm run dev          # start everything
```

Then open **http://localhost:5173**. That single `npm run dev` runs both the API
(port 4000) and the React app (port 5173) together. It seeds two example sites the first
time so you can see how each tool works — delete them from the Site Manager once you've
added your own.

> First run: `npm install` also creates the SQLite database automatically. If you ever want
> to reset to the example data, delete `server/data/marketing-hub.sqlite` and run `npm run seed`.

Other commands:

| Command | Does |
| --- | --- |
| `npm run dev` | Dev mode — API + frontend with hot reload (**use this**) |
| `npm run build` | Build the frontend for production into `dist/` |
| `npm start` | Production mode — one process serves the built app **and** the API on port 4000 |
| `npm run seed` | Insert example data (only if the database is empty) |

---

## Project structure

```
.
├── index.html            # frontend entry
├── vite.config.js        # dev server + /api proxy to the backend
├── src/                  # React frontend
│   ├── StackedMarketingHub.jsx   # main shell (tabs, period, Google status)
│   ├── api.js                    # tiny fetch wrapper (all calls hit /api)
│   └── components/               # Dashboard, AuditTracker, KeywordPlanner, SiteManager
└── server/               # Express backend
    ├── index.js          # REST API
    ├── db.js             # SQLite connection + auto-migrate
    ├── schema.sql        # sites, metrics, audits, keywords
    ├── google.js         # GA4 + Search Console (service account) — credentials live here
    ├── seed.js           # example data
    └── data/             # the SQLite file (git-ignored)
```

Your database (`server/data/`), your `.env`, and any Google key files are **git-ignored** —
they never get committed.

---

## Connecting Google (live data)

Without this, every site uses **manual entry** and the app works fully. Do this when you
want sessions/clicks/impressions/position to fill in automatically. You do it **once**, then
just add each site's IDs in the Site Manager.

We use a **service account** — a robot Google account that reads your analytics. It's simpler
than a personal login: no passwords in the app, no re-login every week. You create it once,
then "invite" its email to each property as a viewer, exactly like adding a teammate.

### Step 1 — Create a Google Cloud project

1. Go to **https://console.cloud.google.com** and sign in with the Google account that can
   see your Analytics.
2. At the top, click the **project dropdown → New Project**. Name it e.g.
   `stacked-marketing-hub` and click **Create**. Wait a few seconds, then make sure that new
   project is selected in the top dropdown.

### Step 2 — Turn on the two APIs

1. In the search bar type **"Google Analytics Data API"**, open it, click **Enable**.
2. Search **"Google Search Console API"**, open it, click **Enable**.

(Enabling just tells Google "this project is allowed to use these APIs.")

### Step 3 — Create the service account + key file

1. Search **"Service Accounts"** (or go to **IAM & Admin → Service Accounts**) → **Create
   service account**.
2. Name it e.g. `marketing-hub-reader` → **Create and continue** → skip the optional
   roles/access steps → **Done**.
3. You'll see it in the list with an **email** like
   `marketing-hub-reader@stacked-marketing-hub.iam.gserviceaccount.com`. **Copy that email —
   you'll need it in Step 5.**
4. Click the service account → **Keys** tab → **Add key → Create new key → JSON → Create**.
   A `.json` file downloads. **This is a password — keep it private.**

### Step 4 — Give the app the key

1. Move that downloaded `.json` file into this project folder and rename it
   `service-account.json` (it's already git-ignored, so it won't be committed).
2. Copy the env file and point it at the key:
   ```bash
   cp .env.example .env
   ```
   In `.env`, uncomment this line:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
   ```
3. Restart the app (`Ctrl-C`, then `npm run dev`). The badge at the top right should turn
   green: **"Google connected"** and show the service account email.

### Step 5 — Invite the service account to each property

This is the key idea: the robot account only sees data you explicitly share with it — the same
way you'd add a colleague. Do this **once per site** (6 sites → 6× in each place).

**In Google Analytics (for sessions & conversions):**
1. Open **Analytics → Admin** (gear, bottom-left) → make sure the correct **property** is
   selected.
2. **Property Access Management** → **+ (top right) → Add users**.
3. Paste the service account **email** from Step 3, role **Viewer**, untick "notify by email",
   **Add**.

**In Search Console (for clicks, impressions, position):**
1. Open **https://search.google.com/search-console**, pick the property.
2. **Settings → Users and permissions → Add user**.
3. Paste the same service account **email**, permission **Restricted**, **Add**.

### Step 6 — Enter each site's IDs, then Sync

In the app's **Site Manager**, add (or edit) each site and fill in:

- **GA4 property ID** — a number like `123456789`. Find it in **Analytics → Admin → Property
  Settings** ("Property ID"), or the number in the URL. (Not the "G-XXXX" measurement ID.)
- **Search Console URL** — exactly as it appears in Search Console:
  - a URL-prefix property → `https://stacked.com/` (include `https://` and trailing `/`), or
  - a domain property → `sc-domain:stacked.com`.

Leave either field blank to keep that metric on manual entry. Then on the **Dashboard**, click
**Sync all from Google** (or **Sync** on a single row). Pick the date range at the top first.

> **Manual entry fallback:** any site without GA4/GSC IDs (or before you finish the Google
> setup) shows an **Add/Edit** button on the Dashboard to type numbers in by hand. A later
> Google sync overwrites a manual row for the same date range.

---

## How the data is stored

SQLite, in `server/data/marketing-hub.sqlite`. Four tables mirror the tools:
`sites`, `metrics` (one row per site per date range), `audits`, `keywords`. It's a single file
— back it up by copying it. To move to Postgres later, the schema in `server/schema.sql`
translates almost directly.

## Security notes

- Google credentials are read **only by the server** (`server/google.js`) from `.env` /
  the key file. Nothing Google-related is ever sent to the browser.
- `.env`, `service-account.json`, and the database are all git-ignored.
- The service account can only read the properties you invited it to, and only read-only.
