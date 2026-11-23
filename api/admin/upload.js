// Private endpoint: uploads a project picture to Supabase Storage and returns its public address.
//   POST /api/admin/upload { data: "<base64 image>" }
const crypto = require("crypto");
const { readBody, storageUpload } = require("../_lib/supabase");
const { requireAdmin } = require("../_lib/adminAuth");

const MAX_BYTES = 2.5 * 1024 * 1024;

function detect(buffer) {
  if (buffer.length > 12 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return { ext: "jpg", type: "image/jpeg" };
  if (buffer.length > 12 && buffer.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { ext: "png", type: "image/png" };
  if (buffer.length > 12 && buffer.slice(0, 4).toString() === "RIFF" && buffer.slice(8, 12).toString() === "WEBP") return { ext: "webp", type: "image/webp" };
  return null;
}

module.exports = async (req, res) => {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const { data } = readBody(req);
    const base64 = String(data || "").replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(base64, "base64");

    if (!buffer.length) return res.status(400).json({ error: "No picture received." });
    if (buffer.length > MAX_BYTES) return res.status(413).json({ error: "That picture is too big. Please use one under 2.5 MB." });

    const kind = detect(buffer);
    if (!kind) return res.status(400).json({ error: "Please upload a JPG, PNG or WebP picture." });

    const objectPath = `projects/${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${kind.ext}`;
    const url = await storageUpload("project-images", objectPath, buffer, kind.type);
    return res.status(201).json({ ok: true, url });
  } catch (error) {
    console.error("Upload error:", error.message);
    return res.status(502).json({ error: error.message || "Upload failed." });
  }
};
