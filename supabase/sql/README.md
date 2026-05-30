# Supabase SQL Manual Setup

Folder ini disiapkan untuk file SQL database Mauapalau. Owner project akan menjalankan SQL sendiri lewat Supabase Dashboard.

## Cara Pakai Nanti

1. Buka Supabase Dashboard.
2. Pilih project yang benar.
3. Buka SQL Editor.
4. Jalankan file SQL sesuai urutan angka filename.
5. Setelah semua selesai, verifikasi tabel, RLS policy, storage bucket, dan seed data.
6. Baru generate database types untuk aplikasi.

## Format File

Gunakan urutan seperti ini:

```text
001_extensions.sql
002_tables.sql
003_indexes.sql
004_rls_policies.sql
005_storage.sql
006_seed_categories.sql
007_seed_templates.sql
```

## Catatan Penting

- Jangan jalankan SQL di production sebelum membaca isi file.
- Jangan simpan service role key di file SQL atau repo.
- RLS harus deny by default.
- Mutasi data customer dilakukan lewat API route server-side, bukan direct browser write.
- Kalau ada perubahan schema, tambahkan file SQL baru dengan nomor berikutnya.
