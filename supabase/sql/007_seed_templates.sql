-- Mauapalau Phase 3
-- Starter templates. Safe to rerun after 006_seed_categories.sql.

insert into public.templates (
  category_id,
  slug,
  name,
  description,
  price_idr,
  estimated_days_min,
  estimated_days_max,
  preview_image_path,
  form_schema,
  sort_order,
  is_active
)
values
  (
    (select id from public.categories where slug = 'undangan'),
    'undangan-minimalis',
    'Undangan Minimalis',
    'Undangan online bersih dengan detail acara, galeri, rekening, dan lokasi.',
    149000,
    2,
    4,
    'previews/undangan-minimalis.png',
    '[
      {"name":"nama_mempelai_pria","label":"Nama mempelai pria","type":"text","required":true},
      {"name":"nama_mempelai_wanita","label":"Nama mempelai wanita","type":"text","required":true},
      {"name":"tanggal_acara","label":"Tanggal acara","type":"date","required":true},
      {"name":"lokasi_acara","label":"Lokasi acara","type":"textarea","required":true},
      {"name":"foto_pasangan","label":"Foto pasangan","type":"file","required":false}
    ]'::jsonb,
    10,
    true
  ),
  (
    (select id from public.categories where slug = 'maaf'),
    'maaf-tulus',
    'Maaf Tulus',
    'Web permintaan maaf personal dengan pesan utama, foto, dan CTA balasan.',
    79000,
    1,
    2,
    'previews/maaf-tulus.png',
    '[
      {"name":"nama_penerima","label":"Nama penerima","type":"text","required":true},
      {"name":"pesan_maaf","label":"Pesan permintaan maaf","type":"textarea","required":true},
      {"name":"foto_kenangan","label":"Foto kenangan","type":"file","required":false}
    ]'::jsonb,
    20,
    true
  ),
  (
    (select id from public.categories where slug = 'landing-page'),
    'landing-validasi-produk',
    'Landing Validasi Produk',
    'Landing page satu halaman untuk validasi produk, jasa, atau campaign.',
    299000,
    3,
    5,
    'previews/landing-validasi-produk.png',
    '[
      {"name":"nama_brand","label":"Nama brand/produk","type":"text","required":true},
      {"name":"headline","label":"Headline utama","type":"text","required":true},
      {"name":"deskripsi_produk","label":"Deskripsi produk","type":"textarea","required":true},
      {"name":"cta_text","label":"Teks tombol CTA","type":"text","required":true}
    ]'::jsonb,
    30,
    true
  )
on conflict (slug) do update
set
  category_id = excluded.category_id,
  name = excluded.name,
  description = excluded.description,
  price_idr = excluded.price_idr,
  estimated_days_min = excluded.estimated_days_min,
  estimated_days_max = excluded.estimated_days_max,
  preview_image_path = excluded.preview_image_path,
  form_schema = excluded.form_schema,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

