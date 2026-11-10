/**
 * 08 — The workshop. The authentic reel (BMW Z4 service, 9WERKS footage) in a
 * tall framed column, beside the crew's three principles and two authentic
 * photographs set off the grid.
 */
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Accent, SectionLabel, displayClasses } from "@/components/ui/Typography";
import { InstagramIcon } from "@/components/icons/BrandIcons";
import { FigCaption, authenticCaption } from "@/components/about/FigCaption";
import { pillars } from "@/content/company";
import { social } from "@/content/site";
import { ReelVideo } from "./workshop/ReelVideo";

export function WorkshopReel() {
  return (
    <Section theme="dark" aria-labelledby="workshop-title" className="overflow-hidden">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <div className="reg-marks mx-auto max-w-[26rem] lg:mx-0">
              <ReelVideo poster="/assets/photos/z4-bay-540.webp" label="9WERKS crew servicing a BMW Z4 in the workshop" className="aspect-9/16 max-h-[82svh] w-full" />
            </div>
            <p className="label mx-auto mt-5 flex max-w-[26rem] items-center gap-3 text-fg-muted lg:mx-0">
              <span className="relative flex size-2" aria-hidden="true">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-stop opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-stop" />
              </span>
              Live from the floor · BMW Z4 service
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <SectionLabel index="08" className="mb-6">
            The workshop
          </SectionLabel>
          <RevealText as="h2" id="workshop-title" className={displayClasses("lg")}>
            <Accent text="Watch the *crew* at work." />
          </RevealText>
          <Reveal className="mt-8">
            <p className="measure text-lead text-fg-muted text-pretty">
              Real cars, real work, on our floor in Sanewadi — the crew, the equipment and the standard every car is held to.
            </p>
          </Reveal>

          <Reveal as="ol" className="mt-14 border-t border-line" stagger={0.1}>
            {pillars.map((p) => (
              <li key={p.index} className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-line py-7 sm:grid-cols-[3.5rem_1fr]">
                <span className="label tabular pt-1.5 text-accent-text">{p.index}</span>
                <div>
                  <h3 className="font-display text-display-sm">{p.title}</h3>
                  <p className="mt-3 text-fg-muted text-pretty">{p.body}</p>
                </div>
              </li>
            ))}
          </Reveal>

          <div className="mt-16 grid grid-cols-12 gap-4 sm:gap-6">
            <figure className="col-span-7">
              <ImageReveal className="aspect-4/5" parallax={5}>
                <Photo id="m5-lift" fill sizes="(min-width: 1024px) 26vw, 56vw" />
              </ImageReveal>
              <FigCaption index="03">{authenticCaption("m5-lift")}</FigCaption>
            </figure>
            <figure className="col-span-5 mt-24 sm:mt-36">
              <ImageReveal className="aspect-2/3" from="right" delay={0.12}>
                <Photo id="bmw-m4" fill sizes="(min-width: 1024px) 18vw, 40vw" />
              </ImageReveal>
              <FigCaption index="04">{authenticCaption("bmw-m4")}</FigCaption>
            </figure>
          </div>

          <Reveal className="mt-14">
            <ButtonLink href={social.instagram.href} variant="secondary" icon={<InstagramIcon className="size-4" />}>
              More on Instagram {social.instagram.handle}
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
