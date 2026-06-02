import { ArrowLeft, ArrowRight, Clock3, Database, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTemplateBySlug } from "@/lib/templates";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type TemplateDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(price);
}

export default async function TemplateDetailPage({ params }: TemplateDetailPageProps) {
  const { slug } = await params;
  const template = await getTemplateBySlug(slug);

  if (!template) {
    notFound();
  }

  const fieldCount = Array.isArray(template.form_schema)
    ? template.form_schema.length
    : 0;

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/templates"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke katalog
        </Link>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.75fr]">
          <div>
            <Badge variant="outline">{template.category.name}</Badge>
            <h1 className="mt-5 text-4xl font-semibold tracking-normal sm:text-5xl">
              {template.name}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              {template.description}
            </p>
          </div>

          <Card>
            <CardContent className="space-y-5 p-6">
              <div>
                <p className="text-sm text-muted-foreground">Harga</p>
                <p className="mt-1 text-3xl font-semibold">
                  {formatPrice(template.price_idr)}
                </p>
              </div>

              <div className="grid gap-3 text-sm">
                <p className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-primary" />
                  {template.estimated_days_min}-{template.estimated_days_max} hari pengerjaan
                </p>
                <p className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  {fieldCount} field form_schema
                </p>
                <p className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  Delivery {template.delivery_type === "hosted" ? "link hosted" : "zip download"}
                </p>
              </div>

              <Link
                href={`/order?template=${template.slug}`}
                className={cn(buttonVariants({ size: "lg" }), "w-full")}
              >
                Pesan template
                <ArrowRight />
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
