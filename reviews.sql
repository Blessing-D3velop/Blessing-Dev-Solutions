-- =====================================================================
-- BlessingDevs reviews database
-- Paste this WHOLE file into Supabase > SQL Editor > New query, then click Run.
-- It is safe to run more than once.
-- =====================================================================

create table if not exists public.reviews (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  moderated_at timestamptz,
  name         text not null check (char_length(name) between 2 and 60),
  business     text check (business is null or char_length(business) <= 80),
  rating       smallint not null check (rating between 1 and 5),
  comment      text not null check (char_length(comment) between 10 and 1000),
  -- New reviews start as "pending". Only "approved" reviews show on the website.
  status       text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  -- One-way hash used only to limit spam. The real IP address is never stored.
  ip_hash      text
);

create index if not exists reviews_status_created_idx on public.reviews (status, created_at desc);
create index if not exists reviews_ip_created_idx     on public.reviews (ip_hash, created_at desc);

-- Lock the table: visitors can NOT read or write it directly from their browser.
-- All access goes through your website's server code using the secret key.
alter table public.reviews enable row level security;
revoke all on public.reviews from anon, authenticated;
