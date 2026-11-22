// Private moderation endpoint, used by reviews-admin.html. Needs the ADMIN_PASSWORD from Vercel.
//   GET  /api/reviews/admin?status=pending|approved|rejected|all
//   POST /api/reviews/admin   { action: "approve" | "reject" | "delete", id }
const { db, safeEqual, readBody } = require("../_lib/supabase");

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return res.status(500).json({ error: "ADMIN_PASSWORD is not set in Vercel." });
  }

  const given = String(req.headers["x-admin-password"] || "");
  if (!given || !safeEqual(given, password)) {
    await sleep(700); // slows down password guessing
    return res.status(401).json({ error: "Wrong password." });
  }

  try {
    if (req.method === "GET") {
      const status = String(req.query && req.query.status || "pending");
      const filter = ["pending", "approved", "rejected"].includes(status) ? `status=eq.${status}&` : "";

      const [rows, statuses] = await Promise.all([
        db(`reviews?${filter}select=id,name,business,rating,comment,status,created_at&order=created_at.desc&limit=200`),
        db("reviews?select=status&limit=5000")
      ]);

      const counts = { pending: 0, approved: 0, rejected: 0 };
      for (const row of statuses || []) if (counts[row.status] !== undefined) counts[row.status] += 1;

      return res.status(200).json({ reviews: rows || [], counts });
    }

    if (req.method === "POST") {
      const { action, id } = readBody(req);
      if (!UUID.test(String(id || ""))) return res.status(400).json({ error: "Invalid review id." });

      if (action === "approve" || action === "reject") {
        await db(`reviews?id=eq.${id}`, {
          method: "PATCH",
          prefer: "return=minimal",
          body: { status: action === "approve" ? "approved" : "rejected", moderated_at: new Date().toISOString() }
        });
        return res.status(200).json({ ok: true });
      }

      if (action === "delete") {
        await db(`reviews?id=eq.${id}`, { method: "DELETE", prefer: "return=minimal" });
        return res.status(200).json({ ok: true });
      }

      return res.status(400).json({ error: "Unknown action." });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed." });
  } catch (error) {
    console.error("Reviews admin error:", error.message, error.detail || "");
    return res.status(502).json({ error: error.message || "Database error." });
  }
};
