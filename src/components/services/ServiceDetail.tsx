/**
 * Body of a service detail page: what the service is and what's included
 * (graphite editorial spread), then the other five services as a ruled index
 * with previous/next navigation.
 */
import Link from "next/link";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { Accent, SectionLabel, displayClasses } from "@/components/ui/Typography";
import { InstagramIcon } from "@/components/icons/BrandIcons";
import { FigCaption, authenticCaption } from "@/components/about/FigCaption";
import { services, type Service } from "@/content/services";
import { routes } from "@/lib/routes";

const arrow = (
  <svg aria-hidden="true" viewBox="0 0 24 12" className="h-3 w-6 shrink-0 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.25">
    <path d="M0 6h22M17 1l5 5-5 5" />
  </svg>
);

export function ServiceOverview({ service: s }: { service: Service }) {
  const caption = authenticCaption(s.image.secondary);
  return (
    <Section theme="graphite" aria-labelledby="service-overview-title" className="border-t border-line">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <SectionLabel index="02" className="mb-8">
            The service
          </SectionLabel>
          <RevealText as="h2" id="service-overview-title" className={displayClasses("md")}>
            <Accent text={s.detail.replace(/^(.*?)([^ ]+ [^ ]+[.!])$/, "$1*$2*")} />
          </RevealText>
          <Reveal className="mt-10">
            <p className="measure text-lead text-fg-muted text-pretty">{s.summary}</p>
          </Reveal>
          {s.note && (
            <Reveal className="mt-8">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-fg-muted">
                <InstagramIcon className="size-4 text-accent-text" />
                {s.note.text}:
                <a href={s.note.href} target="_blank" rel="noopener noreferrer" className="text-fg underline decoration-line-strong underline-offset-4 hover:text-accent-text">
                  {s.note.linkLabel}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </p>
            </Reveal>
          )}
          <figure className="mt-14 w-[78%] sm:w-[60%] lg:w-[70%]">
            <ImageReveal className="aspect-4/5" from="left" parallax={5}>
              <Photo id={s.image.secondary} fill sizes="(min-width: 1024px) 30vw, 70vw" alt={caption ? undefined : ""} />
            </ImageReveal>
            {caption && <FigCaption index="01">{caption}</FigCaption>}
          </figure>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <div className="lg:sticky lg:top-28">
            <p className="label mb-6 text-accent-text">What&apos;s included</p>
            <Reveal as="ol" className="border-t border-line-strong" stagger={0.1}>
              {s.inclusions.map((inc, k) => (
                <li key={inc} className="border-b border-line py-8">
                  <p className="font-display tabular text-display-md font-[300] text-accent-text" aria-hidden="true">
                    {String(k + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-4 font-display text-display-sm">{inc}</p>
                </li>
              ))}
            </Reveal>
            <p className="label mt-6 text-fg-subtle">Component · {s.component}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function OtherServices({ service: s }: { service: Service }) {
  const i = services.findIndex((x) => x.slug === s.slug);
  const prev = services[(i - 1 + services.length) % services.length]!;
  const next = services[(i + 1) % services.length]!;
  const others = services.filter((x) => x.slug !== s.slug);

  return (
    <Section theme="graphite" aria-labelledby="other-services-title" className="border-t border-line">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className="lg:col-span-7">
          <SectionLabel index="04" className="mb-6">
            More services
          </SectionLabel>
          <RevealText as="h2" id="other-services-title" className={displayClasses("lg")}>
            <Accent text="One crew, *six* disciplines." />
          </RevealText>
        </div>
      </div>

      <Reveal as="ul" className="mt-14 border-t border-line-strong" stagger={0.06}>
        {others.map((o) => (
          <li key={o.slug} className="border-b border-line">
            <Link href={routes.service(o.slug)} className="group grid min-h-20 grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 py-5 sm:grid-cols-[3.5rem_1fr_1fr_auto] sm:gap-x-8">
              <span className="label tabular text-accent-text">{o.index}</span>
              <span className="font-display text-display-sm transition-colors group-hover:text-accent-text">{o.title}</span>
              <span className="hidden text-fg-muted sm:block">{o.summary}</span>
              {arrow}
            </Link>
          </li>
        ))}
      </Reveal>

      <nav aria-label="Previous and next service" className="mt-12 grid gap-4 sm:grid-cols-2">
        <Link href={routes.service(prev.slug)} className="group flex min-h-16 items-center gap-4 border border-line px-6 py-4 transition-colors hover:border-accent">
          <svg aria-hidden="true" viewBox="0 0 24 12" className="h-3 w-6 shrink-0 rotate-180 transition-transform duration-500 ease-out-expo group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.25">
            <path d="M0 6h22M17 1l5 5-5 5" />
          </svg>
          <span>
            <span className="label block text-fg-muted">Previous · {prev.index}</span>
            <span className="text-lg">{prev.title}</span>
          </span>
        </Link>
        <Link href={routes.service(next.slug)} className="group flex min-h-16 items-center justify-end gap-4 border border-line px-6 py-4 text-right transition-colors hover:border-accent">
          <span>
            <span className="label block text-fg-muted">Next · {next.index}</span>
            <span className="text-lg">{next.title}</span>
          </span>
          {arrow}
        </Link>
      </nav>
    </Section>
  );
}
