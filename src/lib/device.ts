/**
 * Client-side capability checks used to decide whether to mount WebGL scenes.
 * All functions are safe to call only in the browser.
 */

export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    // Release the probe context immediately.
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/**
 * True when WebGL is implemented in software (SwiftShader, llvmpipe, …), e.g.
 * machines without a GPU or with hardware acceleration disabled. Real-time 3D
 * would be slow and drain the CPU there, so those visitors get the stills.
 */
export function isSoftwareRenderer(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
  } catch {
    return false;
  }
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isTouchDevice(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

interface NavigatorExtras {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
}

/**
 * Heuristic for devices that should get the photographic fallback instead of
 * the real-time 3D scene: Data Saver, very slow connections, or very low-end
 * hardware.
 */
export function shouldUseLiteMode(): boolean {
  if (typeof navigator === "undefined") return true;
  const nav = navigator as Navigator & NavigatorExtras;
  if (nav.connection?.saveData) return true;
  if (nav.connection?.effectiveType && /(^|-)2g$/.test(nav.connection.effectiveType)) return true;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  return cores <= 2 || memory <= 2;
}

/** Quality tier for 3D rendering. */
export type QualityTier = "high" | "medium";

export function getQualityTier(): QualityTier {
  if (typeof window === "undefined") return "medium";
  const nav = navigator as Navigator & NavigatorExtras;
  const small = window.matchMedia("(max-width: 767px)").matches;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  return !small && cores >= 6 && memory >= 4 ? "high" : "medium";
}
