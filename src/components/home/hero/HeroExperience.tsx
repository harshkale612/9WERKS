"use client";

/**
 * Client layer of the home hero: decides whether WebGL runs, lazy-loads the
 * canvas, cross-fades it over the poster when the first frame is ready, feeds
 * the scene with scroll / pointer / drag input, and renders the finish
 * selector (Obsidian · Champagne · Ivory — the vinyl-wrap service in 3D).
 */
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useThreeSupport } from "@/components/three/useThreeSupport";
import { FINISHES, FINISH_ORDER, type FinishId } from "@/components/three/finishes";
import type { HeroRig } from "@/components/three/HeroScene";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

const HeroCanvas = dynamic(() => import("@/components/three/HeroCanvas"), { ssr: false });

export const DEFAULT_FINISH: FinishId = "champagne";

export function HeroExperience({ sectionId }: { sectionId: string }) {
  const support = useThreeSupport();
  const [finish, setFinish] = useState<FinishId>(DEFAULT_FINISH);
  const [ready, setReady] = useState(false);
  // Mount the 3D only once the browser is idle after load: first paint and LCP
  // come from the poster, and the 3D bundle never competes with them.
  const [mount, setMount] = useState(false);
  useEffect(() => {
    if (support.mode !== "webgl") return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    const start = () => setMount(true);
    let idle = 0;
    const timer = window.setTimeout(() => {
      if (w.requestIdleCallback) idle = w.requestIdleCallback(start, { timeout: 2000 });
      else start();
    }, 600);
    return () => {
      window.clearTimeout(timer);
      if (idle) w.cancelIdleCallback?.(idle);
    };
  }, [support.mode]);
  const scroll = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const drag = useRef(0);
  const rig = useMemo<HeroRig>(() => ({ scroll, pointer, drag }), []);

  // Scroll progress of the hero leaving the viewport.
  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        scroll.current = self.progress;
      },
    });
    return () => st.kill();
  }, [sectionId]);

  // Pointer parallax + drag-to-rotate (fine pointers only; touch keeps native scrolling).
  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let dragging = false;
    let startX = 0;
    let startYaw = 0;
    let homeTimer = 0;

    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.current.y = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (dragging) drag.current = gsap.utils.clamp(-0.6, 0.6, startYaw + (e.clientX - startX) * 0.0055);
    };
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || (e.target as HTMLElement).closest("a,button,input,select,textarea,[role=radio]")) return;
      dragging = true;
      startX = e.clientX;
      startYaw = drag.current;
      window.clearTimeout(homeTimer);
      section.style.cursor = "grabbing";
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      section.style.cursor = "";
      homeTimer = window.setTimeout(() => {
        drag.current = 0;
      }, 2600);
    };
    const onLeave = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
    };
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      window.clearTimeout(homeTimer);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, [sectionId]);

  const onReady = useCallback(() => setReady(true), []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = FINISH_ORDER.indexOf(finish);
    const next = e.key === "ArrowRight" || e.key === "ArrowDown" ? (i + 1) % 3 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (i + 2) % 3 : -1;
    if (next < 0) return;
    e.preventDefault();
    const id = FINISH_ORDER[next]!;
    setFinish(id);
    e.currentTarget.querySelector<HTMLElement>(`[data-finish="${id}"]`)?.focus();
  };

  const webgl = support.mode === "webgl";

  return (
    <>
      {webgl && mount && (
        <div aria-hidden="true" className={cn("absolute inset-0 -z-10 transition-opacity duration-[1400ms] ease-out-quart", ready ? "opacity-100" : "opacity-0")}>
          <HeroCanvas finish={finish} rig={rig} tier={support.tier} reducedMotion={support.reducedMotion} onReady={onReady} fallback={null} />
        </div>
      )}

      {webgl && (
        <div className="hero-anim absolute bottom-6 right-[clamp(1.25rem,4.2vw,4.5rem)] z-10 hidden animate-fade lg:block" style={{ ["--d" as string]: "900ms" }}>
          <div className="flex items-center gap-6">
            <p className="label text-fg-muted" id="finish-label">
              Finish
            </p>
            <div role="radiogroup" aria-labelledby="finish-label" className="flex gap-1" onKeyDown={onKeyDown}>
              {FINISH_ORDER.map((id) => {
                const f = FINISHES[id];
                const checked = id === finish;
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={checked}
                    tabIndex={checked ? 0 : -1}
                    data-finish={id}
                    onClick={() => setFinish(id)}
                    className={cn(
                      "label inline-flex min-h-11 items-center gap-2.5 border px-3.5 transition-colors duration-300",
                      checked ? "border-line-strong text-fg" : "border-transparent text-fg-muted hover:text-fg"
                    )}
                  >
                    <span aria-hidden="true" className="size-3 ring-1 ring-line-strong" style={{ backgroundColor: f.color }} />
                    {f.label}
                  </button>
                );
              })}
            </div>
            <Link href={routes.service("wraps-detailing")} className="label inline-flex min-h-11 items-center gap-2 text-accent-text transition-colors hover:text-fg">
              Wraps &amp; detailing
              <svg aria-hidden="true" viewBox="0 0 24 12" className="h-2.5 w-5" fill="none" stroke="currentColor" strokeWidth="1.25">
                <path d="M0 6h22M17 1l5 5-5 5" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
