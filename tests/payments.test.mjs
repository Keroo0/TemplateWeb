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

describe("Phase 7 Midtrans payment", () => {
  it("centralizes Midtrans env, Snap creation, status fetch, and signature verification", () => {
    const source = read("src/lib/midtrans.ts");

    assert.match(source, /MIDTRANS_SERVER_KEY/);
    assert.match(source, /MIDTRANS_CLIENT_KEY/);
    assert.match(source, /createSnapTransaction/);
    assert.match(source, /getMidtransTransactionStatus/);
    assert.match(source, /verifyMidtransSignature/);
    assert.match(source, /sha512/);
    assert.match(source, /order_id.*status_code.*gross_amount/s);
  });

  it("creates Snap tokens server-side from pending orders", () => {
    assert.ok(exists("src/app/api/payments/snap/route.ts"));
    const source = read("src/app/api/payments/snap/route.ts");

    assert.match(source, /POST/);
    assert.match(source, /createSupabaseAdminClient/);
    assert.match(source, /pending_payment/);
    assert.match(source, /createSnapTransaction/);
    assert.match(source, /midtrans_order_id/);
    assert.doesNotMatch(source, /MIDTRANS_SERVER_KEY.*NextResponse/s);
  });

  it("handles webhook verification by re-checking Midtrans status before updating orders", () => {
    assert.ok(exists("src/app/api/payments/webhook/route.ts"));
    const source = read("src/app/api/payments/webhook/route.ts");

    assert.match(source, /POST/);
    assert.match(source, /verifyMidtransSignature/);
    assert.match(source, /getMidtransTransactionStatus/);
    assert.match(source, /midtrans_transaction_status/);
    assert.match(source, /paid|expired|cancelled/);
    assert.doesNotMatch(source, /status.*=.*body\.transaction_status/);
  });

  it("provides a payment page and links successful order creation to it", () => {
    assert.ok(exists("src/app/(public)/payment/[orderCode]/page.tsx"));
    const page = read("src/app/(public)/payment/[orderCode]/page.tsx");
    const form = read("src/components/public/order-form.tsx");

    assert.match(page, /orderCode/);
    assert.match(page, /\/api\/payments\/snap/);
    assert.match(page, /Bayar sekarang/);
    assert.match(form, /\/payment\/\$\{result\.order\?\.order_code\}/);
  });
});
