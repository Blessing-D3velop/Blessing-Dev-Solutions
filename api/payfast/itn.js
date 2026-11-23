const crypto = require("crypto");

const { getPlan } = require("../_lib/plans");

// PHP urlencode() equivalent. No trimming: ITN values must be encoded exactly as received.
function phpUrlEncode(value) {
  return encodeURIComponent(String(value))
    .replace(/[!'()*~]/g, char => "%" + char.charCodeAt(0).toString(16).toUpperCase())
    .replace(/%20/g, "+");
}

// PayFast signs ALL fields it sent, in the order it sent them (excluding "signature"),
// including empty ones. The passphrase is appended last.
function buildParamString(pairs, passphrase) {
  const base = pairs
    .filter(([key]) => key !== "signature")
    .map(([key, value]) => `${key}=${phpUrlEncode(value)}`)
    .join("&");
  const withPassphrase = passphrase ? `${base}&passphrase=${phpUrlEncode(passphrase)}` : base;
  return { base, withPassphrase };
}

async function readRawBody(req) {
  if (typeof req.body === "string") return req.body;
  if (Buffer.isBuffer(req.body)) return req.body.toString("utf8");
  if (req.body && typeof req.body === "object") return new URLSearchParams(req.body).toString();
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    const raw = await readRawBody(req);
    const pairs = Array.from(new URLSearchParams(raw).entries());
    const data = Object.fromEntries(pairs);

    const passphrase = process.env.PAYFAST_PASSPHRASE;
    const merchantId = process.env.PAYFAST_MERCHANT_ID;
    if (!passphrase || !merchantId) return res.status(500).send("Server is not configured");

    // 1. Verify the signature.
    const { base, withPassphrase } = buildParamString(pairs, passphrase);
    const expectedSignature = crypto.createHash("md5").update(withPassphrase).digest("hex");
    if (!data.signature || expectedSignature !== data.signature) {
      return res.status(400).send("Invalid signature");
    }

    // 2. Ignore other merchants / non-complete payments (acknowledge so PayFast stops retrying).
    if (data.merchant_id !== merchantId || data.payment_status !== "COMPLETE") {
      return res.status(200).send("Notification received");
    }

    // 3. Check the plan exists and the amount is sensible.
    // The amount is not compared to today's price, because people who subscribed before a price change
    // keep paying the price they signed up at. The signature and PayFast's own check protect the notification.
    const [planId] = String(data.m_payment_id || "").split("-");
    const plan = await getPlan(planId);
    const paid = Number(data.amount_gross);
    if (!plan || !(paid > 0)) {
      return res.status(400).send("Payment details do not match");
    }
    if (paid.toFixed(2) !== plan.amount.toFixed(2)) {
      console.warn("PayFast amount differs from the current plan price", { planId, paid, currentPrice: plan.amount });
    }

    // 4. Confirm with PayFast's server (parameter string without signature or passphrase).
    const validationUrl = process.env.PAYFAST_SANDBOX === "true"
      ? "https://sandbox.payfast.co.za/eng/query/validate"
      : "https://www.payfast.co.za/eng/query/validate";

    const validation = await fetch(validationUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: base
    });
    const validationText = (await validation.text()).trim();

    if (!validation.ok || validationText !== "VALID") {
      return res.status(400).send("PayFast could not validate this notification");
    }

    console.log("Verified PayFast subscription payment", {
      paymentId: data.pf_payment_id,
      reference: data.m_payment_id,
      planId,
      amount: data.amount_gross,
      email: data.email_address,
      token: data.token
    });

    return res.status(200).send("OK");
  } catch (error) {
    console.error("PayFast ITN error:", error);
    return res.status(500).send("Notification processing failed");
  }
};
