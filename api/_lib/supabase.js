// Small helper for talking to the Supabase database from the server.
// Files starting with "_" are NOT public URLs on Vercel; this is only used by other API files.
const crypto = require("crypto");

function config() {
  const url = (process.env.SUPABASE_URL || "").trim().replace(/\/+$/, "");
  const key = (process.env.SUPABASE_SERVICE_KEY || "").trim();
  if (!url || !key) {
    const err = new Error("The database is not configured yet. Add SUPABASE_URL and SUPABASE_SERVICE_KEY in Vercel.");
    err.status = 500;
    throw err;
  }
  return { url, key };
}

// path example: "reviews?status=eq.approved&select=id,name"
async function db(path, { method = "GET", body, prefer } = {}) {
  const { url, key } = config();
  const headers = { apikey: key, "Content-Type": "application/json" };
  if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`; // legacy service_role keys
  if (prefer) headers.Prefer = prefer;

  const response = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }

  if (!response.ok) {
    const err = new Error((data && data.message) || `Database error (${response.status})`);
    err.status = 502;
    err.detail = data;
    throw err;
  }
  return data;
}

// One-way hash so we can rate-limit without storing a visitor's real IP address.
function hashIp(ip) {
  const { key } = config();
  return crypto.createHash("sha256").update(`${ip}|${key}`).digest("hex");
}

function clientIp(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwarded || (req.socket && req.socket.remoteAddress) || "unknown";
}

function safeEqual(a, b) {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body); } catch (e) { return {}; }
  }
  return {};
}

// Uploads a picture to a public Supabase Storage bucket and returns its public web address.
async function storageUpload(bucket, objectPath, buffer, contentType) {
  const { url, key } = config();
  const headers = { apikey: key, "Content-Type": contentType, "x-upsert": "false" };
  if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`;

  const response = await fetch(`${url}/storage/v1/object/${bucket}/${objectPath}`, { method: "POST", headers, body: buffer });
  if (!response.ok) {
    let message = "";
    try { message = (await response.json()).message || ""; } catch (e) { /* ignore */ }
    const err = new Error(message || `Image upload failed (${response.status})`);
    err.status = 502;
    throw err;
  }
  return `${url}/storage/v1/object/public/${bucket}/${objectPath}`;
}

module.exports = { db, hashIp, clientIp, safeEqual, readBody, storageUpload, config };
