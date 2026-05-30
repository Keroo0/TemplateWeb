# Mauapalau Production Roadmap

Dokumen ini adalah urutan kerja dari repo kosong sampai production. Database akan disiapkan sebagai file SQL manual di `supabase/sql/`, lalu owner project yang menjalankan sendiri di Supabase.

## Phase 0 - Fondasi Produk

- Kunci scope MVP: landing page, katalog template, order form, pembayaran Midtrans, cek status pesanan, admin dashboard, dan delivery link/zip.
- Tetapkan kategori awal: undangan, maaf, nembak, landing-page, dan CRUD.
- Tetapkan status order: `pending_payment`, `paid`, `in_progress`, `ready`, `delivered`, `cancelled`, `expired`.
- Siapkan copy Bahasa Indonesia untuk flow customer: landing, katalog, form order, payment, status, dan email.
- Buat `.env.example` yang memuat Supabase, Midtrans, Resend, admin emails, dan app URL.

## Phase 0.5 - Workflow Engineering

- Setiap fitur baru dimulai dengan TDD scenario list sebelum implementasi.
- Minimal setiap fitur punya skenario terbaik dan skenario terburuk:
  - skenario terbaik: user/admin menjalankan flow normal sampai sukses,
  - skenario terburuk: input invalid, akses tidak sah, webhook duplikat, upload terlalu besar, pembayaran gagal, atau dependency eksternal error sesuai konteks fitur.
- Pilih level test sesuai risiko: unit test untuk pure logic, integration test untuk API/database boundary, dan Playwright/manual QA untuk flow UI utama.
- Setelah fitur selesai, jalankan verification yang relevan: `npm run lint`, `npm run typecheck`, `npm run build`, dan test spesifik fitur.
- Commit perubahan fitur dengan pesan jelas dan push ke GitHub remote `origin`.
- Jika database berubah, commit file SQL dan instruksi di `supabase/sql/`, tapi owner tetap menjalankan SQL manual sendiri.

## Phase 1 - Scaffold Next.js

- Buat app Next.js 15 dengan App Router, TypeScript strict mode, dan struktur `src/`.
- Install Tailwind CSS, shadcn/ui, lucide-react, react-hook-form, zod, Framer Motion, Supabase client/server SDK, Midtrans helper, dan Resend.
- Setup alias import, format linting, dan script dasar: `dev`, `build`, `lint`, `typecheck`.
- Buat layout dasar publik dan admin.
- Pastikan project bisa jalan lokal dengan `npm run dev`.

## Phase 2 - Design System dan UI

- Setup shadcn/ui sebagai primitive utama.
- Gunakan 21.dev sebagai referensi komponen untuk section landing, pricing/card, template gallery, stepper order, empty state, admin table, dan modal.
- Adaptasi komponen agar sesuai brand Mauapalau: Bahasa Indonesia, mobile-first, cepat dibaca, dan conversion-friendly.
- Gunakan Framer Motion untuk animasi ringan: page transition, reveal katalog, hover/tap card, modal, step form, dan status feedback.
- Hindari animasi besar pada pembayaran dan admin workflow yang butuh stabilitas.

## Phase 3 - Database Manual Setup Package

- Buat folder `supabase/sql/`.
- Pecah SQL menjadi file berurutan, contoh:
  - `001_extensions.sql`
  - `002_tables.sql`
  - `003_indexes.sql`
  - `004_rls_policies.sql`
  - `005_storage.sql`
  - `006_seed_categories.sql`
  - `007_seed_templates.sql`
- Tambahkan `supabase/sql/README.md` dengan instruksi lengkap:
  - urutan menjalankan file SQL,
  - tempat menjalankannya di Supabase SQL Editor,
  - env/config yang perlu disiapkan,
  - cara verifikasi tabel, RLS, bucket, dan seed data,
  - cara rollback manual bila diperlukan.
- Jangan menjalankan `supabase db push` ke remote kecuali owner project meminta secara eksplisit.

## Phase 4 - Supabase Integration

- Buat server client dan browser client Supabase di `src/lib/supabase/`.
- Generate atau tulis types database setelah owner selesai setup schema.
- Implement auth admin dengan Supabase Auth.
- Proteksi `/admin` lewat middleware dan whitelist `ADMIN_EMAILS`.
- Pastikan service role key hanya dipakai di server route.

## Phase 5 - Katalog Template

- Buat halaman landing dan katalog template.
- Ambil kategori dan template dari database.
- Buat detail template berisi preview, harga, estimasi pengerjaan, delivery type, dan CTA order.
- Gunakan registry template di `src/templates/registry.ts` untuk hosted templates.
- Jangan hard-code list template di UI final.

## Phase 6 - Dynamic Order Form

- Gunakan `templates.form_schema` sebagai sumber field.
- Buat converter JSON schema internal ke zod schema di `src/lib/form-schema.ts`.
- Validasi form di client dengan react-hook-form dan zod.
- Validasi ulang di API route sebelum membuat order.
- Support upload file dengan limit 5MB per file dan 20MB total per order.
- Snapshot `form_data` ke `orders.form_data` saat order dibuat.

## Phase 7 - Midtrans Payment

- Buat API route untuk membuat order dan Snap token.
- Integrasikan Midtrans Snap di client.
- Simpan `midtrans_order_id`, gross amount, transaction status, dan payment metadata.
- Buat webhook route yang idempotent.
- Webhook wajib verify signature dan re-check status ke Midtrans API sebelum update order.
- Buat halaman payment success/pending/error yang ramah dalam Bahasa Indonesia.

## Phase 8 - Admin Dashboard

- Buat dashboard ringkas: total order, status order, order terbaru, dan quick filters.
- Buat order list dengan search by order code/email/status.
- Buat detail order berisi data customer, file upload, payment info, status log, internal notes, dan delivery controls.
- Admin bisa update status, set delivery link/slug, upload zip, dan kirim notifikasi.
- Semua perubahan status masuk ke `order_status_log`.

## Phase 9 - Template Renderer dan Delivery

- Buat route `u/[slug]` untuk hosted delivery.
- Resolve slug dari order yang statusnya ready/delivered.
- Render component dari `src/templates/registry.ts` dengan data snapshot order.
- Untuk delivery zip, gunakan Supabase Storage signed URL yang expire 7 hari.
- Pastikan data internal admin tidak pernah muncul di route publik.

## Phase 10 - Email

- Setup Resend wrapper di `src/lib/email.ts`.
- Kirim email untuk order created, payment paid, order in progress, order ready, dan delivery.
- Email default Bahasa Indonesia.
- Jangan bocorkan detail internal atau stacktrace di email.

## Phase 11 - Testing dan QA

- Jalankan `npm run lint`, `npm run typecheck`, dan `npm run build`.
- Test manual flow customer: katalog -> order -> upload -> payment sandbox -> cek status.
- Test manual flow admin: login -> lihat order -> update status -> delivery.
- Test webhook Midtrans sandbox dengan payload valid dan duplicate event.
- Test RLS: anon tidak bisa membaca data private.
- Test mobile viewport untuk landing, katalog, order form, payment, dan cek status.

## Phase 12 - Production Deploy

- Buat project Vercel.
- Set environment variables production.
- Owner menjalankan SQL manual di Supabase production sesuai `supabase/sql/README.md`.
- Set Midtrans production keys dan webhook URL.
- Set domain production.
- Jalankan final build dan smoke test.
- Aktifkan monitoring dasar: Vercel logs, Supabase logs, dan Midtrans dashboard.

## Definition of Done

- Customer bisa memilih template, mengisi data, membayar, dan mengecek status.
- Admin bisa melihat order, memproses order, dan mengirim delivery.
- Payment webhook aman, verified, dan idempotent.
- Database setup bisa diulang dari folder SQL dan README tanpa menebak langkah.
- UI berbahasa Indonesia, mobile-friendly, dan animasi Framer Motion tidak mengganggu flow utama.
