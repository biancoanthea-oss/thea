// Seeds Stacked's six sites so the app opens ready to use. Safe to run anytime:
// it does nothing if any sites already exist. Rename any site, or add GA4 /
// Search Console IDs, from the Site Manager tab. Google fields are left blank
// here — every site starts on manual entry until you connect it.
import db from './db.js'

const count = db.prepare('SELECT COUNT(*) AS n FROM sites').get().n
if (count > 0) {
  console.log(`Seed skipped — ${count} site(s) already exist.`)
  process.exit(0)
}

// [display name, url] — edit names freely in the Site Manager.
const SITES = [
  ['Stacked AV', 'https://www.stackedav.ie/'],
  ['Stacked MPS', 'https://www.stackedmps.ie/'],
  ['Stacked Shop (IT)', 'https://shopit.stacked.ie/'],
  ['Stacked Shop', 'https://shop.stacked.ie/'],
  ['Audiovisual.ie', 'https://www.audiovisual.ie/'],
  ['Stacked Merch', 'https://merch.stacked.ie/'],
]

const insertSite = db.prepare(
  `INSERT INTO sites (name, url, ga4_property_id, gsc_site_url) VALUES (?, ?, NULL, NULL)`,
)
const seed = db.transaction(() => {
  for (const [name, url] of SITES) insertSite.run(name, url)
})
seed()

console.log(`Seeded ${SITES.length} Stacked sites (manual entry — connect Google when ready).`)
