#!/usr/bin/env node
/**
 * Renders the hero poster stills and the Open Graph image from the live 3D
 * scene (dev server must be running: npm run dev).
 *
 *   node scripts/3d/render-stills.mjs [baseUrl=http://localhost:3000] [finish=champagne]
 *
 * Outputs:
 *   public/assets/renders/hero-{640..2560}.{avif,webp}           landscape poster
 *   public/assets/renders/hero-portrait-{480,720,1080}.{avif,webp} portrait poster (phones)
 *   public/assets/brand/og-9werks.jpg                              1200×630 share image
 * The original logo is composited unmodified (uniform scaling only).
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { chromium } from "@playwright/test";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const base = process.argv[2] ?? "http://localhost:3000";
const finish = process.argv[3] ?? "champagne";
const OUT = path.join(ROOT, "public/assets/renders");
const TMP = path.join(ROOT, ".render-tmp");

const SHOTS = [
  { name: "hero", w: 2560, h: 1440, widths: [640, 960, 1280, 1600, 1920, 2560] },
  { name: "hero-portrait", w: 1080, h: 2000, widths: [480, 720, 1080] },
];

async function capture(browser, shot) {
  const page = await browser.newPage({ viewport: { width: shot.w, height: shot.h }, deviceScaleFactor: 1 });
  await page.goto(`${base}/lab/render/?finish=${finish}`, { waitUntil: "networkidle", timeout: 180_000 });
  await page.waitForSelector('[data-ready="1"]', { timeout: 240_000 });
  await page.waitForTimeout(4000); // environment + reflector settle
  const file = path.join(TMP, `${shot.name}.png`);
  await page.screenshot({ path: file });
  await page.close();
  return file;
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  await fs.mkdir(TMP, { recursive: true });
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
    args: ["--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--use-angle=swiftshader"],
  });
  const files = {};
  for (const shot of SHOTS) {
    files[shot.name] = await capture(browser, shot);
    for (const w of shot.widths) {
      const img = sharp(files[shot.name]).resize({ width: w });
      await img.clone().avif({ quality: 58, effort: 6 }).toFile(path.join(OUT, `${shot.name}-${w}.avif`));
      await img.clone().webp({ quality: 82, effort: 6 }).toFile(path.join(OUT, `${shot.name}-${w}.webp`));
    }
    console.log(`✓ ${shot.name} → ${shot.widths.join(", ")}`);
  }
  await browser.close();

  // Open Graph: render + legibility grade + ORIGINAL logo.
  const logo = await sharp(path.join(ROOT, "assets-src/brand/9werks-logo-official-960.png")).resize({ width: 400 }).png().toBuffer();
  const grade = Buffer.from(
    `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#090807" stop-opacity="0.92"/><stop offset="0.45" stop-color="#090807" stop-opacity="0.35"/><stop offset="1" stop-color="#090807" stop-opacity="0"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/></svg>`
  );
  await sharp(files.hero)
    .resize({ width: 1200, height: 630, fit: "cover", position: "center" })
    .composite([{ input: grade }, { input: logo, left: 64, top: 630 - 64 - Math.round(400 / (960 / 243)) }])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(ROOT, "public/assets/brand/og-9werks.jpg"));
  console.log("✓ og-9werks.jpg");
  await fs.rm(TMP, { recursive: true, force: true });
}

try {
  await main();
} catch (err) {
  console.error(err);
  process.exit(1);
}
