/**
 * 05 — Expertise. What the crew works on, as a typographic index rather than
 * cards: the four published specialisations set large on the left, the six
 * services as a ruled, linked directory on the right, and the marques named on
 * the official site as a quiet closing line.
 */
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Section } from "@/components/ui/Section";
import { Accent, SectionLabel, displayClasses } from "@/components/ui/Typography";
import { services, specialisations } from "@/content/services";
import { site } from "@/content/site";
import { routes } from "@/lib/routes";

export function AboutExpertise({ index = "05" }: { index?: string }) {
  const marques = `${site.marques.slice(0, -1).join(", ")} and ${site.marques.at(-1)}`;
  return (
    <Section theme="dark" aria-labelledby="about-expertise-title">
      <SectionLabel index={index} className="mb-6">
        Expertise
      </SectionLabel>
      <RevealText as="h2" id="about-expertise-title" className={displayClasses("lg", "max-w-5xl")}>
        <Accent text="From BMW to *supercars.*" />
      </RevealText>

      <div className="mt-16 grid gap-16 lg:mt-24 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <p className="label mb-6 text-accent-text">We specialise in</p>
          <Reveal as="ul" className="border-t border-line" stagger={0.08}>
            {specialisations.map((s) => (
              <li key={s.index} className="flex items-baseline gap-5 border-b border-line py-6 sm:py-7">
                <span className="label tabular text-accent-text">{s.index}</span>
                <span className="font-display text-display-sm">{s.title}</span>
              </li>
            ))}
          </Reveal>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <p className="label mb-6 text-accent-text">Our six services</p>
          <Reveal as="ul" className="border-t border-line" stagger={0.06}>
            {services.map((s) => (
              <li key={s.slug} className="border-b border-line">
                <Link href={routes.service(s.slug)} className="group flex min-h-16 items-center justify-between gap-6 py-4 transition-colors hover:text-accent-text">
                  <span className="flex items-baseline gap-4">
                    <span className="label tabular text-fg-subtle">{s.index}</span>
                    <span className="text-lg">{s.title}</span>
                  </span>
                  <svg aria-hidden="true" viewBox="0 0 24 12" className="h-3 w-6 shrink-0 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.25">
                    <path d="M0 6h22M17 1l5 5-5 5" />
                  </svg>
                </Link>
              </li>
            ))}
          </Reveal>
          <Reveal className="mt-10" delay={0.1}>
            <p className="measure text-lead text-fg-muted text-pretty">
              From {marques} to exotics and supercars — performance and luxury cars need more than a general garage.
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
