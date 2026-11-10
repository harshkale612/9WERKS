# 9WERKS Design System — "Beyond the Ordinary Drive"

> **Studio light on obsidian.** The site behaves like a dark automotive studio: cars, crew and words emerge from black under precise, warm light. Champagne-bronze *is* that light — a highlight, never a flood. **The site is dark throughout** (client direction, Nov 2026): chapters change tone between three blacks, never to a light background.

Implementation lives in `src/app/globals.css` (tokens), `src/components/ui/*` (primitives) and `src/components/motion/*` (motion). This document explains the rules.

---

## 1. Brand source of truth

- The supplied logo (`assets-src/brand/9werks-logo-supplied.jpg`, identical artwork to the official transparent PNG) is used **as-is**: never redrawn, recoloured, cropped, stretched or re-proportioned. Component: `<Logo>` (`src/components/brand/Logo.tsx`), native ratio 960 × 243.
- The logo is drawn for dark grounds. Place it on `studio` / `dark` / `graphite` surfaces only.
- The "9" in the logo is a turbocharger (volute housing + compressor wheel). That idea — precision engineering wrapped in craft — informs the system; the mark itself is never re-drawn as decoration.
- Colours were refined against the artwork: the logo's bronze samples at **#B68C66** (warmer and more copper than the brief's starting value #B99A72), its ivory at **#E6E4D8**.

## 2. Colour

| Token | Hex | Role |
|---|---|---|
| `ink-950` | `#090807` | Studio black — hero, footer, cinematic moments |
| `ink-900` | `#0F0E0D` | Obsidian — base dark surface |
| `ink-850` | `#141311` | Raised dark (graphite chapters) |
| `ink-800` | `#1B1A18` | Panels on dark |
| `graphite` | `#292724` | Strong dark surfaces, dividers |
| `bronze` | `#B68C66` | **The light.** Primary CTA fill, hairline highlights, indices, focus |
| `bronze-300` | `#D2B49C` | Lighter highlight, focus ring on dark |
| `champagne` | `#E8D8BC` | Hover state of the primary CTA, rare highlights |
| `ivory` | `#F4EFE6` | Primary text on dark (never a background) |
| `mist` | `#A19D96` | Secondary text on dark (≥5.5:1 on every dark surface) |
| `smoke` | `#92908C` | Meta text on ink-900/950 only (6:1) |

**Semantic tokens follow the section theme.** Wrap content in `<Section theme="studio|dark|graphite">` (or a `.theme-*` class) and use: `text-fg`, `text-fg-muted`, `text-fg-subtle`, `bg-surface`, `bg-surface-raised`, `border-line`, `border-line-strong`, `text-accent-text`, `bg-accent`, `text-error`. There is no light theme; `SectionTheme` doesn't allow one.

### Contrast (WCAG 2.2)

| Pair | Ratio | |
|---|---|---|
| ivory on ink-900 | 16.8:1 | AAA |
| mist on graphite (worst dark case) | 5.5:1 | AA |
| bronze on ink-900 | 6.4:1 | AA (text OK) |
| ink-950 on bronze (primary button) | 6.4:1 | AA |

### Colour rules
- Bronze is a highlight: one primary (bronze) button per view, thin rules, indices, numerals. Never large bronze fills, never gold gradients, never "everything gold".
- No electric/neon colours. State colours (`go`, `stop`, `error-*`) are desaturated.
- Rhythm: adjacent chapters alternate between the three dark tones — `studio` (#090807) · `dark` (#0F0E0D) · `graphite` (#141311) — separated by a hairline (`border-t border-line`). Never a light background.

## 3. Typography — three voices

| Voice | Family | Usage |
|---|---|---|
| **Engineered** (display) | Mona Sans variable, **width 125** (`font-display`), uppercase, wght ~640 | Headlines, numerals, service names |
| **Editorial** (accent) | Bodoni Moda *Italic*, optical size 96 (`font-accent`) | 1–3 words inside a headline, pull quotes. Never body copy |
| **Technical** (meta) | DM Mono uppercase, tracked 0.16em (`label`, `label-lg`) | Indices "01 ── SERVICES", captions, spec labels, coordinates |
| Body | Mona Sans, normal width, 16–18px, 1.6 leading, ≤62ch (`measure`) | Paragraphs, UI |

Accent syntax: content strings mark accent words with asterisks — `"Your car deserves *the right hands.*"` — rendered by `<Accent text=… />`.

### Scale (fluid, `clamp()`)

| Utility | Range | Use |
|---|---|---|
| `text-display-2xl` | 37 → 156px | Home hero only |
| `text-display-xl` | 34 → 112px | Page heroes, closing statements |
| `text-display-lg` | 30 → 84px | Section openers |
| `text-display-md` | 24 → 52px | Sub-sections, large list items |
| `text-display-sm` | 20 → 32px | Card/step titles |
| `text-lead` | 17 → 21px | Lead paragraphs |
| `label` / `label-lg` | 11 / 13px | Technical voice |

Expanded caps are wide: on screens < 400px prefer `display-lg` or smaller for long words and check for overflow. `font-display-tight` (width 112) is available where 125 is too wide.

## 4. Layout

- Container: `container-x` — max 1728px, gutters `clamp(20px, 4.2vw, 72px)`.
- 12-column grid on `lg+` (`grid lg:grid-cols-12`), single column on phones, purposeful 2-column on tablets.
- Vertical rhythm: `section-y` (80 → 184px) for chapters, `section-y-tight` for bands.
- **Asymmetry over symmetry**: offset image/text columns (7/5, 5/7, 8/4), images that bleed to one edge, numerals that hang outside the text column.
- Corners are square. No rounded cards, no pill buttons, no glass panels.
- Hairlines (`border-line`) are the architecture: they divide, frame and measure.

## 5. Components (signature patterns)

- **Section label** — `<SectionLabel index="06">Services</SectionLabel>` → `06 ── SERVICES` in the technical voice. Every chapter opens with one.
- **Buttons** — `primary` (bronze fill, champagne wipe on hover), `secondary` (hairline outline), `ghost` (text + drawn underline). Square, uppercase, tracked. Trailing arrow; external links get ↗ and an SR-only "(opens in a new tab)".
- **Spec rows** — `<SpecList>`: technical label left, value right, hairlines between — the vehicle spec-sheet pattern for hours, contact and inclusions.
- **Registration marks** — `.reg-marks` adds bronze corner ticks around an image, like crop marks on a technical drawing.
- **Photographs** — `<Photo>` only (AVIF/WebP, intrinsic size, blur placeholder). Captions in the technical voice: `FIG. 03 — On the lift`.
- **Live hours** — `<OpenStatus>` / `<HoursList>` evaluate in Asia/Kolkata.

## 6. Imagery

- Authentic 9WERKS photography first (`authenticPhotoIds`). Images with `provenance: "unverified"` may illustrate a service but are never captioned or described as 9WERKS work.
- Grade: `photo-grade` (saturate .9, contrast 1.04) — subtle; never recolour the cars.
- Overlays: ink gradients for legibility (`bg-linear-to-t from-ink-950 …`). No coloured gradients.
- Crops: portrait 4:5 / 3:4 for crew and detail, cinematic 21:9 for bands. Respect the registry focal point.
- Film grain overlay sits on the whole experience at 4.5% (`.grain-overlay`).

## 7. Motion language — "precision"

| Token | Value | Use |
|---|---|---|
| `expo.out` / `ease-out-expo` | cubic-bezier(.16,1,.3,1) | Reveals, arrivals |
| `expo.inOut` / `ease-precise` | cubic-bezier(.65,0,.35,1) | Wipes, camera moves |
| Durations | 0.3s UI · 0.9–1.3s reveals · 1.5s wipes | |
| Stagger | 0.06–0.1s | Lines, list items |

Components: `<RevealText>` (masked line rise, SplitText), `<Reveal>` (fade-rise / stagger), `<ImageReveal>` (clip-path wipe + settle, optional parallax), `<Counter>`.

Rules:
- Motion explains hierarchy; nothing moves for its own sake. One signature move per section at most.
- **No scroll hijacking.** Scrubbed timelines are fine; pinning only when short and essential.
- Lenis smooth scroll on desktop pointers only; native scroll on touch and for reduced motion.
- `prefers-reduced-motion: reduce` → no reveals, parallax, counters or auto-motion; content is simply present. 3D renders a still frame and responds only to direct input.
- Above-the-fold content animates with CSS (`animate-rise`, `animate-fade`) so it is visible at first paint; scroll content uses GSAP. Pre-hydration guard: `[data-reveal]` is hidden only while `.js` is set and is force-shown after 3.5s if the motion runtime fails.
- Motion (`motion/react`) is for UI micro-interactions only, under `LazyMotion strict` → use `import * as m from "motion/react-m"`.

## 8. 3D art direction

- **Studio**: near-black cyclorama (`#090807`), soft reflective floor, one long overhead softbox strip, two warm champagne side strips, a cool rim — the car is defined by its reflections and edges, not by flat light.
- **Car**: the licensed concept car, repainted — default *Obsidian* (warm black metallic + clearcoat), alternatives *Champagne* and *Ivory* (these mirror the vinyl-wrap service). Bronze brake calipers, satin graphite wheels, tan interior, tinted glass, 9WERKS number plate built from the original logo.
- **Camera**: low three-quarter front, long lens (fov ≈ 28–32). Subtle pointer parallax; limited, damped rotation; scroll moves the camera, never the page.
- Quality tiers: reflective floor + higher DPR on capable desktops; contact shadow + DPR ≤ 1.5 on phones; photographic fallback when WebGL is missing, Data Saver is on, or the device is very low-end.

## 9. Accessibility checklist (every component)

- One `h1` per page (the page hero). Sections are `aria-labelledby` their heading.
- Visible focus: 2px outline in `--focus` (bronze-300), 3px offset.
- Touch targets ≥ 44 × 44px; links in text have a non-colour cue (underline).
- Forms: visible labels, `aria-invalid`, `aria-describedby` for hints/errors, errors in text not colour alone.
- Decorative media `alt=""` / `aria-hidden`; meaningful photos use registry alt text.
- Canvas content is mirrored by real HTML (headings, buttons, descriptions).

## 10. Don't

Generic card grids · rounded rectangles · glassmorphism · random/coloured gradients · neon accents · gold everywhere · floating blobs · decorative motion on every element · stock "AI" layouts · invented facts, prices, reviews or awards.
