# Implementation Plan — 9WERKS website

## Phases

| # | Phase | Done |
|---|---|---|
| 1 | Business research & repository audit | ✅ Five old pages inventoried (BUSINESS_CONTENT.md); live Google figures checked (4.9 / 196); assets catalogued with provenance; empty repo → greenfield |
| 2 | Fresh architecture | ✅ Next 16 static export, TypeScript strict, Tailwind 4, R3F; compatible versions pinned (PROJECT_ARCHITECTURE.md) |
| 3 | Brand & design system | ✅ Tokens refined from the logo (bronze #B68C66), section themes, three type voices, motion language (DESIGN_SYSTEM.md) |
| 4 | Global components | ✅ Header + accessible mobile menu, footer, mobile action bar, buttons, photo, logo, typography, shared sections, form fields |
| 5 | Homepage | ✅ 14 sections incl. brand intro, 3D hero, stats, specialisations, services stage, 3D engineering explorer, workshop reel, process, reviews, gallery + lightbox, CTA, location, footer |
| 6 | Inner pages | ✅ About, Services + six detail pages, Contact (WhatsApp/email form), Booking (WhatsApp hand-off), branded 404 |
| 7 | Interactions | ✅ GSAP reveals, scrubbed process line, sticky services stage, Lenis, finish selector, drag-to-rotate, camera flights, lightbox |
| 8 | Optimisation | ✅ AVIF/WebP pipeline, Draco GLB (11.2 → 1.4 MB), split 3D bundle loaded on idle, software-WebGL fallback, LCP tuning |
| 9 | SEO & accessibility | ✅ Metadata, canonicals, OG, JSON-LD, sitemap/robots, redirects; axe-clean, Lighthouse a11y 100 |
| 10 | QA & production | ✅ Build, typecheck, lint, link check, 48 E2E tests, Lighthouse (QA_REPORT.md) |

## How the work was done

1. **Foundation first** (single author, verified visually before anything else was built):
   - tokens and globals, primitives, motion toolkit, layout chrome, shared sections, form fields;
   - the 3D core (loader, materials, studio, canvas shell, capability gate);
   - asset pipelines and QA tooling.
2. **Slices:** a parallel multi-agent build was attempted but halted at the account's usage limit. It left five About-page components and the engineering content model, which were reviewed and kept. All remaining slices were then built sequentially on the foundation, each one typechecked and linted before the next.
3. **Integration:** the home composition was restored, and dev-only preview routes were made unexportable via `pageExtensions`.
4. **QA loop:** E2E suite, axe, link checker, Lighthouse and viewport-by-viewport visual tours. Each defect was fixed at the root cause, with a regression check after every fix (QA_REPORT.md).

## Work breakdown

| Area | Files |
|---|---|
| Content | `src/content/{site,services,company,photos,navigation,engineering}.ts` |
| Design system | `src/app/globals.css`, `src/components/ui/*`, `src/components/brand/Logo.tsx` |
| Motion | `src/components/motion/*` |
| Layout | `src/components/layout/*`, `src/app/layout.tsx`, `src/app/template.tsx` |
| Shared sections | `src/components/sections/*` |
| Home | `src/components/home/**`, `src/app/page.tsx` |
| 3D | `src/components/three/*`, `scripts/3d/*`, `src/app/lab/render/*` (dev-only) |
| Pages | `src/app/{about,services,services/[slug],contact,booking}/page.tsx`, `src/components/{about,services,contact,booking}/*` |
| Forms | `src/components/forms/Field.tsx`, `src/lib/{whatsapp,validation,hours}.ts` |
| SEO & hosting | `src/lib/seo.ts`, `src/app/{sitemap,robots,manifest}.ts`, `src/app/not-found.tsx`, `public/.htaccess`, `public/_redirects` |
| QA | `tests/e2e/site.spec.ts`, `playwright.config.ts`, `scripts/qa/*` |

## Acceptance criteria

| Criterion | Status |
|---|---|
| Original 9WERKS logo preserved | ✅ Supplied artwork served as-is (+ pixel-identical lossless WebP); used via `<Logo>` only |
| New architecture, design system and components | ✅ |
| Premium champagne-bronze identity | ✅ Refined from the logo; dark cinematic + ivory editorial rhythm |
| Cinematic homepage | ✅ |
| Interactive 3D (or fallback) | ✅ Live studio hero + engineering explorer; poster and photo fallbacks |
| About, Services (all six), Contact, Booking | ✅ |
| WhatsApp integration | ✅ Booking + contact, tested end to end |
| Authentic business info, genuine review references | ✅ No invented facts; Google rating dated and linked; no fabricated reviews |
| Authentic photography where available | ✅ Gallery and captions use authentic photos only |
| Responsive, mobile-optimised | ✅ No overflow at tested widths; mobile action bar; lighter 3D tier |
| Refined animations, reduced-motion support | ✅ |
| SEO, accessibility, performance | ✅ See QA_REPORT.md |
| No broken routes, no dead buttons, no fake data | ✅ Link checker + E2E |
| Successful production build, complete QA report | ✅ |

## Next steps (owner: 9WERKS)

- **Confirm the flagged facts:** the PIN code and statistics (BUSINESS_CONTENT.md §2).
- **Supply assets:** the replacement photos and vector logo (ASSET_INVENTORY.md §6).
- **Deploy:** upload `out/` to Hostinger, then run the manual checks in QA_REPORT.md.
