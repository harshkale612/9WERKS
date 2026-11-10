"use client";

/**
 * Gallery grid + lightbox trigger. Strictly aligned:
 *  - desktop (lg): 4 columns × 2 equal rows — two tall portrait "bookends"
 *    framing a 2 × 2 centre, so every top edge, bottom edge and gutter lines up;
 *  - tablet (sm): an even 2-column grid of equal 4:5 tiles;
 *  - phones: a horizontal snap rail of equal 4:5 tiles.
 * Captions sit inside each tile (bottom-left) so they never break the rows.
 */
import { useState } from "react";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Photo } from "@/components/ui/Photo";
import type { PhotoId } from "@/content/photos";
import { cn } from "@/lib/cn";
import { Lightbox } from "./Lightbox";

export interface GalleryItem {
  id: PhotoId;
  caption: string;
  alt: string;
}

/** Desktop placement: tall bookends in columns 1 and 4, a 2 × 2 grid between. */
const PLACEMENT = [
  "lg:col-start-1 lg:row-span-2 lg:row-start-1",
  "lg:col-start-2 lg:row-start-1",
  "lg:col-start-3 lg:row-start-1",
  "lg:col-start-2 lg:row-start-2",
  "lg:col-start-3 lg:row-start-2",
  "lg:col-start-4 lg:row-span-2 lg:row-start-1",
];

/** Image `sizes` per placement (tall bookends and centre tiles are one column wide). */
const SIZES = "(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 74vw";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <ul
        aria-label="Workshop photographs"
        className={cn(
          // Phones: snap rail
          "-mx-[clamp(1.25rem,4.2vw,4.5rem)] mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(1.25rem,4.2vw,4.5rem)] pb-4",
          // Tablet: even 2-column grid
          "sm:mx-0 sm:mt-20 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0",
          // Desktop: 4 columns × 2 equal rows with fixed height, so all edges align
          "lg:h-[min(44rem,82svh)] lg:grid-cols-4 lg:grid-rows-2"
        )}
      >
        {items.map((item, i) => (
          <li key={item.id} className={cn("w-[74vw] max-w-88 shrink-0 snap-start sm:w-auto sm:max-w-none", PLACEMENT[i % PLACEMENT.length])}>
            <figure className="relative h-full">
              <button type="button" onClick={() => setOpen(i)} className="group relative block h-full w-full cursor-zoom-in text-left">
                <span className="sr-only">
                  Open photo {i + 1} of {items.length}: {item.caption}
                </span>
                <ImageReveal className="aspect-4/5 lg:aspect-auto lg:h-full" from="bottom" delay={(i % 3) * 0.08}>
                  <div className="absolute inset-0 transition-transform duration-1400 ease-out-expo group-hover:scale-[1.04]">
                    <Photo id={item.id} fill sizes={SIZES} alt="" />
                  </div>
                </ImageReveal>
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-line transition-colors duration-500 group-hover:ring-accent" />
              </button>
              {/* Overlaid on the tile but outside the button (valid figure/figcaption, label-in-name safe). */}
              <figcaption className="label pointer-events-none absolute inset-x-0 bottom-0 flex items-end gap-3 bg-linear-to-t from-ink-950/90 via-ink-950/40 to-transparent p-4 pt-12 text-fg sm:p-5 sm:pt-14">
                <span className="tabular shrink-0 text-accent-text">Fig. {String(i + 1).padStart(2, "0")}</span>
                <span aria-hidden="true" className="mb-[0.45em] h-px w-5 shrink-0 bg-current opacity-50" />
                <span className="min-w-0">{item.caption}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <p className="label mt-6 text-fg-subtle sm:hidden" aria-hidden="true">
        Swipe for more →
      </p>
      {open !== null && <Lightbox items={items} index={open} onIndexChange={setOpen} onClose={() => setOpen(null)} />}
    </>
  );
}
