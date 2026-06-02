import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { SectionHeader } from "@/components/public/section-header";
import { TemplateCard } from "@/components/public/template-card";
import { buttonVariants } from "@/components/ui/button";
import { getCatalogTemplates } from "@/lib/templates";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const templates = await getCatalogTemplates();

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke beranda
        </Link>

        <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow="Template tersedia"
            title="Pilih template yang paling dekat dengan kebutuhan lu."
            description="Semua template diambil dari database Supabase. Katalog hanya menampilkan kategori dan template yang aktif."
          />
          <Link
            href="/cek-pesanan"
            className={cn(buttonVariants({ variant: "outline" }), "shrink-0")}
          >
            Cek pesanan
          </Link>
        </div>

        {templates.length > 0 ? (
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        ) : (
          <div className="mt-10 border border-border bg-card p-8">
            <h2 className="text-xl font-semibold">Belum ada template aktif.</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Template akan muncul setelah data aktif tersedia di tabel `templates`
              dan kategorinya juga aktif.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
