# Supabase SQL Manual Setup

Folder ini berisi paket SQL manual untuk database Mauapalau. Owner project menjalankan file-file ini sendiri lewat Supabase Dashboard. Codex tidak menjalankan `supabase db push` dan tidak apply SQL ke remote tanpa instruksi eksplisit.

## Ringkasan Model Akses

- `categories` dan `templates`: katalog publik, hanya row aktif yang boleh dibaca `anon`/`authenticated`.
- `orders`, `order_assets`, dan `order_status_log`: private. Customer dan admin mengakses lewat API route server-side.
- Storage bucket `customer-uploads` dan `delivery-zips`: private. Upload/download dilakukan lewat server API memakai service role.
- Jangan simpan service role key, Midtrans key, Resend key, atau secret lain di file SQL atau repo.

## Urutan Eksekusi

Jalankan file ini satu per satu di Supabase SQL Editor, sesuai urutan:

```text
001_extensions.sql
002_tables.sql
003_indexes.sql
004_rls_policies.sql
005_storage.sql
006_seed_categories.sql
007_seed_templates.sql
```

## Cara Menjalankan di Supabase

1. Buka Supabase Dashboard.
2. Pilih project yang benar.
3. Buka menu SQL Editor.
4. Buat query baru.
5. Buka file `001_extensions.sql`, baca isinya, paste ke SQL Editor, lalu Run.
6. Ulangi untuk file berikutnya sampai `007_seed_templates.sql`.
7. Kalau satu file gagal, jangan lanjut file berikutnya. Baca error, perbaiki, lalu ulang file yang gagal.

## Verifikasi Setelah Eksekusi

Jalankan query berikut di SQL Editor:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'categories',
    'templates',
    'orders',
    'order_assets',
    'order_status_log'
  )
order by table_name;
```

Pastikan lima tabel muncul.

```sql
select relname, relrowsecurity
from pg_class
where relname in (
  'categories',
  'templates',
  'orders',
  'order_assets',
  'order_status_log'
)
order by relname;
```

Pastikan `relrowsecurity` bernilai `true` untuk semua tabel.

```sql
select slug, name, delivery_type, is_active
from public.categories
order by sort_order;
```

Pastikan kategori `undangan`, `maaf`, `nembak`, `landing-page`, dan `crud` muncul.

```sql
select slug, name, price_idr, is_active
from public.templates
order by sort_order;
```

Pastikan template awal seperti `undangan-minimalis` dan `maaf-tulus` muncul.

```sql
select id, public, file_size_limit
from storage.buckets
where id in ('customer-uploads', 'delivery-zips')
order by id;
```

Pastikan kedua bucket muncul dan `public = false`.

## Verifikasi dari Aplikasi

Setelah SQL selesai, generate database types:

```bash
npx supabase gen types typescript --linked > src/lib/supabase/database.types.ts
```

Jalankan verifikasi lokal:

```bash
npm run test:sql
npm run lint
npm run typecheck
npm run build
```

## Rollback Manual

Rollback hanya untuk development atau project kosong. Jangan rollback production berisi order nyata tanpa backup.

Urutan rollback:

```sql
drop table if exists public.order_status_log cascade;
drop table if exists public.order_assets cascade;
drop table if exists public.orders cascade;
drop table if exists public.templates cascade;
drop table if exists public.categories cascade;

drop type if exists public.asset_kind cascade;
drop type if exists public.order_status cascade;
drop type if exists public.delivery_type cascade;

delete from storage.buckets
where id in ('customer-uploads', 'delivery-zips');
```

Kalau bucket sudah berisi object, hapus object lewat Storage UI atau API dulu sebelum menghapus bucket.

## Catatan Penting

- RLS harus deny by default untuk data order customer.
- Public catalog hanya membaca row `is_active = true`.
- Mutasi data customer dilakukan lewat API route server-side, bukan direct browser write.
- Admin tetap divalidasi di aplikasi memakai Supabase Auth dan `ADMIN_EMAILS`.
- Jika ada perubahan schema, tambahkan file SQL baru dengan nomor berikutnya.
