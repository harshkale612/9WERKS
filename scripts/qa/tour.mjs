#!/usr/bin/env node
/**
 * Visual QA "tour": scrolls a page like a visitor (viewport by viewport),
 * letting scroll-triggered reveals play, and saves one screenshot per step.
 * Full-page screenshots are unreliable here (svh units + ScrollTrigger).
 *
 *   node scripts/qa/tour.mjs <url> <outDir> [--mobile] [--step 0.85] [--wait 1100]
 */
import fs from "node:fs";
import path from "node:path";
import { chromium, devices } from "@playwright/test";

const [url, outDir] = process.argv.slice(2);
const args = process.argv.slice(2);
const mobile = args.includes("--mobile");
const opt = (n, d) => (args.includes(`--${n}`) ? Number(args[args.indexOf(`--${n}`) + 1]) : d);
const stepRatio = opt("step", 0.85);
const wait = opt("wait", 1100);
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const ctx = await browser.newContext(mobile ? { ...devices["iPhone 13"] } : { viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => sessionStorage.setItem("9w-intro", "1"));
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "networkidle", timeout: 120_000 });
await page.waitForTimeout(wait * 2);
const vh = page.viewportSize().height;
const total = await page.evaluate(() => document.documentElement.scrollHeight);
let i = 0;
for (let y = 0; y < total; y += Math.round(vh * stepRatio)) {
  await page.mouse.wheel(0, i === 0 ? 0 : Math.round(vh * stepRatio));
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(wait);
  await page.screenshot({ path: path.join(outDir, `${String(i).padStart(2, "0")}.png`) });
  i++;
}
console.log(`${i} frames → ${outDir} (page ${total}px)`);
await browser.close();
