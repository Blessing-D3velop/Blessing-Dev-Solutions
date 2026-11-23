-- =====================================================================
-- Professional rewrite of your build packages and monthly plans.
-- Paste this WHOLE file into Supabase > SQL Editor > New query > Run.
--
-- BUILD PACKAGES: this REPLACES all current packages with the four below.
--   Any package edits you made in the dashboard will be overwritten.
-- MONTHLY PLANS: names, descriptions and features are updated and a fourth plan
--   ("business") is added. Your current plan PRICES are NOT changed.
--   (If a plan has to be created, the price below is used.)
-- You can edit everything afterwards in /admin.html.
-- =====================================================================

begin;

delete from public.packages;

insert into public.packages (name, price, unit, description, features, featured, badge, sort_order) values
  ('Landing Page', 'R1,000 to R1,500', 'once-off', 'A fast, conversion-focused single page that introduces your business and turns visitors into enquiries.', array['Custom one-page design, built mobile-first','Services, gallery and contact sections','WhatsApp and call-to-action buttons','On-page SEO and Google Search Console setup','Domain connection and hosting setup','Delivered in about 7 days']::text[], false, NULL, 0),
  ('E-commerce Store', 'From R3,500', 'minimum', 'A secure online store to showcase your products, accept payments and manage orders.', array['Product catalogue with categories','Shopping cart and secure checkout','PayFast online payments','Admin dashboard for products and orders','Order notifications by email or WhatsApp','Fast, mobile-first design','SEO-ready product pages','Domain, hosting and launch support','Training to manage your store']::text[], true, 'Recommended', 10),
  ('SaaS / Web Application', 'From R6,000', 'minimum', 'A custom web platform with user accounts, a database and an admin dashboard.', array['Secure user registration and login','Database for users, records and content','Admin dashboard to manage users and data','Subscriptions and online payments with PayFast','Custom features and integrations to your brief','Responsive interface on every device','Domain, hosting and deployment','Handover documentation and training']::text[], false, NULL, 20),
  ('Custom / Other', 'Custom quote', 'tailored to your needs', 'Booking systems, business or organisation websites, portfolios, redesigns and bespoke projects, scoped and quoted to fit.', array['Business, school, club and portfolio websites','Booking and appointment systems with online payments','Redesign and speed upgrade of an existing website','Extra pages, features and third-party integrations','Fixed quote before any work starts','Start with a quick WhatsApp consultation']::text[], false, NULL, 30);

insert into public.plans (id, name, amount, description, features, featured, badge, sort_order) values
  ('basic', 'Essential', 199, 'Hosting, maintenance and basic SEO to keep a small business website secure, online and up to date.', array['Website hosting and domain support','Routine maintenance and software updates','Security and uptime checks','On-page SEO setup for up to 3 pages','Google Search Console setup and indexing requests','Mobile and performance checks','Up to 3 small content changes per month','WhatsApp support']::text[], false, NULL, 0),
  ('growth', 'Growth', 299, 'Active SEO and performance management to help your website rank higher and win more enquiries.', array['Everything in Essential','Keyword research and on-page optimisation for up to 7 pages','Unique SEO titles and meta descriptions','Search Console monitoring and indexing checks','Tracking of impressions, clicks and search positions','Technical SEO checks, including broken links and page speed','Internal linking and image optimisation','Monthly SEO and performance report','Up to 7 content changes per month','Priority WhatsApp support']::text[], true, 'Best value', 10),
  ('premium', 'Professional', 399, 'Full-service SEO and website management for businesses that rely on their website to bring in customers.', array['Everything in Growth','SEO optimisation across all existing pages','Long-tail and location-based keyword strategy','Technical SEO audits and fixes: redirects, canonical URLs, Core Web Vitals','Structured data (schema) setup where applicable','Google Business Profile optimisation support','Competitor and keyword visibility checks','Security checks and backup support','Up to 12 content changes and 2 section updates per month','Monthly strategy and performance report','Priority support and troubleshooting']::text[], false, NULL, 20),
  ('business', 'Business', 599, 'For online stores and web apps: hands-on technical support and monitoring so your platform stays fast, secure and online.', array['Everything in Professional','Store or app maintenance and bug fixes','Uptime monitoring with downtime alerts','Database and backup checks','PayFast payment monitoring and troubleshooting','Product, price and content updates','Security updates and performance tuning','Up to 20 changes per month','Monthly traffic and performance report','Priority WhatsApp support']::text[], false, NULL, 30)
on conflict (id) do update set
  name        = excluded.name,
  description = excluded.description,
  features    = excluded.features,
  featured    = excluded.featured,
  badge       = excluded.badge,
  sort_order  = excluded.sort_order;

commit;
