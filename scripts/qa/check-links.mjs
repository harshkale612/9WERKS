#!/usr/bin/env node
/**
 * Link & asset checker for the static export.
 *
 *   node scripts/qa/check-links.mjs [dir=out]
 *
 * For every HTML page in out/: each internal href/src/srcset/poster/content
 * URL must resolve to a file (trailing-slash routes → index.html), every
 * #fragment must match an id on its target page, no link may point at /lab/,
 * and the business contact links must use the official values.
 * Exits non-zero on any problem.
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? "out");
const OFFICIAL = { tel: "tel:+917083199986", mail: "mailto:9werks9@gmail.com", wa: "https://wa.me/917083199986" };

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

const pages = walk(root);
const idsCache = new Map();
const ids = (file) => {
  if (!idsCache.has(file)) {
    const html = fs.readFileSync(file, "utf8");
    idsCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idsCache.get(file);
};

function resolveTarget(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const p = path.join(root, clean);
  if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
  if (fs.existsSync(path.join(p, "index.html"))) return path.join(p, "index.html");
  return null;
}

const problems = [];
const external = new Map();
let checked = 0;

for (const page of pages) {
  const rel = "/" + path.relative(root, page).replace(/index\.html$/, "");
  const html = fs.readFileSync(page, "utf8");
  const urls = new Set();
  for (const m of html.matchAll(/\s(?:href|src|poster)="([^"]+)"/g)) urls.add(m[1]);
  // <meta content="…"> only when it is a URL (og:image etc.), never colours like "#090807".
  for (const m of html.matchAll(/\scontent="((?:\/|https?:)[^"]*)"/g)) urls.add(m[1]);
  for (const m of html.matchAll(/\ssrcSet="([^"]+)"|\ssrcset="([^"]+)"/g)) {
    (m[1] ?? m[2]).split(",").forEach((part) => urls.add(part.trim().split(/\s+/)[0]));
  }
  for (const raw of urls) {
    const u = raw.replace(/&amp;/g, "&");
    if (/^(tel:|mailto:|https?:)/.test(u)) {
      if (u.startsWith("tel:") && u !== OFFICIAL.tel) problems.push(`${rel}: unexpected phone link ${u}`);
      if (u.startsWith("mailto:") && !u.startsWith(OFFICIAL.mail)) problems.push(`${rel}: unexpected email link ${u}`);
      if (u.includes("wa.me/") && !u.startsWith(OFFICIAL.wa)) problems.push(`${rel}: unexpected WhatsApp link ${u}`);
      if (/^https?:/.test(u) && !u.startsWith("https://www.9werksofficial.com")) external.set(u.split("?")[0], (external.get(u.split("?")[0]) ?? 0) + 1);
      continue;
    }
    if (!u.startsWith("/") && !u.startsWith("#")) continue; // data: URIs, relative oddities, plain text
    checked++;
    if (u.startsWith("/lab/")) problems.push(`${rel}: links to dev-only route ${u}`);
    const [pathPart, fragment] = u.split("#");
    const targetFile = pathPart ? resolveTarget(pathPart) : page;
    if (!targetFile) {
      problems.push(`${rel}: broken ${u}`);
      continue;
    }
    if (fragment && targetFile.endsWith(".html") && !ids(targetFile).has(fragment) && fragment !== "top") {
      problems.push(`${rel}: missing anchor #${fragment} on ${pathPart || rel}`);
    }
  }
}

console.log(`Pages: ${pages.length} · internal URLs checked: ${checked}`);
console.log(`External destinations (${external.size}):`);
for (const [u, n] of [...external].sort()) console.log(`  ${String(n).padStart(3)} × ${u}`);
if (problems.length) {
  console.error(`\n✗ ${problems.length} problem(s):`);
  problems.forEach((p) => console.error("  - " + p));
  process.exit(1);
}
console.log("\n✓ No broken internal links, assets or anchors.");
