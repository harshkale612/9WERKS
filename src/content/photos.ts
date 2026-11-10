/**
 * 9WERKS — photography registry.
 *
 * `authentic`  — shows 9WERKS signage, branded plates/shirts, or the workshop
 *                itself; confirmed as the business's own photography.
 * `unverified` — published on the official site, but taken in a visibly
 *                different location. Used only as illustrative service imagery,
 *                never captioned as 9WERKS work. Replace when originals arrive
 *                (see ASSET_INVENTORY.md → replacement checklist).
 *
 * Pixel data (sizes, widths, blur placeholders) is generated into
 * ./generated/photo-manifest.json by scripts/images/build-images.mjs.
 */
import manifest from "./generated/photo-manifest.json";

export type PhotoId =
  | "facade"
  | "porsche"
  | "bmw-m4"
  | "crew"
  | "m5-lift"
  | "z4-bay"
  | "wash"
  | "ferrari"
  | "brakes"
  | "underbody";

export type Provenance = "authentic" | "unverified";

export interface PhotoMeta {
  id: PhotoId;
  alt: string;
  caption?: string;
  provenance: Provenance;
  /** Preferred focal point for object-position, e.g. "50% 40%". */
  focus?: string;
  width: number;
  height: number;
  widths: number[];
  blur: string;
  dominant: string;
}

const editorial: Record<PhotoId, Omit<PhotoMeta, "id" | "width" | "height" | "widths" | "blur" | "dominant">> = {
  facade: {
    alt: "The 9WERKS workshop in Sanewadi, Aundh, with a red Mitsubishi Lancer Evolution parked outside",
    caption: "The workshop — Sanewadi, Aundh",
    provenance: "authentic",
    focus: "50% 55%",
  },
  porsche: {
    alt: "White Porsche Cayenne outside the 9WERKS workshop at dusk",
    caption: "Evening handover",
    provenance: "authentic",
    focus: "55% 60%",
  },
  "bmw-m4": {
    alt: "Blue BMW M4 with its bonnet open and a 9 WERKS number plate",
    caption: "Under the bonnet — BMW M4",
    provenance: "authentic",
    focus: "55% 45%",
  },
  crew: {
    alt: "9WERKS technician in a crew T-shirt working in the engine bay of a MINI Cooper S",
    caption: "Crew at work",
    provenance: "authentic",
    focus: "40% 55%",
  },
  "m5-lift": {
    alt: "Black BMW M5 with its bonnet open on a two-post lift inside the 9WERKS workshop",
    caption: "On the lift",
    provenance: "authentic",
    focus: "50% 62%",
  },
  "z4-bay": {
    alt: "Red BMW Z4 with its bonnet open in the 9WERKS workshop",
    caption: "BMW Z4 service",
    provenance: "authentic",
    focus: "50% 50%",
  },
  wash: {
    alt: "Two detailers hand-washing a black Mercedes-Benz G-Class",
    provenance: "unverified",
    focus: "50% 50%",
  },
  ferrari: {
    alt: "Technician beside the rear of a red Ferrari race car",
    provenance: "unverified",
    focus: "35% 50%",
  },
  brakes: {
    alt: "Technician cleaning a drilled brake disc with brake cleaner",
    provenance: "unverified",
    focus: "60% 40%",
  },
  underbody: {
    alt: "Two technicians inspecting the underside of an SUV raised on a lift",
    provenance: "unverified",
    focus: "50% 40%",
  },
};

type ManifestEntry = { width: number; height: number; widths: number[]; blur: string; dominant: string };
const data = manifest as Record<PhotoId, ManifestEntry>;

export function getPhoto(id: PhotoId): PhotoMeta {
  const m = data[id];
  if (!m) throw new Error(`Unknown photo id: ${id}`);
  return { id, ...editorial[id], ...m };
}

export const photoIds = Object.keys(editorial) as PhotoId[];

/** Only photos confirmed as 9WERKS' own — used wherever imagery is presented as "our work". */
export const authenticPhotoIds = photoIds.filter((id) => editorial[id].provenance === "authentic");

export const PHOTO_BASE = "/assets/photos";
