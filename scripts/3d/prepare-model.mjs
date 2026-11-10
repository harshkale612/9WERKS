#!/usr/bin/env node
/**
 * 9WERKS — 3D vehicle preparation pipeline.
 *
 * Source: "Car Concept" — Khronos glTF Sample Assets
 *   https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept
 *   © 2024 Darmstadt Graphics Group GmbH, artist Eric Chadwick — CC BY 4.0
 *   (derived from a CC0 / public-domain model by "Unity Fan").
 *
 * The Khronos and 3D Commerce logos in the source are trademarks that the
 * CC BY licence does NOT cover, so this script removes every one of them:
 *   - number plate texture (Khronos wordmark)  → replaced by a 9WERKS plate
 *                                                built from the ORIGINAL logo PNG
 *   - tyre sidewall colour texture (wordmarks) → removed (solid rubber colour)
 *   - tyre sidewall normal map (embossed logos) → logo regions flattened
 *   - emissive slots that referenced the logo  → removed (they never glow)
 *
 * It also: drops the KHR_materials_variants set and the costly
 * KHR_materials_transmission glass, renames materials semantically, applies
 * 9WERKS default finishes, simplifies the over-dense wiper mesh, resizes and
 * WebP-encodes textures, and Draco-compresses geometry.
 *
 * Usage: node scripts/3d/prepare-model.mjs
 * Output: public/models/9werks-concept.glb
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import draco3d from "draco3dgltf";
import { MeshoptSimplifier } from "meshoptimizer";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { dedup, draco, prune, simplifyPrimitive, textureCompress, weld } from "@gltf-transform/functions";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const INPUT = path.join(ROOT, "assets-src/3d/CarConcept.glb");
const LOGO = path.join(ROOT, "assets-src/brand/9werks-logo-official-960.png");
const OUTPUT = path.join(ROOT, "public/models/9werks-concept.glb");

/** sRGB hex → linear RGBA factor (glTF colour factors are linear). */
function hexToLinear(hex, a = 1) {
  const h = hex.replace("#", "");
  const toLin = (c) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return [toLin(parseInt(h.slice(0, 2), 16)), toLin(parseInt(h.slice(2, 4), 16)), toLin(parseInt(h.slice(4, 6), 16)), a];
}

const RENAME = {
  "Paint 1 Carmine": "paint_primary",
  "Paint 2 Carmine": "paint_secondary",
  "Interior 3 Carmine": "interior_accent",
  "Interior 1": "interior_trim",
  "Interior 2": "interior_seat",
  Floormat: "interior_floormat",
  Dashboard: "interior_dashboard",
  "Panel Sides": "interior_panels",
  Brake: "brake_caliper",
  Disc: "brake_disc",
  Rim2: "rim_face",
  Rim1: "rim_inner",
  Tireside: "tyre_sidewall",
  Tiretread: "tyre_tread",
  Glass: "glass",
  Mirror: "mirror",
  Headlight: "light_head",
  Brakelight: "light_brake",
  Signallight: "light_signal",
  Mechanical: "mechanical",
  Hardware: "hardware",
  License: "plate",
  "": "trim_black",
};

const NON_EMISSIVE = new Set(["hardware", "mirror", "brake_caliper", "rim_face", "rim_inner", "trim_black"]);

async function buildPlateTexture() {
  // 4:1 plate, obsidian ground, ORIGINAL logo artwork composited unmodified (scaled uniformly).
  const W = 1024;
  const H = 256;
  const logo = await sharp(LOGO).resize({ width: 880, fit: "inside" }).png().toBuffer();
  const meta = await sharp(logo).metadata();
  return sharp({ create: { width: W, height: H, channels: 4, background: { r: 13, g: 12, b: 11, alpha: 1 } } })
    .composite([{ input: logo, left: Math.round((W - meta.width) / 2), top: Math.round((H - meta.height) / 2) }])
    .png()
    .toBuffer();
}

/** Flatten (set to neutral normal) every pixel of `normalPng` where `colorPng` deviates from the rubber base colour. */
async function scrubSidewallNormal(normalPng, colorPng) {
  const n = await sharp(normalPng).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const c = await sharp(colorPng).resize(n.info.width, n.info.height).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = n.info;
  const mask = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const r = c.data[i * 4], g = c.data[i * 4 + 1], b = c.data[i * 4 + 2];
    if (Math.abs(r - 29) + Math.abs(g - 29) + Math.abs(b - 29) > 24) mask[i] = 1;
  }
  // Separable dilation (radius 9 px) so anti-aliased emboss edges are also flattened.
  const R = 9;
  const tmp = new Uint8Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      let v = 0;
      for (let k = -R; k <= R && !v; k++) {
        const xx = x + k;
        if (xx >= 0 && xx < w && mask[y * w + xx]) v = 1;
      }
      tmp[y * w + x] = v;
    }
  let flattened = 0;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      let v = 0;
      for (let k = -R; k <= R && !v; k++) {
        const yy = y + k;
        if (yy >= 0 && yy < h && tmp[yy * w + x]) v = 1;
      }
      if (v) {
        const i = (y * w + x) * 4;
        n.data[i] = 128;
        n.data[i + 1] = 128;
        n.data[i + 2] = 255;
        flattened++;
      }
    }
  const out = await sharp(n.data, { raw: { width: w, height: h, channels: 4 } }).removeAlpha().png().toBuffer();
  return { out, flattened, total: w * h };
}

async function main() {
  await MeshoptSimplifier.ready;
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
    "draco3d.decoder": await draco3d.createDecoderModule(),
    "draco3d.encoder": await draco3d.createEncoderModule(),
  });

  const doc = await io.read(INPUT);
  const root = doc.getRoot();
  const inputBytes = (await fs.stat(INPUT)).size;

  // 1 ─ Drop material variants (we drive finishes at runtime) and the variant-only materials.
  // Iridescence is only used by the variant-only "Pearl"/"Graphite" paints.
  for (const ext of root.listExtensionsUsed()) {
    if (ext.extensionName === "KHR_materials_variants" || ext.extensionName === "KHR_materials_iridescence") ext.dispose();
  }
  for (const m of root.listMaterials()) {
    if (/Pearl|Graphite/.test(m.getName())) m.dispose();
  }

  // 2 ─ Semantic names.
  for (const m of root.listMaterials()) {
    const next = RENAME[m.getName()];
    if (next !== undefined) m.setName(next);
  }
  const mat = (name) => root.listMaterials().find((m) => m.getName() === name);

  // 3 ─ Remove logo-bearing emissive slots on parts that should never glow.
  for (const m of root.listMaterials()) {
    if (NON_EMISSIVE.has(m.getName())) {
      m.setEmissiveTexture(null);
      m.setEmissiveFactor([0, 0, 0]);
    }
  }

  // 4 ─ Number plate → 9WERKS plate built from the original logo.
  const plate = mat("plate");
  const plateTex = doc.createTexture("plate_9werks").setImage(await buildPlateTexture()).setMimeType("image/png");
  plate.setBaseColorTexture(plateTex).setBaseColorFactor([1, 1, 1, 1]).setRoughnessFactor(0.45).setMetallicFactor(0);

  // 5 ─ Tyre sidewall: remove wordmark colour texture; flatten embossed logos in the normal map.
  const side = mat("tyre_sidewall");
  const sideColor = side.getBaseColorTexture();
  const sideNormal = side.getNormalTexture();
  const scrub = await scrubSidewallNormal(Buffer.from(sideNormal.getImage()), Buffer.from(sideColor.getImage()));
  sideNormal.setImage(scrub.out).setMimeType("image/png");
  side.setBaseColorTexture(null).setBaseColorFactor(hexToLinear("#1d1d1d")).setRoughnessFactor(0.62);
  console.log(`• sidewall normal: flattened ${(100 * scrub.flattened / scrub.total).toFixed(2)}% of pixels (logo emboss)`);

  // 6 ─ Glass: replace transmission (extra render pass) with dark tinted, blended glass.
  const glass = mat("glass");
  glass.setExtension("KHR_materials_transmission", null);
  glass
    .setBaseColorFactor(hexToLinear("#060708", 0.58))
    .setAlphaMode("BLEND")
    .setMetallicFactor(0)
    .setRoughnessFactor(0.03);
  for (const ext of root.listExtensionsUsed()) {
    if (ext.extensionName === "KHR_materials_transmission") ext.dispose();
  }

  // 7 ─ 9WERKS default finishes (runtime can still re-tint).
  const clearcoat = (m, factor = 1, rough = 0.04) => {
    const cc = m.getExtension("KHR_materials_clearcoat");
    if (cc) cc.setClearcoatFactor(factor).setClearcoatRoughnessFactor(rough);
  };
  mat("paint_primary").setBaseColorFactor(hexToLinear("#16130f")).setMetallicFactor(0.82).setRoughnessFactor(0.34);
  clearcoat(mat("paint_primary"));
  mat("paint_secondary").setBaseColorFactor(hexToLinear("#090909")).setMetallicFactor(0.4).setRoughnessFactor(0.22);
  clearcoat(mat("paint_secondary"));
  mat("brake_caliper").setBaseColorFactor(hexToLinear("#b68c66")).setMetallicFactor(0.86).setRoughnessFactor(0.3);
  mat("rim_face").setBaseColorFactor(hexToLinear("#2c2a28")).setMetallicFactor(1).setRoughnessFactor(0.26);
  mat("interior_accent").setBaseColorFactor(hexToLinear("#6b4a32")).setRoughnessFactor(0.48);
  mat("interior_dashboard").setEmissiveFactor(hexToLinear("#e8d8bc").slice(0, 3));
  mat("light_head").setEmissiveFactor(hexToLinear("#fff4e6").slice(0, 3));

  // 8 ─ Simplify the over-dense wiper mesh (24k tris for two thin blades).
  for (const mesh of root.listMeshes()) {
    if (mesh.getName() === "BodyWindshieldWipers") {
      for (const prim of mesh.listPrimitives()) simplifyPrimitive(prim, { simplifier: MeshoptSimplifier, ratio: 0.12, error: 0.002 });
    }
  }

  // 9 ─ Textures → WebP. Normal maps at higher quality; AO atlas 2048 → 1024.
  await doc.transform(
    dedup(),
    prune(),
    weld(),
    textureCompress({ encoder: sharp, targetFormat: "webp", slots: /^normalTexture$/, quality: 92, resize: [1024, 1024] }),
    textureCompress({ encoder: sharp, targetFormat: "webp", slots: /^(?!normalTexture).*$/, quality: 82, resize: [1024, 1024] }),
    draco({ method: "edgebreaker", encodeSpeed: 5, decodeSpeed: 5, quantizePosition: 14, quantizeNormal: 10, quantizeTexcoord: 12 })
  );

  // Sweep any texture left referenced only by the root (e.g. from disposed extensions).
  for (const t of root.listTextures()) {
    if (t.listParents().every((p) => p === root)) t.dispose();
  }

  root.getAsset().copyright =
    '"Car Concept" by Eric Chadwick / Darmstadt Graphics Group GmbH (CC BY 4.0), based on a CC0 model by Unity Fan. ' +
    "Modified for 9WERKS: trademarks removed, materials changed, geometry/texture compression.";

  await fs.mkdir(path.dirname(OUTPUT), { recursive: true });
  await io.write(OUTPUT, doc);
  const outBytes = (await fs.stat(OUTPUT)).size;

  let tris = 0;
  for (const mesh of root.listMeshes())
    for (const p of mesh.listPrimitives()) tris += (p.getIndices()?.getCount() ?? p.getAttribute("POSITION").getCount()) / 3;
  console.log(`• materials: ${root.listMaterials().map((m) => m.getName()).join(", ")}`);
  console.log(`• textures: ${root.listTextures().length}, triangles: ${Math.round(tris).toLocaleString()}`);
  console.log(`✓ ${(inputBytes / 1048576).toFixed(2)} MB → ${(outBytes / 1048576).toFixed(2)} MB  ${path.relative(ROOT, OUTPUT)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
