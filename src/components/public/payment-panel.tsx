import { MessageCircle, ReceiptText } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type PaymentPanelProps = {
  orderCode: string;
  ctaLabel?: string;
};

export function PaymentPanel({
  orderCode,
  ctaLabel = "Konfirmasi via WhatsApp"
}: PaymentPanelProps) {
  const whatsappUrl = buildWhatsAppUrl({
    orderCode,
    source: "Halaman konfirmasi pesanan"
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Konfirmasi pembayaran</CardTitle>
        <CardDescription>
          Kirim kode pesanan ke WhatsApp Mauapalau. Admin akan cek data dan
          mengirim instruksi pembayaran manual.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="border border-border bg-muted p-4">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <ReceiptText className="h-4 w-4" />
            Kode pesanan
          </p>
          <p className="mt-1 break-all text-2xl font-semibold">{orderCode}</p>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ size: "lg" }), "w-full")}
        >
          <MessageCircle />
          {ctaLabel}
        </a>

        <p className="text-sm leading-6 text-muted-foreground">
          Status pesanan tetap menunggu pembayaran sampai admin mengonfirmasi
          transfer atau bukti bayar dari WhatsApp.
        </p>
      </CardContent>
    </Card>
  );
}
