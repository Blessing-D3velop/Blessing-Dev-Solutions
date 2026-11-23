-- =====================================================================
-- BlessingDevs website content: projects, package prices, monthly plans, image storage
-- Run AFTER reviews.sql. Paste this WHOLE file into Supabase > SQL Editor > New query > Run.
-- Safe to run more than once. It fills the tables with what is on your site today (only if they are empty).
-- =====================================================================

-- ---------- Projects (portfolio) ----------
create table if not exists public.projects (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null check (char_length(name) between 2 and 80),
  domain     text not null check (char_length(domain) between 3 and 200),
  category   text not null check (char_length(category) between 2 and 40),
  note       text check (note is null or char_length(note) <= 160),
  tags       text check (tags is null or char_length(tags) <= 200),
  image      text,
  -- 'website' = the normal portfolio grid, 'fullstack' = the Full-stack websites section
  kind       text not null default 'website' check (kind in ('website', 'fullstack')),
  sort_order integer not null default 0,
  published  boolean not null default true
);
create unique index if not exists projects_name_kind_idx on public.projects (lower(name), kind);

-- ---------- Build packages (once-off prices) ----------
create table if not exists public.packages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 2 and 60),
  price       text not null check (char_length(price) between 1 and 60),
  unit        text check (unit is null or char_length(unit) <= 30),
  description text check (description is null or char_length(description) <= 300),
  features    text[] not null default '{}',
  featured    boolean not null default false,
  badge       text check (badge is null or char_length(badge) <= 24),
  sort_order  integer not null default 0,
  published   boolean not null default true
);

-- ---------- Monthly plans (these amounts are what PayFast charges new subscribers) ----------
create table if not exists public.plans (
  id          text primary key check (id ~ '^[a-z0-9_]{2,30}$'),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 2 and 40),
  amount      numeric(10,2) not null check (amount > 0 and amount <= 100000),
  description text check (description is null or char_length(description) <= 300),
  features    text[] not null default '{}',
  featured    boolean not null default false,
  badge       text check (badge is null or char_length(badge) <= 24),
  sort_order  integer not null default 0,
  published   boolean not null default true
);

-- ---------- Lock the tables (only your website's server code can use them) ----------
alter table public.projects enable row level security;
alter table public.packages enable row level security;
alter table public.plans    enable row level security;
revoke all on public.projects from anon, authenticated;
revoke all on public.packages from anon, authenticated;
revoke all on public.plans    from anon, authenticated;
grant usage on schema public to service_role;
grant all on public.projects to service_role;
grant all on public.packages to service_role;
grant all on public.plans    to service_role;

-- ---------- Public storage bucket for project pictures ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-images', 'project-images', true, 3145728, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true;

-- ---------- Starting content (only added when the table is empty) ----------
do $seed$
begin
  if not exists (select 1 from public.projects) then
    insert into public.projects (name, domain, category, note, image, kind, sort_order) values
      ('Concepto Ink Tattoos', 'concepto-ink.com', 'Tattoo', 'Tattoo studio website', 'images/work/concepto-ink-tattoos.jpeg', 'website', 0),
      ('Rabie Ridge Tattoos', 'rabi-ridge-tattoos.co.za', 'Tattoo', 'Tattoo studio website', 'images/work/rabie-ridge-tattoos.jpeg', 'website', 10),
      ('Gin Tattoos', 'gin-tattoos.co.za', 'Tattoo', 'Tattoo studio website', 'images/work/gin-tattoos.jpeg', 'website', 20),
      ('Tribal Tattoo Garden', 'tribal-tattoo-garden.online', 'Tattoo', 'Tattoo studio website', 'images/work/tribal-tattoo-garden.jpeg', 'website', 30),
      ('Beauty Spa Potch', 'beautyspapotch.co.za', 'Spa', 'Luxury spa with service tabs and booking', 'images/work/beauty-spa-potch.jpeg', 'website', 40),
      ('Glow With IV', 'glowwithiv.co.za', 'Spa', 'Spa and wellness website', 'images/work/glow-with-iv.jpeg', 'website', 50),
      ('Women in Wellness Spa', 'womeninwellspa.co.za', 'Spa', 'Spa and wellness website', 'images/work/women-in-wellness-spa.jpeg', 'website', 60),
      ('Grace View Preschool', 'graceviewpreschool.online', 'School', 'Preschool website for parents', 'images/work/grace-view-preschool.jpeg', 'website', 70),
      ('Decentral Projects', 'decentralprojects.online', 'Construction', 'Construction company website', 'images/work/decentral-projects.jpeg', 'website', 80),
      ('Clement The Barber', 'clementthebarber.co.za', 'Barber', 'Barbershop website', 'images/work/clement-the-barber.jpeg', 'website', 90),
      ('The Shift Barber Shop', 'theshiftbarbershop.co.za', 'Barber', 'Barbershop website', 'images/work/shift.jpeg', 'website', 100),
      ('Eco Spa Wellness', 'eco-spa-eight.vercel.app', 'Spa', 'Spa website', 'images/work/eco-spa.jpeg', 'website', 110),
      ('ThembeLihle Pre School', 'thembelihle-daycare.vercel.app', 'School', 'Preschool website for parents', 'images/work/thembe.jpeg', 'website', 120),
      ('Mc Squared', 'mc2-pre-school.vercel.app', 'School', 'Preschool website for parents', 'images/work/mc2.jpeg', 'website', 130);
  end if;

  if not exists (select 1 from public.packages) then
    insert into public.packages (name, price, unit, description, features, featured, badge, sort_order) values
      ('Landing page', 'R1,000 to R1,500', 'once-off', 'A single, polished page that tells people who you are and how to contact you.', array['One-page responsive design','Services, gallery and contact sections','WhatsApp and call buttons','Domain connection and hosting setup','Basic on-page SEO','Delivered in about a week']::text[], false, NULL, 0),
      ('Booking and payments', 'R1,500 to R2,500', 'once-off', 'A multi-section website where customers can book or pay you online.', array['Everything in Landing page','PayFast payment integration','Booking fees and deposits','Service tabs and packages','Photo gallery','Google Search Console indexing','Contact form and WhatsApp booking']::text[], true, 'Most chosen', 10),
      ('Full-stack website', 'From R2,500', 'minimum', 'A complete web app with a dashboard so you can manage your site yourself.', array['Everything in Booking and payments','Admin dashboard to manage content','Database for bookings, products or clients','Secure login for you and your team','Custom features built to your needs','Training on how to use your dashboard']::text[], false, NULL, 20);
  end if;

  if not exists (select 1 from public.plans) then
    insert into public.plans (id, name, amount, description, features, featured, badge, sort_order) values
      ('basic', 'Basic', 199, 'Essential website care to keep your business website updated, accessible and properly maintained.', array['Website hosting and domain support','Routine website maintenance and updates','Basic on-page SEO checks','SEO title and meta description setup for up to 3 pages','Basic keyword optimisation for relevant business searches','Google Search Console setup assistance','Google indexing requests for new or updated pages','Basic website performance check','Mobile responsiveness checks','Up to 3 small website revisions per month','WhatsApp customer support']::text[], false, NULL, 0),
      ('growth', 'Growth', 299, 'A stronger SEO and maintenance package designed to improve your website''s search visibility and keep your online presence growing.', array['Everything included in Basic','Advanced on-page SEO optimisation','SEO titles and unique meta descriptions for up to 7 pages','Keyword research and keyword optimisation','Relevant search keyword targeting','Google Search Console performance monitoring','Google indexing requests and indexing issue checks','Monitoring of Google search impressions, clicks and average positions','Broken link and basic technical SEO checks','Website speed and Core Web Vitals performance checks','Image optimisation recommendations','Internal linking improvements','Monthly SEO and website performance report','Up to 7 small website revisions per month','Priority WhatsApp support']::text[], true, 'Best value', 10),
      ('premium', 'Premium', 399, 'Comprehensive website management and SEO support for businesses serious about strengthening their online presence.', array['Everything included in Growth','Advanced SEO optimisation across all existing website pages','Custom SEO titles and meta descriptions for all existing pages','Detailed keyword research and targeting strategy','Long-tail and location-based keyword optimisation','Advanced Google Search Console monitoring','Ongoing Google indexing checks and indexing requests','Technical SEO audits and issue resolution','Google Core Web Vitals and website speed optimisation','Image compression and loading performance improvements','Broken links, redirects and canonical URL checks','Structured data and schema markup where applicable','Google Business Profile optimisation assistance','Monthly SEO strategy and performance report','Competitor and keyword visibility checks','Up to 12 website revisions per month','Up to 2 small content or section updates per month','Priority website maintenance and troubleshooting','Security checks and available backup support','Priority WhatsApp support']::text[], false, NULL, 20);
  end if;
end
$seed$;
