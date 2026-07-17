// Seeds example data so the app isn't empty on first run. Safe to run anytime:
// it does nothing if any sites already exist. Delete these rows from the Site
// Manager once you've added your real sites.
import db from './db.js'

const count = db.prepare('SELECT COUNT(*) AS n FROM sites').get().n
if (count > 0) {
  console.log(`Seed skipped — ${count} site(s) already exist.`)
  process.exit(0)
}

const today = new Date().toISOString().slice(0, 10)
const daysAgo = (n) => {
  const d = new Date(today)
  d.setUTCDate(d.getUTCDate() - n)
  return d.toISOString().slice(0, 10)
}
const period = { start: daysAgo(28), end: daysAgo(1) }

const insertSite = db.prepare(
  `INSERT INTO sites (name, url, ga4_property_id, gsc_site_url) VALUES (?, ?, ?, ?)`,
)
const insertMetric = db.prepare(
  `INSERT INTO metrics (site_id, period_start, period_end, sessions, conversions, clicks, impressions, avg_position, source)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'manual')`,
)
const insertAudit = db.prepare(
  `INSERT INTO audits (site_id, page_url, focus_keyword, title_tag, meta_description, status, priority, issues)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
)
const insertKeyword = db.prepare(
  `INSERT INTO keywords (site_id, keyword, search_volume, difficulty, current_position, target_url, content_status, priority)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
)

const seed = db.transaction(() => {
  // Two example sites — leave the Google fields blank so they use manual entry.
  const a = insertSite.run('Example — Main Site', 'https://example.com', null, null).lastInsertRowid
  const b = insertSite.run('Example — Blog', 'https://blog.example.com', null, null).lastInsertRowid

  insertMetric.run(a, period.start, period.end, 12450, 210, 3400, 88000, 14.2)
  insertMetric.run(b, period.start, period.end, 4820, 44, 1900, 51000, 9.7)

  insertAudit.run(a, 'https://example.com/', 'stacked platform', 'Stacked — All-in-one platform', 'The best all-in-one platform for teams.', 'in_progress', 'high', 'Title too generic; meta under 120 chars')
  insertAudit.run(a, 'https://example.com/pricing', 'stacked pricing', '', '', 'todo', 'medium', 'Missing title tag and meta description')
  insertAudit.run(b, 'https://blog.example.com/seo-guide', 'seo guide 2026', 'The 2026 SEO Guide', 'Everything marketers need for SEO in 2026.', 'done', 'low', '')

  insertKeyword.run(a, 'all-in-one platform', 8100, 62, 12, 'https://example.com/', 'published', 'high')
  insertKeyword.run(a, 'team collaboration software', 5400, 55, 24, 'https://example.com/features', 'drafting', 'medium')
  insertKeyword.run(b, 'seo checklist', 12000, 48, 8, 'https://blog.example.com/seo-guide', 'published', 'high')
  insertKeyword.run(b, 'content marketing ideas', 3300, 38, 0, '', 'idea', 'low')
})

seed()
console.log('Seeded 2 example sites with metrics, audits, and keywords.')
