import sharp from "sharp";

export const REFERENCE_MAX_BYTES = 4 * 1024 * 1024;
export const REFERENCE_MAX_SIDE = 1024;
export const REFERENCE_ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type ReferenceErrorCode = "too_large" | "bad_type" | "corrupt";

export type ReferenceResult =
  | { ok: true; buffer: Buffer; mime: "image/png" }
  | { ok: false; code: ReferenceErrorCode };

type AllowedMime = (typeof REFERENCE_ALLOWED_MIME)[number];

function matchesMagicBytes(bytes: Buffer, mime: AllowedMime): boolean {
  switch (mime) {
    case "image/jpeg":
      return (
        bytes.length >= 3 &&
        bytes[0] === 0xff &&
        bytes[1] === 0xd8 &&
        bytes[2] === 0xff
      );
    case "image/png":
      return (
        bytes.length >= 4 &&
        bytes[0] === 0x89 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x4e &&
        bytes[3] === 0x47
      );
    case "image/webp":
      return (
        bytes.length >= 12 &&
        bytes.toString("ascii", 0, 4) === "RIFF" &&
        bytes.toString("ascii", 8, 12) === "WEBP"
      );
  }
}

/**
 * Validates an uploaded reference image and re-encodes it as a clean PNG
 * (EXIF-rotated, metadata stripped, longest side capped). Pure in-memory:
 * nothing is written to disk or Storage. Error codes are stable so API routes
 * can map them to localized messages.
 */
export async function validateAndNormalizeReference(
  file: File,
): Promise<ReferenceResult> {
  if (file.size > REFERENCE_MAX_BYTES) {
    return { ok: false, code: "too_large" };
  }

  if (!(REFERENCE_ALLOWED_MIME as readonly string[]).includes(file.type)) {
    return { ok: false, code: "bad_type" };
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  // Re-check after reading: file.size can't be trusted to match the payload.
  if (bytes.length > REFERENCE_MAX_BYTES) {
    return { ok: false, code: "too_large" };
  }

  if (!matchesMagicBytes(bytes, file.type as AllowedMime)) {
    return { ok: false, code: "bad_type" };
  }

  try {
    const buffer = await sharp(bytes)
      .rotate()
      .resize({
        width: REFERENCE_MAX_SIDE,
        height: REFERENCE_MAX_SIDE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .png()
      .toBuffer();

    return { ok: true, buffer, mime: "image/png" };
  } catch {
    return { ok: false, code: "corrupt" };
  }
}
