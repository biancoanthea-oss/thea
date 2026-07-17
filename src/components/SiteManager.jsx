import { useState } from 'react'
import { api } from '../api.js'

const emptySite = { name: '', url: '', ga4_property_id: '', gsc_site_url: '' }

export default function SiteManager({ sites, google, notify, reloadSites }) {
  const [editing, setEditing] = useState(null)

  async function remove(site) {
    if (!confirm(`Delete "${site.name}" and all its metrics, audits and keywords?`)) return
    await api.del(`/sites/${site.id}`); await reloadSites(); notify('Site deleted.')
  }

  return (
    <div className="panel">
      <div className="row" style={{ marginBottom: 14 }}>
        <div>
          <h2>Site manager</h2>
          <p className="sub">Add your sites and connect each one to Google Analytics (GA4) and Search Console.</p>
        </div>
        <div className="spacer" />
        <div style={{ alignSelf: 'flex-end' }}>
          <button className="btn" onClick={() => setEditing({ ...emptySite })}>+ Add site</button>
        </div>
      </div>

      {google.configured ? (
        <p className="sub">
          Connected to Google as <strong>{google.serviceAccountEmail}</strong>. Add that email as a
          user on each GA4 property (Viewer) and Search Console property (Restricted) to enable live sync.
        </p>
      ) : (
        <p className="sub" style={{ color: 'var(--warn)' }}>
          Google is not connected yet — sites use manual entry. See the README to set up credentials.
          {google.error ? ` (${google.error})` : ''}
        </p>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Name</th><th>URL</th><th>GA4 property</th><th>Search Console</th><th>Live sync</th><th></th></tr>
          </thead>
          <tbody>
            {sites.map((s) => {
              const connected = s.ga4_property_id || s.gsc_site_url
              return (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td><a href={s.url} target="_blank" rel="noreferrer">{s.url}</a></td>
                  <td className="muted">{s.ga4_property_id || '—'}</td>
                  <td className="muted">{s.gsc_site_url || '—'}</td>
                  <td>
                    {connected
                      ? <span className={`pill ${google.configured ? 'done' : 'medium'}`}>{google.configured ? 'ready' : 'creds needed'}</span>
                      : <span className="pill">manual</span>}
                  </td>
                  <td>
                    <div className="row" style={{ gap: 6, flexWrap: 'nowrap' }}>
                      <button className="btn small ghost" onClick={() => setEditing(s)}>Edit</button>
                      <button className="btn small danger" onClick={() => remove(s)}>✕</button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {sites.length === 0 && (
              <tr><td colSpan={6} className="empty">No sites yet — add your first one.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <SiteModal
          site={editing}
          onClose={() => setEditing(null)}
          onSaved={async () => { setEditing(null); await reloadSites(); notify('Saved.') }}
          notify={notify}
        />
      )}
    </div>
  )
}

function SiteModal({ site, onClose, onSaved, notify }) {
  const [form, setForm] = useState(site)
  const [saving, setSaving] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function save() {
    if (!form.name || !form.url) { notify('Name and URL are required.', true); return }
    setSaving(true)
    try {
      if (form.id) await api.put(`/sites/${form.id}`, form)
      else await api.post('/sites', form)
      await onSaved()
    } catch (e) { notify(e.message, true) } finally { setSaving(false) }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{form.id ? 'Edit site' : 'Add site'}</h3>
        <div className="grid-form">
          <div className="field" style={{ gridColumn: '1 / -1' }}><label>Name</label><input value={form.name} onChange={set('name')} placeholder="Stacked — Main" /></div>
          <div className="field" style={{ gridColumn: '1 / -1' }}><label>Website URL</label><input value={form.url} onChange={set('url')} placeholder="https://stacked.com" /></div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label>GA4 property ID <span className="muted">(optional — enables live sessions/conversions)</span></label>
            <input value={form.ga4_property_id || ''} onChange={set('ga4_property_id')} placeholder="e.g. 123456789" />
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label>Search Console URL <span className="muted">(optional — enables live clicks/impressions/position)</span></label>
            <input value={form.gsc_site_url || ''} onChange={set('gsc_site_url')} placeholder="https://stacked.com/  or  sc-domain:stacked.com" />
          </div>
        </div>
        <p className="sub" style={{ marginTop: 12 }}>
          Leave the Google fields blank to keep a site on manual entry. You can connect it later.
        </p>
        <div className="actions">
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </div>
  )
}
