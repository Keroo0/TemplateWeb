import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileArchive,
  MonitorSmartphone,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import Link from "next/link";

import { MotionReveal } from "@/components/public/motion-reveal";
import { SectionHeader } from "@/components/public/section-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const templates = [
  {
    title: "Undangan Pernikahan",
    description: "Link undangan elegan dengan detail acara, galeri, dan lokasi.",
    price: "Mulai 149rb",
    accent: "bg-secondary"
  },
  {
    title: "Web Permintaan Maaf",
    description: "Halaman personal yang hangat, jujur, dan gampang dibagikan.",
    price: "Mulai 79rb",
    accent: "bg-accent"
  },
  {
    title: "Landing Page",
    description: "Satu halaman rapi untuk validasi produk, jasa, atau campaign.",
    price: "Mulai 299rb",
    accent: "bg-primary"
  }
];

const steps = [
  {
    title: "Pilih template",
    description: "Cari format yang paling cocok: hosted link atau zip download.",
    icon: MonitorSmartphone
  },
  {
    title: "Isi data",
    description: "Masukkan teks, foto, preferensi warna, dan catatan khusus.",
    icon: Sparkles
  },
  {
    title: "Bayar aman",
    description: "Checkout lewat Midtrans Snap, lalu pesanan masuk antrean admin.",
    icon: CreditCard
  },
  {
    title: "Terima hasil",
    description: "Admin mengirim link web atau file zip ketika pengerjaan selesai.",
    icon: FileArchive
  }
];

const reasons = [
  "Copy default Bahasa Indonesia",
  "Dikerjakan manual, bukan generator mentah",
  "Bisa cek status tanpa login",
  "Delivery fleksibel: link hosted atau zip"
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <section className="relative mx-auto grid min-h-[92vh] w-full max-w-6xl items-center gap-12 px-6 py-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="absolute inset-x-6 top-8 flex items-center justify-between text-sm font-semibold">
          <Link href="/" className="tracking-normal">
            Mauapalau
          </Link>
          <Link
            href="/cek-pesanan"
            className="text-muted-foreground hover:text-foreground"
          >
            Cek pesanan
          </Link>
        </div>

        <MotionReveal className="pt-20">
          <Badge variant="outline" className="mb-6 gap-2">
            <Sparkles className="h-3.5 w-3.5 text-secondary" />
            Template web custom, dikerjakan manual
          </Badge>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-foreground sm:text-6xl">
            Web personal yang kelihatan niat, tanpa ribet mulai dari nol.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Pilih template, isi data, bayar aman lewat Midtrans, lalu hasilnya
            dikirim sebagai link hosted atau file zip yang siap dibagikan.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/templates" className={cn(buttonVariants({ size: "lg" }))}>
              Pilih template
              <ArrowRight />
            </Link>
            <Link
              href="/cek-pesanan"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Cek pesanan
            </Link>
          </div>
        </MotionReveal>

        <MotionReveal
          delay={0.12}
          className="relative grid gap-4 pt-2 sm:grid-cols-2 lg:pt-20"
        >
          {templates.map((template) => (
            <Card
              key={template.title}
              className="relative min-h-52 overflow-hidden p-1 shadow-sm"
            >
              <div className={cn("h-2 w-full", template.accent)} />
              <CardHeader>
                <CardTitle>{template.title}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-semibold">{template.price}</p>
              </CardContent>
            </Card>
          ))}
        </MotionReveal>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-14 md:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <MotionReveal key={step.title} delay={index * 0.06}>
                <div className="flex h-full flex-col border border-border bg-background p-5">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-5 text-base font-semibold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </MotionReveal>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeader
          eyebrow="Cara kerja"
          title="Flow order dibuat pendek supaya customer nggak hilang di tengah jalan."
          description="Phase berikutnya akan menyambungkan katalog, form dinamis, pembayaran, dan dashboard admin ke database Supabase."
        />

        <div className="grid gap-3 sm:grid-cols-2">
          {reasons.map((reason) => (
            <Card key={reason}>
              <CardContent className="flex items-start gap-3 p-5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm font-medium leading-6">{reason}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-foreground text-background">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1fr_0.8fr]">
          <SectionHeader
            eyebrow="Template populer"
            title="Mulai dari momen personal sampai landing page yang siap jualan."
            description="Katalog final nanti akan diambil dari database dan disesuaikan dengan form_schema tiap template."
            className="[&_div]:border-background/20 [&_div]:bg-background/10 [&_h2]:text-background [&_p]:text-background/70"
          />

          <div className="grid gap-4">
            <div className="border border-background/15 p-5">
              <Clock3 className="h-5 w-5 text-secondary" />
              <p className="mt-4 text-sm font-semibold">Estimasi jelas</p>
              <p className="mt-2 text-sm leading-6 text-background/70">
                Customer tahu status pesanan dan admin punya ruang kerja manual.
              </p>
            </div>
            <div className="border border-background/15 p-5">
              <ShieldCheck className="h-5 w-5 text-secondary" />
              <p className="mt-4 text-sm font-semibold">Pembayaran aman</p>
              <p className="mt-2 text-sm leading-6 text-background/70">
                Midtrans Snap dipakai untuk checkout, webhook diverifikasi di server.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 border border-border bg-card p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <Badge variant="secondary">Kenapa Mauapalau</Badge>
            <h2 className="mt-4 text-3xl font-semibold">
              Siap bikin web yang terasa personal?
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Fondasi UI sudah disiapkan untuk katalog, order form, payment, dan
              admin dashboard yang konsisten.
            </p>
          </div>
          <Link href="/templates" className={cn(buttonVariants({ size: "lg" }))}>
            Lihat katalog
            <ArrowRight />
          </Link>
        </div>
      </section>
    </main>
  );
}
