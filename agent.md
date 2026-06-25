# CLAUDE.md

Panduan untuk Claude Code saat bekerja di repo ini.

## Tentang Proyek

**Mauapalau** — platform jasa custom template web. Customer pilih template (undangan pernikahan, web permintaan maaf, web nembak, landing page, CRUD), isi form data, konfirmasi pembayaran via WhatsApp, lalu admin (pemilik) kerjakan manual dan deliver hasilnya (link hosted atau zip download).

**Target pasar**: Indonesia. Semua copy default Bahasa Indonesia.

## Tech Stack

- **Next.js 15** (App Router) + **TypeScript** (strict mode)
- **Tailwind CSS** + **shadcn/ui**
- **21.dev** sebagai referensi dan sumber komponen UI React/Tailwind/shadcn-style
- **Framer Motion** untuk animasi UI yang ringan dan conversion-friendly
- **Supabase** (Postgres + Auth + Storage)
- **WhatsApp handoff** untuk konfirmasi pembayaran manual
- **Resend** (email)
- **Vercel** (hosting)
- Forms: **react-hook-form** + **zod**

## Struktur Folder

```
src/
  app/
    (public)/           # Halaman publik (landing, katalog, order, cek-pesanan)
    u/[slug]/           # Renderer template hosted (undangan/maaf/nembak)
    admin/              # Dashboard admin (proteksi auth)
    api/                # Route handlers (orders dan endpoint server-side lain)
  components/
    ui/                 # shadcn primitives
    public/             # Komponen halaman publik
    admin/              # Komponen admin
  templates/            # Renderer per template (lihat src/templates/registry.ts)
    undangan/[nama]/
    maaf/[nama]/
    nembak/[nama]/
  lib/
    supabase/           # Client server & browser
    whatsapp.ts         # Helper nomor dan link WhatsApp
    email.ts            # Resend wrapper
    form-schema.ts      # form_schema (JSON) -> zod schema
    order-code.ts       # Generator order code
  middleware.ts         # Proteksi /admin
supabase/sql/           # File SQL manual setup + instruksi apply database
```

## Database

Database disiapkan sebagai paket SQL manual. Jangan apply schema langsung ke remote Supabase tanpa instruksi eksplisit dari pemilik project. Buat file SQL di `supabase/sql/` beserta README yang menjelaskan urutan eksekusi, variable yang perlu diganti, dan langkah verifikasi.

Skema utama:
- `categories` — 5 kategori (undangan, maaf, nembak, landing-page, crud), kolom `delivery_type` = `hosted` | `download`.
- `templates` — item katalog, punya `form_schema` (jsonb) yang men-drive form order dinamis.
- `orders` — pesanan customer, identifikasi pakai `order_code` (cek status tanpa login).
- `order_assets` — file upload customer (foto, dll.) di Supabase Storage.
- `order_status_log` — audit trail status.

**RLS**: deny by default. Semua mutasi customer lewat API routes pakai service role. Customer cek status via API yang verifikasi `email + order_code`. Admin lewat Supabase Auth + email whitelist di `ADMIN_EMAILS`.

## Aturan Penting

### Workflow Fitur, TDD, dan GitHub
- Untuk setiap fitur baru, mulai dari skenario TDD sebelum implementasi. Minimal tulis skenario terbaik (happy path) dan skenario terburuk (error/edge/security path) yang relevan dengan fitur.
- Implementasi dianggap selesai hanya setelah test/verification yang sesuai dijalankan, misalnya `npm run lint`, `npm run typecheck`, `npm run build`, unit test, integration test, atau Playwright test sesuai risiko fitur.
- Setelah fitur selesai dan verifikasi lewat, commit perubahan dengan pesan yang jelas lalu push ke GitHub remote `origin`, kecuali pemilik project meminta untuk tidak push.
- Jika push gagal karena auth/network, laporkan jelas status commit lokal dan langkah yang perlu dilakukan.
- Jangan commit secret, `.env`, service role key, Supabase access token, atau file lokal sensitif.
- Jika ada perubahan user yang tidak terkait, jangan revert. Commit hanya file yang relevan dengan fitur yang dikerjakan.

### Bahasa & Copy
- **Default UI** = Bahasa Indonesia. Hindari campur Inggris kecuali istilah teknis yang umum (login, upload, dst.).
- Pesan error untuk customer harus ramah dan jelas, jangan tampilkan stacktrace.

### UI, Komponen, dan Animasi
- Gunakan shadcn/ui sebagai primitive utama, lalu adaptasi komponen dari 21.dev bila cocok dengan kebutuhan halaman.
- Komponen dari 21.dev harus disesuaikan dengan brand Mauapalau, Bahasa Indonesia, aksesibilitas, dan struktur data project. Jangan tempel mentah bila membuat bundle berat atau UX tidak konsisten.
- Gunakan Framer Motion untuk micro-interactions, modal/dialog, step order, template preview, page transition, list enter/exit, dan feedback state.
- Animasi harus halus, cepat, dan membantu pemahaman. Hindari animasi berlebihan di flow pembayaran, form order, dan halaman admin yang butuh efisiensi.
- Pastikan semua animasi punya state yang aman untuk mobile, tidak menyebabkan layout shift besar, dan tetap nyaman untuk user yang sensitif terhadap motion.

### Payment Manual & WhatsApp
- Payment aktif diarahkan ke WhatsApp memakai `NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER`.
- Order baru tetap berstatus `pending_payment` sampai admin mengonfirmasi pembayaran secara manual.
- Jangan menandai order `paid` dari input customer atau query string publik.
- Link WhatsApp dibuat lewat `src/lib/whatsapp.ts` supaya format nomor dan pesan konsisten.

### Form Dinamis
- `form_schema` di tabel `templates` adalah sumber kebenaran untuk field form order.
- Convert ke zod schema lewat `src/lib/form-schema.ts` — dipakai client (react-hook-form) dan server (validasi API).
- Saat order dibuat, snapshot `form_data` ke `orders.form_data` — JANGAN ubah ini setelah order paid.

### Template Renderer
- Setiap template hosted = 1 folder di `src/templates/[kategori]/[nama]/` dengan `index.tsx` yang menerima prop `{data}`.
- Daftarkan di `src/templates/registry.ts` dengan `dynamic()` import (code splitting per template).
- Slug `delivery_slug` di `orders` harus unik global (validasi di server saat admin set).

### File Upload
- Max 5MB per file, 20MB total per order. Enforce di client (DX) dan server (security).
- Path Storage: `customer-uploads/{order_code}/{field_name}-{filename}` untuk asset customer, `delivery-zips/{order_code}.zip` untuk zip hasil.
- Signed URL untuk download zip (expire 7 hari).

### Admin
- Proteksi `/admin/*` lewat `src/middleware.ts` — cek session Supabase Auth + email di whitelist.
- Tidak pernah expose service role key ke client.
- Semua perubahan status order harus log ke `order_status_log` dengan `changed_by`.

### Keamanan
- Service role key Supabase **hanya** di server (API routes). Browser pakai anon key + RLS.
- Validasi semua input user dengan zod di API route, jangan andalkan client validation.
- Sanitize `delivery_slug` (regex `^[a-z0-9-]+$`).

## Perintah Umum

```bash
npm run dev              # Dev server (port 3000)
npm run build            # Build production
npm run lint             # ESLint
npm run typecheck        # tsc --noEmit
npx supabase db push     # Hanya jika pemilik project minta apply otomatis
npx supabase gen types typescript --linked > src/lib/supabase/database.types.ts
```

## Workflow Tambah Template Baru

1. Buat folder `src/templates/[kategori]/[nama]/`.
2. Buat `index.tsx` yang export default React component menerima `{data}`.
3. Daftarkan di `src/templates/registry.ts`.
4. Buat `preview.png` (screenshot demo).
5. Insert row di tabel `templates` lewat admin dashboard (atau migration kalau seeding).

## Yang HARUS Dihindari

- Jangan membuat payment gateway baru tanpa keputusan produk eksplisit dari owner.
- Jangan simpan kartu/credential pembayaran customer di DB.
- Jangan expose `notes_internal` (catatan admin) ke endpoint publik.
- Jangan hard-code template list — selalu dari DB + registry.
- Jangan mengubah status pembayaran dari endpoint publik tanpa validasi admin.

## Referensi

- Plan awal: `~/.claude/plans/saya-sedang-ada-plan-delegated-bentley.md`
- WhatsApp click to chat: https://faq.whatsapp.com/5913398998672934
- Supabase Next.js SSR: https://supabase.com/docs/guides/auth/server-side/nextjs
