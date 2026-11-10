import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { LocationBlock } from "@/components/sections/LocationBlock";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Section } from "@/components/ui/Section";
import { HoursList } from "@/components/ui/Hours";
import { Accent, SectionLabel, displayClasses } from "@/components/ui/Typography";
import { ContactForm } from "@/components/contact/ContactForm";
import { DirectLines } from "@/components/contact/DirectLines";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact 9WERKS — Aundh, Pune",
  description:
    "Call +91 70831 99986, WhatsApp or email 9WERKS, or visit the workshop in Sanewadi, Aundh, Pune. Open Mon–Fri 9 AM–9 PM, Sat–Sun 9 AM–12 PM.",
  path: routes.contact,
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Contact", path: routes.contact }]}
        label="Contact"
        index="01"
        title={["Let's talk", "*cars.*"]}
        lead="Questions, quotes or a quick check-up — reach us whichever way suits you."
        aside={<DirectLines />}
        compact
      />

      <Section theme="dark" aria-labelledby="contact-form-title" className="border-t border-line">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <SectionLabel index="02" className="mb-6">
              Send a message
            </SectionLabel>
            <RevealText as="h2" id="contact-form-title" className={displayClasses("lg")}>
              <Accent text="Have a *question?*" />
            </RevealText>
            <Reveal className="mt-8 space-y-8">
              <p className="measure text-lead text-fg-muted text-pretty">
                Send us a message and the crew will get back to you on WhatsApp as soon as possible. For bookings, use our{" "}
                <Link href={routes.booking} className="text-fg underline decoration-line-strong underline-offset-4 hover:text-accent-text">
                  booking form
                </Link>
                .
              </p>
              <div className="max-w-sm border-t border-line pt-6">
                <p className="label mb-3 text-accent-text">Opening hours</p>
                <HoursList />
              </div>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </Section>

      <LocationBlock index="03" />
    </>
  );
}
