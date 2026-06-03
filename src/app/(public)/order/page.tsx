import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderForm } from "@/components/public/order-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getTemplateBySlug } from "@/lib/templates";

type OrderPageProps = {
  searchParams: Promise<{
    template?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function OrderPage({ searchParams }: OrderPageProps) {
  const { template: templateSlug } = await searchParams;

  if (!templateSlug) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6">
        <Card>
          <CardContent className="p-6">
            <Badge variant="outline">Pilih template dulu</Badge>
            <h1 className="mt-4 text-3xl font-semibold">
              Pesanan butuh template aktif.
            </h1>
            <p className="mt-3 text-muted-foreground">
              Buka katalog, pilih template, lalu lanjutkan ke form order.
            </p>
            <Link className="mt-5 inline-flex text-sm font-semibold" href="/templates">
              Lihat katalog
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const template = await getTemplateBySlug(templateSlug);

  if (!template) {
    notFound();
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <Badge variant="outline">{template.category.name}</Badge>
        <h1 className="mt-4 text-4xl font-semibold">Order {template.name}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Isi data sesuai form_schema template. Setelah order dibuat, pembayaran
          Midtrans akan disambungkan di Phase 7.
        </p>

        <Card className="mt-8">
          <CardContent className="p-6">
            <OrderForm template={template} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
