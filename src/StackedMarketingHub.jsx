import { useCallback, useEffect, useState } from 'react'
import { api } from './api.js'
import Dashboard from './components/Dashboard.jsx'
import AuditTracker from './components/AuditTracker.jsx'
import KeywordPlanner from './components/KeywordPlanner.jsx'
import SiteManager from './components/SiteManager.jsx'

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'audit', label: 'SEO Audit Tracker' },
  { id: 'keywords', label: 'Keyword Planner' },
  { id: 'sites', label: 'Site Manager' },
]

// Default reporting window: the last 28 complete days (yesterday back 28 days).
function defaultPeriod() {
  const end = new Date()
  end.setUTCDate(end.getUTCDate() - 1)
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - 27)
  const iso = (d) => d.toISOString().slice(0, 10)
  return { start: iso(start), end: iso(end) }
}

export default function StackedMarketingHub() {
  const [tab, setTab] = useState('dashboard')
  const [sites, setSites] = useState([])
  const [period, setPeriod] = useState(defaultPeriod())
  const [google, setGoogle] = useState({ configured: false })
  const [toast, setToast] = useState(null)

  const notify = useCallback((message, isError = false) => {
    setToast({ message, isError })
    setTimeout(() => setToast(null), 4000)
  }, [])

  const loadSites = useCallback(async () => {
    setSites(await api.get('/sites'))
  }, [])

  useEffect(() => {
    loadSites().catch((e) => notify(e.message, true))
    api.get('/status').then((s) => setGoogle(s.google)).catch(() => {})
  }, [loadSites, notify])

  const shared = { sites, period, setPeriod, google, notify, reloadSites: loadSites }

  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          <h1>Stacked <span className="dot">●</span> Marketing Hub</h1>
          <small>SEO &amp; analytics across your sites</small>
        </div>
        <div
          className={`google-badge ${google.configured ? 'on' : 'off'}`}
          title={google.serviceAccountEmail || google.error || 'Add credentials in .env to connect'}
        >
          {google.configured
            ? `Google connected · ${google.serviceAccountEmail || 'service account'}`
            : 'Google not connected — manual entry'}
        </div>
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'dashboard' && <Dashboard {...shared} />}
      {tab === 'audit' && <AuditTracker {...shared} />}
      {tab === 'keywords' && <KeywordPlanner {...shared} />}
      {tab === 'sites' && <SiteManager {...shared} />}

      {toast && <div className={`toast ${toast.isError ? 'err' : ''}`}>{toast.message}</div>}
    </div>
  )
}
