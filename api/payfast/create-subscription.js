const crypto = require("crypto");

const PLANS = {
  basic: { name: "Basic", amount: 199 },
  growth: { name: "Growth", amount: 299 },
  premium: { name: "Premium", amount: 399 }
};

// PayFast requires the signature to be built in this exact order.
// The passphrase is NOT in this list: it is always appended last.
const FIELD_ORDER = [
  "merchant_id", "merchant_key", "return_url", "cancel_url", "notify_url",
  "notify_method", "name_first", "name_last", "email_address", "cell_number",
  "m_payment_id", "amount", "item_name", "item_description",
  "custom_int1", "custom_int2", "custom_int3", "custom_int4", "custom_int5",
  "custom_str1", "custom_str2", "custom_str3", "custom_str4", "custom_str5",
  "email_confirmation", "confirmation_address", "currency", "payment_method",
  "subscription_type", "billing_date", "recurring_amount", "frequency", "cycles",
  "subscription_notify_email", "subscription_notify_webhook", "subscription_notify_buyer"
];

// Matches PHP's urlencode(): uppercase hex, spaces as "+", and ! ' ( ) * ~ encoded.
function phpUrlEncode(value) {
  return encodeURIComponent(String(value).trim())
    .replace(/[!'()*~]/g, char => "%" + char.charCodeAt(0).toString(16).toUpperCase())
    .replace(/%20/g, "+");
}

// Returns the fields in PayFast's required order, skipping empty values.
function orderFields(fields) {
  const ordered = {};
  for (const key of FIELD_ORDER) {
    const value = fields[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      ordered[key] = String(value).trim();
    }
  }
  return ordered;
}

function createSignature(orderedFields, passphrase) {
  const parts = Object.entries(orderedFields).map(
    ([key, value]) => `${key}=${phpUrlEncode(value)}`
  );
  if (passphrase) parts.push(`passphrase=${phpUrlEncode(passphrase)}`);
  return crypto.createHash("md5").update(parts.join("&")).digest("hex");
}

module.exports = (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const merchantId = process.env.PAYFAST_MERCHANT_ID;
  const merchantKey = process.env.PAYFAST_MERCHANT_KEY;
  const passphrase = process.env.PAYFAST_PASSPHRASE;
  const sandbox = process.env.PAYFAST_SANDBOX === "true";

  if (!merchantId || !merchantKey || !passphrase) {
    return res.status(500).json({
      error: "PayFast is not configured on the server. Check the Vercel environment variables."
    });
  }

  const { planId, name, email, site } = req.body || {};
  const plan = PLANS[planId];

  if (!plan || typeof name !== "string" || !name.trim() ||
      typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: "Please provide a valid plan, name and email address." });
  }

  // Stable production address: used for the server-to-server ITN callback.
  const siteUrl = (process.env.SITE_URL || `https://${req.headers.host}`).replace(/\/+$/, "");
  // The address the customer is actually on: used to send them back after paying/cancelling.
  const originUrl = `https://${req.headers.host}`;

  const cleanName = name.trim().slice(0, 100);
  const nameParts = cleanName.split(/\s+/);
  const firstName = nameParts.shift();
  const lastName = nameParts.join(" ").slice(0, 100);

  const rawFields = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: `${originUrl}/?payment=return`,
    cancel_url: `${originUrl}/?payment=cancel`,
    notify_url: `${siteUrl}/api/payfast/itn`,
    name_first: firstName,
    name_last: lastName,
    email_address: email.trim().slice(0, 100),
    m_payment_id: `${planId}-${Date.now()}`,
    amount: plan.amount.toFixed(2),
    item_name: `BlessingDevs ${plan.name} monthly subscription`,
    custom_str1: typeof site === "string" ? site.trim().slice(0, 255) : "",
    subscription_type: "1",
    recurring_amount: plan.amount.toFixed(2),
    frequency: "3",
    cycles: "0"
  };

  // Ordered correctly (name_last now sits between name_first and email_address).
  const fields = orderFields(rawFields);
  const signature = createSignature(fields, passphrase);

  // Object key order is preserved in JSON, and script.js posts the fields in this order.
  const submittedFields = { ...fields, signature };

  const paymentUrl = sandbox
    ? "https://sandbox.payfast.co.za/eng/process"
    : "https://www.payfast.co.za/eng/process";

  return res.status(200).json({ paymentUrl, fields: submittedFields });
};