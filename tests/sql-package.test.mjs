import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const sqlDir = path.join(root, "supabase/sql");

const requiredFiles = [
  "001_extensions.sql",
  "002_tables.sql",
  "003_indexes.sql",
  "004_rls_policies.sql",
  "005_storage.sql",
  "006_seed_categories.sql",
  "007_seed_templates.sql"
];

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function readSql(fileName) {
  return readFileSync(path.join(sqlDir, fileName), "utf8");
}

describe("Phase 3 Supabase SQL manual package", () => {
  it("contains the ordered SQL files required by the setup guide", () => {
    for (const fileName of requiredFiles) {
      assert.ok(existsSync(path.join(sqlDir, fileName)), `${fileName} is missing`);
    }
  });

  it("defines the core schema tables and order constraints", () => {
    const tables = readSql("002_tables.sql");

    for (const tableName of [
      "categories",
      "templates",
      "orders",
      "order_assets",
      "order_status_log"
    ]) {
      assert.match(tables, new RegExp(`create table if not exists public\\.${tableName}`));
    }

    assert.match(tables, /order_status/);
    assert.match(tables, /delivery_type/);
    assert.match(tables, /delivery_slug/);
    assert.match(tables, /form_schema/);
    assert.match(tables, /form_data/);
  });

  it("enables RLS and keeps private data denied by default", () => {
    const policies = readSql("004_rls_policies.sql");

    for (const tableName of [
      "categories",
      "templates",
      "orders",
      "order_assets",
      "order_status_log"
    ]) {
      assert.match(
        policies,
        new RegExp(`alter table public\\.${tableName}\\s+enable row level security`, "i")
      );
    }

    assert.match(policies, /public can read active categories/i);
    assert.match(policies, /public can read active templates/i);
    assert.doesNotMatch(policies, /orders.*to anon.*using \\(true\\)/is);
    assert.doesNotMatch(policies, /order_assets.*to anon.*using \\(true\\)/is);
  });

  it("creates private storage buckets for customer uploads and delivery zips", () => {
    const storage = readSql("005_storage.sql");

    assert.match(storage, /customer-uploads/);
    assert.match(storage, /delivery-zips/);
    assert.match(storage, /public\s*=\s*false/i);
    assert.match(storage, /file_size_limit/);
  });

  it("seeds default categories and template examples", () => {
    const categories = readSql("006_seed_categories.sql");
    const templates = readSql("007_seed_templates.sql");

    for (const slug of ["undangan", "maaf", "nembak", "landing-page", "crud"]) {
      assert.match(categories, new RegExp(slug));
    }

    assert.match(templates, /form_schema/);
    assert.match(templates, /undangan-minimalis/);
    assert.match(templates, /maaf-tulus/);
  });

  it("documents manual execution, verification, rollback, and no-secret rules", () => {
    const guide = read("supabase/sql/README.md");

    for (const fileName of requiredFiles) {
      assert.match(guide, new RegExp(fileName));
    }

    assert.match(guide, /SQL Editor/);
    assert.match(guide, /Verifikasi/i);
    assert.match(guide, /Rollback/i);
    assert.match(guide, /service role key/i);
  });

  it("does not commit obvious secret values in SQL files", () => {
    for (const fileName of requiredFiles) {
      const sql = readSql(fileName);

      assert.doesNotMatch(sql, /eyJ[A-Za-z0-9_-]{20,}/, `${fileName} contains JWT-like text`);
      assert.doesNotMatch(
        sql,
        /SB-Mid-(server|client)-[A-Za-z0-9_-]+/,
        `${fileName} contains Midtrans-like key`
      );
    }
  });
});
