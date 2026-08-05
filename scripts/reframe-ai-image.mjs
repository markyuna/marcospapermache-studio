// scripts/reframe-ai-image.mjs
//
// Registers the AI render onto the real photo so the comparison slider shows the
// sculpture at the SAME size and position on both sides. The two are different
// depictions (render vs 3/4 photo), so we align them by measurable anchors:
//   - vertical: the sculpture's top and bottom edges (the base reaches the
//     bottom in both) -> gives the scale and the vertical offset,
//   - horizontal: the gold slab's centroid.
// The AI is scaled to match the real's sculpture height, then cropped to
// 1200x1200 so the base and the gold slab line up with the real's.
//
// Input:  wine-holder-ai-generated.webp (freshly regenerated, any square size)
// Output: wine-holder-ai.webp            (1200x1200, registered to the photo)

import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.join(__dirname, "..", "public", "images");
const SIZE = 1200;

// Sculpture anchors within a SIZE×SIZE buffer: top & bottom rows of the
// white/gold body, and the horizontal centroid of the gold slab.
async function anchors(buf) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const row = new Array(H).fill(0);
  let gx = 0;
  let gn = 0;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * C;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const mn = Math.min(r, g, b);
      const mx = Math.max(r, g, b);
      const white = mn > 240 && mx - mn < 10;
      const gold = r > 150 && g > 95 && b < 115 && r - b > 55;
      if (white || gold) row[y]++;
      if (gold && y < H * 0.45) {
        gx += x;
        gn++;
      }
    }
  const thr = W * 0.05;
  let top = 0;
  while (top < H && row[top] < thr) top++;
  let bottom = H - 1;
  while (bottom > 0 && row[bottom] < thr) bottom--;
  return { top, bottom, goldCx: gx / gn };
}

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

async function run() {
  const aiSquare = await sharp(path.join(IMAGES_DIR, "wine-holder-ai-generated.webp"))
    .resize(SIZE, SIZE)
    .toBuffer();
  const realSquare = await sharp(path.join(IMAGES_DIR, "wine-holder-real.webp"))
    .resize(SIZE, SIZE)
    .toBuffer();

  const ai = await anchors(aiSquare);
  const real = await anchors(realSquare);

  const scale = (real.bottom - real.top) / (ai.bottom - ai.top);
  const scaled = Math.round(SIZE * scale);

  // Where the AI anchors land after scaling, and how much to crop so they meet
  // the real's anchors.
  const yOff = clamp(Math.round(ai.bottom * scale - real.bottom), 0, scaled - SIZE);
  const xOff = clamp(Math.round(ai.goldCx * scale - real.goldCx), 0, scaled - SIZE);

  console.log("AI  ", ai, "\nREAL", real, "\nscale", scale.toFixed(4), "crop", { xOff, yOff });

  const scaledBuf = await sharp(aiSquare).resize(scaled, scaled).toBuffer();
  await sharp(scaledBuf)
    .extract({ left: xOff, top: yOff, width: SIZE, height: SIZE })
    .webp({ quality: 90 })
    .toFile(path.join(IMAGES_DIR, "wine-holder-ai.webp"));

  const out = await anchors(
    await sharp(path.join(IMAGES_DIR, "wine-holder-ai.webp")).toBuffer(),
  );
  console.log("OUT ", out, "(should match REAL)");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
