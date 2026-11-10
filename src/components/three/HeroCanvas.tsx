"use client";

/**
 * Canvas for the home hero (default export so it can be loaded with
 * next/dynamic, keeping three.js out of the initial bundle).
 */
import { CanvasShell } from "./CanvasShell";
import { HeroScene, framingFor, type HeroRig } from "./HeroScene";
import { Studio } from "./Studio";
import type { FinishId } from "./finishes";
import type { QualityTier } from "@/lib/device";

interface HeroCanvasProps {
  finish: FinishId;
  rig: HeroRig;
  tier: QualityTier;
  reducedMotion: boolean;
  still?: boolean;
  onReady?: () => void;
  fallback: React.ReactNode;
}

export default function HeroCanvas({ finish, rig, tier, reducedMotion, still = false, onReady, fallback }: HeroCanvasProps) {
  // Fog range follows the camera distance for the current viewport shape.
  const aspect = typeof window !== "undefined" ? window.innerWidth / Math.max(1, window.innerHeight) : 1.6;
  const f = framingFor(aspect);
  return (
    <CanvasShell
      tier={tier}
      fallback={fallback}
      onReady={onReady}
      demand={reducedMotion || still}
      camera={{ position: [6, 1.6, 8], fov: f.fov, far: 120 }}
      rootMargin="0px"
      exposure={1.18}
    >
      <Studio tier={tier} intensity={1.35} fog={[f.radius + 4, f.radius + 24]} />
      <HeroScene finish={finish} rig={rig} still={still} reducedMotion={reducedMotion} />
    </CanvasShell>
  );
}
