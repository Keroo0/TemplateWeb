# WhatsApp Payment And Pricing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove Midtrans from the active application flow, route order payment confirmation to WhatsApp, and add a ChatGPT-subscription-style price list section whose CTAs open WhatsApp.

**Architecture:** Keep order creation server-side and leave orders in `pending_payment` until manual admin confirmation. Centralize WhatsApp URL generation in a small helper, then use it from the payment panel and pricing CTAs. Remove Midtrans routes, helper modules, dependency, env requirements, and tests that describe the old gateway contract.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn/ui primitives, lucide-react, zod, Supabase.

---

### Task 1: Update Payment Contract Tests

**Files:**
- Modify: `tests/payments.test.mjs`
- Modify: `tests/scaffold.test.mjs`

- [ ] **Step 1: Replace payment tests with WhatsApp expectations**

Replace `tests/payments.test.mjs` with tests that assert the active flow is WhatsApp-based:

```js
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
    assert.match(source, /wa\\.me/);
  });

  it("links successful order creation to the payment handoff page", () => {
    const form = read("src/components/public/order-form.tsx");

    assert.match(form, /\/payment\/\\$\\{result\\.order\\?\\.order_code\\}/);
    assert.match(form, /Lanjut via WhatsApp/);
  });

  it("provides a WhatsApp confirmation page without Snap checkout", () => {
    assert.ok(exists("src/app/(public)/payment/[orderCode]/page.tsx"));
    const page = read("src/app/(public)/payment/[orderCode]/page.tsx");
    const panel = read("src/components/public/payment-panel.tsx");

    assert.match(page, /WhatsApp/);
    assert.match(panel, /buildWhatsAppUrl/);
    assert.match(panel, /Konfirmasi via WhatsApp/);
    assert.doesNotMatch(page, /api\\/payments\\/snap/);
    assert.doesNotMatch(panel, /fetch\\(/);
  });

  it("removes Midtrans routes and helper modules from the active app", () => {
    assert.equal(exists("src/app/api/payments/snap/route.ts"), false);
    assert.equal(exists("src/app/api/payments/webhook/route.ts"), false);
    assert.equal(exists("src/lib/midtrans.ts"), false);
    assert.equal(exists("src/lib/payments.ts"), false);
  });
});
```

- [ ] **Step 2: Update scaffold dependency and env assertions**

In `tests/scaffold.test.mjs`, remove `midtrans-client` from the required dependency list. Replace Midtrans env assertions with `NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER`.

- [ ] **Step 3: Run tests to verify they fail before implementation**

Run: `npm run test:payments && npm run test:scaffold`

Expected: `test:payments` fails because `src/lib/whatsapp.ts` does not exist yet and Midtrans files still exist.

### Task 2: Add WhatsApp Env And Helper

**Files:**
- Modify: `src/lib/env.ts`
- Create: `src/lib/whatsapp.ts`
- Modify: `.env.example`
- Modify: `.env.local`

- [ ] **Step 1: Add WhatsApp to public env**

In `src/lib/env.ts`, add `NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER: z.string().min(8)` to `publicEnvSchema`. Remove the Midtrans env schema, `getMidtransEnv`, and the merge into `serverEnvSchema`.

- [ ] **Step 2: Create WhatsApp helper**

Create `src/lib/whatsapp.ts`:

```ts
import { getPublicEnv } from "@/lib/env";

type WhatsAppMessageInput = {
  orderCode?: string;
  templateName?: string;
  customerName?: string;
  customerEmail?: string;
  source?: string;
};

export function normalizeWhatsAppNumber(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }

  return digits;
}

export function buildWhatsAppMessage(input: WhatsAppMessageInput = {}) {
  const lines = [
    "Halo Mauapalau, saya mau konsultasi/order web.",
    input.orderCode ? `Kode pesanan: ${input.orderCode}` : null,
    input.templateName ? `Template/paket: ${input.templateName}` : null,
    input.customerName ? `Nama: ${input.customerName}` : null,
    input.customerEmail ? `Email: ${input.customerEmail}` : null,
    input.source ? `Sumber: ${input.source}` : null
  ].filter(Boolean);

  return lines.join("\n");
}

export function buildWhatsAppUrl(input: WhatsAppMessageInput = {}) {
  const env = getPublicEnv();
  const number = normalizeWhatsAppNumber(env.NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER);
  const message = buildWhatsAppMessage(input);

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
```

- [ ] **Step 3: Update env files**

Set `.env.example` to include `NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER=` and remove `MIDTRANS_SERVER_KEY`, `MIDTRANS_CLIENT_KEY`, `MIDTRANS_IS_PRODUCTION`.

Add this to `.env.local`:

```env
NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER=6289647851864
```

Remove Midtrans local env lines.

- [ ] **Step 4: Run env-related tests**

Run: `npm run test:scaffold`

Expected: scaffold tests pass.

### Task 3: Replace Payment UI With WhatsApp Handoff

**Files:**
- Modify: `src/components/public/order-form.tsx`
- Modify: `src/components/public/payment-panel.tsx`
- Modify: `src/app/(public)/payment/[orderCode]/page.tsx`
- Modify: `src/app/(public)/order/page.tsx`

- [ ] **Step 1: Update order form success CTA**

In `src/components/public/order-form.tsx`, keep the `/payment/${orderCode}` handoff route but rename state from payment language to confirmation language where helpful. Change CTA text from `Lanjut pembayaran` to `Lanjut via WhatsApp`.

- [ ] **Step 2: Replace `PaymentPanel` behavior**

Rewrite `src/components/public/payment-panel.tsx` as a server-safe client component that receives `orderCode`, builds a WhatsApp URL with `buildWhatsAppUrl`, and renders an anchor button. It should not call `fetch`.

- [ ] **Step 3: Rewrite payment page copy**

In `src/app/(public)/payment/[orderCode]/page.tsx`, replace Midtrans/Snap copy with WhatsApp confirmation copy. Use lucide icons such as `MessageCircle`, `ReceiptText`, and `ShieldCheck`. Render `<PaymentPanel orderCode={orderCode} ctaLabel="Konfirmasi via WhatsApp" />`.

- [ ] **Step 4: Update order page intro copy**

In `src/app/(public)/order/page.tsx`, replace the Phase 7 Midtrans sentence with copy explaining that after order creation, the customer confirms payment via WhatsApp.

- [ ] **Step 5: Run payment tests**

Run: `npm run test:payments`

Expected: payment tests still fail until Midtrans files are removed in Task 5, but WhatsApp UI assertions pass.

### Task 4: Add ChatGPT-Style Pricing Section With WhatsApp CTAs

**Files:**
- Modify: `src/app/(public)/page.tsx`

- [ ] **Step 1: Add pricing package data**

Add a `pricingPlans` array with three packages: Personal, Bisnis, and Custom. Each package has a price label, description, features, delivery estimate, and WhatsApp message source.

- [ ] **Step 2: Render pricing section**

Add a section before the final CTA with a three-column pricing grid inspired by subscription plan pickers: plan name at top, price, concise description, full-width CTA, feature list, and one highlighted recommended plan. Every CTA should use `buildWhatsAppUrl({ templateName: plan.title, source: "Price list beranda" })`.

- [ ] **Step 3: Update hero and steps copy**

Replace landing copy that mentions Midtrans with WhatsApp confirmation language. Change the payment step title to `Konfirmasi via WA` and use `MessageCircle` instead of `CreditCard`.

- [ ] **Step 4: Run UI foundation tests**

Run: `npm run test:ui`

Expected: UI tests pass.

### Task 5: Remove Midtrans Code, Dependency, And Docs References

**Files:**
- Delete: `src/app/api/payments/snap/route.ts`
- Delete: `src/app/api/payments/webhook/route.ts`
- Delete: `src/lib/midtrans.ts`
- Delete: `src/lib/payments.ts`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `agent.md`
- Modify: `docs/testing/phase-1-scaffold-tdd.md`
- Modify: `docs/production-roadmap.md`
- Modify: `supabase/sql/README.md`

- [ ] **Step 1: Delete Midtrans app files**

Remove the Snap route, webhook route, Midtrans helper, and payment sync helper.

- [ ] **Step 2: Remove dependency**

Run: `npm uninstall midtrans-client`

Expected: `package.json` and `package-lock.json` no longer include `midtrans-client`.

- [ ] **Step 3: Update guidance docs**

Replace active Midtrans guidance with WhatsApp/manual payment guidance in `agent.md`, `docs/testing/phase-1-scaffold-tdd.md`, `docs/production-roadmap.md`, and `supabase/sql/README.md`. Leave database schema references alone where they describe existing legacy columns.

- [ ] **Step 4: Search for active Midtrans references**

Run: `rg -n "Midtrans|midtrans|Snap|MIDTRANS|/api/payments|midtrans-client" -S . -g '!*node_modules*' -g '!package-lock.json'`

Expected: only the design spec and legacy database type/schema references remain, plus no active route/helper/UI/test references.

### Task 6: Final Verification

**Files:**
- Verify all modified files

- [ ] **Step 1: Run focused tests**

Run: `npm run test:orders && npm run test:payments && npm run test:scaffold && npm run test:ui`

Expected: all pass.

- [ ] **Step 2: Run static verification**

Run: `npm run lint && npm run typecheck`

Expected: both pass.

- [ ] **Step 3: Run production build**

Run: `npm run build`

Expected: build succeeds.

- [ ] **Step 4: Inspect git diff**

Run: `git status --short && git diff --stat`

Expected: changes are limited to WhatsApp payment flow, pricing UI, Midtrans cleanup, tests, and docs.
