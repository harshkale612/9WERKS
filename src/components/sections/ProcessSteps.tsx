"use client";

/**
 * How it works — 01 Book · 02 Inspect · 03 Service · 04 Drive away.
 * A dark chapter (theme prop). A bronze rule draws through the four stages as
 * the section scrolls (scrubbed, never pinned), lighting each numeral as it
 * passes. Vertical on small screens.
 */
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { processSteps } from "@/content/company";
import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/motion/Reveal";
import { Accent, SectionLabel, displayClasses } from "@/components/ui/Typography";
import { Section, type SectionTheme } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { routes } from "@/lib/routes";

interface ProcessStepsProps {
  index?: string;
  title?: string;
  lead?: string;
  showCta?: boolean;
  theme?: SectionTheme;
}

export function ProcessSteps({
  index = "09",
  title = "Booked in *four* steps",
  lead = "No guesswork, no surprises. Here's what happens from the moment you get in touch.",
  showCta = true,
  theme = "graphite",
}: ProcessStepsProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(
        {
          wide: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          narrow: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const wide = Boolean(ctx.conditions?.wide);
          const line = el.querySelector<HTMLElement>(wide ? "[data-line-h]" : "[data-line-v]");
          const nums = gsap.utils.toArray<HTMLElement>("[data-step-num]", el);
          if (!line) return;
          gsap.set(line, wide ? { scaleX: 0 } : { scaleY: 0 });
          // Resolve the theme's colours so GSAP can interpolate them; the unlit state still meets AA.
          const cs = getComputedStyle(el);
          const unlit = cs.getPropertyValue("--fg-subtle").trim() || "#92908c";
          const lit = cs.getPropertyValue("--accent-text").trim() || "#b68c66";
          gsap.set(nums, { color: unlit });
          const tl = gsap.timeline({
            scrollTrigger: { trigger: el, start: wide ? "top 70%" : "top 75%", end: wide ? "bottom 55%" : "bottom 70%", scrub: 0.6 },
          });
          tl.to(line, wide ? { scaleX: 1, ease: "none", duration: 1 } : { scaleY: 1, ease: "none", duration: 1 }, 0);
          nums.forEach((n, i) => {
            tl.to(n, { color: lit, duration: 0.12, ease: "none" }, (i / nums.length) * 0.92);
          });
        }
      );
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <Section theme={theme} aria-labelledby="process-title" className="border-t border-line">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <SectionLabel index={index} className="mb-6">
            How it works
          </SectionLabel>
          <RevealText as="h2" id="process-title" className={displayClasses("lg")}>
            <Accent text={title} />
          </RevealText>
        </div>
        <Reveal className="lg:col-span-5 lg:pb-2">
          <p className="measure text-lead text-fg-muted text-pretty">{lead}</p>
        </Reveal>
      </div>

      <div ref={root} className="relative mt-16 sm:mt-24">
        {/* Horizontal rule (desktop) */}
        <div aria-hidden="true" className="absolute inset-x-0 top-[2.15rem] hidden h-px bg-line lg:block" />
        <div aria-hidden="true" data-line-h="" className="absolute inset-x-0 top-[2.15rem] hidden h-px origin-left bg-accent lg:block" />
        {/* Vertical rule (mobile/tablet) */}
        <div aria-hidden="true" className="absolute bottom-0 left-[0.6rem] top-2 w-px bg-line lg:hidden" />
        <div aria-hidden="true" data-line-v="" className="absolute bottom-0 left-[0.6rem] top-2 w-px origin-top bg-accent lg:hidden" />

        <ol className="relative grid gap-12 lg:grid-cols-4 lg:gap-8">
          {processSteps.map((step) => (
            <li key={step.index} className="relative pl-10 lg:pl-0 lg:pr-6">
              <span aria-hidden="true" className="absolute left-0 top-[0.35rem] block size-[1.2rem] border border-accent bg-surface lg:top-[1.55rem]">
                <span className="absolute inset-[4px] bg-accent" />
              </span>
              <p
                data-step-num=""
                aria-hidden="true"
                className="font-display tabular text-[clamp(2.5rem,1.6rem+3vw,4.75rem)] font-[300] leading-none text-accent-text lg:pl-10"
              >
                {step.index}
              </p>
              <h3 className="mt-4 font-display text-display-sm lg:mt-10">
                <span className="sr-only">Step {step.index}: </span>
                {step.title}
              </h3>
              <p className="mt-4 max-w-xs text-fg-muted text-pretty">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>

      {showCta && (
        <Reveal className="mt-16 flex flex-col gap-3 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-fg-muted">Ready when your car is — we confirm every booking personally.</p>
          <ButtonLink href={routes.booking}>Start with step 01</ButtonLink>
        </Reveal>
      )}
    </Section>
  );
}
