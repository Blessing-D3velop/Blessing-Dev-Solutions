// Public website content (projects, package prices, monthly plans) read from the database.
// If the database has nothing yet, the website keeps using the content built into script.js.
const { db } = require("./_lib/supabase");

const tagList = value => String(value || "").split(",").map(t => t.trim()).filter(Boolean).slice(0, 8);

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const [projects, packages, plans] = await Promise.all([
      db("projects?published=eq.true&select=id,name,domain,category,note,tags,image,kind&order=sort_order.asc,created_at.asc&limit=200"),
      db("packages?published=eq.true&select=id,name,price,unit,description,features,featured,badge&order=sort_order.asc,created_at.asc&limit=20"),
      db("plans?published=eq.true&select=id,name,amount,description,features,featured,badge&order=sort_order.asc,created_at.asc&limit=20")
    ]);

    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({
      projects: (projects || []).map(p => ({
        id: p.id, name: p.name, domain: p.domain, category: p.category,
        note: p.note || "", tags: tagList(p.tags), image: p.image || "", kind: p.kind
      })),
      packages: (packages || []).map(p => ({
        id: p.id, name: p.name, price: p.price, unit: p.unit || "", desc: p.description || "",
        features: p.features || [], featured: !!p.featured, badge: p.badge || ""
      })),
      plans: (plans || []).map(p => ({
        id: p.id, name: p.name, amount: Number(p.amount), desc: p.description || "",
        features: p.features || [], featured: !!p.featured, badge: p.badge || ""
      }))
    });
  } catch (error) {
    // Not configured or tables missing: tell the page to keep its built-in content.
    console.error("Content API error:", error.message);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ projects: [], packages: [], plans: [] });
  }
};
