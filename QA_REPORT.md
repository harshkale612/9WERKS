# QA Report — 9WERKS website

**Build:** Next.js 16.4.5 static export (`out/`), verified 4 Nov 2026 against the production build served by `scripts/qa/serve-static.mjs`, which behaves like the host.

## Summary

| Check | Result |
|---|---|
| Production build (`npm run build`) | ✅ 19 static outputs (11 pages + 404, sitemap, robots, manifest, icons). No dev-only routes exported |
| TypeScript (`tsc --noEmit`, strict) | ✅ 0 errors |
| ESLint (whole repo) | ✅ 0 problems |
| Links / assets / anchors (`npm run qa:links`) | ✅ 954 internal URLs on 14 HTML files, 0 broken. Phone, email and WhatsApp links verified against official values |
| End-to-end (`npm run test:e2e`) | ✅ **48 passed**, 14 skipped by design (desktop-only or mobile-only cases), 0 failed |
| Accessibility (axe, all 11 routes) | ✅ 0 serious or critical violations |
| Lighthouse accessibility / best practices / SEO | ✅ 100 / 100 / 100 on every page measured |
| Cumulative Layout Shift | ✅ 0 on every page |
| Dark theme throughout (`npm run qa:dark`) | ✅ 79 sections on 12 routes, all dark (client direction: no light sections) |

## End-to-end coverage (`tests/e2e/site.spec.ts`)

Run on two projects: desktop (1440×900) and mobile (Pixel 7).

- **Every route:**
  - 200 status, exactly one `h1`, title, meta description (≥ 50 chars), canonical URL on `https://www.9werksofficial.com/`, `og:image`;
  - **no horizontal overflow**, no console or page errors.
- **Unknown URL** → branded 404 page with a real 404 status.
- **Booking:**
  - required-field errors;
  - weekend + evening is rejected with the weekend-hours message;
  - `?service=diagnostics` (old ID) and `?service=wraps-detailing` (slug) pre-select the service;
  - a valid request opens `https://wa.me/917083199986?text=…` containing name, phone, car, service and notes;
  - the confirmation states it is *not yet confirmed*.
- **Contact:** validation; a valid message opens WhatsApp with the composed text; the email fallback is `mailto:9werks9@gmail.com`.
- **Navigation:**
  - mobile menu opens as a dialog, closes on Escape and returns focus;
  - desktop header links reach About, Services and Contact;
  - gallery lightbox opens, navigates with arrow keys and closes on Escape.
- **Accessibility:** axe scan of all 11 routes.

## Lighthouse (lab)

Mobile uses Lighthouse's default simulation (Moto G Power class, 4× CPU slowdown). Medians are given where repeated runs varied.

| Page | Mobile perf | Desktop perf | LCP (mobile) | TBT (mobile) | CLS | A11y · BP · SEO |
|---|---|---|---|---|---|---|
| `/` | 72–73 | 96 | 2.4 s | 0.65–0.70 s | 0 | 100 · 100 · 100 |
| `/about/` | 85 | 95 | 1.8 s | 0.48 s | 0 | 100 · 100 · 100 |
| `/services/` | 79–80 | 99 | 2.0 s | 0.62–0.66 s | 0 | 100 · 100 · 100 |
| `/services/brakes/` | 93 (median of 3) | 100 | 1.7 s | 0.26 s | 0 | 100 · 100 · 100 |
| `/contact/` | 94 (median of 3) | 95 | 1.7 s | 0.21 s | 0 | 100 · 100 · 100 |
| `/booking/` | 98 | 100 | 1.5 s | 0.13 s | 0 | 100 · 100 · 100 |

Notes:
- **Home on mobile:** most of the gap is Speed Index (≈ 6 s). It reflects the deliberate once-per-session brand intro (≈ 2.7 s) on Lighthouse's first visit, plus GSAP/SplitText hydration work.
- **The QA machine has no GPU,** so its WebGL is software (SwiftShader). The site detects software WebGL and serves the rendered still instead of the live scene. On GPU-equipped devices the 3D loads only after the browser is idle, so it never affects LCP.
- **Single runs on a busy machine are noisy:** one Brakes run scored 53 while the load average was 6.1. Repeat runs scored 91–93.

## Issues found during QA and fixed

| # | Issue | Fix |
|---|---|---|
| 1 | Hydration mismatch in the rating ring (Node vs browser trigonometry precision) | Coordinates rounded to 3 dp |
| 2 | Horizontal overflow on phones (`/` 642 px, `/booking/` 19 px): CSS-grid blowout from a horizontal tab scroller and a long no-wrap button | Global zero-specificity `:where(.grid) > * { min-width: 0 }`; buttons may wrap on narrow phones; shorter mobile label |
| 3 | Submit clicks could be lost: blur-time re-validation removed an error message mid-click and shifted the button | Validate on submit, then re-validate on change; WhatsApp still opens synchronously inside the user's gesture (iOS Safari) |
| 4 | Text contrast: dimmed inactive service chapters (40% opacity), 70%-opacity coordinates, pale "unlit" process numerals | No text is ever dimmed; active chapter marked with a bronze rule; numerals start at 5:1 |
| 5 | Lazy images showed only their blur placeholders: clip-path reveals made IntersectionObserver see zero visible area | Reveals use a cover-panel wipe; the services stage cross-fades with opacity |
| 6 | Very slow LCP / blocking time on mobile: software-WebGL rendering; the header logo was the LCP and was painted after hydration | Software-WebGL detection → poster; 3D mounted after the browser is idle; logo `fetchpriority="high"`; inner-page headlines enter with a non-clipping "rack focus" so they are the LCP |
| 7 | Next dev badge captured in rendered stills | `devIndicators: false`; stills re-rendered and verified clean |
| 8 | Hero composition: car too large on 1366×768 and clipped on phones; scroll cue collided with the finish selector | Framing tuned per aspect ratio; scroll cue removed; poster re-rendered to match |
| 9 | Services: a 500 px photo upscaled ~3× into a full-width band | Layouts assigned by source resolution (band → the 1600 px photo) |
| 10 | SplitText masks could clip italic descenders after the reveal | Masks removed when each reveal completes |
| 11 | Client feedback: mixed dark and ivory sections | Every chapter converted to the three dark tones with hairline dividers; the light theme was removed from the type system and CSS; guard script added |
| 12 | Client feedback: anatomy section should show a real 3D structure in motion | Rebuilt as an animated x-ray structural view (assembly intro, exploded view, per-component mechanics). Part offsets authored in world space so node rotations can't misdirect them |

## Visual review

Pages were reviewed viewport by viewport with the scroll-tour script (`scripts/qa/tour.mjs`), which lets every scroll reveal play. Full-page screenshots are unreliable for `svh` layouts.
- **Desktop 1440×900:** Home, About, Services, Contact, Booking.
- **Your screen size, 1366×768:** the home hero.
- **iPhone 13:** the full home page and the hero.

## Manual checks recommended before launch

- **Real devices:** the 3D on a mid-range Android and an iPhone (GPU path), and the finish selector, drag-to-rotate and explorer camera flights.
- **WhatsApp hand-off:** on a phone with WhatsApp installed (app deep link) and on a desktop (WhatsApp Web).
- **Hostinger:** after upload, confirm the redirects `about.html → /about/` and `booking.html?service=brakes → /booking/?service=brakes`.
- **Business facts:** confirm the open items in BUSINESS_CONTENT.md (PIN code 411007 vs 411067; current statistics).
