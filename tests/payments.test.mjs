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

describe("WhatsApp payment handoff", () => {
  it("documents WhatsApp as the public payment handoff env", () => {
    const env = read(".env.example");

    assert.match(env, /^NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER=/m);
    assert.doesNotMatch(env, /^MIDTRANS_SERVER_KEY=/m);
    assert.doesNotMatch(env, /^MIDTRANS_CLIENT_KEY=/m);
  });

  it("centralizes WhatsApp number normalization and URL generation", () => {
    assert.ok(exists("src/lib/whatsapp.ts"));
    const source = read("src/lib/whatsapp.ts");

    assert.match(source, /NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER/);
    assert.match(source, /normalizeWhatsAppNumber/);
    assert.match(source, /buildWhatsAppUrl/);
    assert.match(source, /wa\.me/);
  });

  it("links successful order creation to the payment handoff page", () => {
    const form = read("src/components/public/order-form.tsx");

    assert.match(form, /\/payment\/\$\{result\.order\?\.order_code\}/);
    assert.match(form, /Lanjut via WhatsApp/);
  });

  it("provides a WhatsApp confirmation page without Snap checkout", () => {
    assert.ok(exists("src/app/(public)/payment/[orderCode]/page.tsx"));
    const page = read("src/app/(public)/payment/[orderCode]/page.tsx");
    const panel = read("src/components/public/payment-panel.tsx");

    assert.match(page, /WhatsApp/);
    assert.match(panel, /buildWhatsAppUrl/);
    assert.match(panel, /Konfirmasi via WhatsApp/);
    assert.doesNotMatch(page, /api\/payments\/snap/);
    assert.doesNotMatch(panel, /fetch\(/);
  });

  it("removes Midtrans routes and helper modules from the active app", () => {
    assert.equal(exists("src/app/api/payments/snap/route.ts"), false);
    assert.equal(exists("src/app/api/payments/webhook/route.ts"), false);
    assert.equal(exists("src/lib/midtrans.ts"), false);
    assert.equal(exists("src/lib/payments.ts"), false);
  });
});
