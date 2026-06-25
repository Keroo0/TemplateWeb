# WhatsApp Payment Flow Design

## Context

Mauapalau currently creates pending orders, sends customers to `/payment/[orderCode]`, and starts a Midtrans Snap checkout from `/api/payments/snap`. The project is moving away from gateway checkout because payment gateway KYC adds too much operational friction for the current stage.

The new direction is to remove Midtrans from the product path and route payment confirmation to WhatsApp.

## Decision

Use WhatsApp as the payment handoff. The WhatsApp destination is configured with:

```env
NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER=6289647851864
```

The UI builds `https://wa.me/6289647851864?text=...` links with an order-specific message. The message includes the order code and enough context for manual follow-up.

## User Flow

1. Customer picks a template.
2. Customer fills the dynamic order form.
3. Server creates an order with status `pending_payment`.
4. Customer sees a success message and CTA to continue via WhatsApp.
5. `/payment/[orderCode]` becomes a WhatsApp confirmation page, not a payment gateway page.
6. Admin manually confirms payment and moves the order forward from the admin workflow later.

## Scope

- Add public WhatsApp env validation and helper behavior.
- Add `.env.example` documentation for `NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER`.
- Update `.env.local` with the provided number.
- Replace Midtrans-facing payment UI copy and actions with WhatsApp confirmation.
- Remove `/api/payments/snap` and `/api/payments/webhook` routes.
- Remove Midtrans helper modules and runtime env requirements.
- Remove `midtrans-client` dependency.
- Update tests so the expected payment contract is WhatsApp-based.
- Update project guidance/docs that still describe Midtrans as the active payment method.

## Non-Goals

- Do not add automated payment verification.
- Do not mark orders as `paid` automatically.
- Do not redesign the admin dashboard in this change.
- Do not change the database schema yet, even though Midtrans columns may become legacy fields.

## Data and Status Behavior

Orders continue to start at `pending_payment`. That status now means "waiting for manual WhatsApp payment confirmation" instead of "waiting for gateway webhook."

Existing Midtrans columns can remain in SQL/database types for now to avoid a risky schema migration. They are no longer written by the active application flow.

## Error Handling

If the WhatsApp number env is missing or invalid, public env validation should fail clearly during app execution. The number is normalized to digits before creating the `wa.me` URL.

Order creation errors remain handled by `/api/orders` as they are today.

## Testing

Update the payment tests to assert:

- `NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER` is part of the documented env contract.
- Order creation links to `/payment/${orderCode}`.
- The payment page and panel create a WhatsApp handoff.
- Midtrans Snap/webhook routes are not part of the expected active payment flow.

Run relevant verification after implementation:

- `npm run test:orders`
- `npm run test:payments`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
