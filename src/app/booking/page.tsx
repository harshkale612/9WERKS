import type { Metadata } from "next";
import { Navigation, Phone } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { HoursList } from "@/components/ui/Hours";
import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import { BookingForm } from "@/components/booking/BookingForm";
import { processSteps } from "@/content/company";
import { address, contact, maps } from "@/content/site";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Book a Service — Aundh, Pune",
  description:
    "Request a service slot at 9WERKS in Aundh, Pune. Share your car and what it needs; we confirm every booking personally on WhatsApp. Or call +91 70831 99986.",
  path: routes.booking,
});

export default function BookingPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Book a service", path: routes.booking }]}
        label="Booking"
        index="01"
        title={["Book", "*your service.*"]}
        lead="Share a few details and we'll confirm your slot personally on WhatsApp. It takes under a minute."
        compact
      />

      <Section theme="dark" aria-label="Booking request form" className="border-t border-line !pt-14 sm:!pt-20">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <BookingForm />
          </div>

          <aside className="lg:col-span-4 lg:col-start-9" aria-label="Booking information">
            <div className="space-y-12 lg:sticky lg:top-28">
              <div>
                <p className="label mb-5 text-accent-text">What happens next</p>
                <ol className="border-t border-line">
                  {processSteps.map((s) => (
                    <li key={s.index} className="grid grid-cols-[2.25rem_1fr] gap-x-3 border-b border-line py-4">
                      <span className="label tabular pt-1 text-accent-text">{s.index}</span>
                      <span>
                        <span className="block font-display text-[1.05rem]">{s.title}</span>
                        <span className="mt-1 block text-sm text-fg-muted text-pretty">{s.body}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <p className="label mb-4 text-accent-text">Prefer to talk?</p>
                <a href={contact.phone.href} className="group flex min-h-14 items-center gap-3 font-display text-display-sm transition-colors hover:text-accent-text">
                  <Phone aria-hidden="true" className="size-5 text-accent" strokeWidth={1.5} />
                  <span className="tabular">{contact.phone.display}</span>
                </a>
                <a href={contact.whatsapp.href} target="_blank" rel="noopener noreferrer" className="mt-1 flex min-h-11 items-center gap-3 text-fg-muted transition-colors hover:text-fg">
                  <WhatsAppIcon className="size-4 text-accent" /> Or message us on WhatsApp
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>

              <div>
                <p className="label mb-4 text-accent-text">Opening hours</p>
                <HoursList />
              </div>

              <div>
                <p className="label mb-4 text-accent-text">Workshop</p>
                <address className="not-italic text-fg-muted">
                  {address.lines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
                <a href={maps.directions} target="_blank" rel="noopener noreferrer" className="label mt-4 inline-flex min-h-11 items-center gap-2 text-fg transition-colors hover:text-accent-text">
                  <Navigation aria-hidden="true" className="size-3.5" strokeWidth={1.5} /> Get directions
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
