import { test } from "node:test";
import assert from "node:assert/strict";
import { databaseConfig } from "../lib/database-config";
test("selección de PostgreSQL por variables de Vercel y prioridad explícita", () => {
  const primary = "postgresql://user:secret@db.example/health";
  const alias = "postgres://user:secret@pool.example/health";
  assert.deepEqual(
    databaseConfig({ DATABASE_URL: primary, POSTGRES_URL: alias }),
    { kind: "postgres", url: primary },
  );
  assert.deepEqual(databaseConfig({ POSTGRES_URL: alias, VERCEL: "1" }), {
    kind: "postgres",
    url: alias,
  });
  assert.deepEqual(databaseConfig({ DATABASE_URL: " ", POSTGRES_URL: alias }), {
    kind: "postgres",
    url: alias,
  });
  assert.deepEqual(databaseConfig({}), { kind: "sqlite" });
  assert.throws(
    () => databaseConfig({ VERCEL: "1" }),
    /Configura DATABASE_URL/,
  );
  assert.throws(
    () => databaseConfig({ DATABASE_URL: "https://db.example" }),
    /URL PostgreSQL/,
  );
  assert.throws(
    () => databaseConfig({ DATABASE_URL: "password=secret" }),
    /URL PostgreSQL/,
  );
  assert.throws(
    () => databaseConfig({ DATABASE_URL: "postgres://db.example" }),
    /URL PostgreSQL/,
  );
});
