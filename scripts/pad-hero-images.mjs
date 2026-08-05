// scripts/pad-hero-images.mjs
//
// The square 1200x1200 source images have the sculpture flush against the
// bottom edge (0% margin) and only ~10% air on top, so the hero slider looks
// cropped. This script rebuilds them with real vertical breathing room:
//
//   - Scale the whole photo down to SCALE (sculpture -> ~72% of the frame).
//   - Composite it, with an IDENTICAL transform for both images, onto a
//     1200x1200 cream (#F5F1E8) canvas so the sculpture is vertically centered
//     with ~14% air top and bottom.
//
// The transform (scale + offset) is the SAME for both files, so the sculpture
// stays in the same place in each frame and the reveal never desyncs.
//
// Originals are NOT overwritten; output uses a `-padded` suffix.

import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.join(__dirname, "..", "public", "images");
const PREVIEW_DIR = process.env.PREVIEW_DIR || null;

const CANVAS = 1200; // final square frame
const SCALE = 0.8; // 90%-tall sculpture -> ~72% of the frame
const CREAM = { r: 245, g: 241, b: 232, alpha: 1 }; // #F5F1E8

const INNER = Math.round(CANVAS * SCALE); // 960
const LEFT = Math.round((CANVAS - INNER) / 2); // horizontally centered
// Vertical offset chosen so the sculpture (top ~10%, base flush at bottom in
// the source) ends up with equal air above and below after scaling.
const TOP = 73;

const TARGETS = [
  { in: "wine-holder-ai-generated.webp", out: "wine-holder-ai-padded.webp" },
  { in: "wine-holder-real.webp", out: "wine-holder-real-padded.webp" },
];

async function pad({ in: inName, out: outName }) {
  const inputPath = path.join(IMAGES_DIR, inName);
  const outputPath = path.join(IMAGES_DIR, outName);

  const inner = await sharp(inputPath)
    .resize(INNER, INNER, { fit: "cover", position: "center" })
    .toBuffer();

  const base = sharp({
    create: { width: CANVAS, height: CANVAS, channels: 4, background: CREAM },
  }).composite([{ input: inner, top: TOP, left: LEFT }]);

  await base.clone().webp({ quality: 90 }).toFile(outputPath);
  console.log(
    `${inName} -> ${outName}  (canvas ${CANVAS}x${CANVAS}, inner ${INNER}x${INNER} @ top=${TOP} left=${LEFT})`,
  );

  if (PREVIEW_DIR) {
    const previewPath = path.join(PREVIEW_DIR, outName.replace(/\.webp$/, ".png"));
    await base.clone().png().toFile(previewPath);
    console.log(`  preview -> ${previewPath}`);
  }
}

async function run() {
  for (const t of TARGETS) await pad(t);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
