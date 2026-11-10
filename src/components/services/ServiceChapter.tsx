/**
 * One service chapter on /services/. Six compositions rotate so the page reads
 * as an editorial sequence, never a card grid:
 *   split-left · split-right (+ inset) · band · wide-left · split-right · pair
 * The chapter id is the legacy anchor (servicing, diagnostics, brakes,
 * collision, wraps, wheels) so old service.html#… links still land correctly.
 */
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Photo } from "@/components/ui/Photo";
import { ButtonLink } from "@/components/ui/Button";
import { Accent, displayClasses } from "@/components/ui/Typography";
import { InstagramIcon } from "@/components/icons/BrandIcons";
import type { Service } from "@/content/services";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

export type ChapterLayout = "split-left" | "split-right" | "band" | "wide-left" | "pair";

const THEMES = ["dark", "graphite", "studio", "dark", "graphite", "studio"] as const;
/**
 * Layout per position, chosen by source-image resolution: the full-bleed band
 * goes to the large landscape photo (05, 1600 px); small sources (03, 04, 06 at
 * 500–600 px) get portrait frames that never upscale them noticeably.
 */
const LAYOUTS: ChapterLayout[] = ["split-left", "split-right", "pair", "wide-left", "band", "split-right"];

function Body({ s }: { s: Service }) {
  return (
    <>
      <p className="label flex items-center gap-3 text-fg-muted">
        <span className="tabular text-accent-text">Service {s.index}</span>
        <span aria-hidden="true" className="h-px w-8 bg-current opacity-50" />
        {s.component}
      </p>
      <RevealText as="h2" id={`service-${s.legacyId}-title`} className={displayClasses("lg", "mt-6")}>
        <Accent text={s.displayTitle} />
      </RevealText>
      <Reveal className="mt-8 space-y-5" stagger={0.08}>
        <p className="measure text-lead text-fg text-pretty">{s.summary}</p>
        <p className="measure text-fg-muted text-pretty">{s.detail}</p>
      </Reveal>
      <Reveal as="ol" className="mt-10 border-t border-line" stagger={0.07} aria-label={`What's included in ${s.title}`}>
        {s.inclusions.map((inc, k) => (
          <li key={inc} className="grid grid-cols-[2.5rem_1fr] items-baseline border-b border-line py-4">
            <span className="label tabular text-accent-text">{String(k + 1).padStart(2, "0")}</span>
            <span className="text-lg text-fg">{inc}</span>
          </li>
        ))}
      </Reveal>
      {s.note && (
        <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-fg-muted">
          <InstagramIcon className="size-4 text-accent-text" />
          {s.note.text}:
          <a href={s.note.href} target="_blank" rel="noopener noreferrer" className="text-fg underline decoration-line-strong underline-offset-4 hover:text-accent-text">
            {s.note.linkLabel}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      )}
      <Reveal className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <ButtonLink href={routes.bookService(s.slug)}>Book this service</ButtonLink>
        <ButtonLink href={routes.service(s.slug)} variant="secondary">
          Service details
        </ButtonLink>
      </Reveal>
    </>
  );
}

export function ServiceChapter({ service: s, position }: { service: Service; position: number }) {
  const theme = THEMES[position % THEMES.length];
  const layout = LAYOUTS[position % LAYOUTS.length];
  const primarySizes = "(min-width: 1024px) 42vw, 100vw";

  return (
    <section id={s.legacyId} className={cn(`theme-${theme}`, "section-y relative overflow-hidden border-t border-line")} aria-labelledby={`service-${s.legacyId}-title`}>
      <div className="container-x">
        {layout === "band" ? (
          <>
            <ImageReveal className="aspect-4/5 sm:aspect-21/9" parallax={7}>
              <Photo id={s.image.primary} fill sizes="100vw" alt="" />
            </ImageReveal>
            <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-8">
                <Body s={s} />
              </div>
            </div>
          </>
        ) : (
          <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
            <div
              className={cn(
                "relative",
                layout === "split-left" && "lg:col-span-5",
                layout === "split-right" && "lg:order-2 lg:col-span-5 lg:col-start-8",
                layout === "wide-left" && "lg:col-span-7",
                layout === "pair" && "lg:col-span-6"
              )}
            >
              {layout === "pair" ? (
                <div className="grid grid-cols-12 gap-4">
                  <ImageReveal className="col-span-7 aspect-4/5" parallax={5}>
                    <Photo id={s.image.primary} fill sizes="(min-width: 1024px) 26vw, 56vw" alt="" />
                  </ImageReveal>
                  <ImageReveal className="col-span-5 mt-20 aspect-3/4" from="right" delay={0.1}>
                    <Photo id={s.image.secondary} fill sizes="(min-width: 1024px) 18vw, 40vw" alt="" />
                  </ImageReveal>
                </div>
              ) : (
                <>
                  <ImageReveal className={layout === "wide-left" ? "aspect-4/5 lg:mx-auto lg:max-w-[38rem] lg:aspect-square" : "aspect-4/5"} from={layout === "split-right" ? "right" : "left"} parallax={5}>
                    <Photo id={s.image.primary} fill sizes={layout === "wide-left" ? "(min-width: 1024px) 608px, 100vw" : primarySizes} alt="" />
                  </ImageReveal>
                  {layout === "split-right" && (
                    <div className="absolute -bottom-10 -left-6 hidden w-[42%] lg:block">
                      <ImageReveal className="aspect-3/4 shadow-[0_30px_60px_-25px_rgb(0_0_0/0.6)]" from="bottom" delay={0.15}>
                        <Photo id={s.image.secondary} fill sizes="16vw" alt="" />
                      </ImageReveal>
                    </div>
                  )}
                </>
              )}
            </div>
            <div
              className={cn(
                layout === "split-left" && "lg:col-span-6 lg:col-start-7",
                layout === "split-right" && "lg:order-1 lg:col-span-6",
                layout === "wide-left" && "lg:col-span-4 lg:col-start-9",
                layout === "pair" && "lg:col-span-5 lg:col-start-8"
              )}
            >
              <Body s={s} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
