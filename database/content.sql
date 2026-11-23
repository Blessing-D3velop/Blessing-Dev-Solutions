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
  -- 'website' = the normal portfolio grid, 'fullstack' = the Web apps and online stores section
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
      ('Landing Page', 'R1,000 to R1,500', 'once-off', 'A fast, conversion-focused single page that introduces your business and turns visitors into enquiries.', array['Custom one-page design, built mobile-first','Services, gallery and contact sections','WhatsApp and call-to-action buttons','On-page SEO and Google Search Console setup','Domain connection and hosting setup','Delivered in about 7 days']::text[], false, NULL, 0),
      ('E-commerce Store', 'From R3,500', 'minimum', 'A secure online store to showcase your products, accept payments and manage orders.', array['Product catalogue with categories','Shopping cart and secure checkout','PayFast online payments','Admin dashboard for products and orders','Order notifications by email or WhatsApp','Fast, mobile-first design','SEO-ready product pages','Domain, hosting and launch support','Training to manage your store']::text[], true, 'Recommended', 10),
      ('SaaS / Web Application', 'From R6,000', 'minimum', 'A custom web platform with user accounts, a database and an admin dashboard.', array['Secure user registration and login','Database for users, records and content','Admin dashboard to manage users and data','Subscriptions and online payments with PayFast','Custom features and integrations to your brief','Responsive interface on every device','Domain, hosting and deployment','Handover documentation and training']::text[], false, NULL, 20),
      ('Custom / Other', 'Custom quote', 'tailored to your needs', 'Booking systems, business or organisation websites, portfolios, redesigns and bespoke projects, scoped and quoted to fit.', array['Business, school, club and portfolio websites','Booking and appointment systems with online payments','Redesign and speed upgrade of an existing website','Extra pages, features and third-party integrations','Fixed quote before any work starts','Start with a quick WhatsApp consultation']::text[], false, NULL, 30);
  end if;

  if not exists (select 1 from public.plans) then
    insert into public.plans (id, name, amount, description, features, featured, badge, sort_order) values
      ('basic', 'Essential', 199, 'Hosting, maintenance and basic SEO to keep a small business website secure, online and up to date.', array['Website hosting and domain support','Routine maintenance and software updates','Security and uptime checks','On-page SEO setup for up to 3 pages','Google Search Console setup and indexing requests','Mobile and performance checks','Up to 3 small content changes per month','WhatsApp support']::text[], false, NULL, 0),
      ('growth', 'Growth', 299, 'Active SEO and performance management to help your website rank higher and win more enquiries.', array['Everything in Essential','Keyword research and on-page optimisation for up to 7 pages','Unique SEO titles and meta descriptions','Search Console monitoring and indexing checks','Tracking of impressions, clicks and search positions','Technical SEO checks, including broken links and page speed','Internal linking and image optimisation','Monthly SEO and performance report','Up to 7 content changes per month','Priority WhatsApp support']::text[], true, 'Best value', 10),
      ('premium', 'Professional', 399, 'Full-service SEO and website management for businesses that rely on their website to bring in customers.', array['Everything in Growth','SEO optimisation across all existing pages','Long-tail and location-based keyword strategy','Technical SEO audits and fixes: redirects, canonical URLs, Core Web Vitals','Structured data (schema) setup where applicable','Google Business Profile optimisation support','Competitor and keyword visibility checks','Security checks and backup support','Up to 12 content changes and 2 section updates per month','Monthly strategy and performance report','Priority support and troubleshooting']::text[], false, NULL, 20),
      ('business', 'Business', 599, 'For online stores and web apps: hands-on technical support and monitoring so your platform stays fast, secure and online.', array['Everything in Professional','Store or app maintenance and bug fixes','Uptime monitoring with downtime alerts','Database and backup checks','PayFast payment monitoring and troubleshooting','Product, price and content updates','Security updates and performance tuning','Up to 20 changes per month','Monthly traffic and performance report','Priority WhatsApp support']::text[], false, NULL, 30);
  end if;
end
$seed$;
