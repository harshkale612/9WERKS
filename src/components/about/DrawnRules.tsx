"use client";

/**
 * Draws the hairline architecture inside it once it scrolls into view:
 * `[data-rule="x"]` rules extend from the left, `[data-rule="y"]` drop from the
 * top, and `[data-rule="mark"]` registration marks settle in last.
 *
 * Server HTML renders every rule fully drawn, so no-JS and reduced-motion
 * visitors simply see the finished drawing.
 */
import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/cn";

interface DrawnRulesProps {
  children: ReactNode;
  className?: string;
  start?: string;
}

export function DrawnRules({ children, className, start = "top 82%" }: DrawnRulesProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const horizontal = el.querySelectorAll<HTMLElement>('[data-rule="x"]');
        const vertical = el.querySelectorAll<HTMLElement>('[data-rule="y"]');
        const marks = el.querySelectorAll<HTMLElement>('[data-rule="mark"]');
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start, once: true } });
        if (horizontal.length) {
          tl.fromTo(horizontal, { scaleX: 0 }, { scaleX: 1, transformOrigin: "0% 50%", duration: 1.5, ease: "expo.inOut", stagger: 0.08 }, 0);
        }
        if (vertical.length) {
          tl.fromTo(vertical, { scaleY: 0 }, { scaleY: 1, transformOrigin: "50% 0%", duration: 1.4, ease: "expo.inOut", stagger: 0.08 }, 0.2);
        }
        if (marks.length) {
          tl.fromTo(marks, { opacity: 0, rotate: -90 }, { opacity: 1, rotate: 0, duration: 1.1, ease: "expo.out" }, 0.95);
        }
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={cn("relative", className)}>
      {children}
    </div>
  );
}
