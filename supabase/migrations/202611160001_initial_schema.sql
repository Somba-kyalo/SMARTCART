-- SmartCart Africa foundation schema.
-- Apply this migration in Supabase before enabling database-backed commerce.

create extension if not exists pgcrypto;

create type public.user_role as enum ('customer', 'admin');
create type public.order_status as enum (
  'pending', 'payment_pending', 'paid', 'processing', 'awaiting_supplier',
  'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'
);
create type public.payment_status as enum ('pending', 'processing', 'paid', 'failed', 'refunded');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role public.user_role not null default 'customer',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text not null default '',
  specifications jsonb not null default '{}'::jsonb,
  price_kes integer not null check (price_kes >= 0),
  compare_at_price_kes integer check (compare_at_price_kes is null or compare_at_price_kes >= price_kes),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  alt_text text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  full_name text not null,
  phone text not null,
  county text not null,
  town text not null,
  address_line text not null,
  delivery_instructions text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  email text not null,
  status public.order_status not null default 'pending',
  currency text not null default 'KES' check (currency = 'KES'),
  subtotal_kes integer not null check (subtotal_kes >= 0),
  delivery_fee_kes integer not null default 0 check (delivery_fee_kes >= 0),
  total_kes integer generated always as (subtotal_kes + delivery_fee_kes) stored,
  delivery_details jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_price_kes integer not null check (unit_price_kes >= 0),
  quantity integer not null check (quantity > 0),
  line_total_kes integer generated always as (unit_price_kes * quantity) stored
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null default 'intasend',
  provider_reference text unique,
  status public.payment_status not null default 'pending',
  amount_kes integer not null check (amount_kes >= 0),
  raw_response jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_id_idx on public.products(category_id);
create index products_published_idx on public.products(is_published, created_at desc);
create index product_images_product_id_idx on public.product_images(product_id, sort_order);
create index addresses_user_id_idx on public.addresses(user_id);
create index orders_user_id_idx on public.orders(user_id, created_at desc);
create index orders_status_idx on public.orders(status, created_at desc);
create index order_items_order_id_idx on public.order_items(order_id);
create index payments_order_id_idx on public.payments(order_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and is_active = true
  );
$$;

create policy "Users can view their profile" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "Users can update their profile" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
create policy "Public can view published categories" on public.categories
  for select using (is_published = true or public.is_admin());
create policy "Admins manage categories" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Public can view published products" on public.products
  for select using (is_published = true or public.is_admin());
create policy "Admins manage products" on public.products
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Public can view images for published products" on public.product_images
  for select using (exists (
    select 1 from public.products p where p.id = product_id and (p.is_published or public.is_admin())
  ));
create policy "Admins manage product images" on public.product_images
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Users manage their addresses" on public.addresses
  for all using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());
create policy "Users view their orders" on public.orders
  for select using (user_id = auth.uid() or public.is_admin());
create policy "Admins manage orders" on public.orders
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Users view their order items" on public.order_items
  for select using (exists (
    select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())
  ));
create policy "Admins manage order items" on public.order_items
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Users view their payments" on public.payments
  for select using (exists (
    select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())
  ));
create policy "Admins manage payments" on public.payments
  for all using (public.is_admin()) with check (public.is_admin());
