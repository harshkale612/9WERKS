#!/usr/bin/env node
/**
 * Screenshot helper for visual QA (Playwright + system Google Chrome).
 *
 *   node scripts/qa/shot.mjs <url> <out.png> [--w 1440] [--h 900] [--full] [--mobile]
 *        [--wait 1500] [--scroll] [--reduced] [--at 1200] [--selector "#id"] [--logs]
 *
 *  --full      full-page capture (implies --scroll so scroll-triggered reveals fire)
 *  --scroll    walk the page top→bottom first so ScrollTrigger reveals complete
 *  --mobile    390×844 @2x, touch, mobile UA (iPhone-class)
 *  --reduced   emulate prefers-reduced-motion: reduce
 *  --at N      scroll to N px before a viewport capture
 *  --selector  capture just that element (scrolled into view)
 *  --logs      print browser console errors / page errors
 *
 * Run through scripts/qa/shot.sh to serialise browser launches across agents.
 */
import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
const [url, out] = args;
if (!url || !out) {
  console.error("usage: shot.mjs <url> <out.png> [options]");
  process.exit(2);
}
const flag = (name) => args.includes(`--${name}`);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : def;
};

const mobile = flag("mobile");
const width = Number(opt("w", mobile ? 390 : 1440));
const height = Number(opt("h", mobile ? 844 : 900));
const full = flag("full");
const doScroll = full || flag("scroll");
const wait = Number(opt("wait", 1500));
const at = opt("at", null);
const selector = opt("selector", null);

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--enable-webgl", "--use-angle=swiftshader"],
});
const context = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: mobile ? 2 : 1,
  isMobile: mobile,
  hasTouch: mobile,
  reducedMotion: flag("reduced") ? "reduce" : "no-preference",
  userAgent: mobile
    ? "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1"
    : undefined,
});
const page = await context.newPage();
const logs = [];
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning") logs.push(`[console.${m.type()}] ${m.text()}`);
});
page.on("pageerror", (e) => logs.push(`[pageerror] ${e.message}`));

await page.goto(url, { waitUntil: "networkidle", timeout: 90_000 }).catch((e) => logs.push(`[goto] ${e.message}`));
await page.waitForTimeout(wait);

if (doScroll) {
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += Math.round(height * 0.6)) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(160);
  }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(900);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(700);
}

if (at !== null) {
  await page.evaluate((yy) => window.scrollTo(0, yy), Number(at));
  await page.waitForTimeout(1400);
}

if (selector) {
  const el = page.locator(selector).first();
  await el.scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(1400);
  await el.screenshot({ path: out }).catch((e) => logs.push(`[selector] ${e.message}`));
} else {
  await page.screenshot({ path: out, fullPage: full });
}

const metrics = await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
  height: document.documentElement.scrollHeight,
}));
console.log(`saved ${out}  viewport ${width}×${height}  page height ${metrics.height}px  horizontal overflow: ${metrics.scrollWidth > metrics.clientWidth ? `YES (${metrics.scrollWidth}px)` : "no"}`);
if (flag("logs") || logs.length) console.log(logs.slice(0, 30).join("\n") || "(no console errors)");
await browser.close();
