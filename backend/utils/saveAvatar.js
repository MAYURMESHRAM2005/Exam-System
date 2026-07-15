const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const AVATAR_DIR = path.join(__dirname, "..", "uploads", "avatars");

// Decoded-size ceiling. Kept comfortably under the global 2MB JSON body
// limit (server.js) once base64 inflation (~33%) is accounted for — the
// frontend compresses/resizes photos client-side before upload anyway, so
// a genuine profile photo should land well under this in practice.
const MAX_AVATAR_BYTES = 1 * 1024 * 1024; // 1MB decoded
const ALLOWED_FORMATS = new Set(["jpeg", "jpg", "png", "webp"]);

class AvatarValidationError extends Error {}

/* =========================================================
   SAVE AVATAR IMAGE
   Decodes a "data:image/jpeg;base64,...." string and writes it to disk
   under /uploads/avatars. Unlike saveEvidenceImage (best-effort, silent),
   this is a direct student-initiated upload — bad input should surface as
   a real, specific validation error rather than being swallowed.
========================================================= */
function saveAvatarImage(dataUrl) {
  if (!dataUrl || typeof dataUrl !== "string") {
    throw new AvatarValidationError("No image data was provided.");
  }

  const match = /^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/.exec(dataUrl);
  if (!match) {
    throw new AvatarValidationError("Image data is malformed.");
  }

  const format = match[1].toLowerCase();
  if (!ALLOWED_FORMATS.has(format)) {
    throw new AvatarValidationError(
      "Unsupported image format. Please upload a JPEG, PNG, or WEBP image."
    );
  }

  const buffer = Buffer.from(match[2], "base64");
  if (buffer.length === 0) {
    throw new AvatarValidationError("The image appears to be empty.");
  }
  if (buffer.length > MAX_AVATAR_BYTES) {
    throw new AvatarValidationError(
      `Image is too large (max ${Math.round(MAX_AVATAR_BYTES / 1024)}KB after compression).`
    );
  }

  const ext = format === "jpeg" ? "jpg" : format;
  fs.mkdirSync(AVATAR_DIR, { recursive: true });
  const filename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${ext}`;
  fs.writeFileSync(path.join(AVATAR_DIR, filename), buffer);
  return `/uploads/avatars/${filename}`;
}

/* =========================================================
   DELETE AVATAR IMAGE
   Best-effort: removing the old file when replacing/removing a photo is
   disk hygiene, not something that should ever block the actual request.
========================================================= */
function deleteAvatarImage(avatarUrl) {
  if (!avatarUrl || typeof avatarUrl !== "string") return;
  if (!avatarUrl.startsWith("/uploads/avatars/")) return; // never touch paths outside our own directory

  const filename = path.basename(avatarUrl);
  const filePath = path.join(AVATAR_DIR, filename);

  // Guard against path traversal (e.g. "../../something") collapsing back
  // outside AVATAR_DIR after basename/join — belt and suspenders since
  // basename() alone should already strip any directory components.
  if (!filePath.startsWith(AVATAR_DIR)) return;

  try {
    fs.unlinkSync(filePath);
  } catch {
    // file may already be gone — fine either way
  }
}

module.exports = { saveAvatarImage, deleteAvatarImage, AvatarValidationError };
