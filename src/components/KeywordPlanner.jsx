import { useCallback, useEffect, useState } from 'react'
import { api } from '../api.js'

const CONTENT_STATUS = ['idea', 'drafting', 'published']
const PRIORITY = ['low', 'medium', 'high']
const num = (n) => (n ? Number(n).toLocaleString() : '—')

const emptyRow = {
  keyword: '', search_volume: 0, difficulty: 0, current_position: 0,
  target_url: '', content_status: 'idea', priority: 'medium', notes: '',
}

export default function KeywordPlanner({ sites, notify }) {
  const [siteId, setSiteId] = useState('all')
  const [rows, setRows] = useState([])
  const [editing, setEditing] = useState(null)

  const load = useCallback(async () => {
    const q = siteId === 'all' ? '' : `?site_id=${siteId}`
    setRows(await api.get(`/keywords${q}`))
  }, [siteId])

  useEffect(() => { load().catch((e) => notify(e.message, true)) }, [load, notify])

  const siteName = (id) => sites.find((s) => s.id === id)?.name || '—'

  async function remove(id) {
    if (!confirm('Delete this keyword?')) return
    await api.del(`/keywords/${id}`); await load(); notify('Deleted.')
  }

  return (
    <div className="panel">
      <div className="row" style={{ marginBottom: 14 }}>
        <div>
          <h2>Keyword &amp; content planner</h2>
          <p className="sub">Plan target keywords, track difficulty, rank and content status.</p>
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
            + Add keyword
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Keyword</th><th className="num">Volume</th><th className="num">Difficulty</th>
              <th className="num">Position</th><th>Content</th><th>Priority</th><th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <div>{r.keyword}</div>
                  {siteId === 'all' && <div className="muted" style={{ fontSize: 12 }}>{siteName(r.site_id)}</div>}
                  {r.target_url && <a href={r.target_url} target="_blank" rel="noreferrer" style={{ fontSize: 12 }}>{r.target_url}</a>}
                </td>
                <td className="num">{num(r.search_volume)}</td>
                <td className="num">{r.difficulty || '—'}</td>
                <td className="num">{r.current_position || '—'}</td>
                <td><span className={`pill ${r.content_status}`}>{r.content_status}</span></td>
                <td><span className={`pill ${r.priority}`}>{r.priority}</span></td>
                <td>
                  <div className="row" style={{ gap: 6, flexWrap: 'nowrap' }}>
                    <button className="btn small ghost" onClick={() => setEditing(r)}>Edit</button>
                    <button className="btn small danger" onClick={() => remove(r.id)}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={7} className="empty">No keywords yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <KeywordModal
          row={editing} sites={sites}
          onClose={() => setEditing(null)}
          onSaved={async () => { setEditing(null); await load(); notify('Saved.') }}
          notify={notify}
        />
      )}
    </div>
  )
}

function KeywordModal({ row, sites, onClose, onSaved, notify }) {
  const [form, setForm] = useState(row)
  const [saving, setSaving] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function save() {
    if (!form.keyword) { notify('Keyword is required.', true); return }
    setSaving(true)
    try {
      if (form.id) await api.put(`/keywords/${form.id}`, form)
      else await api.post('/keywords', form)
      await onSaved()
    } catch (e) { notify(e.message, true) } finally { setSaving(false) }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{form.id ? 'Edit keyword' : 'Add keyword'}</h3>
        <div className="grid-form">
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label>Site</label>
            <select value={form.site_id} onChange={set('site_id')}>
              {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}><label>Keyword</label><input value={form.keyword} onChange={set('keyword')} /></div>
          <div className="field"><label>Search volume</label><input type="number" value={form.search_volume} onChange={set('search_volume')} /></div>
          <div className="field"><label>Difficulty (0–100)</label><input type="number" value={form.difficulty} onChange={set('difficulty')} /></div>
          <div className="field"><label>Current position</label><input type="number" step="0.1" value={form.current_position} onChange={set('current_position')} /></div>
          <div className="field">
            <label>Content status</label>
            <select value={form.content_status} onChange={set('content_status')}>{CONTENT_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}</select>
          </div>
          <div className="field">
            <label>Priority</label>
            <select value={form.priority} onChange={set('priority')}>{PRIORITY.map((p) => <option key={p} value={p}>{p}</option>)}</select>
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}><label>Target URL</label><input value={form.target_url} onChange={set('target_url')} placeholder="https://example.com/target-page" /></div>
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
