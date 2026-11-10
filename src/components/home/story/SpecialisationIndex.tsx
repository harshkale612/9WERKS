"use client";

/**
 * Interactive index for the specialisations. Rows link to the services page.
 * Desktop (hover + fine pointer): a floating 4:5 frame follows the cursor and
 * cross-fades to the hovered/focused row's photo (GSAP quickTo, no re-render
 * per frame). Touch: an inline thumbnail per row.
 */
import Link from "next/link";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Reveal } from "@/components/motion/Reveal";
import { Photo } from "@/components/ui/Photo";
import type { PhotoId } from "@/content/photos";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

interface Item {
  index: string;
  title: string;
  photo: PhotoId;
}

export function SpecialisationIndex({ items }: { items: Item[] }) {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const mover = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);

  useGSAP(
    () => {
      const el = frame.current;
      if (!el) return;
      gsap.set(el, { xPercent: -50, yPercent: -50 });
      mover.current = {
        x: gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" }),
      };
    },
    { scope: root }
  );

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !root.current) return;
    const r = root.current.getBoundingClientRect();
    mover.current?.x(e.clientX - r.left);
    mover.current?.y(e.clientY - r.top);
  };

  /** Keyboard focus: park the frame beside the focused row. */
  const onFocusRow = (i: number, target: HTMLElement) => {
    setActive(i);
    if (!root.current) return;
    const r = root.current.getBoundingClientRect();
    const t = target.getBoundingClientRect();
    mover.current?.x(r.width * 0.72);
    mover.current?.y(t.top - r.top + t.height / 2);
  };

  return (
    <div ref={root} className="relative mt-14 sm:mt-20" onPointerMove={onMove} onPointerLeave={() => setActive(null)}>
      <Reveal as="ul" className="border-t border-line-strong" stagger={0.09}>
        {items.map((item, i) => (
          <li key={item.index} className="border-b border-line">
            <Link
              href={routes.services}
              className={cn(
                "group relative z-10 flex min-h-24 items-center gap-5 py-6 transition-colors duration-500 sm:gap-8 sm:py-8",
                active !== null && active !== i ? "text-fg-subtle" : "text-fg"
              )}
              onPointerEnter={() => setActive(i)}
              onFocus={(e) => onFocusRow(i, e.currentTarget)}
              onBlur={() => setActive(null)}
            >
              <span className="label tabular w-8 shrink-0 text-accent-text">{item.index}</span>
              <span className="font-display text-[clamp(1.6rem,0.9rem+3.6vw,4.75rem)] leading-[0.95] transition-transform duration-700 ease-out-expo group-hover:translate-x-3 group-focus-visible:translate-x-3">
                {item.title}
              </span>
              {/* Touch: inline thumbnail */}
              <span aria-hidden="true" className="relative ml-auto block aspect-4/5 w-16 shrink-0 overflow-hidden sm:w-20 [@media(hover:hover)_and_(pointer:fine)]:hidden">
                <Photo id={item.photo} fill sizes="80px" alt="" />
              </span>
              <svg aria-hidden="true" viewBox="0 0 24 12" className="ml-auto hidden h-3 w-6 shrink-0 text-accent opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-x-1 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:block" fill="none" stroke="currentColor" strokeWidth="1.25">
                <path d="M0 6h22M17 1l5 5-5 5" />
              </svg>
            </Link>
          </li>
        ))}
      </Reveal>

      {/* Desktop: floating preview frame */}
      <div
        ref={frame}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-0 top-0 z-0 hidden aspect-4/5 w-[clamp(14rem,20vw,19rem)] overflow-hidden transition-[opacity,scale] duration-500 ease-out-expo [@media(hover:hover)_and_(pointer:fine)]:block",
          active === null ? "scale-90 opacity-0" : "scale-100 opacity-100"
        )}
      >
        {items.map((item, i) => (
          <div key={item.index} className={cn("absolute inset-0 transition-opacity duration-500", active === i ? "opacity-100" : "opacity-0")}>
            <Photo id={item.photo} fill sizes="304px" alt="" />
          </div>
        ))}
      </div>
    </div>
  );
}
