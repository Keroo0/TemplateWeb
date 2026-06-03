import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function exists(relativePath) {
  return existsSync(path.join(root, relativePath));
}

describe("Phase 6 dynamic order form", () => {
  it("converts template form_schema to zod validation with upload limits", () => {
    const source = read("src/lib/form-schema.ts");

    assert.match(source, /zod/);
    assert.match(source, /buildOrderFormSchema/);
    assert.match(source, /parseTemplateFields/);
    assert.match(source, /MAX_FILE_SIZE_BYTES/);
    assert.match(source, /MAX_TOTAL_UPLOAD_BYTES/);
    assert.match(source, /5 \* 1024 \* 1024/);
    assert.match(source, /20 \* 1024 \* 1024/);
  });

  it("generates Mauapalau order codes with the required format", () => {
    const source = read("src/lib/order-code.ts");

    assert.match(source, /generateOrderCode/);
    assert.match(source, /MP-/);
    assert.match(source, /\[A-Z0-9\]/);
  });

  it("creates pending orders server-side with service role and form_data snapshot", () => {
    const source = read("src/lib/orders.ts");

    assert.match(source, /createSupabaseAdminClient/);
    assert.match(source, /createPendingOrder/);
    assert.match(source, /pending_payment/);
    assert.match(source, /form_data/);
    assert.match(source, /generateOrderCode/);
    assert.doesNotMatch(source, /notes_internal/);
  });

  it("exposes a validated order creation API route", () => {
    assert.ok(exists("src/app/api/orders/route.ts"));
    const source = read("src/app/api/orders/route.ts");

    assert.match(source, /POST/);
    assert.match(source, /zod/);
    assert.match(source, /getTemplateBySlug/);
    assert.match(source, /buildOrderFormSchema/);
    assert.match(source, /createPendingOrder/);
    assert.match(source, /NextResponse\.json/);
  });

  it("renders a dynamic client order form with react-hook-form", () => {
    assert.ok(exists("src/components/public/order-form.tsx"));
    const source = read("src/components/public/order-form.tsx");

    assert.match(source, /"use client"/);
    assert.match(source, /useForm/);
    assert.match(source, /react-hook-form/);
    assert.match(source, /form_schema/);
    assert.match(source, /\/api\/orders/);
    assert.match(source, /Pesan sekarang/);
  });

  it("renders the public /order page from a template query parameter", () => {
    assert.ok(exists("src/app/(public)/order/page.tsx"));
    const source = read("src/app/(public)/order/page.tsx");

    assert.match(source, /searchParams/);
    assert.match(source, /getTemplateBySlug/);
    assert.match(source, /OrderForm/);
    assert.match(source, /Pilih template dulu/);
    assert.match(source, /notFound/);
  });
});
