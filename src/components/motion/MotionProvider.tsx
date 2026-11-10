"use client";

/**
 * Global motion runtime:
 *  - registers GSAP plugins once,
 *  - runs Lenis smooth scrolling on the GSAP ticker (skipped entirely for
 *    prefers-reduced-motion users and on touch devices, which keep native scroll),
 *  - keeps ScrollTrigger in sync with Lenis and with route changes,
 *  - provides Motion's LazyMotion (strict: use `m.*` components, not `motion.*`),
 *  - marks <html> as `motion-ready` so pre-hydration reveal guards lift.
 *
 * `useLenis()` returns a stable API; every method is a safe no-op when smooth
 * scrolling is disabled.
 */
import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
gsap.defaults({ ease: "expo.out", duration: 1.1 });

export interface ScrollApi {
  /** Pause smooth scrolling (e.g. while a modal is open). */
  stop: () => void;
  start: () => void;
  /** Scroll to a target (px, selector or element). Falls back to native scrolling. */
  scrollTo: (target: number | string | HTMLElement, options?: { offset?: number; immediate?: boolean }) => void;
  resize: () => void;
  /** The live Lenis instance, if smooth scrolling is active. */
  readonly instance: Lenis | null;
}

const ScrollContext = createContext<ScrollApi | null>(null);

export function useLenis(): ScrollApi {
  const api = useContext(ScrollContext);
  if (!api) throw new Error("useLenis must be used inside <MotionProvider>");
  return api;
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  const api = useMemo<ScrollApi>(
    () => ({
      stop: () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
      resize: () => lenisRef.current?.resize(),
      scrollTo: (target, options) => {
        const lenis = lenisRef.current;
        if (lenis) {
          lenis.scrollTo(target, { offset: options?.offset ?? 0, immediate: options?.immediate });
          return;
        }
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const behavior: ScrollBehavior = options?.immediate || reduce ? "auto" : "smooth";
        if (typeof target === "number") {
          window.scrollTo({ top: target + (options?.offset ?? 0), behavior });
          return;
        }
        const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + (options?.offset ?? 0), behavior });
      },
      get instance() {
        return lenisRef.current;
      },
    }),
    []
  );

  useEffect(() => {
    document.documentElement.classList.add("motion-ready");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (reduce || coarse) return;

    const lenis = new Lenis({
      lerp: 0.11,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
      anchors: { offset: -96 },
      stopInertiaOnNavigate: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenisRef.current = lenis;

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // New page content changes the document height: recalculate scroll positions.
  useEffect(() => {
    const id = window.setTimeout(() => {
      lenisRef.current?.resize();
      ScrollTrigger.refresh();
    }, 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return (
    <ScrollContext.Provider value={api}>
      <MotionConfig reducedMotion="user">
        <LazyMotion features={domAnimation} strict>
          {children}
        </LazyMotion>
      </MotionConfig>
    </ScrollContext.Provider>
  );
}
