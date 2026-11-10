/**
 * Paint finishes for the 3D car. Plain data (no three.js import) so UI such as
 * swatches can use it without pulling the 3D bundle. The three finishes are
 * drawn from the brand palette and mirror the vinyl-wrap service.
 */
export type FinishId = "obsidian" | "champagne" | "ivory";

export interface Finish {
  id: FinishId;
  label: string;
  /** Swatch / paint base colour (sRGB hex). */
  color: string;
  metalness: number;
  roughness: number;
  clearcoat: number;
  clearcoatRoughness: number;
}

export const FINISHES: Record<FinishId, Finish> = {
  obsidian: { id: "obsidian", label: "Obsidian", color: "#16130f", metalness: 0.78, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.035 },
  champagne: { id: "champagne", label: "Champagne", color: "#b68c66", metalness: 0.88, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.04 },
  ivory: { id: "ivory", label: "Ivory", color: "#e9e3d6", metalness: 0.12, roughness: 0.24, clearcoat: 1, clearcoatRoughness: 0.03 },
};

export const FINISH_ORDER: FinishId[] = ["obsidian", "champagne", "ivory"];

export const MODEL_URL = "/models/9werks-concept.glb";
export const DRACO_PATH = "/draco/";
