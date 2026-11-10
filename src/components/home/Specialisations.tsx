/**
 * 05 — Our specialisation. The four published specialisations as a monumental
 * typographic index. On fine pointers, hovering or focusing a row brings its
 * authentic photograph into a floating frame that trails the cursor; on touch
 * screens each row carries a small inline thumbnail instead.
 */
import { RevealText } from "@/components/motion/RevealText";
import { Section } from "@/components/ui/Section";
import { Accent, SectionLabel, displayClasses } from "@/components/ui/Typography";
import { specialisations } from "@/content/services";
import { SpecialisationIndex } from "./story/SpecialisationIndex";

export function Specialisations() {
  return (
    <Section theme="dark" aria-labelledby="specialisations-title">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className="lg:col-span-8">
          <SectionLabel index="05" className="mb-6">
            Our specialisation
          </SectionLabel>
          <RevealText as="h2" id="specialisations-title" className={displayClasses("lg")}>
            <Accent text="What we *specialise* in." />
          </RevealText>
        </div>
        <p className="text-fg-muted text-pretty lg:col-span-4 lg:pb-2">
          Exotics, supercars and sports cars — the cars that need more than a general garage.
        </p>
      </div>
      <SpecialisationIndex items={specialisations.map((s) => ({ index: s.index, title: s.title, photo: s.photo }))} />
    </Section>
  );
}
