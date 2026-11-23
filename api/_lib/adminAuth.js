// Shared password check for the private admin endpoints.
const { safeEqual } = require("./supabase");
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Returns true when the request is allowed. Otherwise it has already sent the error response.
async function requireAdmin(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    res.status(500).json({ error: "ADMIN_PASSWORD is not set in Vercel." });
    return false;
  }
  const given = String(req.headers["x-admin-password"] || "");
  if (!given || !safeEqual(given, password)) {
    await sleep(700); // slows down password guessing
    res.status(401).json({ error: "Wrong password." });
    return false;
  }
  return true;
}

module.exports = { requireAdmin };
