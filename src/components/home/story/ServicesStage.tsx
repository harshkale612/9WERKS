"use client";

/**
 * Sticky stage + scrolling chapters. A ScrollTrigger per chapter marks it
 * active as it crosses the viewport centre; the stage cross-fades to that service's
 * photo with its index and component tag. No pinning — the page
 * scrolls normally; the stage is plain CSS `position: sticky`.
 */
import Link from "next/link";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Photo } from "@/components/ui/Photo";
import { Accent } from "@/components/ui/Typography";
import type { Service } from "@/content/services";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

const arrow = (
  <svg aria-hidden="true" viewBox="0 0 24 12" className="h-3 w-6 shrink-0 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.25">
    <path d="M0 6h22M17 1l5 5-5 5" />
  </svg>
);

export function ServicesStage({ services }: { services: Service[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const chapters = gsap.utils.toArray<HTMLElement>("[data-chapter]", root.current);
      chapters.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="mt-16 grid gap-10 sm:mt-24 lg:grid-cols-12">
      {/* Sticky stage (desktop) */}
      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-28 h-[calc(100svh-9rem)] max-h-[52rem]">
          <div className="reg-marks h-full">
            <div className="relative h-full overflow-hidden bg-ink-900">
              {services.map((s, i) => (
                <div
                  key={s.slug}
                  aria-hidden="true"
                  className={cn(
                    // Opacity (not clip-path) so every stage photo lazy-loads ahead of its turn.
                    "absolute inset-0 transition-[opacity,scale] duration-[1100ms] ease-out-quart",
                    i === active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
                  )}
                >
                  <Photo id={s.image.primary} fill sizes="38vw" alt="" />
                  <div className="absolute inset-0 bg-linear-to-t from-ink-950/85 via-ink-950/10 to-transparent" />
                </div>
              ))}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 xl:p-8">
                <p className="font-display tabular text-[clamp(4rem,7vw,7.5rem)] font-[300] leading-[0.8] text-fg">{services[active]?.index}</p>
                <p className="label pb-2 text-right text-fg-muted">{services[active]?.component}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters */}
      <ol className="lg:col-span-6 lg:col-start-7">
        {services.map((s, i) => (
          <li
            key={s.slug}
            data-chapter=""
            className={cn(
              "relative border-t border-line py-14 sm:py-16 lg:flex lg:min-h-[78svh] lg:flex-col lg:justify-center lg:py-20 lg:pl-10",
              "lg:before:absolute lg:before:bottom-20 lg:before:left-0 lg:before:top-20 lg:before:w-px lg:before:origin-top lg:before:bg-accent lg:before:transition-transform lg:before:duration-700 lg:before:ease-out-expo",
              i === active ? "lg:before:scale-y-100" : "lg:before:scale-y-0"
            )}
          >
            {/* Mobile image */}
            <div className="relative mb-10 aspect-4/5 overflow-hidden sm:aspect-3/2 lg:hidden">
              <Photo id={s.image.primary} fill sizes="(min-width: 640px) 90vw, 100vw" alt="" />
              <div className="absolute inset-0 bg-linear-to-t from-ink-950/70 to-transparent" />
              <p className="label absolute bottom-5 left-5 text-fg">{s.component}</p>
            </div>

            <p className="label flex items-center gap-3 text-fg-muted">
              <span className="tabular text-accent-text">Service {s.index}</span>
              <span aria-hidden="true" className="h-px w-8 bg-current opacity-50" />
              <span className="lg:hidden">{s.shortTitle}</span>
              <span className="hidden lg:inline">{s.component}</span>
            </p>
            <h3 className="mt-6 font-display text-display-md">
              <Accent text={s.displayTitle} />
            </h3>
            <p className="measure mt-6 text-lead text-fg-muted text-pretty">{s.summary}</p>

            <ul className="mt-8 border-t border-line">
              {s.inclusions.map((inc, k) => (
                <li key={inc} className="flex items-baseline gap-4 border-b border-line py-3.5">
                  <span className="label tabular text-fg-subtle">{String(k + 1).padStart(2, "0")}</span>
                  <span className="text-fg">{inc}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
              <Link href={routes.service(s.slug)} className="group label-lg inline-flex min-h-11 items-center gap-3 text-fg transition-colors hover:text-accent-text">
                Explore <span className="sr-only">{s.title}</span> {arrow}
              </Link>
              <Link href={routes.bookService(s.slug)} className="group label-lg inline-flex min-h-11 items-center gap-3 text-accent-text transition-colors hover:text-fg">
                Book this service <span className="sr-only">: {s.title}</span> {arrow}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
