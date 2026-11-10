/**
 * 06 — Services. All six services as editorial chapters beside a sticky
 * photographic stage that changes with the chapter in view (desktop). On
 * phones every chapter carries its own image. See ./story/ServicesStage.tsx.
 */
import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Accent, SectionLabel, displayClasses } from "@/components/ui/Typography";
import { services } from "@/content/services";
import { routes } from "@/lib/routes";
import { ServicesStage } from "./story/ServicesStage";

export function ServicesShowcase() {
  return (
    <Section theme="studio" aria-labelledby="services-showcase-title">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className="lg:col-span-7">
          <SectionLabel index="06" className="mb-6">
            Services
          </SectionLabel>
          <RevealText as="h2" id="services-showcase-title" className={displayClasses("lg")}>
            <Accent text="Everything your car *needs.*" />
          </RevealText>
        </div>
        <Reveal className="lg:col-span-4 lg:col-start-9 lg:pb-2">
          <p className="text-lead text-fg-muted text-pretty">
            From a routine service to collision repair, paint and wraps — one crew handles it all, with the right tools for the job.
          </p>
        </Reveal>
      </div>

      <ServicesStage services={services} />

      <Reveal className="mt-16 flex flex-col items-start gap-6 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="label text-fg-muted">Six services · one crew · Aundh, Pune</p>
        <ButtonLink href={routes.services} variant="secondary">
          View all services
        </ButtonLink>
      </Reveal>
    </Section>
  );
}
