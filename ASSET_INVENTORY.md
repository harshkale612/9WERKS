# Asset Inventory — 9WERKS

Sources live in `assets-src/` (never served). Pipelines write optimised copies to `public/`.

## 1. Brand

| File | What | Notes |
|---|---|---|
| `assets-src/brand/9werks-logo-supplied.jpg` | **The supplied logo** (800×203 JPEG on black) | Single source of truth |
| `assets-src/brand/9werks-logo-official-960.png`, `-480.png` | Official transparent PNGs from 9werksofficial.com | Same artwork as the supplied JPEG (mean pixel difference 2.4/255) |
| `public/assets/brand/9werks-logo-{480,960}.png` | Served originals | Byte-identical copies |
| `public/assets/brand/9werks-logo-{480,960}.webp` | Lossless WebP | **Pixel-identical** (verified), 45.6 KB vs 93 KB |
| `public/assets/brand/9werks-logo-supplied.jpg` | Supplied file, served as-is | |
| `src/app/icon.png`, `apple-icon.png`, `favicon.ico`, `public/assets/brand/icon-{192,512}.png` | Official "9" turbo-mark icons from the old site | `favicon.ico` = uniform downscale (16/32/48) |
| `public/assets/brand/og-9werks.jpg` | 1200×630 share image | 3D studio render + original logo, uniformly scaled |

Logo colours sampled from the artwork: bronze **#B68C66**, ivory **#E6E4D8**. The logo is only ever rendered by `<Logo>`, never redrawn or recoloured.

Pipeline: `node scripts/images/build-brand.mjs`.

## 2. Photography

All ten photos come from the old site. No higher-resolution originals are public; a third-party repo holds byte-identical copies. Pipeline: `npm run assets:images` produces AVIF + WebP at widths ≤ the source (never upscaled), blur placeholders, and `src/content/generated/photo-manifest.json`.

| ID | Source size | Provenance | Used for |
|---|---|---|---|
| `facade` | 1280×1920 | ✅ Authentic (9WERKS signage) | Home About intro, gallery, About CTA |
| `porsche` | 1200×1600 | ✅ Authentic (outside the workshop) | Final CTA, gallery, service secondary |
| `bmw-m4` | 1200×1800 | ✅ Authentic (9 WERKS plate). Found unreferenced on the old server | Diagnostics, About story, gallery |
| `crew` | 1200×1600 | ✅ Authentic (9WERKS shirt, 9 WERKS plate) | About hero, Servicing, gallery |
| `m5-lift` | 1200×1600 | ✅ Authentic (workshop interior) | Workshop, Trust band, gallery |
| `z4-bay` | 540×960 | ✅ Authentic (reel poster) | Workshop reel poster, gallery |
| `wash` | 1600×900 | ⚠️ Unverified (different facility) | Wraps & detailing illustration only |
| `ferrari` | 600×600 | ⚠️ Unverified (Ferrari Challenge setting) | Collision & paint illustration only |
| `brakes` | 500×600 | ⚠️ Unverified | Brakes illustration only |
| `underbody` | 500×600 | ⚠️ Unverified (brick-walled workshop) | Wheels & tyres illustration only |

Unverified photos are **never captioned or described as 9WERKS work**. The gallery and every figure caption use authentic photos only (`authenticPhotoIds`).

## 3. Video

| File | Details |
|---|---|
| `assets-src/video/z4-reel.mp4` | Authentic reel: BMW Z4 service, 9WERKS watermark, 540×960, 32 s, 30 fps, no audio, 4.62 MB |
| `public/assets/video/workshop-reel.mp4` | H.264 CRF 30, fast-start, 3.28 MB |
| `public/assets/video/workshop-reel.webm` | VP9 CRF 42, 3.06 MB |

Loads only when in view and has a pause control. Pipeline: `npm run assets:video`.

## 4. 3D

| Item | Details |
|---|---|
| Source | "Car Concept", Khronos glTF Sample Assets, © 2024 Darmstadt Graphics Group GmbH, artist Eric Chadwick, **CC BY 4.0**, derived from a CC0 model by Unity Fan |
| Output | `public/models/9werks-concept.glb`: **11.23 MB → 1.40 MB**, ~198k triangles, 12 textures |
| Trademarks removed | Khronos wordmark plate → 9WERKS plate built from the original logo; tyre sidewall wordmarks removed; embossed Khronos / 3D Commerce logos flattened in the sidewall normal map (2.8% of pixels); logo-bearing emissive slots removed |
| Other changes | Variants, iridescence and transmission removed; materials renamed; wiper mesh simplified; textures → WebP (AO 2048→1024); Draco (edgebreaker; position 14 / normal 10 / UV 12 bits) |
| KTX2 | Evaluated, **not used**: total textures < 0.4 MB as WebP, while the Basis transcoder would add ~0.5 MB |
| Decoder | `public/draco/` (Apache-2.0, from three.js), self-hosted |
| Lighting | Generated at runtime from light formers (no HDRI download) |
| Stills | `public/assets/renders/hero-*.{avif,webp}` (landscape 640–2560, portrait 480–1080), rendered from the live scene by `node scripts/3d/render-stills.mjs` (needs `npm run dev`) |
| Attribution | In the site footer (licence requirement) |

Pipeline: `npm run assets:model`.

## 5. Fonts, textures, icons

| Asset | Licence |
|---|---|
| Mona Sans (variable, width 75–125), Bodoni Moda Italic, DM Mono | SIL OFL 1.1, self-hosted at build by `next/font` |
| `public/assets/textures/grain.png` (film grain) | Generated for this project |
| UI icons | lucide-react (ISC) |
| WhatsApp / Instagram glyphs | Simple Icons (CC0) |

## 6. Asset replacement checklist (requests for 9WERKS)

Priority order:

1. **Vector logo (SVG)** and the standalone "9" mark at ≥ 2048 px. The current maximum (960 px) limits large brand moments.
2. **Original, full-resolution photos** (≥ 3000 px long side) of all current images, especially `brakes`, `underbody`, `ferrari` and `z4-bay` (500–600 px today).
3. **Authentic replacements for the four unverified photos**:
   - brake close-up (caliper + disc behind an alloy)
   - wheel / tyre work (balancer or fitting)
   - paint or collision work in progress
   - detailing or wrap work at 9WERKS
4. **Diagnostics in use**: a technician with the scan tool connected.
5. **Team portrait** of the crew in the workshop (with everyone's consent).
6. **Interior detailing** close-up.
7. **Handover** at the workshop door (with the client's consent).
8. **A licensed model of a specific car** (optional). The CC BY concept car is production-ready, but a model of a car the crew actually services would deepen authenticity.

New photos go in `assets-src/photos/`. Register them in `scripts/images/build-images.mjs` and `src/content/photos.ts`, then run `npm run assets:images`.
