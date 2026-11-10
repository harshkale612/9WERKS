"use client";
import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import type { HeroRig } from "@/components/three/HeroScene";
import type { FinishId } from "@/components/three/finishes";

const HeroCanvas = dynamic(() => import("@/components/three/HeroCanvas"), { ssr: false });

/** Full-screen deterministic still of the hero scene; sets data-ready when the first frame is drawn. */
export default function RenderClient() {
  const scroll = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const drag = useRef(0);
  const rig = useMemo<HeroRig>(() => ({ scroll, pointer, drag }), []);
  const [ready, setReady] = useState(false);
  const finish = ((typeof window !== "undefined" && new URLSearchParams(window.location.search).get("finish")) || "champagne") as FinishId;
  return (
    <div className="fixed inset-0 z-[200] bg-ink-950" data-ready={ready ? "1" : "0"}>
      <HeroCanvas finish={finish} rig={rig} tier="high" reducedMotion={false} still onReady={() => setReady(true)} fallback={null} />
    </div>
  );
}
