import { NextResponse } from "next/server";
import { z } from "zod";

import {
  getMidtransTransactionStatus,
  mapMidtransStatusToOrderStatus,
  verifyMidtransSignature
} from "@/lib/midtrans";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database, Json } from "@/lib/supabase/database.types";

export const runtime = "nodejs";

const webhookSchema = z.object({
  order_id: z.string().min(1),
  status_code: z.string().min(1),
  gross_amount: z.string().min(1),
  signature_key: z.string().min(1)
});

type OrderStatus = Database["public"]["Enums"]["order_status"];

type MidtransVerifiedStatus = {
  order_id: string;
  transaction_id?: string;
  transaction_status?: string;
  payment_type?: string;
  settlement_time?: string;
};

function toJson(value: unknown): Json {
  return JSON.parse(JSON.stringify(value)) as Json;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = webhookSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Payload webhook belum valid." }, { status: 400 });
  }

  if (!verifyMidtransSignature(result.data)) {
    return NextResponse.json({ error: "Signature webhook tidak valid." }, { status: 401 });
  }

  try {
    const verifiedStatus = await getMidtransTransactionStatus(
      result.data.order_id
    ) as MidtransVerifiedStatus;
    const nextStatus = mapMidtransStatusToOrderStatus(
      verifiedStatus.transaction_status
    ) as OrderStatus;

    const supabase = createSupabaseAdminClient();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, paid_at")
      .eq("midtrans_order_id", verifiedStatus.order_id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
    }

    const paidAt =
      nextStatus === "paid"
        ? order.paid_at ?? verifiedStatus.settlement_time ?? new Date().toISOString()
        : order.paid_at;

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: nextStatus,
        midtrans_transaction_id: verifiedStatus.transaction_id ?? null,
        midtrans_transaction_status: verifiedStatus.transaction_status ?? null,
        midtrans_payment_type: verifiedStatus.payment_type ?? null,
        midtrans_raw_status: toJson(verifiedStatus),
        paid_at: paidAt
      })
      .eq("id", order.id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return NextResponse.json({ received: true, status: nextStatus });
  } catch {
    return NextResponse.json(
      { error: "Webhook pembayaran belum bisa diproses." },
      { status: 500 }
    );
  }
}
