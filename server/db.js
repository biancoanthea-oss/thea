import Database from 'better-sqlite3'
import { readFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Resolve the DB path from env (relative paths are relative to the repo root).
const dbFile = resolve(
  process.cwd(),
  process.env.DATABASE_FILE || './server/data/marketing-hub.sqlite',
)
mkdirSync(dirname(dbFile), { recursive: true })

const db = new Database(dbFile)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// Apply schema (idempotent — every statement is CREATE ... IF NOT EXISTS).
const schema = readFileSync(resolve(__dirname, 'schema.sql'), 'utf8')
db.exec(schema)

export default db
export { dbFile }
