"use client";

/**
 * Cinematic image reveal: a cover panel in the section's own surface colour
 * wipes away while the image inside settles from a slight scale. Optional
 * scroll parallax on the inner layer. Children should fill the frame
 * (e.g. <Photo fill />).
 *
 * Why a cover rather than clip-path on the frame: IntersectionObserver treats
 * an ancestor's clip-path as zero visible area, so `loading="lazy"` images
 * would not start loading until the reveal began (showing their blur
 * placeholder). With a cover, the browser lazy-loads ahead as normal.
 */
import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/cn";

interface ImageRevealProps {
  children: ReactNode;
  className?: string;
  /** Wipe direction (the edge the image appears from). */
  from?: "bottom" | "top" | "left" | "right";
  /** Parallax travel in % of the inner layer (0 = off). */
  parallax?: number;
  delay?: number;
  start?: string;
}

/** Cover transform: shrinks towards the opposite edge of `from`. */
const COVER: Record<NonNullable<ImageRevealProps["from"]>, { prop: "scaleX" | "scaleY"; origin: string }> = {
  bottom: { prop: "scaleY", origin: "50% 0%" },
  top: { prop: "scaleY", origin: "50% 100%" },
  left: { prop: "scaleX", origin: "100% 50%" },
  right: { prop: "scaleX", origin: "0% 50%" },
};

export function ImageReveal({ children, className, from = "bottom", parallax = 0, delay = 0, start = "top 85%" }: ImageRevealProps) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const cover = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = frame.current;
      const layer = inner.current;
      const panel = cover.current;
      if (!el || !layer || !panel) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const c = COVER[from];
        gsap.set(panel, { transformOrigin: c.origin, display: "block" });
        gsap.fromTo(panel, { [c.prop]: 1 }, { [c.prop]: 0, duration: 1.45, ease: "expo.inOut", delay, scrollTrigger: { trigger: el, start, once: true } });
        gsap.fromTo(layer, { scale: 1.16 }, { scale: 1, duration: 1.9, ease: "expo.out", delay, scrollTrigger: { trigger: el, start, once: true } });
        if (parallax) {
          gsap.fromTo(
            layer.firstElementChild,
            { yPercent: -parallax },
            { yPercent: parallax, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } }
          );
        }
      });
      return () => mm.revert();
    },
    { scope: frame }
  );

  // Respect a caller-supplied position (e.g. "absolute inset-0"); default to relative.
  const positioned = /\b(absolute|fixed|sticky)\b/.test(className ?? "");
  return (
    <div ref={frame} className={cn(!positioned && "relative", "overflow-hidden", className)}>
      <div ref={inner} className="absolute inset-0 will-change-transform">
        <div className={cn("absolute inset-0", parallax ? "top-[-12%] bottom-[-12%]" : "")}>{children}</div>
      </div>
      <div ref={cover} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] hidden bg-surface" />
    </div>
  );
}
