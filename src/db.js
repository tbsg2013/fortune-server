import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __srcDir = path.dirname(fileURLToPath(import.meta.url));

const SCHEMA = `

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  birth_date TEXT,
  birth_time TEXT,
  birth_hour INTEGER,
  birth_minute INTEGER,
  gender TEXT DEFAULT '男',
  created_at TEXT DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS fortune_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  title TEXT,
  input_data TEXT,
  result_data TEXT,
  created_at TEXT DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS chat_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT,
  created_at TEXT DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now', 'localtime'))
);

CREATE INDEX IF NOT EXISTS idx_records_user ON fortune_records(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_session ON chat_messages(session_id);

`;

async function init() {
  if (process.env.DATABASE_URL) {
    const { createClient } = await import('@libsql/client/web');
    const client = createClient({
      url: process.env.DATABASE_URL,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
    for (const stmt of SCHEMA.split(';').map((s) => s.trim()).filter(Boolean)) {
      try { await client.execute(stmt); } catch (e) { console.error('schema init:', e.message); }
    }
    const num = (v) => (v == null ? 0 : typeof v === 'bigint' ? Number(v) : Number(v));
    const normalize = (r) => {
      const cols = r.columns || [];
      const rows = (r.rows || []).map((row) => {
        if (Array.isArray(row)) {
          const o = {};
          for (let i = 0; i < cols.length; i++) o[cols[i]] = row[i];
          return o;
        }
        return row;
      });
      const last = r.lastInsertRowid != null ? r.lastInsertRowid : (r.meta && r.meta.last_insert_rowid);
      const changes = r.rowsAffected != null ? r.rowsAffected : (r.meta && r.meta.rows_written);
      return { rows, lastInsertRowid: num(last), changes: num(changes) };
    };
    return {
      get: async (sql, ...args) => normalize(await client.execute({ sql, args })).rows[0],
      all: async (sql, ...args) => normalize(await client.execute({ sql, args })).rows,
      run: async (sql, ...args) => {
        const n = normalize(await client.execute({ sql, args }));
        return { lastInsertRowid: n.lastInsertRowid, changes: n.changes };
      },
    };
  }
  let DatabaseSync;
  try {
    const sqliteSpec = ['node', 'sqlite'];
    ({ DatabaseSync } = await import(sqliteSpec[0] + ':' + sqliteSpec[1]));
  } catch (e) {
    throw new Error('未配置 DATABASE_URL：生产环境必须配置 Turso 数据库环境变量（DATABASE_URL / DATABASE_AUTH_TOKEN）');
  }
  const dataDir = path.join(__srcDir, '..', 'data');
  mkdirSync(dataDir, { recursive: true });
  const sqlite = new DatabaseSync(path.join(dataDir, 'fortune.db'));
  sqlite.exec(SCHEMA);
  return {
    get: (sql, ...args) => sqlite.prepare(sql).get(...args),
    all: (sql, ...args) => sqlite.prepare(sql).all(...args),
    run: (sql, ...args) => {
      const info = sqlite.prepare(sql).run(...args);
      return { lastInsertRowid: Number(info.lastInsertRowid), changes: Number(info.changes) };
    },
  };
}

let dbPromise = null;
function getDb() {
  if (!dbPromise) dbPromise = init();
  return dbPromise;
}

export const db = {
  get: async (...args) => (await getDb()).get(...args),
  all: async (...args) => (await getDb()).all(...args),
  run: async (...args) => (await getDb()).run(...args),
};
export const now = () => new Date().toISOString();
