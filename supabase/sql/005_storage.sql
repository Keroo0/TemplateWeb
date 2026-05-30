-- Mauapalau Phase 3
-- Private buckets. Upload/download is mediated by server API routes using service role.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values
  (
    'customer-uploads',
    'customer-uploads',
    false,
    5242880,
    array[
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf'
    ]
  ),
  (
    'delivery-zips',
    'delivery-zips',
    false,
    20971520,
    array[
      'application/zip',
      'application/x-zip-compressed'
    ]
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

update storage.buckets
set public = false
where id in ('customer-uploads', 'delivery-zips');

-- Keep storage.objects private for anon/authenticated users.
-- service_role bypasses RLS for server-mediated uploads and signed URL generation.
drop policy if exists "customer uploads are private" on storage.objects;
drop policy if exists "delivery zips are private" on storage.objects;
