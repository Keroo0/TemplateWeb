import "server-only";

import { createHash } from "node:crypto";

import { getMidtransEnv } from "@/lib/env";

export type SnapTransactionInput = {
  order_code: string;
  amount_idr: number;
  customer_name: string;
  customer_email: string;
  customer_whatsapp?: string | null;
};

export type MidtransStatusResponse = {
  order_id: string;
  status_code: string;
  gross_amount: string;
  transaction_status?: string;
  fraud_status?: string;
  transaction_id?: string;
  payment_type?: string;
  signature_key?: string;
  [key: string]: unknown;
};

function getMidtransBaseUrls() {
  const env = getMidtransEnv();

  return {
    snapUrl: env.MIDTRANS_IS_PRODUCTION
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions",
    apiUrl: env.MIDTRANS_IS_PRODUCTION
      ? "https://api.midtrans.com/v2"
      : "https://api.sandbox.midtrans.com/v2",
    serverKey: env.MIDTRANS_SERVER_KEY,
    clientKey: env.MIDTRANS_CLIENT_KEY
  };
}

function getAuthorizationHeader(serverKey: string) {
  return `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`;
}

async function assertMidtransResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as
    | T
    | { error_messages?: string[]; status_message?: string | string[] }
    | null;

  if (!response.ok) {
    const message = formatMidtransError(payload, response.status);
    throw new Error(message);
  }

  return payload as T;
}

function formatMidtransError(
  payload: { error_messages?: string[]; status_message?: string | string[] } | null,
  status: number
) {
  if (payload?.error_messages?.length) {
    return payload.error_messages.join(" ");
  }

  if (Array.isArray(payload?.status_message)) {
    return payload.status_message.join(" ");
  }

  return payload?.status_message ?? `Midtrans request gagal dengan status ${status}.`;
}

export async function createSnapTransaction(
  input: SnapTransactionInput
): Promise<{ token: string; redirect_url: string }> {
  const { snapUrl, serverKey } = getMidtransBaseUrls();
  const response = await fetch(snapUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthorizationHeader(serverKey)
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: input.order_code,
        gross_amount: input.amount_idr
      },
      customer_details: {
        first_name: input.customer_name,
        email: input.customer_email,
        phone: input.customer_whatsapp ?? undefined
      },
      enabled_payments: ["gopay", "bank_transfer", "credit_card", "qris", "shopeepay"]
    })
  });

  return assertMidtransResponse<{ token: string; redirect_url: string }>(response);
}

export async function getMidtransTransactionStatus(
  orderId: string
): Promise<MidtransStatusResponse> {
  const { apiUrl, serverKey } = getMidtransBaseUrls();
  const response = await fetch(`${apiUrl}/${encodeURIComponent(orderId)}/status`, {
    headers: {
      Authorization: getAuthorizationHeader(serverKey)
    }
  });

  return assertMidtransResponse<MidtransStatusResponse>(response);
}

export function verifyMidtransSignature(notification: MidtransStatusResponse) {
  const env = getMidtransEnv();

  if (!notification.signature_key) {
    return false;
  }

  const rawSignature = `${notification.order_id}${notification.status_code}${notification.gross_amount}${env.MIDTRANS_SERVER_KEY}`;
  const expectedSignature = createHash("sha512").update(rawSignature).digest("hex");

  return expectedSignature === notification.signature_key;
}

export function mapMidtransStatusToOrderStatus(status: MidtransStatusResponse["transaction_status"]) {
  if (status === "settlement" || status === "capture") {
    return "paid" as const;
  }

  if (status === "expire") {
    return "expired" as const;
  }

  if (status === "cancel" || status === "deny" || status === "failure") {
    return "cancelled" as const;
  }

  return "pending_payment" as const;
}
