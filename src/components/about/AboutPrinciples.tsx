/**
 * 04 — Principles. The three things 9WERKS never compromises on, as an
 * alternating sequence of photographic plates on graphite — each crop, scale and
 * alignment different, like plates in a monograph:
 *   01  small portrait plate, left · text low on the right
 *   02  text on the left · taller portrait plate, right
 *   03  wide cinematic plate, left · text low on the right
 * Every plate opens with a cover wipe from its own side.
 */
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { Accent, SectionLabel, displayClasses } from "@/components/ui/Typography";
import { pillars, type Pillar } from "@/content/company";
import { cn } from "@/lib/cn";
import { FigCaption, authenticCaption } from "./FigCaption";

interface PlateLayout {
  figure: string;
  frame: string;
  sizes: string;
  text: string;
  from: "left" | "right" | "bottom";
}

/** One layout per pillar, in order. Mobile widths vary too, so the sequence never reads as a grid. */
const layouts: PlateLayout[] = [
  {
    figure: "w-[78%] sm:w-[58%] lg:col-span-4 lg:col-start-1 lg:w-auto",
    frame: "aspect-3/4",
    sizes: "(min-width: 1024px) 28vw, (min-width: 640px) 55vw, 75vw",
    text: "lg:col-span-5 lg:col-start-7 lg:self-end lg:pb-4",
    from: "left",
  },
  {
    figure: "ml-auto w-[86%] sm:w-[66%] lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:ml-0 lg:w-auto",
    frame: "aspect-4/5",
    sizes: "(min-width: 1024px) 36vw, (min-width: 640px) 62vw, 82vw",
    text: "lg:col-span-5 lg:col-start-2 lg:row-start-1 lg:self-center",
    from: "right",
  },
  {
    figure: "lg:col-span-8 lg:col-start-1",
    frame: "aspect-4/5 sm:aspect-3/2",
    sizes: "(min-width: 1024px) 60vw, 92vw",
    text: "lg:col-span-3 lg:col-start-10 lg:self-end lg:pb-4",
    from: "bottom",
  },
];

/** "Quality servicing" → "Quality *servicing*" (last word in the editorial italic). */
const accentLast = (title: string) => title.replace(/(\S+)$/, "*$1*");

function Plate({ pillar, layout, figure }: { pillar: Pillar; layout: PlateLayout; figure: string }) {
  const caption = authenticCaption(pillar.photo);
  return (
    <li className="grid gap-y-10 sm:gap-y-12 lg:grid-cols-12 lg:gap-x-10">
      <figure className={layout.figure}>
        <ImageReveal className={layout.frame} from={layout.from} parallax={5}>
          <Photo id={pillar.photo} fill sizes={layout.sizes} />
        </ImageReveal>
        {caption && <FigCaption index={figure}>{caption}</FigCaption>}
      </figure>

      <Reveal className={cn("max-w-xl", layout.text)}>
        <p aria-hidden="true" className="font-display tabular text-[length:clamp(3.5rem,2.2rem+4.4vw,7.5rem)] font-[300] leading-[0.8] tracking-[-0.04em] text-accent-text">
          {pillar.index}
        </p>
        <h3 className="mt-8 font-display text-display-md sm:mt-10">
          <span className="sr-only">{pillar.index}. </span>
          <Accent text={accentLast(pillar.title)} />
        </h3>
        <p className="mt-5 text-lead text-fg-muted text-pretty sm:mt-6">{pillar.body}</p>
      </Reveal>
    </li>
  );
}

export function AboutPrinciples({ index = "04", firstFigure = 2 }: { index?: string; firstFigure?: number }) {
  return (
    <Section theme="graphite" aria-labelledby="about-principles-title" className="border-t border-line">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-x-10">
        <div className="lg:col-span-8">
          <SectionLabel index={index} className="mb-6">
            Principles
          </SectionLabel>
          <RevealText as="h2" id="about-principles-title" className={displayClasses("lg")}>
            <Accent text="Three things we never *compromise* on." />
          </RevealText>
        </div>
        <Reveal className="lg:col-span-3 lg:col-start-10 lg:pb-2">
          <p className="text-lead text-fg-muted text-pretty">The standard every car in our workshop is held to.</p>
        </Reveal>
      </div>

      <ol className="mt-20 space-y-24 sm:mt-28 sm:space-y-32 lg:mt-36 lg:space-y-44">
        {pillars.map((pillar, i) => {
          const layout = layouts[i % layouts.length]!;
          return <Plate key={pillar.index} pillar={pillar} layout={layout} figure={String(firstFigure + i).padStart(2, "0")} />;
        })}
      </ol>
    </Section>
  );
}
