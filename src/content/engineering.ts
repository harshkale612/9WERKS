/**
 * 9WERKS — "The anatomy of care" (home 07, Automotive engineering).
 *
 * Six parts of the car, each mapped 1:1 to one of the six real services in
 * ./services.ts (titles, summaries and inclusions always come from there).
 * Component descriptions are generic, factual notes about the PART — what it
 * is and why it matters — never claims about what 9WERKS can do beyond the
 * published service inclusions.
 *
 * Camera views, anchors and highlight groups drive the 3D explorer
 * (src/components/three/EngineeringScene.tsx). Coordinates are metres in the
 * prepared model's space: nose towards +Z, the car's left side towards +X,
 * wheels on y = 0, centred on x/z. Plain data — no three.js import.
 */
import { getPhoto, type PhotoId } from "./photos";
import { getService, type Service, type ServiceSlug } from "./services";

export type EngineeringComponentId = "engine" | "electronics" | "brakes" | "bodywork" | "finish" | "wheels";

export type Vec3 = readonly [number, number, number];

/** Named groups of meshes the 3D scene can emphasise (resolved in three/EngineeringRig.ts). */
export type CarPartGroup =
  | "hood"
  | "paint"
  | "glass"
  | "headlights"
  | "taillights"
  | "dash"
  | "interior"
  | "calipers"
  | "discs"
  | "rims"
  | "tyres";

/** Extra, component-specific animation layered on top of the highlight. */
export type EngineeringEffect = "lift" | "scan" | "sweep" | "door" | "spin";

export interface CameraView {
  position: Vec3;
  target: Vec3;
  /** Vertical field of view in degrees (long lens, 24–34). */
  fov: number;
}

export interface EngineeringComponent {
  id: EngineeringComponentId;
  /** "01"–"06" — mirrors the service index. */
  index: string;
  /** Component name shown in the control list (the service's `component` tag). */
  name: string;
  service: Service;
  /** One or two factual sentences about the part itself. */
  description: string;
  /** Camera framing for wide canvases (aspect ≈ 1.2). */
  view: CameraView;
  /** Overrides for portrait canvases (phones). Unset keys fall back to `view`. */
  viewNarrow?: Partial<CameraView>;
  /** Point on the part the callout leader line points at. */
  anchor: Vec3;
  /** Meshes lit and given the bronze highlight; everything else is dimmed. */
  highlight: readonly CarPartGroup[];
  /** Meshes turned to an x-ray ghost so the highlighted part shows through. */
  ghost?: readonly CarPartGroup[];
  effect?: EngineeringEffect;
  /** Pre-rendered still of this view (public/assets/renders), used as poster and no-WebGL fallback. */
  still: string;
  /** Last-resort fallback if the still is missing: an authentic 9WERKS photograph. */
  photo: PhotoId;
}

function service(slug: ServiceSlug): Service {
  const s = getService(slug);
  if (!s) throw new Error(`engineering: unknown service ${slug}`);
  return s;
}

/** The service's own primary photo when it is authentic 9WERKS photography, otherwise its secondary, otherwise the lift shot. */
function authenticPhoto(s: Service): PhotoId {
  for (const id of [s.image.primary, s.image.secondary]) {
    if (getPhoto(id).provenance === "authentic") return id;
  }
  return "m5-lift";
}

function component(
  id: EngineeringComponentId,
  slug: ServiceSlug,
  data: Omit<EngineeringComponent, "id" | "index" | "name" | "service" | "still" | "photo">
): EngineeringComponent {
  const s = service(slug);
  return { id, index: s.index, name: s.component, service: s, still: `/assets/renders/eng-${id}`, photo: authenticPhoto(s), ...data };
}

export const engineeringComponents: EngineeringComponent[] = [
  component("engine", "servicing-routine-checks", {
    description:
      "Oil lubricates and cools the engine’s moving parts, filters keep contaminants out of it, and coolant holds it at a steady working temperature.",
    view: { position: [3.55, 2.5, 5.05], target: [0.05, 0.55, 1.2], fov: 30 },
    viewNarrow: { position: [3.9, 3.3, 6.6], target: [0, 0.5, 1.05] },
    anchor: [0.35, 0.86, 1.45],
    highlight: ["hood"],
    effect: "lift",
  }),
  component("electronics", "performance-diagnostics", {
    description:
      "Control units and sensors watch the engine, brakes and chassis continuously. When a reading falls outside its expected range, the car stores a fault code.",
    view: { position: [2.35, 1.05, 5.6], target: [0.15, 0.68, 1.15], fov: 30 },
    viewNarrow: { position: [2.9, 1.35, 7.4], target: [0.1, 0.62, 0.9] },
    anchor: [0.62, 0.66, 1.95],
    highlight: ["headlights", "taillights", "dash"],
    ghost: ["glass"],
    effect: "scan",
  }),
  component("brakes", "brakes", {
    description:
      "Calipers press the pads against the discs, turning speed into heat. Pad thickness, disc condition and fresh fluid decide how consistently a car stops.",
    view: { position: [3.45, 1.05, 3.05], target: [0.95, 0.66, 1.2], fov: 30 },
    viewNarrow: { position: [4.0, 1.2, 3.7], target: [0.95, 0.7, 1.15] },
    anchor: [1.02, 0.52, 1.1],
    highlight: ["calipers", "discs"],
    ghost: ["rims"],
  }),
  component("bodywork", "collision-repair-paint", {
    description:
      "Body panels give the car its shape and protect the structure beneath. Layers of primer, colour and clear coat protect the panels in turn.",
    view: { position: [6.4, 1.35, -2.6], target: [0, 0.5, 0.05], fov: 30 },
    viewNarrow: { position: [7.8, 2.2, -4.6], target: [0, 0.5, 0] },
    anchor: [1.1, 0.68, -0.35],
    highlight: ["paint"],
    effect: "sweep",
  }),
  component("finish", "wraps-detailing", {
    description:
      "The surfaces you see and touch every day: paintwork, trim, upholstery and glass. They take the most wear from sun, dust and use, and show it first.",
    view: { position: [3.3, 2.45, 1.8], target: [0.15, 0.62, -0.1], fov: 30 },
    viewNarrow: { position: [4.1, 3.2, 2.4], target: [0.1, 0.6, -0.15] },
    anchor: [0.38, 0.8, -0.15],
    highlight: ["interior", "dash"],
    ghost: ["glass"],
    effect: "door",
  }),
  component("wheels", "alloy-wheels-tyres", {
    description:
      "Tyres are the car’s only contact with the road. Correct pressures and even wear keep grip, braking and steering predictable, and the alloys carry it all.",
    view: { position: [3.55, 0.62, -3.55], target: [0.95, 0.4, -1.5], fov: 28 },
    viewNarrow: { position: [4.1, 0.8, -4.3], target: [0.95, 0.42, -1.45] },
    anchor: [1.13, 0.4, -1.55],
    highlight: ["rims", "tyres"],
    effect: "spin",
  }),
];

/** Wide establishing view the camera starts from before flying to the first component. */
export const establishingView: CameraView = { position: [6.6, 2.1, 7.4], target: [0, 0.5, 0], fov: 30 };

export const engineeringCopy = {
  label: "Engineering",
  title: "The anatomy of *care*",
  lead: "Each of our six services looks after a different part of the car. Explore the structure in 3D — choose a component to see where it sits and what the service covers.",
  listLabel: "Car components",
  hint: "Select a component",
} as const;

export function getEngineeringComponent(id: EngineeringComponentId): EngineeringComponent {
  const c = engineeringComponents.find((x) => x.id === id);
  if (!c) throw new Error(`engineering: unknown component ${id}`);
  return c;
}
