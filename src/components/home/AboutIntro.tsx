/**
 * 04 — About 9WERKS. A graphite chapter after the stats band: an
 * editorial left page (headline, intro, philosophy) and an overlapping pair of
 * authentic photographs on the right, each with a technical figure caption.
 */
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Accent, SectionLabel, displayClasses } from "@/components/ui/Typography";
import { FigCaption, authenticCaption } from "@/components/about/FigCaption";
import { companyIntro, philosophy } from "@/content/company";
import { routes } from "@/lib/routes";

export function AboutIntro() {
  return (
    <Section theme="graphite" aria-labelledby="about-intro-title" className="overflow-hidden border-t border-line">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6 lg:pt-6">
          <SectionLabel index="04" className="mb-8">
            About 9WERKS
          </SectionLabel>
          <RevealText as="h2" id="about-intro-title" className={displayClasses("lg")}>
            <Accent text="More than a *workshop.* A crew that *understands* your ride." />
          </RevealText>
          <Reveal className="mt-10 space-y-6 sm:mt-12" stagger={0.1}>
            <p className="measure text-lead text-fg text-pretty">{companyIntro}</p>
            <p className="measure text-fg-muted text-pretty">{philosophy}</p>
            <div className="pt-4">
              <ButtonLink href={routes.about} variant="secondary">
                Our story
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <div className="relative lg:col-span-6 lg:pl-6">
          <figure className="ml-auto w-[86%] sm:w-[72%] lg:w-[78%]">
            <ImageReveal className="aspect-4/5" parallax={6}>
              <Photo id="crew" fill sizes="(min-width: 1024px) 38vw, (min-width: 640px) 64vw, 84vw" />
            </ImageReveal>
            <FigCaption index="01">{authenticCaption("crew")}</FigCaption>
          </figure>
          <figure className="relative z-10 -mt-24 w-[58%] sm:-mt-40 sm:w-[46%] lg:absolute lg:bottom-[-2rem] lg:left-0 lg:mt-0 lg:w-[44%]">
            <ImageReveal className="aspect-3/4 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)]" from="left" delay={0.15}>
              <Photo id="facade" fill sizes="(min-width: 1024px) 22vw, (min-width: 640px) 42vw, 56vw" />
            </ImageReveal>
            <FigCaption index="02">{authenticCaption("facade")}</FigCaption>
          </figure>
        </div>
      </div>
    </Section>
  );
}
