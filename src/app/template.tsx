"use client";

/**
 * Page transition. The first page load renders without any wrapper animation
 * (so server HTML is visible immediately and LCP is unaffected); subsequent
 * client-side navigations fade the new page in. Opacity only — a transform
 * here would become the containing block for any `position: fixed` content.
 */
import { useEffect, type ReactNode } from "react";
import * as m from "motion/react-m";

let hasNavigated = false;

export default function Template({ children }: { children: ReactNode }) {
  const animate = hasNavigated;
  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <m.div
      initial={animate ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
    >
      {children}
    </m.div>
  );
}
