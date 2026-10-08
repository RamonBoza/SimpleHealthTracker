import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";
import { databaseConfig } from "./database-config";
import { schemaStatements } from "./schema";
type Row = Record<string, any>;
let sqlite: import("node:sqlite").DatabaseSync | undefined;
let pg: ReturnType<typeof postgres> | undefined;
let initialized: Promise<void> | undefined;
function postgresClient(url: string) {
  return (pg ??= postgres(url, {
    max: 3,
    prepare: false,
    idle_timeout: 20,
    connect_timeout: 10,
    max_lifetime: 300,
    // Never silently downgrade production transport or disable certificate verification.
    ...(process.env.VERCEL ? { ssl: { rejectUnauthorized: true } } : {}),
  }));
}
export async function query(
  sql: string,
  params: (string | number | null)[] = [],
): Promise<Row[]> {
  const config = databaseConfig();
  if (config.kind === "postgres") {
    const client = postgresClient(config.url);
    let index = 0;
    return Array.from(
      await client.unsafe(
        sql.replace(/\?/g, () => `$${++index}`),
        params,
      ),
    );
  }
  if (!sqlite) {
    const { DatabaseSync } = await import("node:sqlite");
    const dir = resolve(
      /* turbopackIgnore: true */ process.env.DATA_DIR || "data",
    );
    mkdirSync(dir, { recursive: true });
    sqlite = new DatabaseSync(resolve(dir, "health.sqlite"));
    sqlite.exec(
      "PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA secure_delete=ON;",
    );
  }
  const stmt = sqlite.prepare(sql);
  if (/^\s*(SELECT|WITH)/i.test(sql) || /RETURNING/i.test(sql))
    return stmt.all(...params) as Row[];
  stmt.run(...params);
  return [];
}
export function init() {
  if (initialized) return initialized;
  const pending = (async () => {
    const config = databaseConfig();
    if (config.kind === "postgres") {
      // Serialize first-time schema setup across serverless instances in one transaction.
      await postgresClient(config.url).begin(async (tx) => {
        await tx.unsafe("SELECT pg_advisory_xact_lock(514212086)");
        for (const sql of schemaStatements) await tx.unsafe(sql);
      });
    } else {
      for (const sql of schemaStatements) await query(sql);
    }
  })();
  initialized = pending;
  pending.catch(() => {
    if (initialized === pending) initialized = undefined;
  });
  return initialized;
}
export async function closeDb() {
  if (pg) await pg.end();
  sqlite?.close();
  sqlite = undefined;
  pg = undefined;
  initialized = undefined;
}
