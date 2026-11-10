/**
 * 10 — Reviews. The Google rating as a monumental figure inside a fine
 * "rev counter" ring that sweeps to 4.9/5. Always dated and linked to the live
 * listing; no review text or names (none are part of our verified data).
 */
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Accent, SectionLabel, displayClasses } from "@/components/ui/Typography";
import { reviews } from "@/content/site";
import { RatingRing } from "./workshop/RatingRing";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-1.5" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span key={i} className="relative block size-5">
            <svg viewBox="0 0 24 24" className="absolute inset-0 size-5 text-line-strong" fill="currentColor">
              <path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9z" />
            </svg>
            <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <svg viewBox="0 0 24 24" className="size-5 text-bronze" fill="currentColor">
                <path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9z" />
              </svg>
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function ReviewsBand() {
  return (
    <Section theme="studio" aria-labelledby="reviews-title" className="overflow-hidden">
      <div className="grid gap-16 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-5">
          <SectionLabel index="10" className="mb-6">
            Reviews
          </SectionLabel>
          <RevealText as="h2" id="reviews-title" className={displayClasses("lg")}>
            <Accent text="Rated by the people who *drive.*" />
          </RevealText>
          <Reveal className="mt-8 space-y-8">
            <p className="measure text-lead text-fg-muted text-pretty">
              Our customers rate us {reviews.rating} out of {reviews.outOf} on {reviews.source}. Read what they say, in their own words, on our Google listing.
            </p>
            <ButtonLink href={reviews.href} size="lg">
              Read our reviews on Google
            </ButtonLink>
          </Reveal>
        </div>

        <div className="relative lg:col-span-6 lg:col-start-7">
          <figure className="relative mx-auto aspect-square w-full max-w-[34rem]" aria-label={`Rated ${reviews.rating} out of ${reviews.outOf} from ${reviews.count} ${reviews.source} reviews, as of ${reviews.asOf}`}>
            <RatingRing value={reviews.rating / reviews.outOf} className="absolute inset-0" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="font-display font-[300] leading-[0.8] tracking-[-0.05em] text-fg text-[clamp(6.5rem,2rem+18vw,12.5rem)]" aria-hidden="true">
                {reviews.rating}
              </p>
              <p className="label mt-4 text-fg-muted" aria-hidden="true">
                out of {reviews.outOf}
              </p>
              <div className="mt-6">
                <Stars rating={reviews.rating} />
              </div>
              <p className="label-lg mt-6 text-fg" aria-hidden="true">
                <Counter value={reviews.count} /> {reviews.source} reviews
              </p>
            </div>
          </figure>
          <p className="label mx-auto mt-6 max-w-[34rem] text-center text-fg-subtle">
            As of {reviews.asOf} · live figures on Google
          </p>
        </div>
      </div>
    </Section>
  );
}
