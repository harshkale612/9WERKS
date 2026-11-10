import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Accent } from "@/components/ui/Typography";
import { address } from "@/content/site";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="theme-studio relative flex min-h-[86svh] items-end overflow-hidden pb-20 pt-36 sm:pb-28" aria-labelledby="nf-title">
      <div className="container-x w-full">
        <p className="label mb-8 flex items-center gap-3 text-fg-muted">
          <span className="tabular text-accent-text">Error 404</span>
          <span aria-hidden="true" className="h-px w-8 bg-current opacity-50" />
          <span className="tabular">{address.coordinatesLabel}</span>
        </p>
        <h1 id="nf-title" className="font-display text-display-xl">
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="block animate-rise">
              <Accent text="Off the *map.*" />
            </span>
          </span>
        </h1>
        <p className="measure mt-8 animate-fade text-lead text-fg-muted text-pretty" style={{ animationDelay: "250ms" }}>
          This page doesn&apos;t exist — it may have moved when we rebuilt our website. Everything else is right where it should be.
        </p>
        <div className="mt-10 flex animate-fade flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ animationDelay: "400ms" }}>
          <ButtonLink href={routes.home}>Back to home</ButtonLink>
          <ButtonLink href={routes.booking} variant="secondary">
            Book a service
          </ButtonLink>
        </div>
        <nav aria-label="Helpful links" className="mt-16 border-t border-line pt-8">
          <ul className="flex flex-wrap gap-x-10 gap-y-2">
            {[
              { href: routes.services, label: "Services" },
              { href: routes.about, label: "About" },
              { href: routes.contact, label: "Contact" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="label-lg inline-flex min-h-11 items-center text-fg-muted transition-colors hover:text-fg">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
