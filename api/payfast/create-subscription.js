const crypto = require("crypto");

const PLANS = {
  basic: { name: "Basic", amount: 109 },
  growth: { name: "Growth", amount: 199 },
  premium: { name: "Premium", amount: 299 }
};

const FIELD_ORDER = [
  "merchant_id", "merchant_key", "return_url", "cancel_url", "notify_url",
  "notify_method", "name_first", "name_last", "email_address", "cell_number",
  "m_payment_id", "amount", "item_name", "item_description",
  "custom_int1", "custom_int2", "custom_int3", "custom_int4", "custom_int5",
  "custom_str1", "custom_str2", "custom_str3", "custom_str4", "custom_str5",
  "email_confirmation", "confirmation_address", "currency", "payment_method",
  "subscription_type", "passphrase", "billing_date", "recurring_amount", "frequency", "cycles",
  "subscription_notify_email", "subscription_notify_webhook", "subscription_notify_buyer"
];

function phpUrlEncode(value) {
  return encodeURIComponent(String(value).trim())
    .replace(/[!'()*]/g, char => "%" + char.charCodeAt(0).toString(16).toUpperCase())
    .replace(/%20/g, "+");
}


function phpUrlEncode(value) {
  return encodeURIComponent(String(value))
    .replace(/[!'()*~]/g, char =>
      "%" + char.charCodeAt(0).toString(16).toUpperCase()
    )
    .replace(/%20/g, "+");
}

function createSignature(fields, passphrase) {
  const parts = [];

  // Preserve the exact order of the fields being submitted.
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined && value !== null && String(value) !== "") {
      parts.push(`${key}=${phpUrlEncode(value)}`);
    }
  }

  // The passphrase must be appended last.
  if (passphrase) {
    parts.push(`passphrase=${phpUrlEncode(passphrase)}`);
  }

  return crypto
    .createHash("md5")
    .update(parts.join("&"))
    .digest("hex");
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

  const baseUrl = process.env.SITE_URL || `https://${req.headers.host}`;
  const cleanName = name.trim().slice(0, 100);
  const nameParts = cleanName.split(/\s+/);
  const firstName = nameParts.shift();
  const lastName = nameParts.join(" ").slice(0, 100);

  const fields = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: `${baseUrl}/?payment=return`,
    cancel_url: `${baseUrl}/?payment=cancel`,
    notify_url: `${baseUrl}/api/payfast/itn`,
    name_first: firstName,
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

  if (lastName) fields.name_last = lastName;

  const signature = createSignature(fields, passphrase);
  const submittedFields = { ...fields, signature };
  const paymentUrl = sandbox
    ? "https://sandbox.payfast.co.za/eng/process"
    : "https://www.payfast.co.za/eng/process";

  return res.status(200).json({ paymentUrl, fields: submittedFields });
};
