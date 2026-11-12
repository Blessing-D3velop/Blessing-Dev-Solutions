const crypto = require("crypto");

const PLANS = { basic: 109, growth: 199, premium: 299 };
const FIELD_ORDER = [
  "m_payment_id", "pf_payment_id", "payment_status", "item_name", "item_description",
  "amount_gross", "amount_fee", "amount_net", "custom_str1", "custom_str2",
  "custom_str3", "custom_str4", "custom_str5", "custom_int1", "custom_int2",
  "custom_int3", "custom_int4", "custom_int5", "name_first", "name_last",
  "email_address", "merchant_id"
];

function phpUrlEncode(value) {
  return encodeURIComponent(String(value).trim())
    .replace(/[!'()*]/g, char => "%" + char.charCodeAt(0).toString(16).toUpperCase())
    .replace(/%20/g, "+");
}

function signatureFor(data, passphrase) {
  const parts = [];
  for (const key of FIELD_ORDER) {
    if (data[key] !== undefined && data[key] !== null && String(data[key]) !== "") {
      parts.push(`${key}=${phpUrlEncode(data[key])}`);
    }
  }
  if (passphrase) parts.push(`passphrase=${phpUrlEncode(passphrase)}`);
  return crypto.createHash("md5").update(parts.join("&")).digest("hex");
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    const raw = typeof req.body === "string"
      ? req.body
      : new URLSearchParams(req.body || {}).toString();
    const data = Object.fromEntries(new URLSearchParams(raw));
    const passphrase = process.env.PAYFAST_PASSPHRASE;
    const merchantId = process.env.PAYFAST_MERCHANT_ID;
    if (!passphrase || !merchantId) return res.status(500).send("Server is not configured");

    const expectedSignature = signatureFor(data, passphrase);
    if (!data.signature || expectedSignature !== data.signature) {
      return res.status(400).send("Invalid signature");
    }

    if (data.merchant_id !== merchantId || data.payment_status !== "COMPLETE") {
      return res.status(200).send("Notification received");
    }

    const [planId] = String(data.m_payment_id || "").split("-");
    const expectedAmount = PLANS[planId];
    if (!expectedAmount || Number(data.amount_gross).toFixed(2) !== expectedAmount.toFixed(2)) {
      return res.status(400).send("Payment details do not match");
    }

    const validationUrl = process.env.PAYFAST_SANDBOX === "true"
      ? "https://sandbox.payfast.co.za/eng/query/validate"
      : "https://www.payfast.co.za/eng/query/validate";

    const validation = await fetch(validationUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: raw
    });
    const validationText = (await validation.text()).trim();

    if (!validation.ok || validationText !== "VALID") {
      return res.status(400).send("PayFast could not validate this notification");
    }

    // The payment has been verified. Persist/activate the subscription in a database
    // or send an admin notification here when you add membership management.
    console.log("Verified PayFast subscription payment", {
      paymentId: data.pf_payment_id,
      reference: data.m_payment_id,
      planId,
      amount: data.amount_gross,
      email: data.email_address
    });

    return res.status(200).send("OK");
  } catch (error) {
    console.error("PayFast ITN error:", error);
    return res.status(500).send("Notification processing failed");
  }
};
