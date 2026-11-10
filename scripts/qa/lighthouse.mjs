#!/usr/bin/env node
/**
 * Lighthouse runner for the production export (serve it first: npm run preview).
 *
 *   node scripts/qa/lighthouse.mjs [baseUrl=http://localhost:4173] [--desktop] [paths...]
 *
 * Writes JSON reports to qa-artifacts/lighthouse/ and prints scores + Core Web
 * Vitals (lab). Uses the system Google Chrome.
 * Note: on machines without a GPU, WebGL runs in software (SwiftShader), which
 * makes the 3D pages' performance numbers pessimistic.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const desktop = args.includes("--desktop");
const positional = args.filter((a) => !a.startsWith("--"));
const base = positional[0]?.startsWith("http") ? positional.shift() : "http://localhost:4173";
const paths = positional.length ? positional : ["/", "/about/", "/services/", "/services/brakes/", "/contact/", "/booking/"];
const outDir = path.resolve("qa-artifacts/lighthouse");
fs.mkdirSync(outDir, { recursive: true });

const rows = [];
for (const p of paths) {
  const name = `${desktop ? "desktop" : "mobile"}${p.replace(/\//g, "_") || "_home"}`;
  const out = path.join(outDir, `${name}.json`);
  const flags = [
    "--yes",
    "lighthouse@13.6.0",
    base + p,
    "--quiet",
    "--chrome-path=/usr/bin/google-chrome-stable",
    "--chrome-flags=--headless=new --no-sandbox --enable-unsafe-swiftshader",
    "--only-categories=performance,accessibility,best-practices,seo",
    "--output=json",
    `--output-path=${out}`,
  ];
  if (desktop) flags.push("--preset=desktop");
  try {
    execFileSync("npx", flags, { stdio: "ignore", timeout: 240_000 });
    const r = JSON.parse(fs.readFileSync(out, "utf8"));
    const a = r.audits;
    const score = (k) => Math.round((r.categories[k]?.score ?? 0) * 100);
    rows.push({
      page: p,
      perf: score("performance"),
      a11y: score("accessibility"),
      bp: score("best-practices"),
      seo: score("seo"),
      FCP: a["first-contentful-paint"]?.displayValue,
      LCP: a["largest-contentful-paint"]?.displayValue,
      TBT: a["total-blocking-time"]?.displayValue,
      CLS: a["cumulative-layout-shift"]?.displayValue,
      SI: a["speed-index"]?.displayValue,
    });
  } catch (e) {
    rows.push({ page: p, error: String(e.message).slice(0, 120) });
  }
}
console.log(`Lighthouse (${desktop ? "desktop" : "mobile"}) — ${base}`);
console.table(rows);
