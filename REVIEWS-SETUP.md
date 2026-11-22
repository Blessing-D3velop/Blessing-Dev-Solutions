# Reviews setup (about 15 minutes, one time)

Clients leave a star rating and a comment on your website. Each review is saved in a database and waits for your approval. Only approved reviews show on the site.

## 1. Create the database (Supabase, free plan)
1. Go to supabase.com and sign up.
2. Click **New project**. Give it a name (for example `blessingdevs`), choose a database password (save it somewhere safe) and pick the region closest to your visitors (Cape Town if it is offered).
3. Wait about a minute while the project is created.
4. In the left menu open **SQL Editor** → **New query**.
5. Open the file `database/reviews.sql`, copy ALL of it, paste it in and click **Run**. You should see "Success".
6. Open **Table Editor**. You should see a table called `reviews`.

password:jb3WYhX@&7y4r$?

## 2. Copy two things from Supabase
Open **Project Settings** → **API** (or **API Keys**):
- **Project URL**, which looks like `https://abcdxyz.supabase.co`
- The **secret key** (also called the `service_role` key). Keep it private. Never paste it into `script.js`, `index.html` or anywhere public.

## 3. Add them to Vercel
In Vercel open your project → **Settings** → **Environment Variables** and add these three for **Production**:

| Name | Value |
| --- | --- |
| `SUPABASE_URL` | the Project URL |
| `SUPABASE_SERVICE_KEY` | the secret key |
| `ADMIN_PASSWORD` | a long password you choose (this unlocks the approval page) |

Then **redeploy** (Deployments → the latest one → Redeploy). Environment variables only apply to new deployments.

## 4. Upload the files to your project
```
index.html              (replace the old one)
reviews.js              (new)
reviews.css             (new)
reviews-admin.html      (new, your private approval page)
api/_lib/supabase.js    (new)
api/reviews/index.js    (new)
api/reviews/admin.js    (new)
```
You do not need to upload `database/reviews.sql` to the website. It is only used once in step 1.

## 5. Test it
1. Open your website, scroll to **What my clients say**, and send a test review.
2. Open `https://blessing-dev-solutions-sxcb.vercel.app/reviews-admin.html`, sign in with your `ADMIN_PASSWORD`, and click **Approve**.
3. Refresh your website. The review appears within about a minute.

## Good to know
- The approval page is hidden from Google (`noindex`) and is not in your sitemap. Keep the link and password to yourself.
- Visitors cannot read or change the database directly. Everything goes through your server code.
- Spam protection: a hidden trap field, a minimum time on the form, a limit of 3 reviews per hour per visitor, and nothing goes live until you approve it.
- The database stores the name, business and review text, plus a one-way scrambled code used only for the spam limit (never the real IP address). Mention this in your privacy policy if you have one (POPIA).
- Supabase free projects pause after about a week with no activity. If the reviews stop loading, open your Supabase dashboard and click **Restore**.
- Do not add these reviews to your page as Google star-rating markup. Google ignores self-published reviews of your own business.
