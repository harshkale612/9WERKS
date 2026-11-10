/**
 * 11 — Gallery. Authentic 9WERKS photography only, laid out like the plates
 * of a printed photo book (varied crops, staggered columns). Every
 * plate opens an accessible lightbox. A swipeable rail on phones.
 */
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Accent, SectionLabel, displayClasses } from "@/components/ui/Typography";
import { InstagramIcon } from "@/components/icons/BrandIcons";
import { authenticPhotoIds, getPhoto } from "@/content/photos";
import { social } from "@/content/site";
import { GalleryGrid } from "./gallery/GalleryGrid";

export function Gallery() {
  const items = authenticPhotoIds.map((id) => {
    const p = getPhoto(id);
    return { id, caption: p.caption ?? "", alt: p.alt };
  });

  return (
    <Section theme="dark" aria-labelledby="gallery-title" className="overflow-hidden border-t border-line">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className="lg:col-span-7">
          <SectionLabel index="11" className="mb-6">
            Gallery
          </SectionLabel>
          <RevealText as="h2" id="gallery-title" className={displayClasses("lg")}>
            <Accent text="Cars we *love* working on." />
          </RevealText>
        </div>
        <Reveal className="space-y-6 lg:col-span-4 lg:col-start-9 lg:pb-2">
          <p className="text-lead text-fg-muted text-pretty">A look inside 9WERKS — the space, the crew and some of the cars that pass through our doors.</p>
          <ButtonLink href={social.instagram.href} variant="ghost" icon={<InstagramIcon className="size-4" />}>
            Follow {social.instagram.handle}
          </ButtonLink>
        </Reveal>
      </div>
      <GalleryGrid items={items} />
    </Section>
  );
}
