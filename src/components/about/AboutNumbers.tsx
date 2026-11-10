/**
 * 03 — In numbers. The four published figures (exact values from site.ts) set
 * into a 2 × 2 hairline grid on the obsidian ground: oversized thin numerals,
 * generous whitespace, rules that draw in like a technical drawing, and a
 * bronze registration cross where they intersect. A single ruled column on
 * phones. Numerals scale with their cell (container query units), so
 * "1,500+" always fits its quadrant.
 */
import { Counter } from "@/components/motion/Counter";
import { RevealText } from "@/components/motion/RevealText";
import { Section } from "@/components/ui/Section";
import { Accent, SectionLabel, displayClasses } from "@/components/ui/Typography";
import { stats } from "@/content/site";
import { cn } from "@/lib/cn";
import { DrawnRules } from "./DrawnRules";

function RegistrationCross() {
  return (
    <span data-rule="mark" aria-hidden="true" className="absolute left-0 top-0 hidden size-7 -translate-x-1/2 -translate-y-1/2 sm:block">
      <span className="absolute inset-x-0 top-1/2 h-px bg-accent" />
      <span className="absolute inset-y-0 left-1/2 w-px bg-accent" />
    </span>
  );
}

export function AboutNumbers({ index = "03" }: { index?: string }) {
  return (
    <Section theme="dark" aria-labelledby="about-numbers-title">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-x-10">
        <div className="lg:col-span-8">
          <SectionLabel index={index} className="mb-6">
            In numbers
          </SectionLabel>
          <RevealText as="h2" id="about-numbers-title" className={displayClasses("lg")}>
            <Accent text="9WERKS, *by the numbers.*" />
          </RevealText>
        </div>
      </div>

      <DrawnRules className="mt-14 sm:mt-20 lg:mt-28">
        <span data-rule="x" aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-line-strong" />
        <span data-rule="x" aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-line-strong" />
        <dl className="grid sm:grid-cols-2">
          {stats.map((stat, i) => {
            const right = i % 2 === 1;
            return (
              <div
                key={stat.id}
                className={cn(
                  "@container relative flex min-h-[12.5rem] flex-col justify-between gap-10 py-8 sm:min-h-[19rem] sm:py-10 lg:min-h-[26rem] lg:py-12",
                  right ? "sm:pl-8 lg:pl-12" : "sm:pr-8 lg:pr-12"
                )}
              >
                {i > 0 && <span data-rule="x" aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-px bg-line", i === 1 && "sm:hidden")} />}
                {right && <span data-rule="y" aria-hidden="true" className="absolute inset-y-0 left-0 hidden w-px bg-line sm:block" />}
                {i === 3 && <RegistrationCross />}

                <dt className="label flex items-baseline gap-3 text-fg-muted">
                  <span aria-hidden="true" className="tabular text-accent-text">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {stat.label}
                </dt>
                <dd className="font-display text-[length:clamp(3.25rem,21cqi,10rem)] font-[300] leading-[0.8] tracking-[-0.045em] text-fg">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </dd>
              </div>
            );
          })}
        </dl>
      </DrawnRules>
    </Section>
  );
}
