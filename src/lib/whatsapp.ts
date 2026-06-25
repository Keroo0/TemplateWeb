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
