import type { Metadata } from "next";
import { HomeHero } from "@/components/home/HomeHero";
import { StatsBand } from "@/components/home/StatsBand";
import { AboutIntro } from "@/components/home/AboutIntro";
import { Specialisations } from "@/components/home/Specialisations";
import { ServicesShowcase } from "@/components/home/ServicesShowcase";
import { EngineeringExplorer } from "@/components/home/EngineeringExplorer";
import { WorkshopReel } from "@/components/home/WorkshopReel";
import { ReviewsBand } from "@/components/home/ReviewsBand";
import { Gallery } from "@/components/home/Gallery";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { FinalCta } from "@/components/sections/FinalCta";
import { LocationBlock } from "@/components/sections/LocationBlock";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Exotic, Supercar & Sports Car Specialists in Aundh, Pune",
    description: site.description,
    path: "/",
  }),
  // The home page uses the full brand title rather than the "%s | 9WERKS" template.
  title: { absolute: "9WERKS — Exotic, Supercar & Sports Car Specialists in Aundh, Pune" },
};

/**
 * Home — "Beyond the Ordinary Drive"
 *  01–02 Brand intro + signature 3D hero     HomeHero
 *  03    Published statistics                StatsBand
 *  04    About 9WERKS                        AboutIntro
 *  05    Our specialisation                  Specialisations
 *  06    Services                            ServicesShowcase
 *  07    Automotive engineering (3D)         EngineeringExplorer
 *  08    The workshop (authentic reel)       WorkshopReel
 *  09    How it works                        ProcessSteps
 *  10    Customer reviews (Google)           ReviewsBand
 *  11    Gallery (authentic photography)     Gallery
 *  12    Final booking CTA                   FinalCta
 *  13    Location                            LocationBlock
 *  14    Footer                              (layout)
 */
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <StatsBand />
      <AboutIntro />
      <Specialisations />
      <ServicesShowcase />
      <EngineeringExplorer />
      <WorkshopReel />
      <ProcessSteps />
      <ReviewsBand />
      <Gallery />
      <FinalCta />
      <LocationBlock />
    </>
  );
}
