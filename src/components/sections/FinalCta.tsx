/**
 * Closing call to action — a cinematic, full-bleed authentic photograph with
 * the booking prompt. Used at the end of most pages.
 */
import { Phone } from "lucide-react";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/motion/Reveal";
import { Photo } from "@/components/ui/Photo";
import { ButtonLink } from "@/components/ui/Button";
import { Accent, SectionLabel, displayClasses } from "@/components/ui/Typography";
import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import type { PhotoId } from "@/content/photos";
import { contact } from "@/content/site";
import { routes } from "@/lib/routes";

interface FinalCtaProps {
  index?: string;
  label?: string;
  title?: string;
  lead?: string;
  photo?: PhotoId;
  ctaLabel?: string;
  ctaHref?: string;
}

export function FinalCta({
  index = "12",
  label = "Book a service",
  title = "Your car deserves *the right hands.*",
  lead = "Tell us about your car and what it needs. We'll confirm your slot personally on WhatsApp.",
  photo = "porsche",
  ctaLabel = "Book your service",
  ctaHref = routes.booking,
}: FinalCtaProps) {
  return (
    <section className="theme-studio relative isolate overflow-hidden" aria-labelledby="final-cta-title">
      <ImageReveal className="absolute inset-0 -z-10" parallax={8} start="top 95%">
        <Photo id={photo} fill sizes="100vw" alt="" />
      </ImageReveal>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-ink-950 via-ink-950/80 to-ink-950/10" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-ink-950 via-transparent to-ink-950/60" />

      <div className="container-x flex min-h-[78svh] flex-col justify-end py-24 sm:py-32 lg:min-h-[92svh]">
        <SectionLabel index={index} className="mb-8">
          {label}
        </SectionLabel>
        <RevealText as="h2" id="final-cta-title" className={displayClasses("xl", "max-w-5xl")}>
          <Accent text={title} />
        </RevealText>
        <Reveal className="mt-8 max-w-xl" delay={0.15}>
          <p className="text-lead text-fg-muted text-pretty">{lead}</p>
        </Reveal>
        <Reveal className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap" delay={0.25}>
          <ButtonLink href={ctaHref} size="lg">
            {ctaLabel}
          </ButtonLink>
          <ButtonLink href={contact.phone.href} variant="secondary" size="lg" icon={<Phone aria-hidden="true" className="size-4" strokeWidth={1.5} />} noArrow>
            <span className="tabular">{contact.phone.display}</span>
          </ButtonLink>
          <ButtonLink href={contact.whatsapp.href} variant="secondary" size="lg" icon={<WhatsAppIcon className="size-4" />} noArrow>
            WhatsApp
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
