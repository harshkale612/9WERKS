/**
 * 01 + 02 — Brand intro and the signature 3D hero.
 *
 * Server-rendered: poster still (LCP), headline, supporting text, CTAs and
 * location indicator are in the HTML at first paint. The client layer
 * (HeroExperience) adds the live WebGL studio and the finish selector.
 */
import { Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Accent } from "@/components/ui/Typography";
import { address, contact } from "@/content/site";
import { routes } from "@/lib/routes";
import { BrandIntro } from "./BrandIntro";
import { HeroExperience } from "./hero/HeroExperience";
import { HeroPoster } from "./hero/HeroPoster";

const HERO_ID = "home-hero";
const headline = ["Engineered", "for *excellence.*"];

export function HomeHero() {
  return (
    <>
      <BrandIntro />
      <section id={HERO_ID} className="theme-studio relative isolate flex min-h-[max(100svh,40rem)] flex-col justify-end overflow-hidden" aria-labelledby="home-title">
        <HeroPoster />
        <HeroExperience sectionId={HERO_ID} />

        {/* Legibility grades over the studio */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-[5] bg-linear-to-t from-ink-950 via-ink-950/35 to-transparent sm:via-ink-950/10" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-[5] hidden bg-linear-to-r from-ink-950/80 via-ink-950/20 to-transparent lg:block" />

        <div className="container-x relative w-full pb-14 pt-28 sm:pb-20 lg:pb-24">
          <p className="hero-anim label mb-7 flex animate-fade items-center gap-3 text-fg-muted" style={{ ["--d" as string]: "250ms" }}>
            <span aria-hidden="true" className="h-px w-10 bg-accent" />
            Aundh, Pune · India
            <span className="tabular hidden text-fg-subtle sm:inline">{address.coordinatesLabel}</span>
          </p>
          <h1 id="home-title" className="font-display text-display-2xl lg:max-w-[11em]">
            {headline.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <span className="hero-anim block animate-rise" style={{ ["--d" as string]: `${120 + i * 110}ms` }}>
                  <Accent text={line} />
                </span>
              </span>
            ))}
          </h1>
          <p className="hero-anim measure mt-7 max-w-[34rem] animate-fade text-lead text-fg-muted text-pretty" style={{ ["--d" as string]: "480ms" }}>
            Specialist servicing, diagnostics and automotive care for exotic, supercar and performance vehicles.
          </p>
          {/* Phones: a compact pair (the pinned action bar carries Call). */}
          <div className="hero-anim mt-8 grid animate-fade grid-cols-2 gap-3 sm:hidden" style={{ ["--d" as string]: "620ms" }}>
            <ButtonLink href={routes.services} noArrow className="!px-3">
              Our services
            </ButtonLink>
            <ButtonLink href={routes.booking} variant="secondary" noArrow className="!px-3">
              Book a service
            </ButtonLink>
          </div>
          <div className="hero-anim mt-9 hidden animate-fade flex-row flex-wrap gap-3 sm:flex" style={{ ["--d" as string]: "620ms" }}>
            <ButtonLink href={routes.services} size="lg">
              Explore our services
            </ButtonLink>
            <ButtonLink href={routes.booking} variant="secondary" size="lg">
              Book a service
            </ButtonLink>
            <span className="ml-3 inline-flex">
              <ButtonLink href={contact.phone.href} variant="ghost" icon={<Phone aria-hidden="true" className="size-4" strokeWidth={1.5} />} noArrow>
                <span className="tabular">{contact.phone.display}</span>
              </ButtonLink>
            </span>
          </div>
        </div>

        {/* Technical readout */}
        <p aria-hidden="true" className="hero-anim label pointer-events-none absolute right-[clamp(1.25rem,4.2vw,4.5rem)] top-28 hidden animate-fade text-right text-fg-subtle lg:block" style={{ ["--d" as string]: "800ms" }}>
          N° 01 — Studio
          <br />
          <span className="[@media(hover:none)]:hidden">Drag to rotate</span>
        </p>
      </section>
    </>
  );
}
