/**
 * Editorial footer: closing statement, the original logo, navigation, the six
 * services, visit details with live opening status, and licence credits.
 */
import Link from "next/link";
import { ArrowUp, Phone, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { Accent } from "@/components/ui/Typography";
import { HoursList } from "@/components/ui/Hours";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons/BrandIcons";
import { primaryNav, bookingNav } from "@/content/navigation";
import { services } from "@/content/services";
import { address, contact, credits, maps, social, site } from "@/content/site";
import { routes } from "@/lib/routes";
import { CurrentYear } from "./CurrentYear";

const linkClass = "inline-flex min-h-9 items-center text-fg-muted transition-colors duration-300 hover:text-fg";

export function SiteFooter() {
  return (
    <footer className="theme-studio relative overflow-hidden border-t border-line" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        9WERKS — site footer
      </h2>

      {/* Closing statement */}
      <div className="container-x grid gap-10 pb-16 pt-20 sm:pt-28 lg:grid-cols-12 lg:items-end lg:pb-24 lg:pt-36">
        <p className="font-display text-display-xl lg:col-span-8" aria-hidden="true">
          <Accent text="Beyond the *ordinary* drive." />
        </p>
        <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col lg:items-end">
          <ButtonLink href={routes.booking} size="lg">
            Book your service
          </ButtonLink>
          <ButtonLink href={contact.whatsapp.href} variant="secondary" size="lg" icon={<WhatsAppIcon className="size-4" />} noArrow>
            WhatsApp the crew
          </ButtonLink>
        </div>
      </div>

      <div className="container-x">
        <div className="h-px bg-line" />
      </div>

      {/* Directory */}
      <div className="container-x grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <div className="space-y-6 sm:col-span-2 lg:col-span-4 lg:pr-10">
          <Link href={routes.home} className="block w-[13.5rem] sm:w-[16rem]" aria-label="9WERKS — home">
            <Logo sizes="256px" alt="" />
          </Link>
          <p className="measure max-w-sm text-fg-muted">
            {site.category} in {address.short}. Servicing, diagnostics, brakes, paint, wraps and wheels — by a crew that treats every car like its own.
          </p>
          <ul className="flex flex-col gap-1">
            {[social.instagram, social.detailing].map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className={`${linkClass} gap-3`}>
                  <InstagramIcon className="size-4 text-accent" />
                  {s.handle}
                  <span className="sr-only"> on Instagram (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer" className="lg:col-span-2">
          <p className="label mb-5 text-accent-text">Explore</p>
          <ul className="space-y-1">
            {[...primaryNav, bookingNav].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Services" className="lg:col-span-3">
          <p className="label mb-5 text-accent-text">Services</p>
          <ul className="space-y-1">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={routes.service(s.slug)} className={linkClass}>
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-6 sm:col-span-2 lg:col-span-3">
          <p className="label text-accent-text">Visit the workshop</p>
          <address className="space-y-3 not-italic">
            <a href={maps.listing} target="_blank" rel="noopener noreferrer" className="flex gap-3 text-fg-muted transition-colors hover:text-fg">
              <MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-accent" strokeWidth={1.5} />
              <span>
                {address.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
                <span className="sr-only"> — open in Google Maps (new tab)</span>
              </span>
            </a>
            <a href={contact.phone.href} className="flex min-h-9 items-center gap-3 text-fg-muted transition-colors hover:text-fg">
              <Phone aria-hidden="true" className="size-4 shrink-0 text-accent" strokeWidth={1.5} />
              <span className="tabular">{contact.phone.display}</span>
            </a>
            <a href={contact.email.href} className="flex min-h-9 items-center gap-3 break-all text-fg-muted transition-colors hover:text-fg">
              <Mail aria-hidden="true" className="size-4 shrink-0 text-accent" strokeWidth={1.5} />
              {contact.email.address}
            </a>
          </address>
          <HoursList compact />
        </div>
      </div>

      {/* Legal */}
      <div className="container-x">
        <div className="flex flex-col gap-4 border-t border-line py-8 pb-[calc(2rem+env(safe-area-inset-bottom))] text-sm text-fg-subtle lg:flex-row lg:items-center lg:justify-between">
          <p>
            © <CurrentYear /> {site.name}. All rights reserved. <span className="label ml-2 tabular">{address.coordinatesLabel}</span>
          </p>
          <p className="max-w-2xl text-xs leading-relaxed">
            3D vehicle: “
            <a href={credits.model.source} target="_blank" rel="noopener noreferrer" className="underline decoration-line-strong underline-offset-4 hover:text-fg">
              {credits.model.title}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            ” by {credits.model.author}, based on {credits.model.basedOn} —{" "}
            <a href={credits.model.licenceUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-line-strong underline-offset-4 hover:text-fg">
              {credits.model.licence}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            . {credits.model.changes}
          </p>
          <a href="#top" className="label inline-flex min-h-11 items-center gap-2 self-start text-fg-muted transition-colors hover:text-fg lg:self-auto">
            Back to top <ArrowUp aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </footer>
  );
}
