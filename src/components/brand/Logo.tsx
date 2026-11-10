/**
 * The ORIGINAL 9WERKS logo artwork — never redrawn, recoloured or distorted.
 * Files: public/assets/brand/9werks-logo-{480,960}.{png,webp} (WebP copies are
 * lossless and pixel-identical to the supplied PNG). Width is set by the caller;
 * height always follows the artwork's native 960 × 243 proportion.
 *
 * The artwork is designed for dark grounds — place it on ink/graphite surfaces.
 */
import { cn } from "@/lib/cn";

export const LOGO_RATIO = 960 / 243;

interface LogoProps {
  className?: string;
  /** Use eager loading in the header (above the fold). */
  priority?: boolean;
  /** CSS width hint for srcset selection, e.g. "160px". */
  sizes?: string;
  alt?: string;
}

export function Logo({ className, priority = false, sizes = "180px", alt = "9WERKS — A crew for your luxe ride" }: LogoProps) {
  return (
    <picture className={cn("block", className)}>
      <source type="image/webp" srcSet="/assets/brand/9werks-logo-480.webp 480w, /assets/brand/9werks-logo-960.webp 960w" sizes={sizes} />
      <img
        src="/assets/brand/9werks-logo-480.png"
        srcSet="/assets/brand/9werks-logo-480.png 480w, /assets/brand/9werks-logo-960.png 960w"
        sizes={sizes}
        width={960}
        height={243}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className="h-auto w-full select-none"
        draggable={false}
      />
    </picture>
  );
}
