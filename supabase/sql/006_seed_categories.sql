-- Mauapalau Phase 3
-- Default categories. Safe to rerun.

insert into public.categories (
  slug,
  name,
  description,
  delivery_type,
  sort_order,
  is_active
)
values
  (
    'undangan',
    'Undangan Pernikahan',
    'Template undangan online dengan detail acara, galeri, dan lokasi.',
    'hosted',
    10,
    true
  ),
  (
    'maaf',
    'Web Permintaan Maaf',
    'Halaman personal untuk menyampaikan permintaan maaf dengan rapi.',
    'hosted',
    20,
    true
  ),
  (
    'nembak',
    'Web Nembak',
    'Halaman interaktif untuk menyampaikan perasaan secara personal.',
    'hosted',
    30,
    true
  ),
  (
    'landing-page',
    'Landing Page',
    'Halaman promosi untuk produk, jasa, event, atau campaign.',
    'download',
    40,
    true
  ),
  (
    'crud',
    'CRUD Sederhana',
    'Template aplikasi CRUD sederhana untuk kebutuhan internal.',
    'download',
    50,
    true
  )
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  delivery_type = excluded.delivery_type,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

