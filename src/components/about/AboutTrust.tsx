/**
 * 06 — Trust. The three commitments from the official site, set as three
 * measured columns under a single rule, with an authentic photograph as the
 * closing plate. No awards or certification bodies are named: none are
 * verifiable (see BUSINESS_CONTENT.md).
 */
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { Accent, SectionLabel, displayClasses } from "@/components/ui/Typography";
import { trustPoints } from "@/content/company";
import { FigCaption, authenticCaption } from "./FigCaption";

export function AboutTrust({ index = "06", figure = "05" }: { index?: string; figure?: string }) {
  const caption = authenticCaption("m5-lift");
  return (
    <Section theme="graphite" aria-labelledby="about-trust-title">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className="lg:col-span-7">
          <SectionLabel index={index} className="mb-6">
            Trust
          </SectionLabel>
          <RevealText as="h2" id="about-trust-title" className={displayClasses("lg")}>
            <Accent text="A crew you can *trust.*" />
          </RevealText>
        </div>
        <Reveal className="lg:col-span-4 lg:col-start-9 lg:pb-2">
          <p className="text-lead text-fg-muted text-pretty">
            Every car is handled by our certified technicians — committed to safety, reliability and customer satisfaction on every job.
          </p>
        </Reveal>
      </div>

      <Reveal as="ol" className="mt-16 grid border-t border-line-strong sm:mt-24 md:grid-cols-3" stagger={0.1}>
        {trustPoints.map((p, i) => (
          <li key={p.index} className={`py-10 md:py-12 ${i > 0 ? "border-t border-line md:border-l md:border-t-0 md:pl-10" : ""} ${i < 2 ? "md:pr-10" : ""}`}>
            <p aria-hidden="true" className="font-display tabular text-display-md font-[300] text-accent-text">
              {p.index}
            </p>
            <h3 className="mt-8 font-display text-display-sm">{p.title}</h3>
            <p className="mt-4 text-fg-muted text-pretty">{p.body}</p>
          </li>
        ))}
      </Reveal>

      <figure className="mt-10 sm:mt-16">
        <ImageReveal className="aspect-4/5 sm:aspect-21/9" parallax={7}>
          <Photo id="m5-lift" fill sizes="100vw" position="50% 60%" />
        </ImageReveal>
        {caption && <FigCaption index={figure}>{caption}</FigCaption>}
      </figure>
    </Section>
  );
}
