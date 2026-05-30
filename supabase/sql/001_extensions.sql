-- Mauapalau Phase 3
-- Jalankan pertama. File ini aman diulang.

create extension if not exists pgcrypto;
create extension if not exists citext;

do $$
begin
  create type public.delivery_type as enum ('hosted', 'download');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.order_status as enum (
    'pending_payment',
    'paid',
    'in_progress',
    'ready',
    'delivered',
    'cancelled',
    'expired'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.asset_kind as enum (
    'customer_upload',
    'delivery_zip'
  );
exception
  when duplicate_object then null;
end $$;

