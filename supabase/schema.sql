-- Lumé — Supabase schema
--
-- Optional. The store runs fully from the seed catalog in src/lib/products.ts
-- with zero database. Apply this when you want to add/edit products live (no
-- redeploy) and to persist orders from the Stripe webhook.
--
-- RLS model:
--   products — public SELECT (the storefront reads it with the anon key).
--              Writes happen only via the service-role key (admin API / webhook).
--   orders   — no public access at all. Inserted by the webhook using the
--              service-role key; never readable by anon.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id                text primary key,
  slug              text unique not null,
  name              text not null,
  tagline           text default '',
  description       text default '',
  category          text not null default 'wellness',
  tags              text[] not null default '{}',
  price_cents       integer not null check (price_cents >= 0),
  compare_at_cents  integer,
  rating            numeric(2,1) not null default 4.7,
  reviews           integer not null default 0,
  badges            text[] not null default '{}',
  benefits          text[] not null default '{}',
  how_to_use        text default '',
  hue               integer not null default 260,
  emoji             text not null default '✨',
  accent            text not null default '#a78bfa',
  image             text,
  featured          boolean not null default false,
  viral             boolean not null default false,
  in_stock          boolean not null default true,
  sort              integer not null default 0,
  created_at        timestamptz not null default now()
);

alter table public.products enable row level security;

-- Anyone can read the catalog (it's public storefront data).
drop policy if exists "products are publicly readable" on public.products;
create policy "products are publicly readable"
  on public.products for select
  to anon, authenticated
  using (true);

-- No anon INSERT/UPDATE/DELETE policies → writes require the service-role key.

create index if not exists products_category_idx on public.products (category);
create index if not exists products_featured_idx on public.products (featured);

-- ---------------------------------------------------------------------------
-- Orders (written by the Stripe webhook via service role)
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  stripe_event_id    text unique,
  stripe_session_id  text,
  email              text,
  name               text,
  amount_total       integer,
  currency           text,
  status             text not null default 'paid',
  items              jsonb
);

alter table public.orders enable row level security;
-- Intentionally NO policies → the anon key can neither read nor write orders.
-- Only the service-role key (which bypasses RLS) touches this table.

-- ---------------------------------------------------------------------------
-- Seed a product. Run once; safe to re-run (upsert by id). Example:
--
-- insert into public.products (id, slug, name, tagline, category, price_cents,
--   compare_at_cents, rating, reviews, badges, hue, emoji, accent, featured, viral)
-- values ('p-glacier-globes','glacier-ice-globes','Glacier Ice Globes',
--   'Cold-therapy facial in 5 minutes.','skincare-tools',3800,5200,4.8,2143,
--   '{"Viral on TikTok","Bestseller"}',190,'🧊','#38bdf8',true,true)
-- on conflict (id) do update set price_cents = excluded.price_cents;
-- ---------------------------------------------------------------------------
