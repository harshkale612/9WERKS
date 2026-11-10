/**
 * 02 — Our story. A graphite editorial spread, like the opening pages of a
 * printed monograph: a tall authentic photograph bleeds off the left edge
 * ("left page"), while the right page carries the opening sentence of the
 * company story as the chapter headline — engineered caps closing in the
 * editorial italic — followed by the rest of the story in two body columns
 * and a closing line set apart by a hairline.
 */
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { Accent, SectionLabel, displayClasses } from "@/components/ui/Typography";
import { story } from "@/content/company";
import type { PhotoId } from "@/content/photos";
import { FigCaption, authenticCaption } from "./FigCaption";

const PHOTO: PhotoId = "bmw-m4";

/** Split the first paragraph into its opening sentence (the headline) and the remainder. */
function splitOpening(paragraph: string) {
  const end = paragraph.indexOf(". ");
  if (end < 0) return { opening: paragraph, rest: "" };
  return { opening: paragraph.slice(0, end + 1), rest: paragraph.slice(end + 2) };
}

/**
 * Bleed to the viewport's left edge on large screens: undo the container's
 * centring margin and its gutter (mirrors `container-x` in globals.css).
 */
const bleedLeft = "lg:-ml-[calc(max(0px,(100vw_-_108rem)/2)_+_clamp(1.25rem,4.2vw,4.5rem))]";

export function AboutStory({ index = "02" }: { index?: string }) {
  const [first = "", second, third] = story;
  const { opening, rest } = splitOpening(first);
  // "…automotive care *tailored to the unique needs of your vehicle.*"
  const headline = opening.replace(/\b(tailored\b.*)$/, "*$1*");
  const caption = authenticCaption(PHOTO);

  return (
    <Section theme="graphite" aria-labelledby="about-story-title" className="border-t border-line">
      <div className="grid gap-y-14 sm:gap-y-16 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-20">
        {/* Right page, top — label + headline */}
        <div className="lg:col-span-6 lg:col-start-7 lg:row-start-1">
          <SectionLabel index={index} className="mb-8 sm:mb-10">
            Our story
          </SectionLabel>
          <RevealText as="h2" id="about-story-title" className={displayClasses("md", "max-w-[22ch]")}>
            <Accent text={headline} />
          </RevealText>
        </div>

        {/* Left page — the photograph, bleeding off the edge */}
        <figure className="lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <ImageReveal className={`aspect-4/5 lg:aspect-auto lg:h-[min(50rem,92svh)] ${bleedLeft}`} from="left" parallax={6}>
            <Photo id={PHOTO} fill sizes="(min-width: 1024px) 42vw, 92vw" />
          </ImageReveal>
          {caption && <FigCaption index="01">{caption}</FigCaption>}
        </figure>

        {/* Right page, bottom — body columns and the closing line */}
        <div className="lg:col-span-6 lg:col-start-7 lg:row-start-2 lg:self-end">
          <Reveal className="grid gap-6 text-[1.0625rem] leading-[1.7] text-fg-muted text-pretty sm:grid-cols-2 sm:gap-10" stagger={0.1}>
            {rest && (
              <p className="first-letter:float-left first-letter:mr-2.5 first-letter:mt-1 first-letter:font-accent first-letter:text-[3.9em] first-letter:leading-[0.74] first-letter:text-accent-text">
                {rest}
              </p>
            )}
            {second && <p>{second}</p>}
          </Reveal>
          {third && (
            <Reveal className="mt-12 border-t border-line pt-8 sm:mt-14 sm:pt-10" delay={0.1}>
              <p className="measure text-lead text-fg text-pretty">{third}</p>
            </Reveal>
          )}
        </div>
      </div>
    </Section>
  );
}
