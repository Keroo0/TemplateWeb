import { NextResponse } from "next/server";
import { z } from "zod";

import { createSnapTransaction } from "@/lib/midtrans";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const snapRequestSchema = z.object({
  order_code: z.string().trim().min(1)
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = snapRequestSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Kode pesanan belum valid.", issues: result.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, order_code, amount_idr, customer_name, customer_email, customer_whatsapp")
    .eq("order_code", result.data.order_code)
    .eq("status", "pending_payment")
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: "Pesanan pending pembayaran tidak ditemukan." },
      { status: 404 }
    );
  }

  try {
    const midtransOrderId = order.order_code;
    const snapTransaction = await createSnapTransaction({
      order_code: midtransOrderId,
      amount_idr: order.amount_idr,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_whatsapp: order.customer_whatsapp
    });

    const { error: updateError } = await supabase
      .from("orders")
      .update({ midtrans_order_id: midtransOrderId })
      .eq("id", order.id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return NextResponse.json({
      token: snapTransaction.token,
      redirect_url: snapTransaction.redirect_url
    });
  } catch {
    return NextResponse.json(
      { error: "Transaksi pembayaran belum bisa dibuat. Coba lagi sebentar lagi." },
      { status: 500 }
    );
  }
}
