import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCta } from "@/components/sections/FinalCta";
import { ButtonLink } from "@/components/ui/Button";
import { AboutStory } from "@/components/about/AboutStory";
import { AboutNumbers } from "@/components/about/AboutNumbers";
import { AboutPrinciples } from "@/components/about/AboutPrinciples";
import { AboutExpertise } from "@/components/about/AboutExpertise";
import { AboutTrust } from "@/components/about/AboutTrust";
import { companyIntro } from "@/content/company";
import { contact } from "@/content/site";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About 9WERKS — 35 Years of Car Care in Pune",
  description:
    "9WERKS is a crew of certified technicians in Aundh, Pune, with 35 years of experience caring for exotic, supercar and performance vehicles.",
  path: routes.about,
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "About", path: routes.about }]}
        label="About 9WERKS"
        index="01"
        title={["Built on", "*35 years* of care."]}
        lead={companyIntro}
        actions={
          <>
            <ButtonLink href={routes.booking}>Book a service</ButtonLink>
            <ButtonLink href={contact.phone.href} variant="secondary" icon={<Phone aria-hidden="true" className="size-4" strokeWidth={1.5} />} noArrow>
              <span className="tabular">{contact.phone.display}</span>
            </ButtonLink>
          </>
        }
        photo={{ id: "crew" }}
      />
      <AboutStory index="02" />
      <AboutNumbers index="03" />
      <AboutPrinciples index="04" firstFigure={2} />
      <AboutExpertise index="05" />
      <AboutTrust index="06" figure="05" />
      <FinalCta
        index="07"
        label="Visit the crew"
        title="Meet the crew in *Aundh.*"
        lead="Drop by the workshop in Sanewadi, or book a slot and we'll confirm it personally on WhatsApp."
        photo="facade"
      />
    </>
  );
}
