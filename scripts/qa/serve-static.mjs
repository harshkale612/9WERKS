#!/usr/bin/env node
/**
 * Zero-dependency static server for the exported site (out/) that behaves
 * like the production host: /path/ → /path/index.html, /path → 308 /path/
 * when that directory exists, unknown paths → 404.html with status 404.
 *
 *   node scripts/qa/serve-static.mjs [dir=out] [port=4173]
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? "out");
const port = Number(process.argv[3] ?? 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".glb": "model/gltf-binary",
  ".wasm": "application/wasm",
  ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json",
};

function send(res, status, file, method) {
  const type = TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream";
  const stat = fs.statSync(file);
  res.writeHead(status, { "Content-Type": type, "Content-Length": stat.size, "Cache-Control": "no-cache" });
  if (method === "HEAD") return res.end();
  fs.createReadStream(file).pipe(res);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${port}`);
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    res.writeHead(400).end("Bad request");
    return;
  }
  const target = path.join(root, pathname);
  if (!target.startsWith(root)) {
    res.writeHead(403).end("Forbidden");
    return;
  }
  const isFile = (p) => fs.existsSync(p) && fs.statSync(p).isFile();
  const isDir = (p) => fs.existsSync(p) && fs.statSync(p).isDirectory();

  if (isFile(target)) return send(res, 200, target, req.method);
  if (isDir(target)) {
    if (!pathname.endsWith("/")) {
      res.writeHead(308, { Location: `${pathname}/${url.search}` }).end();
      return;
    }
    const index = path.join(target, "index.html");
    if (isFile(index)) return send(res, 200, index, req.method);
  }
  if (isFile(`${target}.html`)) return send(res, 200, `${target}.html`, req.method);
  const notFound = path.join(root, "404.html");
  if (isFile(notFound)) return send(res, 404, notFound, req.method);
  res.writeHead(404).end("Not found");
});

server.listen(port, () => console.log(`Serving ${root} at http://localhost:${port}`));
