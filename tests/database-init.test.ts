import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { resolve, join, sep } from "node:path";
import { init, query, closeDb } from "../lib/db";
test("inicialización idempotente y recuperación después de una configuración fallida", async () => {
  const original = {
    url: process.env.DATABASE_URL,
    alias: process.env.POSTGRES_URL,
    vercel: process.env.VERCEL,
    dir: process.env.DATA_DIR,
  };
  const root = resolve("data");
  mkdirSync(root, { recursive: true });
  const dir = mkdtempSync(join(root, "db-test-"));
  try {
    delete process.env.VERCEL;
    process.env.POSTGRES_URL = "";
    process.env.DATABASE_URL = "https://invalid.example";
    process.env.DATA_DIR = dir;
    await assert.rejects(init(), /URL PostgreSQL/);
    process.env.DATABASE_URL = "";
    const first = init();
    assert.equal(first, init());
    await first;
    await init();
    const tables = await query(
      "SELECT name FROM sqlite_master WHERE type='table'",
    );
    for (const name of [
      "users",
      "days",
      "sessions",
      "resets",
      "audit",
      "limits",
    ])
      assert.ok(tables.some((t) => t.name === name));
    const indexes = await query(
      "SELECT name FROM sqlite_master WHERE type='index'",
    );
    assert.ok(indexes.some((i) => i.name === "sessions_user_idx"));
  } finally {
    await closeDb();
    for (const [key, value] of Object.entries({
      DATABASE_URL: original.url,
      POSTGRES_URL: original.alias,
      VERCEL: original.vercel,
      DATA_DIR: original.dir,
    }))
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    assert.ok(dir.startsWith(root + sep));
    rmSync(dir, { recursive: true });
  }
});
