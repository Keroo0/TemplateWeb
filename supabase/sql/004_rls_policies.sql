-- Mauapalau Phase 3
-- RLS policy model:
-- - categories/templates active rows are readable by public catalog.
-- - orders/assets/status logs remain private and are accessed via server API service role.
-- - service_role bypasses RLS. Do not expose service role keys to clients.

grant usage on schema public to anon, authenticated;

grant select on public.categories to anon, authenticated;
grant select on public.templates to anon, authenticated;

grant select, insert, update, delete on public.categories to service_role;
grant select, insert, update, delete on public.templates to service_role;
grant select, insert, update, delete on public.orders to service_role;
grant select, insert, update, delete on public.order_assets to service_role;
grant select, insert, update, delete on public.order_status_log to service_role;

alter table public.categories enable row level security;
alter table public.templates enable row level security;
alter table public.orders enable row level security;
alter table public.order_assets enable row level security;
alter table public.order_status_log enable row level security;

drop policy if exists "public can read active categories" on public.categories;
create policy "public can read active categories"
on public.categories
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "public can read active templates" on public.templates;
create policy "public can read active templates"
on public.templates
for select
to anon, authenticated
using (
  is_active = true
  and exists (
    select 1
    from public.categories
    where categories.id = templates.category_id
      and categories.is_active = true
  )
);

-- Intentionally no anon/authenticated policies for:
-- public.orders, public.order_assets, public.order_status_log.
-- Customer status checks must go through an API route that verifies email + order_code.
-- Admin mutations must go through server-side routes using service role.

