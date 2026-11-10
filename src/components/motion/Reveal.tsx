"use client";

/**
 * Scroll reveal for blocks. Elements carry `data-reveal`, which keeps them
 * hidden before hydration (see globals.css → Motion safety) so nothing flashes.
 *
 * variant: "up" (fade + rise) | "fade"
 * stagger: animate direct children one after another instead of the wrapper.
 */
import { useRef, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

type RevealProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  variant?: "up" | "fade";
  delay?: number;
  stagger?: number;
  /** ScrollTrigger start, default "top 88%". */
  start?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function Reveal<T extends ElementType = "div">({
  as,
  children,
  className,
  variant = "up",
  delay = 0,
  stagger,
  start = "top 88%",
  ...rest
}: RevealProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add({ reduce: "(prefers-reduced-motion: reduce)", ok: "(prefers-reduced-motion: no-preference)" }, (ctx) => {
        const done = () => el.setAttribute("data-reveal-done", "");
        const targets = stagger ? Array.from(el.children) : [el];
        if (ctx.conditions?.reduce) {
          gsap.set([el, ...targets], { opacity: 1, y: 0 });
          done();
          return;
        }
        if (stagger) gsap.set(el, { opacity: 1 });
        gsap.fromTo(
          targets,
          { opacity: 0, y: variant === "up" ? 32 : 0 },
          {
            opacity: 1,
            y: 0,
            duration: variant === "up" ? 1.15 : 1.4,
            ease: "expo.out",
            delay,
            stagger: stagger ?? 0,
            scrollTrigger: { trigger: el, start, once: true },
            onComplete: done,
          }
        );
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} data-reveal="" className={className} {...rest}>
      {children}
    </Tag>
  );
}
