#!/usr/bin/env node
/**
 * Dark-theme guard: every <section>, <header>, <footer> and full-width block on
 * every route must have a dark background (relative luminance < 0.05).
 *   node scripts/qa/check-dark.mjs [baseUrl=http://localhost:4173]
 */
import { chromium } from "@playwright/test";
const base = process.argv[2] ?? "http://localhost:4173";
const routes = ["/", "/about/", "/services/", "/services/servicing-routine-checks/", "/services/performance-diagnostics/", "/services/brakes/", "/services/collision-repair-paint/", "/services/wraps-detailing/", "/services/alloy-wheels-tyres/", "/contact/", "/booking/", "/404/"];
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
let bad = 0;
for (const r of routes) {
  await page.goto(base + r, { waitUntil: "load" });
  const res = await page.evaluate(() => {
    const lum = (rgb) => {
      const m = rgb.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 1];
      if (m.length === 4 && m[3] === 0) return null; // transparent
      const [R, G, B] = m.slice(0, 3).map((c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
      return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    };
    const out = [];
    for (const el of document.querySelectorAll("main section, main > div > section, footer, header, body")) {
      const l = lum(getComputedStyle(el).backgroundColor);
      if (l !== null && l > 0.05) out.push(`${el.tagName.toLowerCase()}#${el.id || ""}.${String(el.className).slice(0, 50)} lum=${l.toFixed(3)}`);
    }
    return { count: document.querySelectorAll("main section").length, out };
  });
  bad += res.out.length;
  console.log(`${res.out.length ? "✗" : "✓"} ${r.padEnd(38)} ${res.count} sections${res.out.length ? "\n    " + res.out.join("\n    ") : ""}`);
}
await browser.close();
console.log(bad ? `\n✗ ${bad} light background(s) found` : "\n✓ Every section on every route is dark.");
process.exit(bad ? 1 : 0);
