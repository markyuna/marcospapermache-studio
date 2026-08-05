// scripts/crop-hero-images.mjs
//
// Crops the two hero comparison-slider images to a shared 4:5 frame.
//
// Both outputs MUST end up with identical dimensions and the same crop
// geometry, otherwise the reveal (clip-path) desyncs when the divider moves.
// We therefore use a deterministic centered cover crop for BOTH images
// (never `attention`, which would pick a different offset per image).
//
// Usage:
//   node scripts/crop-hero-images.mjs
//   node scripts/crop-hero-images.mjs --top-bias=0.15   # shift crop window up
//
// A positive --top-bias keeps MORE of the top of the image (useful if the
// centered crop clips the top of the sculpture). Range roughly [-0.5, 0.5].

import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.join(__dirname, "..", "public", "images");
const PREVIEW_DIR = process.env.PREVIEW_DIR || null;

// Shared 4:5 output frame.
const TARGET_W = 1024;
const TARGET_H = 1280;

const TARGETS = [
  { in: "wine-holder-ai-generated.webp", out: "wine-holder-ai-generated-4x5.webp" },
  { in: "wine-holder-real-sculpture.webp", out: "wine-holder-real-sculpture-4x5.webp" },
];

function parseBias() {
  const arg = process.argv.find((a) => a.startsWith("--top-bias="));
  if (!arg) return 0;
  const v = Number.parseFloat(arg.split("=")[1]);
  return Number.isFinite(v) ? Math.max(-0.5, Math.min(0.5, v)) : 0;
}

// Deterministic 4:5 cover crop with an optional vertical bias, applied
// identically to every image so the two frames line up pixel-for-pixel.
async function cropToFrame(inputPath, bias) {
  const img = sharp(inputPath);
  const meta = await img.metadata();
  const srcW = meta.width;
  const srcH = meta.height;

  const targetRatio = TARGET_W / TARGET_H; // 0.8
  const srcRatio = srcW / srcH;

  let cropW;
  let cropH;
  if (srcRatio > targetRatio) {
    // Source is wider than 4:5 -> crop the sides.
    cropH = srcH;
    cropW = Math.round(srcH * targetRatio);
  } else {
    // Source is taller than 4:5 -> crop top/bottom.
    cropW = srcW;
    cropH = Math.round(srcW / targetRatio);
  }

  const left = Math.round((srcW - cropW) / 2); // always horizontally centered
  const maxTop = srcH - cropH;
  // bias 0 = centered; positive = window moves up (keeps more top).
  let top = Math.round(maxTop / 2 - bias * maxTop);
  top = Math.max(0, Math.min(maxTop, top));

  return {
    meta: { srcW, srcH, cropW, cropH, left, top },
    pipeline: img.extract({ left, top, width: cropW, height: cropH }).resize(TARGET_W, TARGET_H),
  };
}

async function run() {
  const bias = parseBias();
  console.log(`Target frame: ${TARGET_W}x${TARGET_H} (4:5), top-bias=${bias}\n`);

  for (const t of TARGETS) {
    const inputPath = path.join(IMAGES_DIR, t.in);
    const outputPath = path.join(IMAGES_DIR, t.out);

    const { meta, pipeline } = await cropToFrame(inputPath, bias);

    await pipeline.clone().webp({ quality: 90 }).toFile(outputPath);
    console.log(
      `${t.in}  (${meta.srcW}x${meta.srcH})\n` +
        `  -> extract left=${meta.left} top=${meta.top} ${meta.cropW}x${meta.cropH}` +
        ` -> resize ${TARGET_W}x${TARGET_H}\n` +
        `  -> ${t.out}`,
    );

    if (PREVIEW_DIR) {
      const previewPath = path.join(PREVIEW_DIR, t.out.replace(/\.webp$/, ".png"));
      await pipeline.clone().png().toFile(previewPath);
      console.log(`  -> preview ${previewPath}`);
    }
    console.log("");
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
