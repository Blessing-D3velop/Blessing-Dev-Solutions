// Private endpoint used by admin.html to edit projects, package prices and monthly plans.
//   GET  /api/admin/content                                  -> everything (including hidden items)
//   POST /api/admin/content { action: "save", table, item, isNew }
//   POST /api/admin/content { action: "delete", table, id }   (not allowed for plans)
const { db, readBody } = require("../_lib/supabase");
const { requireAdmin } = require("../_lib/adminAuth");

class Invalid extends Error {}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PLAN_ID = /^[a-z0-9_]{2,30}$/;

const str = (v, max) => String(v == null ? "" : v).replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
const bool = v => v === true || v === "true" || v === 1 || v === "1";

function order(v) {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.max(-1000, Math.min(1000, n)) : 0;
}

function lines(v) {
  const list = Array.isArray(v) ? v : String(v == null ? "" : v).split(/\r?\n/);
  const cleaned = list.map(x => str(x, 160)).filter(Boolean);
  if (cleaned.length > 25) throw new Invalid("Please use 25 feature lines or fewer.");
  return cleaned;
}

function image(v) {
  const value = String(v == null ? "" : v).trim();
  if (!value) return null;
  const base = (process.env.SUPABASE_URL || "").trim().replace(/\/+$/, "");
  const storagePrefix = `${base}/storage/v1/object/public/project-images/`;
  if (/^images\/[A-Za-z0-9_\-\/.]+$/.test(value) && !value.includes("..")) return value;
  if (base && value.startsWith(storagePrefix) && /^[A-Za-z0-9_\-\/.]+$/.test(value.slice(storagePrefix.length))) return value;
  throw new Invalid("Please upload the picture again using the Upload button.");
}

const cleaners = {
  projects(i) {
    const name = str(i.name, 80);
    if (name.length < 2) throw new Invalid("Please enter the project name.");
    const domain = str(i.domain, 200).replace(/^https?:\/\//i, "").replace(/\/+$/, "");
    if (!/^[a-z0-9]([a-z0-9.-]*[a-z0-9])?(\/\S*)?$/i.test(domain)) throw new Invalid("Enter the website address like mybusiness.co.za (no spaces).");
    const category = str(i.category, 40);
    if (category.length < 2) throw new Invalid("Please enter the industry, for example Spa or Gym.");
    const kind = i.kind === "fullstack" ? "fullstack" : "website";
    return {
      name, domain, category, kind,
      note: str(i.note, 160) || null,
      tags: str(i.tags, 200) || null,
      image: image(i.image),
      sort_order: order(i.sort_order),
      published: bool(i.published)
    };
  },
  packages(i) {
    const name = str(i.name, 60);
    const price = str(i.price, 60);
    if (name.length < 2) throw new Invalid("Please enter the package name.");
    if (!price) throw new Invalid("Please enter the price, for example R1,500 to R2,500.");
    return {
      name, price,
      unit: str(i.unit, 30) || null,
      description: str(i.description, 300) || null,
      features: lines(i.features),
      featured: bool(i.featured),
      badge: str(i.badge, 24) || null,
      sort_order: order(i.sort_order),
      published: bool(i.published)
    };
  },
  plans(i) {
    const name = str(i.name, 40);
    const amount = Math.round(Number(i.amount) * 100) / 100;
    if (name.length < 2) throw new Invalid("Please enter the plan name.");
    if (!Number.isFinite(amount) || amount <= 0 || amount > 100000) throw new Invalid("Please enter the monthly price in rand, for example 199.");
    return {
      name, amount,
      description: str(i.description, 300) || null,
      features: lines(i.features),
      featured: bool(i.featured),
      badge: str(i.badge, 24) || null,
      sort_order: order(i.sort_order),
      published: bool(i.published)
    };
  }
};

module.exports = async (req, res) => {
  if (!(await requireAdmin(req, res))) return;

  try {
    if (req.method === "GET") {
      const [projects, packages, plans] = await Promise.all([
        db("projects?select=*&order=sort_order.asc,created_at.asc&limit=500"),
        db("packages?select=*&order=sort_order.asc,created_at.asc&limit=50"),
        db("plans?select=*&order=sort_order.asc,created_at.asc&limit=50")
      ]);
      return res.status(200).json({ projects, packages, plans });
    }

    if (req.method === "POST") {
      const body = readBody(req);
      const table = String(body.table || "");
      if (!cleaners[table]) return res.status(400).json({ error: "Unknown table." });

      if (body.action === "save") {
        const item = body.item && typeof body.item === "object" ? body.item : {};
        const row = cleaners[table](item);

        if (body.isNew) {
          if (table === "plans") {
            const id = String(item.id || "").trim().toLowerCase();
            if (!PLAN_ID.test(id)) throw new Invalid("The plan code must be 2 to 30 lowercase letters, numbers or underscores, for example gold.");
            row.id = id;
          }
          const created = await db(table, { method: "POST", prefer: "return=representation", body: row });
          return res.status(201).json({ ok: true, item: created && created[0] });
        }

        const id = String(item.id || "");
        if (table === "plans" ? !PLAN_ID.test(id) : !UUID.test(id)) throw new Invalid("Invalid id.");
        await db(`${table}?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", prefer: "return=minimal", body: row });
        return res.status(200).json({ ok: true });
      }

      if (body.action === "delete") {
        if (table === "plans") {
          return res.status(400).json({ error: "Plans can't be deleted because existing subscribers use them. Untick 'Show on website' to hide a plan instead." });
        }
        const id = String(body.id || "");
        if (!UUID.test(id)) throw new Invalid("Invalid id.");
        await db(`${table}?id=eq.${id}`, { method: "DELETE", prefer: "return=minimal" });
        return res.status(200).json({ ok: true });
      }

      return res.status(400).json({ error: "Unknown action." });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed." });
  } catch (error) {
    if (error instanceof Invalid) return res.status(400).json({ error: error.message });
    console.error("Admin content error:", error.message, error.detail || "");
    const duplicate = /duplicate|unique/i.test(error.message);
    return res.status(duplicate ? 409 : 502).json({
      error: duplicate ? "Something with that name or code already exists." : (error.message || "Database error.")
    });
  }
};
