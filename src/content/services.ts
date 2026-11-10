/**
 * 9WERKS — the six services, preserved from the official site and the brief.
 *
 * Copy rules: no prices, warranties, turnaround times or capabilities that
 * 9WERKS has not published. `summary` + `inclusions` are the brief's wording;
 * `detail` is the official site's own elaboration.
 */
import type { PhotoId } from "./photos";

export type ServiceSlug =
  | "servicing-routine-checks"
  | "performance-diagnostics"
  | "brakes"
  | "collision-repair-paint"
  | "wraps-detailing"
  | "alloy-wheels-tyres";

/** IDs used by the legacy site (`service.html#id`, `booking.html?service=id`). */
export type LegacyServiceId = "servicing" | "diagnostics" | "brakes" | "collision" | "wraps" | "wheels";

export interface Service {
  slug: ServiceSlug;
  legacyId: LegacyServiceId;
  index: string;
  title: string;
  /** Title with an editorial serif accent: words wrapped in *asterisks* render in Bodoni italic. */
  displayTitle: string;
  shortTitle: string;
  summary: string;
  detail: string;
  inclusions: [string, string, string];
  /** Small "component" tag used in the engineering explorer and service UI. */
  component: string;
  image: { primary: PhotoId; secondary: PhotoId };
  note?: { text: string; linkLabel: string; href: string };
  seo: { title: string; description: string };
}

export const services: Service[] = [
  {
    slug: "servicing-routine-checks",
    legacyId: "servicing",
    index: "01",
    title: "Servicing & Routine Checks",
    displayTitle: "Servicing & *routine* checks",
    shortTitle: "Servicing",
    summary: "Scheduled servicing and routine health checks for exotic, supercar and performance vehicles.",
    detail:
      "Done properly, with quality parts and the right fluids — so your car keeps running the way it was engineered to.",
    inclusions: ["Periodic and scheduled servicing", "Oil, filters and fluids", "Multi-point health checks"],
    component: "Engine & fluids",
    image: { primary: "crew", secondary: "z4-bay" },
    seo: {
      title: "Supercar & Luxury Car Servicing in Pune",
      description:
        "Scheduled servicing and multi-point health checks for exotic, supercar and performance cars at 9WERKS, Aundh, Pune — oil, filters and fluids done properly.",
    },
  },
  {
    slug: "performance-diagnostics",
    legacyId: "diagnostics",
    index: "02",
    title: "Performance Diagnostics",
    displayTitle: "Performance *diagnostics*",
    shortTitle: "Diagnostics",
    summary: "Modern performance vehicles require accurate diagnostic tools to identify faults.",
    detail:
      "Modern performance cars are computers on wheels. We use proper diagnostic tools to find the real fault fast — so you only fix what needs fixing.",
    inclusions: ["Full scan and fault-code reading", "Electrical and sensor checks", "Findings and recommendations"],
    component: "Electronics & sensors",
    image: { primary: "bmw-m4", secondary: "m5-lift" },
    seo: {
      title: "Performance Car Diagnostics in Pune",
      description:
        "Full scan and fault-code reading, electrical and sensor checks, with clear findings and recommendations — performance diagnostics at 9WERKS, Aundh, Pune.",
    },
  },
  {
    slug: "brakes",
    legacyId: "brakes",
    index: "03",
    title: "Brakes",
    displayTitle: "Brakes",
    shortTitle: "Brakes",
    summary: "Professional brake inspection, servicing and component replacement.",
    detail: "Confident stopping power. We inspect, service and replace brake components to keep every drive safe.",
    inclusions: ["Brake pad and disc inspection", "Pad and disc replacement", "Brake fluid service"],
    component: "Brakes",
    image: { primary: "brakes", secondary: "m5-lift" },
    seo: {
      title: "Brake Service & Replacement for Performance Cars in Pune",
      description:
        "Brake pad and disc inspection, pad and disc replacement and brake fluid service for exotic and performance cars at 9WERKS, Aundh, Pune.",
    },
  },
  {
    slug: "collision-repair-paint",
    legacyId: "collision",
    index: "04",
    title: "Collision Repair & Paint",
    displayTitle: "Collision repair & *paint*",
    shortTitle: "Collision & paint",
    summary: "Bodywork and paint restoration for scratches, scuffs and collision damage.",
    detail: "From scuffs and scratches to collision damage — bodywork and paint that brings back the factory finish.",
    inclusions: ["Dent and panel repair", "Colour-matched paintwork", "Scratch and scuff repair"],
    component: "Bodywork & paint",
    image: { primary: "ferrari", secondary: "porsche" },
    seo: {
      title: "Collision Repair & Car Paint in Pune",
      description:
        "Dent and panel repair, colour-matched paintwork and scratch and scuff repair for luxury and performance cars at 9WERKS, Aundh, Pune.",
    },
  },
  {
    slug: "wraps-detailing",
    legacyId: "wraps",
    index: "05",
    title: "Wraps & Detailing",
    displayTitle: "Wraps & *detailing*",
    shortTitle: "Wraps & detailing",
    summary: "Vehicle appearance enhancement, protection and detailing.",
    detail:
      "Change the look or protect the paint with a wrap — and bring back the showroom shine, inside and out.",
    inclusions: ["Vinyl wraps", "Wash and interior detailing", "Finishing work"],
    component: "Finish & interior",
    image: { primary: "wash", secondary: "facade" },
    note: {
      text: "See our detailing work on Instagram",
      linkLabel: "@9werksdetailzstudio",
      href: "https://www.instagram.com/9werksdetailzstudio/",
    },
    seo: {
      title: "Car Wraps & Detailing in Pune",
      description:
        "Vinyl wraps, wash and interior detailing and finishing work for exotic and luxury cars at 9WERKS, Aundh, Pune. See our work at @9werksdetailzstudio.",
    },
  },
  {
    slug: "alloy-wheels-tyres",
    legacyId: "wheels",
    index: "06",
    title: "Alloy Wheels & Tyres",
    displayTitle: "Alloy wheels & *tyres*",
    shortTitle: "Wheels & tyres",
    summary: "Alloy wheel services and tyre replacement.",
    detail: "Alloy wheel work and tyre replacement, so your car looks right and grips right.",
    inclusions: ["Alloy wheel work", "Tyre fitting and replacement", "Pressure and wear checks"],
    component: "Wheels & tyres",
    image: { primary: "underbody", secondary: "porsche" },
    seo: {
      title: "Alloy Wheel & Tyre Services in Pune",
      description:
        "Alloy wheel work, tyre fitting and replacement, and pressure and wear checks for performance and luxury cars at 9WERKS, Aundh, Pune.",
    },
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/** Resolve either a slug or a legacy id (e.g. from `?service=diagnostics`). */
export function resolveService(idOrSlug: string | null | undefined): Service | undefined {
  if (!idOrSlug) return undefined;
  const key = idOrSlug.trim().toLowerCase();
  return services.find((s) => s.slug === key || s.legacyId === key);
}

/** The four specialisations published on the official site. */
export const specialisations = [
  { index: "01", title: "Exotic & supercar servicing", photo: "m5-lift" as PhotoId },
  { index: "02", title: "Performance diagnostics", photo: "bmw-m4" as PhotoId },
  { index: "03", title: "Mechanical repairs", photo: "crew" as PhotoId },
  { index: "04", title: "Luxury vehicle maintenance", photo: "porsche" as PhotoId },
] as const;
