-- Vertex AI — Supabase schema (for reference / reproducibility)
-- Applied to project: neuaiogsdvhpwmnrtxgl
-- RLS model:
--   leads    — anonymous INSERT only (validated); never publicly SELECTable.
--   clients  — public SELECT (demo/operational data).
--   projects — public SELECT (demo/operational data).
--   new_leads_count() — SECURITY DEFINER aggregate; exposes a count only (no PII).

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  company     text,
  reason      text,
  budget      text,
  message     text not null,
  status      text not null default 'new'
);
alter table public.leads enable row level security;

create policy "anon can submit valid leads"
  on public.leads for insert to anon, authenticated
  with check (
    char_length(name) between 1 and 200
    and char_length(email) between 3 and 320
    and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    and char_length(message) between 1 and 5000
    and (company is null or char_length(company) <= 200)
    and (reason is null or char_length(reason) <= 100)
    and (budget is null or char_length(budget) <= 50)
  );

create table if not exists public.clients (
  id text primary key, name text not null, industry text not null,
  status text not null, since date
);
create table if not exists public.projects (
  id text primary key, client text not null, engagement text not null,
  status text not null, progress int not null default 0, owner text not null,
  value text not null, due text not null, sort int not null default 0
);
alter table public.clients enable row level security;
alter table public.projects enable row level security;
create policy "public can read clients"  on public.clients  for select to anon, authenticated using (true);
create policy "public can read projects" on public.projects for select to anon, authenticated using (true);

create or replace function public.new_leads_count()
returns integer language sql security definer set search_path = public as $$
  select count(*)::int from public.leads where created_at > now() - interval '30 days';
$$;
grant execute on function public.new_leads_count() to anon, authenticated;
