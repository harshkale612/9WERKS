"use client";

/**
 * Decides, on the client, whether a 3D scene should mount.
 *   "pending"  — server render / hydration: show the poster or fallback
 *   "webgl"    — mount the scene with `tier`
 *   "fallback" — no WebGL, software-only WebGL, Data Saver, or a very low-end device
 * Reduced motion does NOT force the fallback; scenes render a still frame and
 * respond only to direct input instead.
 *
 * Implemented with useSyncExternalStore: the server snapshot is "pending", the
 * client snapshot is computed once and cached (no setState-in-effect).
 */
import { useSyncExternalStore } from "react";
import { getQualityTier, hasWebGL, isSoftwareRenderer, prefersReducedMotion, shouldUseLiteMode, type QualityTier } from "@/lib/device";

export interface ThreeSupport {
  mode: "pending" | "webgl" | "fallback";
  tier: QualityTier;
  reducedMotion: boolean;
}

const PENDING: ThreeSupport = { mode: "pending", tier: "medium", reducedMotion: false };
let cached: ThreeSupport | null = null;

function getSnapshot(): ThreeSupport {
  if (!cached) {
    // `?webgl=force` bypasses the software-renderer check (visual QA in headless browsers).
    const force = /[?&]webgl=force\b/.test(window.location.search);
    const ok = hasWebGL() && !shouldUseLiteMode() && (force || !isSoftwareRenderer());
    cached = { mode: ok ? "webgl" : "fallback", tier: getQualityTier(), reducedMotion: prefersReducedMotion() };
  }
  return cached;
}

const subscribe = () => () => {};

export function useThreeSupport(): ThreeSupport {
  return useSyncExternalStore(subscribe, getSnapshot, () => PENDING);
}
