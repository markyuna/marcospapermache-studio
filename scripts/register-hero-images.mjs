// scripts/register-hero-images.mjs
//
// The AI render and the real photo are both 1200x1200, but the sculpture is not
// spatially registered: its warm features (gold slab + bottles) centre at ~50.7%
// of the width in the AI image and ~57.2% in the real photo. In the comparison
// slider that ~78px horizontal offset makes the two halves look mismatched
// ("one bigger than the other"). CSS object-fit cannot fix this (both are 1:1 in
// a 1:1 box) — the pixels themselves must be re-aligned.
//
// Fix: shift the real photo left so its sculpture centres on the same column as
// the AI one, then extend the exposed right edge by copying edge pixels (that
// side is plain wall, so it stays seamless). The AI image is already centred, so
// it's copied through unchanged to keep a matched, clearly-named pair.

import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.join(__dirname, "..", "public", "images");
const PREVIEW_DIR = process.env.PREVIEW_DIR || null;

const SIZE = 1200;
const SHIFT = 78; // px to move the real sculpture left (57.2% -> ~50.7%)

async function centroidX(buf) {
  const { data, info } = await sharp(buf)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  let sx = 0;
  let n = 0;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * C;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const gold = r > 150 && g > 95 && b < 115 && r - b > 55;
      const amber = b < 95 && r > 110 && g > 75 && r - b > 40;
      if (gold || amber) {
        sx += x;
        n++;
      }
    }
  return (sx / n / W) * 100;
}

async function run() {
  const aiIn = path.join(IMAGES_DIR, "wine-holder-ai-generated.webp");
  const realIn = path.join(IMAGES_DIR, "wine-holder-real.webp");
  const aiOut = path.join(IMAGES_DIR, "wine-holder-ai-reg.webp");
  const realOut = path.join(IMAGES_DIR, "wine-holder-real-reg.webp");

  // AI: passthrough (already centred).
  const aiBuf = await sharp(aiIn).resize(SIZE, SIZE).toBuffer();
  await sharp(aiBuf).webp({ quality: 90 }).toFile(aiOut);

  // Real: crop SHIFT px off the left, extend the same amount of wall on the right.
  const realBuf = await sharp(realIn)
    .extract({ left: SHIFT, top: 0, width: SIZE - SHIFT, height: SIZE })
    .extend({ right: SHIFT, extendWith: "copy" })
    .resize(SIZE, SIZE)
    .toBuffer();
  await sharp(realBuf).webp({ quality: 90 }).toFile(realOut);

  console.log("AI   centroidX:", (await centroidX(aiBuf)).toFixed(1) + "%");
  console.log("REAL centroidX:", (await centroidX(realBuf)).toFixed(1) + "% (was 57.2%)");

  if (PREVIEW_DIR) {
    const a = await sharp(aiBuf).resize(400, 400).toBuffer();
    const r = await sharp(realBuf).resize(400, 400).toBuffer();
    await sharp({
      create: { width: 812, height: 400, channels: 3, background: { r: 20, g: 20, b: 20 } },
    })
      .composite([
        { input: a, left: 0, top: 0 },
        { input: r, left: 412, top: 0 },
      ])
      .png()
      .toFile(path.join(PREVIEW_DIR, "registered-side-by-side.png"));
    console.log("preview -> registered-side-by-side.png");
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
