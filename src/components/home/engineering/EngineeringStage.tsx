"use client";

/**
 * Interactive explorer: an accessible tab list of the six components drives
 * the 3D view and the information panel (real HTML, readable without WebGL).
 * The canvas mounts only as the section approaches the viewport; without
 * WebGL the component's authentic photograph takes its place.
 */
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useThreeSupport } from "@/components/three/useThreeSupport";
import { Photo } from "@/components/ui/Photo";
import { Accent } from "@/components/ui/Typography";
import { engineeringComponents, engineeringCopy } from "@/content/engineering";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

const EngineeringCanvas = dynamic(() => import("@/components/three/EngineeringCanvas"), { ssr: false });

const arrow = (
  <svg aria-hidden="true" viewBox="0 0 24 12" className="h-3 w-6 shrink-0 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.25">
    <path d="M0 6h22M17 1l5 5-5 5" />
  </svg>
);

export function EngineeringStage() {
  const support = useThreeSupport();
  const [active, setActive] = useState(0);
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [exploded, setExploded] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const component = engineeringComponents[active]!;

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const mq = window.matchMedia("(max-aspect-ratio: 1/1)");
    const onMq = () => setNarrow(mq.matches);
    onMq();
    mq.addEventListener("change", onMq);
    const nearIo = new IntersectionObserver(([e]) => e?.isIntersecting && setNear(true), { rootMargin: "100% 0px" });
    const viewIo = new IntersectionObserver(([e]) => e?.isIntersecting && setInView(true), { threshold: 0.35 });
    nearIo.observe(el);
    viewIo.observe(el);
    return () => {
      mq.removeEventListener("change", onMq);
      nearIo.disconnect();
      viewIo.disconnect();
    };
  }, []);

  const onReady = useCallback(() => setReady(true), []);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = engineeringComponents.length;
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (active + 1) % n;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (active - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next < 0) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  const webgl = support.mode === "webgl";
  const s = component.service;

  return (
    <div className="mt-14 grid gap-10 sm:mt-20 lg:grid-cols-12 lg:gap-10">
      {/* Stage */}
      <div ref={host} className="lg:col-span-8">
        <div className="reg-marks">
          <div className="relative aspect-4/5 overflow-hidden bg-ink-950 sm:aspect-16/11 lg:aspect-auto lg:h-[min(46rem,78svh)]">
            {/* Fallback / poster: the service's authentic photograph */}
            <div className={cn("absolute inset-0 transition-opacity duration-700", webgl && ready ? "opacity-0" : "opacity-100")}>
              {engineeringComponents.map((c, i) => (
                <div key={c.id} className={cn("absolute inset-0 transition-opacity duration-700", i === active ? "opacity-100" : "opacity-0")}>
                  <Photo id={c.photo} fill sizes="(min-width: 1024px) 62vw, 100vw" alt="" />
                  <div className="absolute inset-0 bg-ink-950/45" />
                </div>
              ))}
            </div>
            {webgl && near && (
              <div aria-hidden="true" className={cn("absolute inset-0 transition-opacity duration-1000", ready ? "opacity-100" : "opacity-0")}>
                <EngineeringCanvas component={component} tier={support.tier} narrow={narrow} reducedMotion={support.reducedMotion} started={inView} exploded={exploded} onReady={onReady} fallback={null} />
              </div>
            )}
            <p className="label pointer-events-none absolute left-5 top-5 flex items-center gap-3 text-fg">
              <span className="tabular text-accent-text">{component.index}</span>
              <span aria-hidden="true" className="h-px w-6 bg-current opacity-50" />
              {component.name}
            </p>
            <p className="label pointer-events-none absolute bottom-5 left-5 hidden text-fg-subtle sm:block">{webgl ? "X-ray structure view" : "Workshop photograph"}</p>
            {webgl && (
              <button
                type="button"
                aria-pressed={exploded}
                onClick={() => setExploded((v) => !v)}
                className="label absolute right-4 top-4 z-10 inline-flex min-h-11 items-center gap-2.5 border border-line-strong bg-ink-950/70 px-4 text-fg backdrop-blur-sm transition-colors hover:border-accent"
              >
                <span aria-hidden="true" className={cn("relative block size-3.5 transition-transform duration-500 ease-out-expo", exploded && "rotate-45")}>
                  <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-accent" />
                  <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-accent" />
                </span>
                {exploded ? "Assemble" : "Exploded view"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Controls + panel */}
      <div className="lg:col-span-4">
        <div
          role="tablist"
          aria-label={engineeringCopy.listLabel}
          onKeyDown={onKey}
          className="-mx-[clamp(1.25rem,4.2vw,4.5rem)] flex snap-x gap-0 overflow-x-auto border-b border-line px-[clamp(1.25rem,4.2vw,4.5rem)] lg:mx-0 lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-t lg:px-0"
        >
          {engineeringComponents.map((c, i) => {
            const selected = i === active;
            return (
              <button
                key={c.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`eng-tab-${c.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls="eng-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                className={cn(
                  "group relative flex min-h-12 shrink-0 snap-start items-center gap-3 whitespace-nowrap px-4 py-3 text-left transition-colors lg:min-h-14 lg:border-b lg:border-line lg:px-0 lg:py-4",
                  selected ? "text-fg" : "text-fg-muted hover:text-fg"
                )}
              >
                <span className="label tabular text-accent-text">{c.index}</span>
                <span className="text-[0.95rem] lg:text-lg">{c.name}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute bottom-0 left-0 h-px w-full origin-left bg-accent transition-transform duration-500 ease-out-expo lg:bottom-[-1px]",
                    selected ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </button>
            );
          })}
        </div>

        <div id="eng-panel" role="tabpanel" aria-labelledby={`eng-tab-${component.id}`} className="pt-8 lg:pt-10" aria-live="polite">
          <p className="label text-fg-muted">Service {s.index}</p>
          <h3 className="mt-4 font-display text-display-sm">
            <Accent text={s.displayTitle} />
          </h3>
          <p className="mt-5 text-fg-muted text-pretty">{component.description}</p>
          <ul className="mt-6 border-t border-line">
            {s.inclusions.map((inc) => (
              <li key={inc} className="flex items-baseline gap-3 border-b border-line py-3 text-fg">
                <span aria-hidden="true" className="size-1.5 shrink-0 translate-y-[-2px] bg-accent" />
                {inc}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-x-7 gap-y-1">
            <Link href={routes.service(s.slug)} className="group label-lg inline-flex min-h-11 items-center gap-3 text-fg hover:text-accent-text">
              Explore the service {arrow}
            </Link>
            <Link href={routes.bookService(s.slug)} className="group label-lg inline-flex min-h-11 items-center gap-3 text-accent-text hover:text-fg">
              Book this {arrow}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
