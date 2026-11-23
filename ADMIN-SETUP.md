# Admin dashboard setup (about 10 minutes, one time)

The dashboard lives at `https://blessing-dev-solutions-sxcb.vercel.app/admin.html` and uses the same admin password as the reviews page. From it you can:
- approve or reject client reviews
- change your monthly plan prices (these are the prices PayFast charges)
- change your build package prices and descriptions
- add, edit, hide and delete portfolio projects, including uploading their pictures

## 1. Create the tables (once)
1. In Supabase open **SQL Editor** > **New query**.
2. Open `database/content.sql`, copy ALL of it, paste it in and click **Run**. "Success. No rows returned" is normal.
3. Open **Table Editor**. You should now see `projects`, `packages` and `plans`, already filled with what is on your site today. Under **Storage** you should see a bucket called `project-images`.

## 2. Upload the files to your project
```
index.html                         (replace)
content.js                         (new)
content.css                        (new)
admin.html                         (new, your dashboard)
reviews-admin.html                 (replace; it now just sends you to admin.html)
api/content.js                     (new)
api/admin/content.js               (new)
api/admin/upload.js                (new)
api/_lib/supabase.js               (replace)
api/_lib/adminAuth.js              (new)
api/_lib/plans.js                  (new)
api/payfast/create-subscription.js (replace)
api/payfast/itn.js                 (replace)
```
Keep your own `script.js`. No changes are needed in it. The new `content.js` loads after it and swaps in what is in the database. If the database can't be reached, your site shows the content that is already in `script.js`.
The environment variables you already added in Vercel are all you need. Redeploy after uploading.

## 3. Use it
Open `/admin.html`, sign in, and pick a tab.
- **Monthly plans:** change the price, text or features, then Save. New subscribers are charged the new price. People already subscribed keep the price they signed up at. Plans can be hidden but not deleted.
- **Build packages:** the price is text, so you can type `R1,500 to R2,500` or `From R2,500`. The dollar price is worked out automatically.
- **Projects:** click **Add a project**, fill it in, choose a picture and click Add. Choose "Web apps and online stores" in "Where to show it" and the project appears in the **Web apps and online stores** section. Choose "Websites I've built" for the normal portfolio grid.
Changes show on the website within about a minute.

## Good to know
- **Pictures:** use a 3:2 picture such as 1200 x 800. They are resized in your browser before upload, so big screenshots are fine.
- **Test a price change** with a PayFast sandbox payment before relying on it with real customers.
- **Safety:** the dashboard needs your admin password for every change, and visitors can only read the published content. Keep `ADMIN_PASSWORD` private and make it long.
- The Web apps and online stores section only appears once at least one project is set to "Web apps and online stores".
