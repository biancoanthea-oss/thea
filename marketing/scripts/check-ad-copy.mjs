#!/usr/bin/env node
// Validates ad copy assets against Google Ads character limits.
// Assets live in fenced code blocks whose info string names the asset type,
// one asset per line. Run: npm run ads:lint

import { readFile, readdir } from 'node:fs/promises'
import { join, dirname, relative, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

// Google Ads limits. https://support.google.com/google-ads (asset specs)
const LIMITS = {
  headline: 30,
  description: 90,
  path: 15,
  'long-headline': 90,
  'short-description': 60,
  'business-name': 25,
}

// Recommended asset counts per section. Responsive Search Ads want many assets
// so Google has combinations to test; Performance Max asset groups have their
// own, lower minimums, so the target depends on the file.
const RECOMMENDED = {
  'rsa-copy.md': { headline: 12, description: 4 },
  'pmax-asset-groups.md': {
    headline: 5,
    'long-headline': 2,
    description: 2,
    'short-description': 1,
  },
}

const BLOCK = /^```([a-z-]+)\n([\s\S]*?)^```/gm

async function markdownFiles(dir) {
  const found = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
    const path = join(dir, entry.name)
    if (entry.isDirectory()) found.push(...(await markdownFiles(path)))
    else if (entry.name.endsWith('.md')) found.push(path)
  }
  return found
}

const problems = []
const warnings = []
let checked = 0

for (const file of await markdownFiles(ROOT)) {
  const source = await readFile(file, 'utf8')
  const rel = relative(ROOT, file)
  let heading = ''
  const counts = new Map()

  for (const match of source.matchAll(BLOCK)) {
    const [, type, body] = match
    const limit = LIMITS[type]
    if (!limit) continue

    // Which section is this block in? Nearest preceding "## " heading.
    const before = source.slice(0, match.index)
    const headings = before.match(/^## .+$/gm)
    heading = headings ? headings[headings.length - 1].replace(/^##\s*/, '') : rel

    const assets = body.split('\n').map((line) => line.trim()).filter(Boolean)
    const key = `${heading}::${type}`
    counts.set(key, (counts.get(key) ?? 0) + assets.length)

    const line0 = before.split('\n').length + 1
    assets.forEach((asset, i) => {
      checked++
      // Google counts characters, and non-ASCII counts the same as ASCII.
      const length = [...asset].length
      if (length > limit) {
        problems.push(
          `${rel}:${line0 + i}  ${type} is ${length}/${limit} (${length - limit} over)\n` +
            `      "${asset}"`
        )
      }
    })
  }

  const recommended = RECOMMENDED[basename(file)] ?? {}
  for (const [key, count] of counts) {
    const [section, type] = key.split('::')
    const want = recommended[type]
    if (want && count < want) {
      warnings.push(`${rel}  ${section}: ${count} ${type}s (aim for ${want}+)`)
    }
  }
}

if (warnings.length) {
  console.log('\nWarnings — under the recommended asset count:')
  for (const warning of warnings) console.log(`  ${warning}`)
}

if (problems.length) {
  console.error(`\n${problems.length} asset(s) over the character limit:\n`)
  for (const problem of problems) console.error(`  ${problem}`)
  console.error(`\nChecked ${checked} assets. Trim the ones above and re-run.\n`)
  process.exit(1)
}

console.log(`\n${checked} ad assets checked, all within Google Ads limits.\n`)
