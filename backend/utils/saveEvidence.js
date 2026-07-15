const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const EVIDENCE_DIR = path.join(__dirname, "..", "uploads", "evidence");
const MAX_EVIDENCE_BYTES = 1.5 * 1024 * 1024; // ~1.5MB decoded — generous for a compressed JPEG snapshot

/* =========================================================
   SAVE EVIDENCE IMAGE
   Decodes a "data:image/jpeg;base64,...." string from the client and
   writes it to disk under /uploads/evidence. Returns the public URL path
   (e.g. "/uploads/evidence/xyz.jpg"), or null if the input is missing,
   malformed, or oversized — this never throws, since a failed evidence
   capture should never block logging the underlying violation.
========================================================= */
function saveEvidenceImage(dataUrl) {
  if (!dataUrl || typeof dataUrl !== "string") return null;

  const match = /^data:image\/(jpeg|jpg|png);base64,(.+)$/.exec(dataUrl);
  if (!match) return null;

  const ext = match[1] === "png" ? "png" : "jpg";
  const buffer = Buffer.from(match[2], "base64");

  if (buffer.length === 0 || buffer.length > MAX_EVIDENCE_BYTES) return null;

  try {
    fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
    const filename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${ext}`;
    fs.writeFileSync(path.join(EVIDENCE_DIR, filename), buffer);
    return `/uploads/evidence/${filename}`;
  } catch {
    return null;
  }
}

module.exports = { saveEvidenceImage };
