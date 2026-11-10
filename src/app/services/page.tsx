import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { FinalCta } from "@/components/sections/FinalCta";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import { ServiceChapter } from "@/components/services/ServiceChapter";
import { ServiceIndexAside } from "@/components/services/ServiceIndexAside";
import { services } from "@/content/services";
import { contact } from "@/content/site";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services — Supercar Servicing, Diagnostics, Paint & Wraps",
  description:
    "Six specialist services for exotic, supercar and performance cars in Aundh, Pune: servicing, performance diagnostics, brakes, collision repair & paint, wraps & detailing, alloy wheels & tyres.",
  path: routes.services,
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Services", path: routes.services }]}
        label="Our services"
        index="01"
        title={["Six disciplines.", "*One* crew."]}
        lead="Six core services for exotics, supercars and sports cars, one expert crew. Whatever your car needs, it's handled properly."
        actions={
          <>
            <ButtonLink href={routes.booking}>Book a service</ButtonLink>
            <ButtonLink href={contact.whatsapp.href} variant="secondary" icon={<WhatsAppIcon className="size-4" />} noArrow>
              Ask on WhatsApp
            </ButtonLink>
          </>
        }
        aside={<ServiceIndexAside />}
      />
      {services.map((s, i) => (
        <ServiceChapter key={s.slug} service={s} position={i} />
      ))}
      <ProcessSteps index="07" />
      <FinalCta
        index="08"
        label="Not sure?"
        title="Not sure what *you need?*"
        lead="Tell us what's going on with your car and we'll point you in the right direction — no obligation."
        photo="m5-lift"
      />
    </>
  );
}
