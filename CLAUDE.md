# 9WERKS website — working rules

Next.js 16 (App Router, **static export**: `output: "export"`, `trailingSlash: true`) · React 19 · TypeScript (strict) · Tailwind CSS v4 (CSS-first tokens in `src/app/globals.css`) · three.js / R3F / drei · GSAP + ScrollTrigger + SplitText · Motion · Lenis · React Hook Form + Zod.

Read `DESIGN_SYSTEM.md` before building UI. Business facts live only in `src/content/*` — see `BUSINESS_CONTENT.md`.

## Non-negotiables
- **No invented business data**: no prices, warranties, turnaround times, awards, testimonials, customer names or numbers beyond `src/content/site.ts`. Reviews: link to Google; never fabricate review text.
- **Logo**: only via `<Logo>`; original artwork, never redrawn/recoloured/stretched.
- **Photos**: only via `<Photo id=… sizes=…>`; photos with `provenance: "unverified"` are never captioned as 9WERKS work.
- **Routes**: only via `routes.*` from `src/lib/routes.ts` (all end in `/`).
- **WhatsApp / phone / email**: only via `src/content/site.ts` + `src/lib/whatsapp.ts`.

## Conventions
- Server components by default; add `"use client"` only for interactivity/animation. Heavy client code (three.js) is dynamically imported with `ssr: false` and gated by capability checks (`src/lib/device.ts`).
- **Dark theme throughout (client direction)**: every chapter uses `<Section theme="studio|dark|graphite">` — no light/ivory backgrounds. Alternate tones between neighbours and divide with `border-t border-line`. Use semantic colours (`text-fg`, `text-fg-muted`, `border-line`, `text-accent-text`, `bg-surface`).
- Type voices: `font-display` (expanded caps), `font-accent` (Bodoni italic accents via `<Accent text="a *word*">`), `label` (mono meta).
- Motion: `<RevealText>`, `<Reveal>`, `<ImageReveal>`, `<Counter>`; custom GSAP via `useGSAP` (scoped, cleaned up) with `gsap.matchMedia()` honouring `prefers-reduced-motion`. No scroll hijacking.
- Motion library runs under `LazyMotion strict`: use `import * as m from "motion/react-m"` (`m.div`), never `motion.div`.
- Tailwind v4 canonical classes: `bg-linear-to-t`, `aspect-4/5`, `top-[-12%]`, `size-4`, `shrink-0`.
- Watch class conflicts — no tailwind-merge: never pass a class that fights a component's built-in one (e.g. `absolute` vs `relative`).
- Accessibility: one `h1` per page, labelled sections, visible focus, ≥44px targets, accessible forms, reduced-motion support.

## Tooling
- Dev server: `npm run dev` (port 3000). Production: `npm run build` → `out/`, preview with `npm run preview`.
- Serialised checks for parallel work: `bash scripts/qa/typecheck.sh [regex]`, `bash scripts/qa/shot.sh <url> <out.png> [--full|--mobile|--at N|--selector S|--reduced|--logs]`.
- Asset pipelines: `npm run assets:images`, `npm run assets:model`, `npm run assets:video`, `node scripts/images/build-brand.mjs`.
- Dev-only routes are named `page.dev.tsx` (e.g. `src/app/lab/render/` for `scripts/3d/render-stills.mjs`); `pageExtensions` excludes them from production builds.
- QA: `npm run test:e2e` (after a build), `npm run qa:links`, `npm run qa:lighthouse`, `node scripts/qa/tour.mjs <url> <dir> [--mobile]`.
