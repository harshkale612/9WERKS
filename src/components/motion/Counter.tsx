"use client";

/**
 * Animated statistic. Server-renders the final value (correct for SEO, no-JS
 * and reduced motion), then counts up once when scrolled into view.
 * Uses Indian digit grouping (1,500 / 1,50,000) via en-IN.
 */
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

const fmt = (n: number) => Math.round(n).toLocaleString("en-IN");

export function Counter({ value, suffix = "", duration = 2.2, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const state = { n: 0 };
      const numEl = el.querySelector<HTMLElement>("[data-num]");
      if (!numEl) return;
      gsap.to(state, {
        n: value,
        duration,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onStart: () => {
          numEl.textContent = fmt(0);
        },
        onUpdate: () => {
          numEl.textContent = fmt(state.n);
        },
      });
    },
    { scope: ref, dependencies: [value] }
  );

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">
        {fmt(value)}
        {suffix}
      </span>
      <span aria-hidden="true" className="tabular">
        <span data-num="">{fmt(value)}</span>
        {suffix}
      </span>
    </span>
  );
}
