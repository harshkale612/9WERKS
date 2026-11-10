/**
 * Visit — address, directions, contact routes, live opening hours and the
 * Google Map (lazy-loaded iframe, toned to the obsidian palette).
 */
import { Mail, MapPin, Navigation, Phone } from "lucide-react";
import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { HoursList } from "@/components/ui/Hours";
import { Accent, SectionLabel, displayClasses } from "@/components/ui/Typography";
import { Section } from "@/components/ui/Section";
import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import { address, contact, maps } from "@/content/site";

interface LocationBlockProps {
  index?: string;
  title?: string;
  lead?: string;
  headingLevel?: "h2" | "h3";
}

export function LocationBlock({
  index = "13",
  title = "Find us in *Aundh*, Pune",
  lead = "Drop in, call ahead, or message us on WhatsApp. We're just behind Seasons Road in Sanewadi.",
  headingLevel = "h2",
}: LocationBlockProps) {
  return (
    <Section theme="graphite" aria-labelledby="location-title" id="visit">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionLabel index={index} className="mb-6">
            Visit the workshop
          </SectionLabel>
          <RevealText as={headingLevel} id="location-title" className={displayClasses("lg")}>
            <Accent text={title} />
          </RevealText>
          <Reveal className="mt-8">
            <p className="measure text-lead text-fg-muted text-pretty">{lead}</p>
          </Reveal>

          <Reveal className="mt-12 space-y-8" stagger={0.08}>
            <address className="not-italic">
              <p className="label mb-3 flex items-center gap-2 text-accent-text">
                <MapPin aria-hidden="true" className="size-3.5" strokeWidth={1.5} /> Address
              </p>
              <p className="text-lg leading-relaxed text-fg">
                {address.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </p>
              <p className="label mt-3 tabular text-fg-subtle">{address.coordinatesLabel}</p>
            </address>

            <div>
              <p className="label mb-3 text-accent-text">Opening hours</p>
              <HoursList className="max-w-sm" />
            </div>

            <ul className="grid gap-2 sm:grid-cols-2">
              <li>
                <a href={contact.phone.href} className="flex min-h-12 items-center gap-3 border-b border-line py-2 text-fg transition-colors hover:text-accent-text">
                  <Phone aria-hidden="true" className="size-4 text-accent" strokeWidth={1.5} />
                  <span className="tabular">{contact.phone.display}</span>
                </a>
              </li>
              <li>
                <a href={contact.whatsapp.href} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center gap-3 border-b border-line py-2 text-fg transition-colors hover:text-accent-text">
                  <WhatsAppIcon className="size-4 text-accent" />
                  WhatsApp the crew<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li className="sm:col-span-2">
                <a href={contact.email.href} className="flex min-h-12 items-center gap-3 border-b border-line py-2 text-fg transition-colors hover:text-accent-text">
                  <Mail aria-hidden="true" className="size-4 text-accent" strokeWidth={1.5} />
                  {contact.email.address}
                </a>
              </li>
            </ul>

            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={maps.directions} icon={<Navigation aria-hidden="true" className="size-4" strokeWidth={1.5} />} noArrow>
                Get directions
              </ButtonLink>
              <ButtonLink href={maps.listing} variant="secondary">
                View on Google Maps
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-7" variant="fade">
          <div className="reg-marks h-full">
            <div className="relative aspect-4/5 h-full min-h-[22rem] overflow-hidden bg-ink-900 sm:aspect-4/3 lg:aspect-auto lg:min-h-[36rem]">
              <iframe
                src={maps.embed}
                title="Map showing the 9WERKS workshop in Sanewadi, Aundh, Pune"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0 [filter:grayscale(1)_invert(0.9)_contrast(0.92)_brightness(0.92)]"
              />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-bronze/20 mix-blend-color" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-line" />
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
