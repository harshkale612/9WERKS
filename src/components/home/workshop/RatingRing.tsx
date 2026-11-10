"use client";

/**
 * A fine gauge ring with 60 tick marks; the bronze arc sweeps to `value`
 * (0–1) when scrolled into view. Server HTML renders the final state.
 */
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const R = 46;
/** Round so server (Node) and browser trig results serialise identically (no hydration mismatch). */
const q = (n: number) => Math.round(n * 1000) / 1000;
const C = 2 * Math.PI * R;

export function RatingRing({ value, className }: { value: number; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const arc = ref.current?.querySelector<SVGCircleElement>("[data-arc]");
      if (!arc) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(arc, { strokeDashoffset: C }, { strokeDashoffset: C * (1 - value), duration: 2.4, ease: "expo.inOut", scrollTrigger: { trigger: ref.current, start: "top 80%", once: true } });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [value] }
  );

  return (
    <svg ref={ref} viewBox="0 0 100 100" className={className} aria-hidden="true">
      {Array.from({ length: 60 }, (_, i) => {
        const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
        const major = i % 5 === 0;
        const r1 = major ? 49.2 : 49.6;
        return (
          <line
            key={i}
            x1={q(50 + Math.cos(a) * r1)}
            y1={q(50 + Math.sin(a) * r1)}
            x2={q(50 + Math.cos(a) * 50)}
            y2={q(50 + Math.sin(a) * 50)}
            stroke="currentColor"
            strokeWidth={major ? 0.3 : 0.15}
            className="text-line-strong"
          />
        );
      })}
      <circle cx="50" cy="50" r={R} fill="none" stroke="currentColor" strokeWidth="0.25" className="text-line" />
      <circle
        data-arc=""
        cx="50"
        cy="50"
        r={R}
        fill="none"
        stroke="var(--color-bronze)"
        strokeWidth="0.6"
        strokeLinecap="round"
        strokeDasharray={q(C)}
        strokeDashoffset={q(C * (1 - value))}
        transform="rotate(-90 50 50)"
      />
    </svg>
  );
}
