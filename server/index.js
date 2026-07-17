import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import db from './db.js'
import { googleStatus, fetchGa4, fetchGsc } from './google.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(cors())
app.use(express.json())

const api = express.Router()

// ── Helpers ─────────────────────────────────────────────────────────────────
const isoDaysAgo = (base, days) => {
  const d = new Date(base)
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString().slice(0, 10)
}
function defaultPeriod() {
  const today = new Date().toISOString().slice(0, 10)
  return { start: isoDaysAgo(today, 28), end: isoDaysAgo(today, 1) }
}
const asError = (res, err) =>
  res.status(500).json({ error: err?.message || String(err) })

// ── Status ──────────────────────────────────────────────────────────────────
api.get('/status', (_req, res) => res.json({ google: googleStatus() }))

// ── Sites ───────────────────────────────────────────────────────────────────
api.get('/sites', (_req, res) => {
  res.json(db.prepare('SELECT * FROM sites ORDER BY id').all())
})

api.post('/sites', (req, res) => {
  const { name, url, ga4_property_id, gsc_site_url } = req.body || {}
  if (!name || !url) return res.status(400).json({ error: 'name and url are required' })
  const info = db
    .prepare(
      `INSERT INTO sites (name, url, ga4_property_id, gsc_site_url)
       VALUES (?, ?, ?, ?)`,
    )
    .run(name, url, ga4_property_id || null, gsc_site_url || null)
  res.status(201).json(db.prepare('SELECT * FROM sites WHERE id = ?').get(info.lastInsertRowid))
})

api.put('/sites/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM sites WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'site not found' })
  const { name, url, ga4_property_id, gsc_site_url } = { ...existing, ...req.body }
  db.prepare(
    `UPDATE sites SET name = ?, url = ?, ga4_property_id = ?, gsc_site_url = ? WHERE id = ?`,
  ).run(name, url, ga4_property_id || null, gsc_site_url || null, req.params.id)
  res.json(db.prepare('SELECT * FROM sites WHERE id = ?').get(req.params.id))
})

api.delete('/sites/:id', (req, res) => {
  db.prepare('DELETE FROM sites WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

// ── Metrics ─────────────────────────────────────────────────────────────────
// GET /api/metrics?start=&end=  → one row per site (metric may be null).
api.get('/metrics', (req, res) => {
  const { start = defaultPeriod().start, end = defaultPeriod().end } = req.query
  const sites = db.prepare('SELECT * FROM sites ORDER BY id').all()
  const getMetric = db.prepare(
    `SELECT * FROM metrics WHERE site_id = ? AND period_start = ? AND period_end = ?`,
  )
  const rows = sites.map((site) => ({
    site,
    metric: getMetric.get(site.id, start, end) || null,
  }))
  res.json({ period: { start, end }, rows })
})

// Upsert a metric row (used by manual entry).
function upsertMetric(siteId, period, values, source) {
  db.prepare(
    `INSERT INTO metrics
       (site_id, period_start, period_end, sessions, conversions, clicks, impressions, avg_position, source, updated_at)
     VALUES (@site_id, @period_start, @period_end, @sessions, @conversions, @clicks, @impressions, @avg_position, @source, datetime('now'))
     ON CONFLICT(site_id, period_start, period_end) DO UPDATE SET
       sessions=@sessions, conversions=@conversions, clicks=@clicks,
       impressions=@impressions, avg_position=@avg_position,
       source=@source, updated_at=datetime('now')`,
  ).run({
    site_id: siteId,
    period_start: period.start,
    period_end: period.end,
    sessions: Number(values.sessions) || 0,
    conversions: Number(values.conversions) || 0,
    clicks: Number(values.clicks) || 0,
    impressions: Number(values.impressions) || 0,
    avg_position: Number(values.avg_position) || 0,
    source,
  })
  return db
    .prepare(`SELECT * FROM metrics WHERE site_id = ? AND period_start = ? AND period_end = ?`)
    .get(siteId, period.start, period.end)
}

api.put('/metrics/:siteId', (req, res) => {
  const { start = defaultPeriod().start, end = defaultPeriod().end, ...values } = req.body || {}
  const site = db.prepare('SELECT * FROM sites WHERE id = ?').get(req.params.siteId)
  if (!site) return res.status(404).json({ error: 'site not found' })
  res.json(upsertMetric(site.id, { start, end }, values, 'manual'))
})

// Pull live data for one site from Google (whichever APIs it has configured).
async function syncSite(site, period) {
  const values = { sessions: 0, conversions: 0, clicks: 0, impressions: 0, avg_position: 0 }
  const pulled = []
  if (site.ga4_property_id) {
    Object.assign(
      values,
      await fetchGa4({ propertyId: site.ga4_property_id, startDate: period.start, endDate: period.end }),
    )
    pulled.push('ga4')
  }
  if (site.gsc_site_url) {
    Object.assign(
      values,
      await fetchGsc({ siteUrl: site.gsc_site_url, startDate: period.start, endDate: period.end }),
    )
    pulled.push('gsc')
  }
  if (pulled.length === 0) {
    const e = new Error('This site has no GA4 property or Search Console URL configured.')
    e.code = 'NOT_CONNECTED'
    throw e
  }
  const metric = upsertMetric(site.id, period, values, 'google')
  return { site_id: site.id, pulled, metric }
}

api.post('/sites/:id/sync', async (req, res) => {
  const site = db.prepare('SELECT * FROM sites WHERE id = ?').get(req.params.id)
  if (!site) return res.status(404).json({ error: 'site not found' })
  const { start = defaultPeriod().start, end = defaultPeriod().end } = req.body || {}
  const status = googleStatus()
  if (!status.configured)
    return res.status(400).json({ error: status.error || 'Google credentials are not configured on the server.' })
  try {
    res.json(await syncSite(site, { start, end }))
  } catch (err) {
    res.status(err.code === 'NOT_CONNECTED' ? 400 : 500).json({ error: err.message })
  }
})

// Sync every connected site in one shot.
api.post('/sync', async (req, res) => {
  const { start = defaultPeriod().start, end = defaultPeriod().end } = req.body || {}
  const status = googleStatus()
  if (!status.configured)
    return res.status(400).json({ error: status.error || 'Google credentials are not configured on the server.' })
  const sites = db
    .prepare('SELECT * FROM sites WHERE ga4_property_id IS NOT NULL OR gsc_site_url IS NOT NULL')
    .all()
  const results = []
  for (const site of sites) {
    try {
      results.push({ ok: true, ...(await syncSite(site, { start, end })) })
    } catch (err) {
      results.push({ ok: false, site_id: site.id, error: err.message })
    }
  }
  res.json({ period: { start, end }, results })
})

// ── Audits & Keywords (generic CRUD) ────────────────────────────────────────
const AUDIT_FIELDS = ['page_url', 'focus_keyword', 'title_tag', 'meta_description', 'status', 'priority', 'issues', 'notes']
const KEYWORD_FIELDS = ['keyword', 'search_volume', 'difficulty', 'current_position', 'target_url', 'content_status', 'priority', 'notes']

function makeCrud(table, fields) {
  return {
    list: (req, res) => {
      const { site_id } = req.query
      const rows = site_id
        ? db.prepare(`SELECT * FROM ${table} WHERE site_id = ? ORDER BY id DESC`).all(site_id)
        : db.prepare(`SELECT * FROM ${table} ORDER BY id DESC`).all()
      res.json(rows)
    },
    create: (req, res) => {
      const b = req.body || {}
      if (!b.site_id) return res.status(400).json({ error: 'site_id is required' })
      const cols = ['site_id', ...fields]
      const info = db
        .prepare(`INSERT INTO ${table} (${cols.join(',')}) VALUES (${cols.map((c) => '@' + c).join(',')})`)
        .run(Object.fromEntries(cols.map((c) => [c, b[c] ?? (c === 'site_id' ? null : '')])))
      res.status(201).json(db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(info.lastInsertRowid))
    },
    update: (req, res) => {
      const existing = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(req.params.id)
      if (!existing) return res.status(404).json({ error: 'not found' })
      const merged = { ...existing, ...req.body }
      db.prepare(
        `UPDATE ${table} SET ${fields.map((f) => `${f}=@${f}`).join(', ')}, updated_at=datetime('now') WHERE id=@id`,
      ).run({ ...merged, id: req.params.id })
      res.json(db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(req.params.id))
    },
    remove: (req, res) => {
      db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(req.params.id)
      res.json({ ok: true })
    },
  }
}

for (const [path, fields] of [['audits', AUDIT_FIELDS], ['keywords', KEYWORD_FIELDS]]) {
  const crud = makeCrud(path, fields)
  api.get(`/${path}`, crud.list)
  api.post(`/${path}`, crud.create)
  api.put(`/${path}/:id`, crud.update)
  api.delete(`/${path}/:id`, crud.remove)
}

app.use('/api', api)

// ── Serve the built frontend in production ──────────────────────────────────
const distDir = resolve(__dirname, '../dist')
if (existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get('*', (_req, res) => res.sendFile(resolve(distDir, 'index.html')))
}

const port = process.env.PORT || 4000
app.listen(port, () => {
  const g = googleStatus()
  console.log(`\n  Stacked Marketing Hub API → http://localhost:${port}`)
  console.log(
    g.configured
      ? `  Google: connected as ${g.serviceAccountEmail}`
      : `  Google: not configured (manual entry only)${g.error ? ' — ' + g.error : ''}`,
  )
})
