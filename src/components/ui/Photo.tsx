/**
 * <Photo> — renders a registered photograph as a responsive <picture> with
 * AVIF + WebP sources, intrinsic width/height (no layout shift), a blurred
 * placeholder, and lazy loading by default. Works in server and client
 * components.
 *
 *   <Photo id="m5-lift" sizes="(min-width: 1024px) 50vw, 100vw" />          // intrinsic ratio
 *   <div className="relative aspect-4/5"><Photo id="crew" fill /></div>   // fills a sized box
 */
import { getPhoto, PHOTO_BASE, type PhotoId } from "@/content/photos";
import { cn } from "@/lib/cn";

interface PhotoProps {
  id: PhotoId;
  /** Responsive sizes hint — always set this accurately for performance. */
  sizes: string;
  /** Override registry alt text (e.g. "" when purely decorative next to a caption). */
  alt?: string;
  /** Fill the nearest positioned ancestor with object-fit: cover. */
  fill?: boolean;
  /** Above-the-fold hero image: eager + high fetch priority. */
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /** CSS object-position; defaults to the registry focal point. */
  position?: string;
  /** Apply the subtle cinematic grade. Default true. */
  grade?: boolean;
}

export function Photo({ id, sizes, alt, fill = false, priority = false, className, imgClassName, position, grade = true }: PhotoProps) {
  const p = getPhoto(id);
  const srcset = (ext: "avif" | "webp") => p.widths.map((w) => `${PHOTO_BASE}/${id}-${w}.${ext} ${w}w`).join(", ");
  const fallbackWidth = p.widths.find((w) => w >= 960) ?? p.widths[p.widths.length - 1];

  return (
    <picture className={cn(fill ? "absolute inset-0 block" : "block", className)}>
      <source type="image/avif" srcSet={srcset("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcset("webp")} sizes={sizes} />
      <img
        src={`${PHOTO_BASE}/${id}-${fallbackWidth}.webp`}
        width={p.width}
        height={p.height}
        alt={alt ?? p.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        className={cn(fill ? "h-full w-full object-cover" : "h-auto w-full", grade && "photo-grade", imgClassName)}
        style={{
          objectPosition: position ?? p.focus,
          backgroundImage: `url(${p.blur})`,
          backgroundSize: "cover",
          backgroundPosition: position ?? p.focus ?? "center",
          backgroundColor: p.dominant,
        }}
      />
    </picture>
  );
}
