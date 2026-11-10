/**
 * 03 — In numbers. A spec-sheet band: the monumental "35" (years) carries the
 * left page; the other three published figures sit in ruled rows on the
 * right, numerals hung on hairlines with labels in the technical voice.
 */
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/Typography";
import { stats } from "@/content/site";

export function StatsBand() {
  const [lead, ...rest] = stats;
  if (!lead) return null;
  return (
    <Section theme="dark" spacing="tight" aria-labelledby="stats-title" className="border-t border-line">
      <h2 id="stats-title" className="sr-only">
        9WERKS in numbers
      </h2>
      <SectionLabel index="03" className="mb-10 sm:mb-14">
        In numbers
      </SectionLabel>

      <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-10">
        <Reveal className="lg:col-span-6">
          <p className="label text-fg-muted">{lead.label}</p>
          <p className="mt-2 font-display font-[300] leading-[0.78] tracking-[-0.05em] text-fg text-[clamp(8.5rem,3rem+24vw,21rem)]">
            <Counter value={lead.value} suffix={lead.suffix} />
          </p>
        </Reveal>

        <Reveal as="dl" className="border-t border-line-strong lg:col-span-5 lg:col-start-8" stagger={0.1}>
          {rest.map((s) => (
            <div key={s.id} className="flex items-end justify-between gap-6 border-b border-line py-6 sm:py-8">
              <dt className="label max-w-[12rem] pb-2 text-fg-muted">{s.label}</dt>
              <dd className="font-display font-[300] leading-none tracking-[-0.03em] text-fg text-[clamp(3rem,1.8rem+4.6vw,5.75rem)]">
                <Counter value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
