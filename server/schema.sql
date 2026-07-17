-- Stacked Marketing Hub — database schema (SQLite)
-- One file, four tables. Mirrors the original component's data shape:
-- sites, per-site metrics, audit rows, and keywords.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS sites (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  name             TEXT    NOT NULL,
  url              TEXT    NOT NULL,
  -- Google connection (nullable → site falls back to manual entry)
  ga4_property_id  TEXT,               -- e.g. "properties/123456789" or just "123456789"
  gsc_site_url     TEXT,               -- e.g. "https://example.com/" or "sc-domain:example.com"
  created_at       TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Per-site metrics for a date range. One row per (site, period).
-- `source` is 'google' when pulled live, or 'manual' when typed in by hand.
CREATE TABLE IF NOT EXISTS metrics (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id       INTEGER NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  period_start  TEXT    NOT NULL,      -- YYYY-MM-DD
  period_end    TEXT    NOT NULL,      -- YYYY-MM-DD
  sessions      INTEGER DEFAULT 0,     -- GA4
  conversions   INTEGER DEFAULT 0,     -- GA4
  clicks        INTEGER DEFAULT 0,     -- Search Console
  impressions   INTEGER DEFAULT 0,     -- Search Console
  avg_position  REAL    DEFAULT 0,     -- Search Console
  source        TEXT    NOT NULL DEFAULT 'manual',
  updated_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE(site_id, period_start, period_end)
);

-- Page-level SEO audit tracker.
CREATE TABLE IF NOT EXISTS audits (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id           INTEGER NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  page_url          TEXT    NOT NULL,
  focus_keyword     TEXT    DEFAULT '',
  title_tag         TEXT    DEFAULT '',
  meta_description  TEXT    DEFAULT '',
  status            TEXT    NOT NULL DEFAULT 'todo',      -- todo | in_progress | done
  priority          TEXT    NOT NULL DEFAULT 'medium',    -- low | medium | high
  issues            TEXT    DEFAULT '',
  notes             TEXT    DEFAULT '',
  updated_at        TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Keyword / content planner.
CREATE TABLE IF NOT EXISTS keywords (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id           INTEGER NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  keyword           TEXT    NOT NULL,
  search_volume     INTEGER DEFAULT 0,
  difficulty        INTEGER DEFAULT 0,      -- 0–100
  current_position  REAL    DEFAULT 0,
  target_url        TEXT    DEFAULT '',
  content_status    TEXT    NOT NULL DEFAULT 'idea',   -- idea | drafting | published
  priority          TEXT    NOT NULL DEFAULT 'medium', -- low | medium | high
  notes             TEXT    DEFAULT '',
  updated_at        TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_metrics_site  ON metrics(site_id);
CREATE INDEX IF NOT EXISTS idx_audits_site   ON audits(site_id);
CREATE INDEX IF NOT EXISTS idx_keywords_site ON keywords(site_id);
