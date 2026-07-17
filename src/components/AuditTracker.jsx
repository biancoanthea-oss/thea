import { useCallback, useEffect, useState } from 'react'
import { api } from '../api.js'

const STATUS = ['todo', 'in_progress', 'done']
const PRIORITY = ['low', 'medium', 'high']
const label = (s) => s.replace('_', ' ')

const emptyRow = {
  page_url: '', focus_keyword: '', title_tag: '', meta_description: '',
  status: 'todo', priority: 'medium', issues: '', notes: '',
}

export default function AuditTracker({ sites, notify }) {
  const [siteId, setSiteId] = useState('all')
  const [rows, setRows] = useState([])
  const [editing, setEditing] = useState(null)

  const load = useCallback(async () => {
    const q = siteId === 'all' ? '' : `?site_id=${siteId}`
    setRows(await api.get(`/audits${q}`))
  }, [siteId])

  useEffect(() => { load().catch((e) => notify(e.message, true)) }, [load, notify])

  const siteName = (id) => sites.find((s) => s.id === id)?.name || '—'

  async function remove(id) {
    if (!confirm('Delete this audit row?')) return
    await api.del(`/audits/${id}`); await load(); notify('Deleted.')
  }

  return (
    <div className="panel">
      <div className="row" style={{ marginBottom: 14 }}>
        <div>
          <h2>Page-level SEO audit tracker</h2>
          <p className="sub">Track title tags, meta descriptions and fixes per page.</p>
        </div>
        <div className="spacer" />
        <div className="field" style={{ minWidth: 180 }}>
          <label>Site</label>
          <select value={siteId} onChange={(e) => setSiteId(e.target.value)}>
            <option value="all">All sites</option>
            {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div style={{ alignSelf: 'flex-end' }}>
          <button
            className="btn"
            disabled={sites.length === 0}
            onClick={() => setEditing({ ...emptyRow, site_id: siteId === 'all' ? sites[0]?.id : Number(siteId) })}
          >
            + Add page
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Page</th><th>Focus keyword</th><th>Title tag</th><th>Status</th><th>Priority</th><th>Issues</th><th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <a href={r.page_url} target="_blank" rel="noreferrer">{r.page_url || '(no URL)'}</a>
                  {siteId === 'all' && <div className="muted" style={{ fontSize: 12 }}>{siteName(r.site_id)}</div>}
                </td>
                <td>{r.focus_keyword || <span className="muted">—</span>}</td>
                <td style={{ maxWidth: 220 }}>{r.title_tag || <span className="muted">missing</span>}</td>
                <td><span className={`pill ${r.status}`}>{label(r.status)}</span></td>
                <td><span className={`pill ${r.priority}`}>{r.priority}</span></td>
                <td style={{ maxWidth: 200 }} className="muted">{r.issues}</td>
                <td>
                  <div className="row" style={{ gap: 6, flexWrap: 'nowrap' }}>
                    <button className="btn small ghost" onClick={() => setEditing(r)}>Edit</button>
                    <button className="btn small danger" onClick={() => remove(r.id)}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={7} className="empty">No audit rows yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <AuditModal
          row={editing} sites={sites}
          onClose={() => setEditing(null)}
          onSaved={async () => { setEditing(null); await load(); notify('Saved.') }}
          notify={notify}
        />
      )}
    </div>
  )
}

function AuditModal({ row, sites, onClose, onSaved, notify }) {
  const [form, setForm] = useState(row)
  const [saving, setSaving] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function save() {
    if (!form.page_url) { notify('Page URL is required.', true); return }
    setSaving(true)
    try {
      if (form.id) await api.put(`/audits/${form.id}`, form)
      else await api.post('/audits', form)
      await onSaved()
    } catch (e) { notify(e.message, true) } finally { setSaving(false) }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{form.id ? 'Edit page' : 'Add page'}</h3>
        <div className="grid-form">
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label>Site</label>
            <select value={form.site_id} onChange={set('site_id')}>
              {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label>Page URL</label>
            <input value={form.page_url} onChange={set('page_url')} placeholder="https://example.com/pricing" />
          </div>
          <div className="field"><label>Focus keyword</label><input value={form.focus_keyword} onChange={set('focus_keyword')} /></div>
          <div className="field">
            <label>Status</label>
            <select value={form.status} onChange={set('status')}>{STATUS.map((s) => <option key={s} value={s}>{label(s)}</option>)}</select>
          </div>
          <div className="field">
            <label>Priority</label>
            <select value={form.priority} onChange={set('priority')}>{PRIORITY.map((p) => <option key={p} value={p}>{p}</option>)}</select>
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}><label>Title tag</label><input value={form.title_tag} onChange={set('title_tag')} /></div>
          <div className="field" style={{ gridColumn: '1 / -1' }}><label>Meta description</label><textarea rows={2} value={form.meta_description} onChange={set('meta_description')} /></div>
          <div className="field" style={{ gridColumn: '1 / -1' }}><label>Issues</label><input value={form.issues} onChange={set('issues')} placeholder="Missing meta, thin content…" /></div>
          <div className="field" style={{ gridColumn: '1 / -1' }}><label>Notes</label><textarea rows={2} value={form.notes} onChange={set('notes')} /></div>
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </div>
  )
}
