"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

type PaymentPanelProps = {
  orderCode: string;
  snapEndpoint?: string;
  ctaLabel?: string;
};

type SnapResponse = {
  redirect_url?: string;
  error?: string;
};

export function PaymentPanel({
  orderCode,
  snapEndpoint = "/api/payments/snap",
  ctaLabel = "Bayar sekarang"
}: PaymentPanelProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function startPayment() {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(snapEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          order_code: orderCode
        })
      });

      const result = (await response.json()) as SnapResponse;

      if (!response.ok) {
        setError(result.error ?? "Checkout pembayaran belum bisa dibuat.");
        return;
      }

      if (!result.redirect_url) {
        setError("Midtrans belum mengirim link pembayaran.");
        return;
      }

      window.location.href = result.redirect_url;
    } catch {
      setError("Koneksi ke pembayaran terputus. Coba lagi sebentar lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pembayaran</CardTitle>
        <CardDescription>
          Kode pesanan akan dikirim ke Midtrans untuk membuat checkout Snap.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="border border-border bg-muted p-4">
          <p className="text-sm text-muted-foreground">Kode pesanan</p>
          <p className="mt-1 break-all text-2xl font-semibold">{orderCode}</p>
        </div>

        {error ? (
          <p className="border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <Button
          type="button"
          size="lg"
          className="w-full"
          onClick={startPayment}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <CreditCard />}
          {isLoading ? "Membuat checkout..." : ctaLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
