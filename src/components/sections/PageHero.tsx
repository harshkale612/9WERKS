/**
 * Opening chapter for inner pages. Dark studio ground, breadcrumb, technical
 * label, masked display headline, lead, actions, and an optional authentic
 * photograph (split layout) or custom aside.
 *
 * The headline enters with a pure-CSS rack focus (no JS, never clipped), so it
 * is painted in the first frame and can be the page's LCP element.
 */
import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { Photo } from "@/components/ui/Photo";
import { Accent, SectionLabel } from "@/components/ui/Typography";
import type { PhotoId } from "@/content/photos";
import { address } from "@/content/site";
import { cn } from "@/lib/cn";

interface PageHeroProps {
  crumbs: Crumb[];
  label: string;
  index?: string;
  /** Headline lines; *asterisks* mark serif-italic accents. Each entry is one masked line on large screens. */
  title: string[];
  lead?: ReactNode;
  actions?: ReactNode;
  photo?: { id: PhotoId; position?: string };
  /** Replaces the photo column with custom content. */
  aside?: ReactNode;
  /** Shorter hero for utility pages (contact, booking). */
  compact?: boolean;
  id?: string;
}

export function PageHero({ crumbs, label, index, title, lead, actions, photo, aside, compact = false, id = "page-title" }: PageHeroProps) {
  const hasMedia = Boolean(photo || aside);
  return (
    <section className={cn("theme-studio relative overflow-hidden", compact ? "pb-14 pt-28 sm:pb-20 sm:pt-36" : "pb-16 pt-28 sm:pt-36 lg:min-h-[88svh] lg:pb-24")} aria-labelledby={id}>
      <div className={cn("container-x relative grid gap-12 lg:gap-10", hasMedia && "lg:grid-cols-12 lg:items-end")}>
        <div className={cn(hasMedia ? "lg:col-span-7" : "lg:max-w-6xl")}>
          <Breadcrumbs items={crumbs} className="mb-10 sm:mb-14" />
          <SectionLabel index={index} className="mb-6">
            {label}
          </SectionLabel>
          <h1 id={id} className={cn("font-display", compact ? "text-display-lg" : "text-display-xl")}>
            {title.map((line, i) => (
              <span key={i} className="block animate-focus pb-[0.04em]" style={{ animationDelay: `${i * 110}ms` }}>
                <Accent text={line} />
              </span>
            ))}
          </h1>
          {lead && (
            <div className="mt-8 animate-fade text-lead text-fg-muted measure text-pretty sm:mt-10" style={{ animationDelay: "420ms" }}>
              {lead}
            </div>
          )}
          {actions && (
            <div className="mt-10 flex animate-fade flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ animationDelay: "520ms" }}>
              {actions}
            </div>
          )}
          <p className="label mt-14 hidden animate-fade items-center gap-3 text-fg-subtle sm:flex" style={{ animationDelay: "700ms" }}>
            <span className="h-px w-10 bg-accent" aria-hidden="true" />
            Aundh, Pune · India <span className="tabular">{address.coordinatesLabel}</span>
          </p>
        </div>

        {photo && !aside && (
          <div className="lg:col-span-5">
            <div className="reg-marks animate-fade" style={{ animationDelay: "240ms" }}>
              <div className="relative aspect-4/5 overflow-hidden lg:aspect-3/4">
                <Photo id={photo.id} priority fill sizes="(min-width: 1024px) 38vw, 100vw" position={photo.position} />
                <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink-950/50 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        )}
        {aside && <div className="lg:col-span-5">{aside}</div>}
      </div>
    </section>
  );
}
