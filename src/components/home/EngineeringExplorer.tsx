/**
 * 07 — Automotive engineering: "The anatomy of care". Six components of the
 * car, each mapped to one of the six real services, explored in 3D.
 */
import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { Accent, SectionLabel, displayClasses } from "@/components/ui/Typography";
import { engineeringCopy } from "@/content/engineering";
import { EngineeringStage } from "./engineering/EngineeringStage";

export function EngineeringExplorer() {
  return (
    <Section theme="studio" aria-labelledby="engineering-title" className="border-t border-line">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className="lg:col-span-7">
          <SectionLabel index="07" className="mb-6">
            {engineeringCopy.label}
          </SectionLabel>
          <RevealText as="h2" id="engineering-title" className={displayClasses("lg")}>
            <Accent text={engineeringCopy.title} />
          </RevealText>
        </div>
        <Reveal className="lg:col-span-4 lg:col-start-9 lg:pb-2">
          <p className="text-lead text-fg-muted text-pretty">{engineeringCopy.lead}</p>
        </Reveal>
      </div>
      <EngineeringStage />
    </Section>
  );
}
