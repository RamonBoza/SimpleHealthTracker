// Shared, idempotent schema for PostgreSQL and local SQLite.
export const schemaStatements = [
  "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT NOT NULL, username_key TEXT UNIQUE NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, settings TEXT NOT NULL, created TEXT NOT NULL, consent TEXT NOT NULL, banned_until TEXT, ban_reason TEXT, role TEXT NOT NULL DEFAULT 'user')",
  "CREATE TABLE IF NOT EXISTS days (user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, date TEXT NOT NULL, data TEXT NOT NULL, PRIMARY KEY(user_id,date))",
  "CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires TEXT NOT NULL)",
  "CREATE TABLE IF NOT EXISTS resets (token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires TEXT NOT NULL)",
  "CREATE TABLE IF NOT EXISTS audit (id TEXT PRIMARY KEY, actor TEXT, target TEXT, action TEXT NOT NULL, reason TEXT NOT NULL, created TEXT NOT NULL)",
  "CREATE TABLE IF NOT EXISTS limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires TEXT NOT NULL)",
  "CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id)",
  "CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires)",
  "CREATE INDEX IF NOT EXISTS resets_user_idx ON resets(user_id)",
  "CREATE INDEX IF NOT EXISTS audit_created_idx ON audit(created)",
];
