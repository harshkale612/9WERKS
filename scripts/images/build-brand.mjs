#!/usr/bin/env node
/**
 * 9WERKS — brand asset preparation.
 *
 * The supplied logo is the single source of truth. This script never redraws,
 * recolours, crops or re-proportions it. It only:
 *   - copies the original files into public/assets/brand/ unchanged, and
 *   - writes LOSSLESS WebP copies (pixel-identical) for lighter delivery, and
 *   - derives favicon / app icons from the official 9WERKS icon (uniform scaling only).
 *
 * Usage: node scripts/images/build-brand.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const SRC_BRAND = path.join(ROOT, "assets-src/brand");
const SRC_ICONS = path.join(ROOT, "assets-src/icons");
const OUT = path.join(ROOT, "public/assets/brand");
const APP = path.join(ROOT, "src/app");

/** Minimal ICO writer (PNG-compressed entries). */
function buildIco(pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6 + 16 * count);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);
  let offset = header.length;
  pngBuffers.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i;
    header.writeUInt8(size >= 256 ? 0 : size, e);
    header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt8(0, e + 2);
    header.writeUInt8(0, e + 3);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(data.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...pngBuffers.map((p) => p.data)]);
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });

  // Originals, byte-for-byte.
  await fs.copyFile(path.join(SRC_BRAND, "9werks-logo-supplied.jpg"), path.join(OUT, "9werks-logo-supplied.jpg"));
  await fs.copyFile(path.join(SRC_BRAND, "9werks-logo-official-960.png"), path.join(OUT, "9werks-logo-960.png"));
  await fs.copyFile(path.join(SRC_BRAND, "9werks-logo-official-480.png"), path.join(OUT, "9werks-logo-480.png"));

  // Lossless (pixel-identical) WebP copies.
  for (const w of [960, 480]) {
    await sharp(path.join(SRC_BRAND, `9werks-logo-official-${w}.png`))
      .webp({ lossless: true, effort: 6 })
      .toFile(path.join(OUT, `9werks-logo-${w}.webp`));
  }

  // App icons from the official 9WERKS icon.
  const icon512 = path.join(SRC_ICONS, "icon-512.png");
  await fs.copyFile(icon512, path.join(OUT, "icon-512.png"));
  await fs.copyFile(path.join(SRC_ICONS, "icon-192.png"), path.join(OUT, "icon-192.png"));
  await fs.copyFile(icon512, path.join(APP, "icon.png"));
  await fs.copyFile(path.join(SRC_ICONS, "apple-touch-icon.png"), path.join(APP, "apple-icon.png"));

  const icoEntries = [];
  for (const size of [16, 32, 48]) {
    icoEntries.push({ size, data: await sharp(icon512).resize(size, size, { kernel: "lanczos3" }).png().toBuffer() });
  }
  await fs.writeFile(path.join(APP, "favicon.ico"), buildIco(icoEntries));

  for (const f of await fs.readdir(OUT)) {
    const s = await fs.stat(path.join(OUT, f));
    console.log(`${String(s.size).padStart(8)}  public/assets/brand/${f}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
