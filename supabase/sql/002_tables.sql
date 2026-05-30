-- Mauapalau Phase 3
-- Core tables. Jalankan setelah 001_extensions.sql.

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  delivery_type public.delivery_type not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_slug_format check (slug ~ '^[a-z0-9-]+$')
);

create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  slug text not null unique,
  name text not null,
  description text,
  price_idr integer not null,
  estimated_days_min integer not null default 1,
  estimated_days_max integer not null default 3,
  preview_image_path text,
  form_schema jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint templates_slug_format check (slug ~ '^[a-z0-9-]+$'),
  constraint templates_price_non_negative check (price_idr >= 0),
  constraint templates_estimated_days_valid check (
    estimated_days_min > 0
    and estimated_days_max >= estimated_days_min
  ),
  constraint templates_form_schema_array check (jsonb_typeof(form_schema) = 'array')
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.templates(id) on delete restrict,
  order_code text not null unique,
  customer_name text not null,
  customer_email citext not null,
  customer_whatsapp text,
  status public.order_status not null default 'pending_payment',
  form_data jsonb not null default '{}'::jsonb,
  amount_idr integer not null,
  midtrans_order_id text unique,
  midtrans_transaction_id text,
  midtrans_transaction_status text,
  midtrans_payment_type text,
  midtrans_raw_status jsonb,
  delivery_type public.delivery_type not null,
  delivery_slug text unique,
  delivery_url text,
  delivery_zip_path text,
  notes_customer text,
  notes_internal text,
  paid_at timestamptz,
  ready_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_order_code_format check (order_code ~ '^MP-[0-9]{8}-[A-Z0-9]{4,8}$'),
  constraint orders_delivery_slug_format check (
    delivery_slug is null or delivery_slug ~ '^[a-z0-9-]+$'
  ),
  constraint orders_amount_non_negative check (amount_idr >= 0),
  constraint orders_form_data_object check (jsonb_typeof(form_data) = 'object')
);

create table if not exists public.order_assets (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  kind public.asset_kind not null default 'customer_upload',
  field_name text not null,
  bucket_id text not null,
  object_path text not null,
  original_filename text,
  mime_type text,
  size_bytes bigint not null default 0,
  created_at timestamptz not null default now(),
  constraint order_assets_size_non_negative check (size_bytes >= 0),
  constraint order_assets_unique_object unique (bucket_id, object_path)
);

create table if not exists public.order_status_log (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  from_status public.order_status,
  to_status public.order_status not null,
  changed_by citext,
  note text,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists templates_set_updated_at on public.templates;
create trigger templates_set_updated_at
before update on public.templates
for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

