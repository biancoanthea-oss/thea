// Server-side Google integration. All credentials stay here — nothing in this
// file is ever exposed to the browser.
//
// We authenticate with a single Google *service account*. To connect a site:
//   • GA4:            add the service account's email as a Viewer on the GA4 property
//   • Search Console: add the service account's email as a Restricted user on the property
// See README → "Google Cloud setup" for the click-by-click walkthrough.

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { google } from 'googleapis'

const GA4_SCOPE = 'https://www.googleapis.com/auth/analytics.readonly'
const GSC_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly'

// ── Load credentials once ────────────────────────────────────────────────────
function loadCredentials() {
  const inline = process.env.GOOGLE_CREDENTIALS_JSON
  if (inline && inline.trim()) {
    try {
      return { credentials: JSON.parse(inline) }
    } catch {
      return { error: 'GOOGLE_CREDENTIALS_JSON is set but is not valid JSON.' }
    }
  }
  const path = process.env.GOOGLE_APPLICATION_CREDENTIALS
  if (path && path.trim()) {
    const abs = resolve(process.cwd(), path)
    if (!existsSync(abs)) {
      return { error: `Service account file not found at ${abs}` }
    }
    try {
      return { credentials: JSON.parse(readFileSync(abs, 'utf8')) }
    } catch {
      return { error: `Service account file at ${abs} is not valid JSON.` }
    }
  }
  return { error: null } // not configured — this is fine, manual entry still works
}

const loaded = loadCredentials()

export function googleStatus() {
  return {
    configured: Boolean(loaded.credentials),
    error: loaded.error || null,
    serviceAccountEmail: loaded.credentials?.client_email || null,
  }
}

let _ga4Client = null
function ga4Client() {
  if (!loaded.credentials) return null
  if (!_ga4Client) {
    _ga4Client = new BetaAnalyticsDataClient({ credentials: loaded.credentials })
  }
  return _ga4Client
}

let _authClient = null
function gscAuth() {
  if (!loaded.credentials) return null
  if (!_authClient) {
    _authClient = new google.auth.GoogleAuth({
      credentials: loaded.credentials,
      scopes: [GA4_SCOPE, GSC_SCOPE],
    })
  }
  return _authClient
}

// ── GA4: sessions + conversions for a date range ────────────────────────────
export async function fetchGa4({ propertyId, startDate, endDate }) {
  const client = ga4Client()
  if (!client) throw new Error('Google credentials not configured')
  // Accept either "properties/123" or bare "123".
  const property = String(propertyId).startsWith('properties/')
    ? String(propertyId)
    : `properties/${propertyId}`

  const [res] = await client.runReport({
    property,
    dateRanges: [{ startDate, endDate }],
    metrics: [{ name: 'sessions' }, { name: 'conversions' }],
  })

  const row = res.rows?.[0]
  const val = (i) => Number(row?.metricValues?.[i]?.value || 0)
  return {
    sessions: Math.round(val(0)),
    conversions: Math.round(val(1)),
  }
}

// ── Search Console: clicks, impressions, average position ───────────────────
export async function fetchGsc({ siteUrl, startDate, endDate }) {
  const auth = gscAuth()
  if (!auth) throw new Error('Google credentials not configured')
  const webmasters = google.webmasters({ version: 'v3', auth })

  const { data } = await webmasters.searchanalytics.query({
    siteUrl,
    requestBody: { startDate, endDate, dimensions: [], rowLimit: 1 },
  })

  const row = data.rows?.[0]
  return {
    clicks: Math.round(row?.clicks || 0),
    impressions: Math.round(row?.impressions || 0),
    avg_position: row?.position ? Number(row.position.toFixed(1)) : 0,
  }
}
