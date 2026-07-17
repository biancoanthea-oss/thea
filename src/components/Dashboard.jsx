import { useCallback, useEffect, useState } from 'react'
import { api } from '../api.js'

const fmt = (n) => (n == null ? '—' : Number(n).toLocaleString())
const blankMetric = { sessions: 0, conversions: 0, clicks: 0, impressions: 0, avg_position: 0 }

export default function Dashboard({ period, setPeriod, google, notify }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [editing, setEditing] = useState(null) // { site, metric }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get(`/metrics?start=${period.start}&end=${period.end}`)
      setRows(data.rows)
    } catch (e) {
      notify(e.message, true)
    } finally {
      setLoading(false)
    }
  }, [period, notify])

  useEffect(() => { load() }, [load])

  const totals = rows.reduce(
    (t, { metric: m }) => {
      if (!m) return t
      t.sessions += m.sessions; t.conversions += m.conversions
      t.clicks += m.clicks; t.impressions += m.impressions
      t.posWeight += m.avg_position * (m.impressions || 1); t.posBase += m.impressions || 1
      return t
    },
    { sessions: 0, conversions: 0, clicks: 0, impressions: 0, posWeight: 0, posBase: 0 },
  )
  const avgPos = totals.posBase ? (totals.posWeight / totals.posBase).toFixed(1) : '—'

  async function syncOne(siteId) {
    setSyncing(true)
    try {
      await api.post(`/sites/${siteId}/sync`, period)
      await load()
      notify('Pulled latest data from Google.')
    } catch (e) {
      notify(e.message, true)
    } finally {
      setSyncing(false)
    }
  }

  async function syncAll() {
    setSyncing(true)
    try {
      const { results } = await api.post('/sync', period)
      await load()
      const ok = results.filter((r) => r.ok).length
      const failed = results.filter((r) => !r.ok)
      notify(
        `Synced ${ok} site(s).` + (failed.length ? ` ${failed.length} failed: ${failed[0].error}` : ''),
        failed.length > 0,
      )
    } catch (e) {
      notify(e.message, true)
    } finally {
      setSyncing(false)
    }
  }

  const connectedCount = rows.filter((r) => r.site.ga4_property_id || r.site.gsc_site_url).length

  return (
    <div className="panel">
      <div className="row" style={{ marginBottom: 14 }}>
        <div>
          <h2>Multi-site dashboard</h2>
          <p className="sub">Sessions &amp; conversions (GA4) · clicks, impressions &amp; position (Search Console)</p>
        </div>
        <div className="spacer" />
        <div className="field" style={{ minWidth: 130 }}>
          <label>From</label>
          <input type="date" value={period.start} onChange={(e) => setPeriod({ ...period, start: e.target.value })} />
        </div>
        <div className="field" style={{ minWidth: 130 }}>
          <label>To</label>
          <input type="date" value={period.end} onChange={(e) => setPeriod({ ...period, end: e.target.value })} />
        </div>
        <div style={{ alignSelf: 'flex-end' }}>
          <button
            className="btn"
            onClick={syncAll}
            disabled={syncing || !google.configured || connectedCount === 0}
            title={
              !google.configured
                ? 'Connect Google in .env to enable live sync'
                : connectedCount === 0
                  ? 'No sites have a GA4 property or Search Console URL yet'
                  : 'Pull the latest numbers for all connected sites'
            }
          >
            {syncing ? 'Syncing…' : 'Sync all from Google'}
          </button>
        </div>
      </div>

      <div className="cards">
        <div className="card"><div className="k">Sessions</div><div className="v">{fmt(totals.sessions)}</div></div>
        <div className="card"><div className="k">Conversions</div><div className="v">{fmt(totals.conversions)}</div></div>
        <div className="card"><div className="k">Clicks</div><div className="v">{fmt(totals.clicks)}</div></div>
        <div className="card"><div className="k">Impressions</div><div className="v">{fmt(totals.impressions)}</div></div>
        <div className="card"><div className="k">Avg. position</div><div className="v">{avgPos}</div></div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Site</th>
              <th className="num">Sessions</th>
              <th className="num">Conversions</th>
              <th className="num">Clicks</th>
              <th className="num">Impressions</th>
              <th className="num">Avg. pos</th>
              <th>Source</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ site, metric }) => {
              const connected = site.ga4_property_id || site.gsc_site_url
              return (
                <tr key={site.id}>
                  <td>
                    <div>{site.name}</div>
                    <div className="muted" style={{ fontSize: 12 }}>{site.url}</div>
                  </td>
                  <td className="num">{fmt(metric?.sessions)}</td>
                  <td className="num">{fmt(metric?.conversions)}</td>
                  <td className="num">{fmt(metric?.clicks)}</td>
                  <td className="num">{fmt(metric?.impressions)}</td>
                  <td className="num">{metric?.avg_position ? metric.avg_position.toFixed(1) : '—'}</td>
                  <td>
                    {metric ? (
                      <span className={`pill source-${metric.source}`}>{metric.source}</span>
                    ) : (
                      <span className="pill">no data</span>
                    )}
                  </td>
                  <td>
                    <div className="row" style={{ gap: 6, flexWrap: 'nowrap' }}>
                      {connected && google.configured && (
                        <button className="btn small" disabled={syncing} onClick={() => syncOne(site.id)}>Sync</button>
                      )}
                      <button className="btn small ghost" onClick={() => setEditing({ site, metric })}>
                        {metric ? 'Edit' : 'Add'}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {rows.length === 0 && (
              <tr><td colSpan={8} className="empty">No sites yet. Add your sites in the <strong>Site Manager</strong> tab.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {loading && <p className="muted" style={{ marginTop: 10 }}>Loading…</p>}

      {editing && (
        <ManualMetricModal
          site={editing.site}
          metric={editing.metric || blankMetric}
          period={period}
          onClose={() => setEditing(null)}
          onSaved={async () => { setEditing(null); await load(); notify('Saved.') }}
          notify={notify}
        />
      )}
    </div>
  )
}

function ManualMetricModal({ site, metric, period, onClose, onSaved, notify }) {
  const [form, setForm] = useState({
    sessions: metric.sessions || 0,
    conversions: metric.conversions || 0,
    clicks: metric.clicks || 0,
    impressions: metric.impressions || 0,
    avg_position: metric.avg_position || 0,
  })
  const [saving, setSaving] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function save() {
    setSaving(true)
    try {
      await api.put(`/metrics/${site.id}`, { ...form, start: period.start, end: period.end })
      await onSaved()
    } catch (e) {
      notify(e.message, true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Manual entry — {site.name}</h3>
        <p className="sub">{period.start} → {period.end}. Saved as a manual entry; a Google sync will overwrite it.</p>
        <div className="grid-form">
          {[['sessions', 'Sessions'], ['conversions', 'Conversions'], ['clicks', 'Clicks'], ['impressions', 'Impressions'], ['avg_position', 'Avg. position']].map(([k, label]) => (
            <div key={k} className="field">
              <label>{label}</label>
              <input type="number" step={k === 'avg_position' ? '0.1' : '1'} value={form[k]} onChange={set(k)} />
            </div>
          ))}
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </div>
  )
}
