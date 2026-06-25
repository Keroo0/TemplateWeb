import { ArrowLeft, MessageCircle, ReceiptText, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { PaymentPanel } from "@/components/public/payment-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

type PaymentPageProps = {
  params: Promise<{
    orderCode: string;
  }>;
};

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { orderCode } = await params;

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/templates"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke katalog
        </Link>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-start">
          <div>
            <Badge variant="outline">WhatsApp handoff</Badge>
            <h1 className="mt-5 text-4xl font-semibold tracking-normal sm:text-5xl">
              Lanjutkan konfirmasi pesanan via WhatsApp.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              Pesanan {orderCode} sudah masuk. Kirim kode ini ke WhatsApp supaya
              admin bisa cek data, memberi instruksi pembayaran, dan mulai
              mengatur antrean pengerjaan.
            </p>

            <div className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
              <Card>
                <CardContent className="flex items-start gap-3 p-5">
                  <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="leading-6 text-muted-foreground">
                    Link WhatsApp otomatis membawa kode pesanan, jadi chat tidak
                    perlu dimulai dari nol.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-start gap-3 p-5">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="leading-6 text-muted-foreground">
                    Pembayaran dikonfirmasi manual oleh admin sebelum status
                    pesanan dipindah ke pengerjaan.
                  </p>
                </CardContent>
              </Card>
              <Card className="sm:col-span-2">
                <CardContent className="flex items-start gap-3 p-5">
                  <ReceiptText className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="leading-6 text-muted-foreground">
                    Simpan kode {orderCode} untuk follow-up dan pengecekan status
                    pesanan berikutnya.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <PaymentPanel orderCode={orderCode} ctaLabel="Konfirmasi via WhatsApp" />
        </section>
      </div>
    </main>
  );
}
