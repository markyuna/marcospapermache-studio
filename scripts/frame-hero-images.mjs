// scripts/frame-hero-images.mjs
//
// Rebuilds the hero comparison images so they fill a 1200x1200 frame edge to
// edge WITHOUT a flat cream matte (the previous approach left an uneven cream
// border that read as an unwanted frame).
//
// Technique: a heavily blurred, full-frame copy of the same photo becomes the
// backdrop, and the crisp photo is composited on top slightly scaled down and
// centered. The sculpture keeps breathing room, but the "air" is the scene's
// own tones bleeding out softly — so the image looks like it fills the card
// border to border, with no hard cream band.
//
// The foreground transform (scale + offset) is IDENTICAL for both images, so
// the crisp sculpture sits in the same spot in each frame and the reveal stays
// aligned. (The blurred backdrops differ, but they're soft and abstract at the
// edges, where the divider never needs pixel alignment.)
//
// Originals are NOT overwritten; output uses a `-hero` suffix.

import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.join(__dirname, "..", "public", "images");
const PREVIEW_DIR = process.env.PREVIEW_DIR || null;

const CANVAS = 1200;
const SCALE = 0.84; // crisp sculpture -> ~76% of the frame, rest is soft scene
const BLUR_SIGMA = 34;

const INNER = Math.round(CANVAS * SCALE); // 1008
const OFFSET = Math.round((CANVAS - INNER) / 2); // centered both axes

const TARGETS = [
  { in: "wine-holder-ai-generated.webp", out: "wine-holder-ai-hero.webp" },
  { in: "wine-holder-real.webp", out: "wine-holder-real-hero.webp" },
];

async function frame({ in: inName, out: outName }) {
  const inputPath = path.join(IMAGES_DIR, inName);
  const outputPath = path.join(IMAGES_DIR, outName);

  // Soft full-frame backdrop from the same photo.
  const backdrop = await sharp(inputPath)
    .resize(CANVAS, CANVAS, { fit: "cover", position: "center" })
    .blur(BLUR_SIGMA)
    .modulate({ brightness: 1.04, saturation: 0.9 })
    .toBuffer();

  // Crisp foreground, scaled down, centered.
  const foreground = await sharp(inputPath)
    .resize(INNER, INNER, { fit: "cover", position: "center" })
    .toBuffer();

  const composed = sharp(backdrop).composite([
    { input: foreground, top: OFFSET, left: OFFSET },
  ]);

  await composed.clone().webp({ quality: 90 }).toFile(outputPath);
  console.log(
    `${inName} -> ${outName}  (backdrop blur=${BLUR_SIGMA}, inner ${INNER}x${INNER} @ ${OFFSET},${OFFSET})`,
  );

  if (PREVIEW_DIR) {
    const previewPath = path.join(PREVIEW_DIR, outName.replace(/\.webp$/, ".png"));
    await composed.clone().png().toFile(previewPath);
    console.log(`  preview -> ${previewPath}`);
  }
}

async function run() {
  for (const t of TARGETS) await frame(t);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
