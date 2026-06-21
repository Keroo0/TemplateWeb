import "server-only";

import {
  createSnapTransaction,
  getMidtransTransactionStatus,
  mapMidtransStatusToOrderStatus,
  type MidtransStatusResponse
} from "@/lib/midtrans";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/database.types";

export async function createOrderSnap(orderCode: string) {
  const supabase = createSupabaseAdminClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("order_code, amount_idr, customer_name, customer_email, customer_whatsapp, status")
    .eq("order_code", orderCode)
    .single();

  if (error || !order) {
    throw new Error("Pesanan tidak ditemukan.");
  }

  if (order.status !== "pending_payment") {
    throw new Error("Pesanan ini tidak dalam status menunggu pembayaran.");
  }

  const snap = await createSnapTransaction({
    order_code: order.order_code,
    amount_idr: order.amount_idr,
    customer_name: order.customer_name,
    customer_email: order.customer_email,
    customer_whatsapp: order.customer_whatsapp
  });

  const { error: updateError } = await supabase
    .from("orders")
    .update({ midtrans_order_id: order.order_code })
    .eq("order_code", order.order_code);

  if (updateError) {
    throw new Error(`Gagal menyimpan status pembayaran: ${updateError.message}`);
  }

  return snap;
}

export async function syncOrderFromMidtrans(orderId: string, statusPayload?: MidtransStatusResponse) {
  const verifiedStatus = statusPayload ?? (await getMidtransTransactionStatus(orderId));
  const orderStatus = mapMidtransStatusToOrderStatus(verifiedStatus.transaction_status);
  const supabase = createSupabaseAdminClient();

  const updatePayload = {
    status: orderStatus,
    midtrans_order_id: verifiedStatus.order_id,
    midtrans_transaction_id: verifiedStatus.transaction_id ?? null,
    midtrans_transaction_status: verifiedStatus.transaction_status ?? null,
    midtrans_payment_type: verifiedStatus.payment_type ?? null,
    midtrans_raw_status: verifiedStatus as Json,
    paid_at: orderStatus === "paid" ? new Date().toISOString() : null
  };

  const { data, error } = await supabase
    .from("orders")
    .update(updatePayload)
    .eq("order_code", verifiedStatus.order_id)
    .select("order_code, status, midtrans_transaction_status")
    .single();

  if (error) {
    throw new Error(`Gagal memperbarui status pembayaran: ${error.message}`);
  }

  return data;
}
