import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileArchive,
  MessageCircle,
  MonitorSmartphone,
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
import { buildWhatsAppUrl } from "@/lib/whatsapp";

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
    title: "Konfirmasi via WA",
    description: "Kode pesanan dikirim ke WhatsApp untuk instruksi pembayaran manual.",
    icon: MessageCircle
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

const pricingPlans = [
  {
    title: "Personal",
    price: "79rb",
    unit: "mulai dari",
    description: "Untuk web personal singkat yang fokus ke satu momen.",
    estimate: "1-2 hari",
    features: [
      "Web permintaan maaf atau nembak",
      "Copywriting ringan dibantu rapikan",
      "Satu halaman hosted",
      "Konfirmasi dan revisi via WhatsApp"
    ],
    highlighted: false
  },
  {
    title: "Undangan",
    price: "149rb",
    unit: "mulai dari",
    description: "Paket paling pas untuk undangan online yang siap dibagikan.",
    estimate: "2-4 hari",
    features: [
      "Detail acara, galeri, lokasi, dan rekening",
      "Form data lengkap sebelum chat",
      "Link hosted siap sebar",
      "Update status pesanan tanpa login"
    ],
    highlighted: true
  },
  {
    title: "Bisnis",
    price: "299rb",
    unit: "mulai dari",
    description: "Landing page untuk produk, jasa, campaign, atau validasi ide.",
    estimate: "3-5 hari",
    features: [
      "Struktur landing page satu halaman",
      "CTA WhatsApp atau form prospek",
      "Section manfaat, produk, dan social proof",
      "Delivery hosted atau zip download"
    ],
    highlighted: false
  }
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
            Pilih template, isi data, konfirmasi lewat WhatsApp, lalu hasilnya
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
          description="Katalog, form dinamis, konfirmasi WhatsApp, dan dashboard admin dibuat saling nyambung supaya data pesanan tetap rapi."
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
              <MessageCircle className="h-5 w-5 text-secondary" />
              <p className="mt-4 text-sm font-semibold">Konfirmasi cepat</p>
              <p className="mt-2 text-sm leading-6 text-background/70">
                Instruksi pembayaran dikirim manual via WhatsApp setelah data order masuk.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow="Price list"
            title="Pilih paket seperti milih subscription, tapi ngobrolnya tetap manusia."
            description="Semua paket bisa langsung dibahas via WhatsApp. Kalau sudah yakin dengan template tertentu, lanjutkan lewat katalog supaya data order tersimpan rapi."
          />
          <Badge variant="outline" className="w-fit">
            Payment manual via WhatsApp
          </Badge>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {pricingPlans.map((plan) => {
            const whatsappUrl = buildWhatsAppUrl({
              templateName: plan.title,
              source: "Price list beranda"
            });

            return (
              <Card
                key={plan.title}
                className={cn(
                  "flex min-h-[520px] flex-col p-1",
                  plan.highlighted
                    ? "border-foreground bg-foreground text-background"
                    : "bg-card"
                )}
              >
                <CardHeader className="min-h-44">
                  <div className="flex items-start justify-between gap-3">
                    <Badge
                      variant={plan.highlighted ? "secondary" : "outline"}
                      className="w-fit"
                    >
                      {plan.highlighted ? "Paling sering dipilih" : plan.estimate}
                    </Badge>
                    {plan.highlighted ? (
                      <Sparkles className="h-5 w-5 text-secondary" />
                    ) : null}
                  </div>
                  <CardTitle className="pt-4 text-2xl">{plan.title}</CardTitle>
                  <CardDescription
                    className={cn(plan.highlighted && "text-background/70")}
                  >
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col">
                  <div className="mb-6">
                    <p
                      className={cn(
                        "text-sm",
                        plan.highlighted ? "text-background/60" : "text-muted-foreground"
                      )}
                    >
                      {plan.unit}
                    </p>
                    <p className="mt-1 text-4xl font-semibold tracking-normal">
                      {plan.price}
                    </p>
                    <p
                      className={cn(
                        "mt-2 text-sm",
                        plan.highlighted ? "text-background/60" : "text-muted-foreground"
                      )}
                    >
                      Estimasi pengerjaan {plan.estimate}
                    </p>
                  </div>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      buttonVariants({
                        variant: plan.highlighted ? "secondary" : "default",
                        size: "lg"
                      }),
                      "w-full"
                    )}
                  >
                    Chat paket ini
                    <MessageCircle />
                  </a>

                  <div className="mt-7 space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <CheckCircle2
                          className={cn(
                            "mt-0.5 h-4 w-4 shrink-0",
                            plan.highlighted ? "text-secondary" : "text-primary"
                          )}
                        />
                        <p
                          className={cn(
                            "text-sm leading-6",
                            plan.highlighted
                              ? "text-background/75"
                              : "text-muted-foreground"
                          )}
                        >
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
