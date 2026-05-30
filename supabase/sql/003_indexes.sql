-- Mauapalau Phase 3
-- Indexes for catalog, order lookup, admin filters, and delivery resolution.

create index if not exists categories_active_sort_idx
  on public.categories (is_active, sort_order, name);

create index if not exists templates_category_active_sort_idx
  on public.templates (category_id, is_active, sort_order, name);

create index if not exists templates_active_price_idx
  on public.templates (is_active, price_idr);

create index if not exists orders_customer_email_idx
  on public.orders (customer_email);

create index if not exists orders_status_created_at_idx
  on public.orders (status, created_at desc);

create index if not exists orders_midtrans_order_id_idx
  on public.orders (midtrans_order_id);

create unique index if not exists orders_delivery_slug_unique_idx
  on public.orders (delivery_slug)
  where delivery_slug is not null;

create index if not exists order_assets_order_kind_idx
  on public.order_assets (order_id, kind);

create index if not exists order_status_log_order_created_at_idx
  on public.order_status_log (order_id, created_at desc);

