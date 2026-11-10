# Project Architecture — 9WERKS website

## 1. Audit summary

- **Repository:** empty at the start; this is a greenfield build.
- **Old site** (9werksofficial.com, Hostinger): hand-written static HTML/CSS/vanilla JS across five pages. Forms hand off to WhatsApp, and it had JSON-LD (AutoRepair) but no sitemap or robots file. It is a business-information reference only; a snapshot is kept in `docs/reference/legacy-site/`.
- **No backend by design.** Booking and contact compose messages in the browser for WhatsApp, phone or email, as the old site did. The new site has no API routes, server actions or database.

## 2. Stack

| Layer | Choice (exact versions in `package.json`) | Why |
|---|---|---|
| Framework | Next.js 16.4.5, App Router, **static export** | Pure frontend; deployable to the existing static host or any CDN |
| UI | React 19.3.1, TypeScript 5.9.3 (strict) | TS 7 (native port) deliberately avoided for Next compatibility |
| Styling | Tailwind CSS 4.3.4 (CSS-first tokens) | Tokens and section themes in `src/app/globals.css` |
| 3D | three 0.187, React Three Fiber 9.8.2, drei 10.7.9 | R3F 9 requires React < 19.4 |
| Motion | GSAP 3.15 (ScrollTrigger, SplitText), Motion 14.9 (UI), Lenis 1.3.27 | GSAP for scroll storytelling, Motion for micro-interactions |
| Forms | React Hook Form 7.91 + Zod 4.6 | Validation; WhatsApp hand-off |
| Icons | lucide-react + CC0 brand glyphs | |
| QA | ESLint 10 + eslint-config-next, Playwright 1.64 + axe-core, Lighthouse 13 | |

## 3. Directory structure

```
src/
  app/                       routes (static export)
    layout.tsx               fonts, metadata, JSON-LD, header/footer, motion runtime
    template.tsx             page-enter fade on client navigation
    page.tsx                 home (14 sections)
    about/ services/ services/[slug]/ contact/ booking/
    not-found.tsx sitemap.ts robots.ts manifest.ts
    lab/render/page.dev.tsx  DEV-ONLY render route (ignored by production builds)
  components/
    ui/          Section, Typography (Accent, SectionLabel, Display), Button, Photo, SpecList, Hours, OpenStatus, JsonLd
    brand/       Logo (original artwork only)
    motion/      MotionProvider (Lenis + GSAP + LazyMotion), Reveal, RevealText, ImageReveal, Counter
    layout/      SiteHeader, MobileMenu, SiteFooter, MobileActionBar, CurrentYear
    sections/    PageHero, Breadcrumbs, ProcessSteps, FinalCta, LocationBlock (shared)
    home/        HomeHero, BrandIntro, StatsBand, AboutIntro, Specialisations, ServicesShowcase,
                 EngineeringExplorer, WorkshopReel, ReviewsBand, Gallery (+ subfolders)
    about/ services/ contact/ booking/   page-specific components
    three/       CanvasShell, Studio, useCarModel, useThreeSupport, finishes,
                 HeroScene/HeroCanvas, EngineeringScene/EngineeringCanvas
    forms/       Field (TextField, TextAreaField, SelectField)
    icons/       BrandIcons
  content/       site, services, company, photos, navigation, engineering (+ generated/)
  lib/           routes, seo, whatsapp, hours, validation, device, fonts, cn
scripts/         images/, 3d/, video/, qa/ (pipelines + QA tooling)
tests/e2e/       Playwright suite
assets-src/      original assets (not served)
public/          served assets, .htaccess, _redirects
docs/reference/legacy-site/   old site snapshot
```

## 4. Rendering & routing

- `output: "export"` and `trailingSlash: true` produce `out/<route>/index.html`. There are 11 public pages plus `404.html`.
- Routes: `/`, `/about/`, `/services/`, `/services/{servicing-routine-checks, performance-diagnostics, brakes, collision-repair-paint, wraps-detailing, alloy-wheels-tyres}/`, `/contact/`, `/booking/`.
- Service pages use `generateStaticParams` with `dynamicParams = false`.
- All internal links come from `src/lib/routes.ts`.
- **Dev-only routes:** `pageExtensions` adds `dev.tsx` only under `next dev`, so `src/app/lab/**/page.dev.tsx` can never be exported.

## 5. Content model

Business facts live only in `src/content/*` (see BUSINESS_CONTENT.md). Components never hard-code phone numbers, URLs or business copy. Photos are referenced by ID (`<Photo id>`); their alt text, captions and provenance are kept in the registry.

## 6. Design system

See **DESIGN_SYSTEM.md**. Summary:
- tokens on `:root`;
- semantic section themes (`studio`, `dark`, `graphite`, `ivory`) drive `text-fg`, `border-line`, `text-accent-text` and the other semantic colours;
- three type voices (Mona Sans Expanded, Bodoni Moda Italic accents, DM Mono labels);
- square corners and hairline architecture.

## 7. Motion system

- **MotionProvider:** registers GSAP plugins and runs Lenis on the GSAP ticker for fine pointers only (native scroll on touch and for reduced motion). It refreshes ScrollTrigger on route change and wraps Motion's `LazyMotion strict`.
- **Above the fold:** content animates with CSS only — the home hero's masked rise and inner pages' "rack focus" — so it paints in the first frame.
- **Scroll content:** uses `<RevealText>` (SplitText line masks, removed once done), `<Reveal>`, `<ImageReveal>` (a cover-panel wipe, so lazy images prefetch normally) and `<Counter>`.
- **Safety net:** an inline boot script adds `.js`, and if the motion runtime hasn't started within 3.5 s, `.motion-fallback` reveals everything.
- **Reduced motion:** no reveals, parallax, counters, auto-motion or smooth scrolling.

## 8. 3D system

1. **Asset pipeline:** `scripts/3d/prepare-model.mjs` (trademark removal, Draco, WebP).
2. **Capability gate:** `useThreeSupport()` returns `pending`, `webgl` or `fallback`. Fallback applies when there's no WebGL, the WebGL is software (SwiftShader/llvmpipe), Data Saver is on, or the device has ≤ 2 cores / ≤ 2 GB memory. Add `?webgl=force` to override for QA.
3. **Quality tiers:** `high` gets a reflective floor and DPR ≤ 2 (desktop, ≥ 6 cores, ≥ 4 GB). `medium` gets a matte floor, contact shadows and DPR ≤ 1.5.
4. **CanvasShell:**
   - renders only while visible and the tab is active (`frameloop: never` otherwise);
   - has an on-demand mode for reduced motion;
   - an error boundary and context-loss listener swap in the fallback;
   - GPU memory is released on unmount.
5. **Hero:**
   - The poster still (LCP) paints first.
   - The 3D bundle (~289 KB gzipped) loads after the browser is idle and cross-fades in.
   - Framing adapts to aspect ratio.
   - Scroll, pointer parallax and drag-to-rotate (fine pointers only) are applied with damping in one `useFrame`.
   - The finish selector (Obsidian / Champagne / Ivory) tweens the paint.
6. **Engineering explorer ("The anatomy of care"):** an animated structural view of the supercar.
   - **X-ray structure:** a smoked translucent shell traced by bronze structure lines (EdgesGeometry of every panel), so the cabin, seats, wheels, brakes and axles read through it.
   - **Assembly:** on scroll-in, the car starts exploded and flies together as the lines draw in.
   - **Per-component mechanics:**
     - wheel lifts off to reveal the spinning disc and caliper (Brakes);
     - wheels push out and spin about their true axles;
     - doors and roof open (Interior);
     - bonnet and rear deck lift (Engine);
     - scanning light sheet (Electronics);
     - solid paint with panel gaps (Bodywork).
   - **Exploded-view toggle** for the whole car.
   - Exploded offsets are authored in world space and converted into each part's frame, so the model's node rotations can't skew them.
   - An accessible tab list drives the camera flights (GSAP). Info panels are real HTML; without WebGL, authentic photos stand in.

## 9. Images & video

- **Photos:** AVIF + WebP `<picture>` with intrinsic sizes (no layout shift), blur placeholders, lazy by default, and accurate `sizes`.
- **Hero poster:** a responsive landscape/portrait art-directed `<picture>`.
- **Reel:** WebM + MP4; loads and plays only in view; pause control; never autoplays with reduced motion.

## 10. SEO

- **Per-page metadata:** a title template, a unique description, a canonical URL (`https://www.9werksofficial.com/…`), Open Graph and Twitter cards, and a share image.
- **JSON-LD:**
  - `AutoRepair` (LocalBusiness: address, geo, hours, contacts, sameAs);
  - `WebSite`;
  - `Service` + `OfferCatalog` on each service page;
  - `BreadcrumbList` on inner pages.
  - No `aggregateRating`: self-published ratings aren't eligible, and the figure is a dated snapshot.
- **Crawl files:** `sitemap.xml` (11 URLs), `robots.txt` (disallows `/lab/`), web manifest.
- **Old URLs:** 301 redirects preserve existing search equity (see Deployment).

## 11. Accessibility

- **Structure:** skip link, landmarks, one `h1` per page, and sections labelled by their headings.
- **Interaction:**
  - visible focus (bronze-300 on dark, bronze-ink on ivory) and ≥ 44 px targets;
  - the mobile menu and lightbox are modal dialogs that trap focus and close on Esc;
  - the explorer is a keyboard tab list.
- **Forms:** labels, `aria-invalid`/`aria-describedby`, errors announced, and the first invalid field is focused.
- **Colour:** all text pairs ≥ 4.5:1 (see DESIGN_SYSTEM.md); no text is ever dimmed for effect.
- **Motion & media:** reduced motion is respected; the canvas is decorative and mirrored by HTML.

## 12. Performance strategy

- **Bundles:** three.js is code-split behind dynamic imports and capability checks; nothing heavy is above the fold.
- **Hydration:** server components by default.
- **Fonts:** self-hosted and subset.
- **Images:** pre-optimised AVIF/WebP; LCP elements are an eager, high-priority poster or a text headline; CLS 0.
- **Rendering:** the hidden or off-screen canvas doesn't render.
- **Measured results:** see QA_REPORT.md.

## 13. Deployment

- `npm run build` produces `out/`. Upload the **contents** of `out/` to the web root.
- **Hostinger (Apache/LiteSpeed):** the exported `.htaccess` handles:
  - HTTPS + `www` canonical host;
  - 301s from `index.html`, `about.html`, `service.html`, `contact.html` and `booking.html` (query strings kept, so `booking.html?service=brakes` lands with Brakes pre-selected);
  - a 404 page, MIME types (avif, webm, glb, wasm, webmanifest), Brotli/deflate, cache headers (immutable `/_next/static`) and security headers.
- **Netlify / Cloudflare Pages:** `public/_redirects` holds the equivalent redirects.
- **Vercel or a Node host:** works as-is (static).

## 14. Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server (port 3000) |
| `npm run build` / `npm run preview` | Static export → `out/` / serve it like the host (port 4173) |
| `npm run lint` · `npm run typecheck` | ESLint / TypeScript |
| `npm run test:e2e` | Playwright suite (needs a build; starts the preview automatically) |
| `npm run qa:links` · `npm run qa:lighthouse` | Link/asset/anchor checker · Lighthouse table |
| `npm run assets:images` · `assets:model` · `assets:video` | Asset pipelines |
| `node scripts/3d/render-stills.mjs` | Re-render hero stills + OG image (with `npm run dev` running) |
| `node scripts/qa/tour.mjs <url> <dir> [--mobile]` | Screenshot a page viewport by viewport (visual QA) |
