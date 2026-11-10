"use client";

/** Canvas for the engineering explorer — animated structural anatomy (default export for next/dynamic). */
import { CanvasShell } from "./CanvasShell";
import { EngineeringScene } from "./EngineeringScene";
import { Studio } from "./Studio";
import type { EngineeringComponent } from "@/content/engineering";
import type { QualityTier } from "@/lib/device";

interface EngineeringCanvasProps {
  component: EngineeringComponent;
  tier: QualityTier;
  narrow: boolean;
  reducedMotion: boolean;
  started: boolean;
  exploded: boolean;
  onReady?: () => void;
  fallback: React.ReactNode;
}

export default function EngineeringCanvas({ component, tier, narrow, reducedMotion, started, exploded, onReady, fallback }: EngineeringCanvasProps) {
  return (
    <CanvasShell tier={tier} fallback={fallback} onReady={onReady} demand={reducedMotion} camera={{ position: [6.6, 2.1, 7.4], fov: 30 }} exposure={1.15}>
      <Studio tier="medium" intensity={1.3} fog={[12, 30]} />
      <EngineeringScene component={component} narrow={narrow} reducedMotion={reducedMotion} started={started} exploded={exploded} />
    </CanvasShell>
  );
}
