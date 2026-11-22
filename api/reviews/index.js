// Public reviews endpoint.
//   GET  /api/reviews  -> approved reviews + rating summary
//   POST /api/reviews  -> submit a new review (saved as "pending" until you approve it)
const { db, hashIp, clientIp, readBody } = require("../_lib/supabase");

function cleanLine(value, max) {
  return String(value == null ? "" : value)
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function cleanText(value, max) {
  return String(value == null ? "" : value)
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}

module.exports = async (req, res) => {
  try {
    if (req.method === "GET") {
      const [reviews, ratings] = await Promise.all([
        db("reviews?status=eq.approved&select=id,name,business,rating,comment,created_at&order=created_at.desc&limit=50"),
        db("reviews?status=eq.approved&select=rating&limit=1000")
      ]);

      const counts = [0, 0, 0, 0, 0];
      let total = 0;
      for (const row of ratings || []) {
        if (row.rating >= 1 && row.rating <= 5) {
          counts[row.rating - 1] += 1;
          total += row.rating;
        }
      }
      const count = counts.reduce((a, b) => a + b, 0);

      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
      return res.status(200).json({
        reviews: reviews || [],
        summary: { count, average: count ? Math.round((total / count) * 10) / 10 : 0, counts }
      });
    }

    if (req.method === "POST") {
      res.setHeader("Cache-Control", "no-store");
      const body = readBody(req);

      // Spam traps: a hidden field that humans never fill in, and a minimum time on the form.
      // Bots get a normal-looking "success" so they don't learn anything.
      const elapsed = Number(body.elapsed);
      if (cleanLine(body.website, 200) || (Number.isFinite(elapsed) && elapsed < 3000)) {
        return res.status(200).json({ ok: true });
      }

      const name = cleanLine(body.name, 60);
      const business = cleanLine(body.business, 80);
      const comment = cleanText(body.comment, 1000);
      const rating = Number(body.rating);

      if (name.length < 2) return res.status(400).json({ error: "Please enter your name." });
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Please choose a star rating from 1 to 5." });
      }
      if (comment.length < 10) {
        return res.status(400).json({ error: "Please write at least a short sentence (10 characters or more)." });
      }

      // Max 3 reviews per hour from the same visitor.
      const ipHash = hashIp(clientIp(req));
      const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const recent = await db(`reviews?ip_hash=eq.${ipHash}&created_at=gte.${encodeURIComponent(since)}&select=id&limit=5`);
      if ((recent || []).length >= 3) {
        return res.status(429).json({ error: "You've sent a few reviews already. Please try again later." });
      }

      await db("reviews", {
        method: "POST",
        prefer: "return=minimal",
        body: { name, business: business || null, rating, comment, status: "pending", ip_hash: ipHash }
      });

      return res.status(201).json({ ok: true });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed." });
  } catch (error) {
    console.error("Reviews API error:", error.message, error.detail || "");
    const notConfigured = error.status === 500;
    return res.status(notConfigured ? 500 : 502).json({
      error: notConfigured ? error.message : "Something went wrong saving your review. Please try again."
    });
  }
};
