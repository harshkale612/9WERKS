"use client";

/**
 * Line-by-line masked text reveal (GSAP SplitText, lines masked so each line
 * rises from behind an invisible edge). Re-splits automatically on resize and
 * font load. SplitText's `aria: "auto"` keeps the text readable to screen
 * readers as one unit.
 *
 * Wrap ONE text element (heading or paragraph). Inline children such as
 * `<span className="font-accent">` are preserved.
 */
import { useRef, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

type RevealTextProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  start?: string;
  /** Animate immediately on mount instead of on scroll (for content at the top of a page). */
  immediate?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function RevealText<T extends ElementType = "h2">({
  as,
  children,
  className,
  delay = 0,
  stagger = 0.085,
  start = "top 88%",
  immediate = false,
  ...rest
}: RevealTextProps<T>) {
  const Tag = (as ?? "h2") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set(el, { opacity: 1 });
        el.setAttribute("data-reveal-done", "");
        return;
      }
      gsap.set(el, { opacity: 1 });
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 112,
            duration: 1.25,
            ease: "expo.out",
            stagger,
            delay,
            scrollTrigger: immediate ? undefined : { trigger: el, start, once: true },
            onComplete: () => {
              el.setAttribute("data-reveal-done", "");
              // Restore the original markup: removes the line masks so ascenders /
              // descenders of the italic accent can never stay clipped.
              split.revert();
            },
          });
        },
      });
      return () => split.revert();
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} data-reveal="" className={className} {...rest}>
      {children}
    </Tag>
  );
}
