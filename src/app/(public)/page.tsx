import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

const categories = [
  "Undangan pernikahan",
  "Web permintaan maaf",
  "Web nembak",
  "Landing page",
  "CRUD sederhana"
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground">
            <Sparkles className="h-4 w-4 text-secondary" />
            Template web custom, dikerjakan manual
          </div>

          <h1 className="text-4xl font-semibold tracking-normal text-foreground sm:text-6xl">
            Mauapalau bantu bikin web personal yang siap dibagikan.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Pilih template, isi data, bayar aman lewat Midtrans, lalu tunggu
            hasilnya dikirim sebagai link hosted atau file zip.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/templates"
              className="inline-flex h-12 items-center justify-center gap-2 bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Pilih template
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/cek-pesanan"
              className="inline-flex h-12 items-center justify-center border border-border bg-background px-5 text-sm font-semibold transition hover:bg-muted"
            >
              Cek pesanan
            </a>
          </div>
        </div>

        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <div key={category} className="border border-border bg-card p-4">
              <CheckCircle2 className="mb-4 h-5 w-5 text-primary" />
              <p className="text-sm font-medium">{category}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
