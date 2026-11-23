// Looks up a monthly plan (name + price in rand). The price in the database is the one PayFast charges.
const { db } = require("./supabase");

// Used only if the database has no "plans" table yet or is not configured.
const DEFAULT_PLANS = {
  basic: { name: "Basic", amount: 199 },
  growth: { name: "Growth", amount: 299 },
  premium: { name: "Premium", amount: 399 }
};

async function getPlan(id, { publishedOnly = false } = {}) {
  id = String(id || "");
  if (!/^[a-z0-9_]{2,30}$/.test(id)) return null;

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) return DEFAULT_PLANS[id] || null;

  try {
    const rows = await db(`plans?id=eq.${id}${publishedOnly ? "&published=eq.true" : ""}&select=id,name,amount&limit=1`);
    const row = rows && rows[0];
    return row ? { name: row.name, amount: Number(row.amount) } : null;
  } catch (error) {
    const code = error.detail && error.detail.code;
    if (code === "PGRST205" || code === "42P01") return DEFAULT_PLANS[id] || null; // table not created yet
    throw error;
  }
}

module.exports = { getPlan, DEFAULT_PLANS };
