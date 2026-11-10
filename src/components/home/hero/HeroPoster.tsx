/**
 * The hero's first paint and LCP image: a still render of the 3D studio scene
 * (scripts/3d/render-stills.mjs). Landscape and portrait framings; the live
 * canvas cross-fades in on top when WebGL is available. It is also the full
 * fallback when WebGL is not.
 */
const LANDSCAPE = [640, 960, 1280, 1600, 1920, 2560];
const PORTRAIT = [480, 720, 1080];

const set = (name: string, widths: number[], ext: string) => widths.map((w) => `/assets/renders/${name}-${w}.${ext} ${w}w`).join(", ");

export function HeroPoster() {
  return (
    <picture className="absolute inset-0 -z-20 block">
      <source media="(max-aspect-ratio: 4/5)" type="image/avif" srcSet={set("hero-portrait", PORTRAIT, "avif")} sizes="100vw" />
      <source media="(max-aspect-ratio: 4/5)" type="image/webp" srcSet={set("hero-portrait", PORTRAIT, "webp")} sizes="100vw" />
      <source type="image/avif" srcSet={set("hero", LANDSCAPE, "avif")} sizes="100vw" />
      <source type="image/webp" srcSet={set("hero", LANDSCAPE, "webp")} sizes="100vw" />
      <img
        src="/assets/renders/hero-1600.webp"
        alt=""
        width={2560}
        height={1440}
        fetchPriority="high"
        loading="eager"
        decoding="async"
        className="h-full w-full object-cover"
      />
    </picture>
  );
}
