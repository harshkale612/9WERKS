#!/usr/bin/env node
/**
 * 9WERKS — responsive image pipeline.
 *
 * Reads the source photographs in `assets-src/photos/` and writes, for each
 * registered photo, an AVIF + WebP responsive set to `public/assets/photos/`
 * plus a tiny blurred placeholder. A manifest consumed by `<Photo>` is written
 * to `src/content/generated/photo-manifest.json`.
 *
 * Widths are never upscaled beyond the source resolution.
 *
 * Usage: node scripts/images/build-images.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const SRC = path.join(ROOT, "assets-src/photos");
const OUT = path.join(ROOT, "public/assets/photos");
const MANIFEST = path.join(ROOT, "src/content/generated/photo-manifest.json");

/** id → source file. Alt text & provenance live in src/content/photos.ts. */
const PHOTOS = {
  facade: "facade-1280.webp",
  porsche: "porsche-1200.webp",
  "bmw-m4": "bmw-m4-1200.webp",
  crew: "crew-1200.webp",
  "m5-lift": "m5-lift-1200.webp",
  "z4-bay": "z4-poster-540.webp",
  wash: "wash-1600.webp",
  ferrari: "ferrari-600.webp",
  brakes: "brakes-500.webp",
  underbody: "underbody-500.webp",
};

const CANDIDATE_WIDTHS = [360, 540, 720, 960, 1200, 1600];

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
  const manifest = {};
  let totalBytes = 0;

  for (const [id, file] of Object.entries(PHOTOS)) {
    const input = path.join(SRC, file);
    const meta = await sharp(input).metadata();
    const srcW = meta.width;
    const srcH = meta.height;
    const widths = [...new Set([...CANDIDATE_WIDTHS.filter((w) => w < srcW), srcW])].sort((a, b) => a - b);

    for (const w of widths) {
      const base = sharp(input).resize({ width: w, withoutEnlargement: true });
      const avifPath = path.join(OUT, `${id}-${w}.avif`);
      const webpPath = path.join(OUT, `${id}-${w}.webp`);
      await base.clone().avif({ quality: 56, effort: 6, chromaSubsampling: "4:2:0" }).toFile(avifPath);
      await base.clone().webp({ quality: 80, effort: 6, smartSubsample: true }).toFile(webpPath);
      totalBytes += (await fs.stat(avifPath)).size + (await fs.stat(webpPath)).size;
    }

    const blurBuf = await sharp(input).resize({ width: 20 }).blur(1.2).webp({ quality: 42 }).toBuffer();
    const { dominant } = await sharp(input).stats();
    const hex = "#" + [dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, "0")).join("");

    manifest[id] = {
      width: srcW,
      height: srcH,
      widths,
      blur: `data:image/webp;base64,${blurBuf.toString("base64")}`,
      dominant: hex,
    };
    console.log(`✓ ${id.padEnd(10)} ${srcW}×${srcH} → [${widths.join(", ")}]`);
  }

  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\nWrote ${Object.keys(manifest).length} photos, ${(totalBytes / 1024).toFixed(0)} KB total → ${path.relative(ROOT, OUT)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
