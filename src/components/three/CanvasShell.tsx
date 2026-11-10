"use client";

/**
 * Canvas wrapper shared by every 3D scene.
 *  - renders only while on screen and the tab is visible (frameloop "never" otherwise),
 *  - DPR and antialiasing follow the quality tier,
 *  - ACES filmic tone mapping, sRGB output,
 *  - an error boundary + context-loss listener that swap to the photographic
 *    fallback instead of leaving a blank box,
 *  - `onReady` fires after the first frame with the model on screen.
 * The canvas is decorative: equivalent content always exists in HTML.
 */
import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { QualityTier } from "@/lib/device";
import { cn } from "@/lib/cn";

class SceneErrorBoundary extends Component<{ fallback: ReactNode; onError?: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[9WERKS 3D] scene failed, showing fallback:", error);
    this.props.onError?.();
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Calls onReady once the scene has rendered a frame after Suspense resolved. */
function ReadySignal({ onReady }: { onReady?: () => void }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    let raf = requestAnimationFrame(() => {
      gl.render(scene, camera);
      raf = requestAnimationFrame(() => onReady?.());
    });
    return () => cancelAnimationFrame(raf);
  }, [gl, scene, camera, onReady]);
  return null;
}

/** Releases GPU memory when the canvas unmounts and reports context loss. */
function Lifecycle({ onLost }: { onLost: () => void }) {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (e: Event) => {
      e.preventDefault();
      onLost();
    };
    canvas.addEventListener("webglcontextlost", lost);
    return () => {
      canvas.removeEventListener("webglcontextlost", lost);
      gl.renderLists.dispose();
    };
  }, [gl, onLost]);
  return null;
}

export interface CanvasShellProps {
  tier: QualityTier;
  children: ReactNode;
  /** Shown if WebGL fails at runtime. */
  fallback: ReactNode;
  camera?: { position: [number, number, number]; fov?: number; near?: number; far?: number };
  /** Initial camera look-at target (scenes with their own rigs may override every frame). */
  target?: [number, number, number];
  className?: string;
  onReady?: () => void;
  /** Force rendering off. */
  paused?: boolean;
  /** Render only when invalidate() is called (static scenes, reduced motion). */
  demand?: boolean;
  /** Extra visibility margin before rendering starts. */
  rootMargin?: string;
  exposure?: number;
}

export function CanvasShell({
  tier,
  children,
  fallback,
  camera = { position: [5.2, 1.35, 6.2], fov: 30 },
  target = [0, 0.55, 0],
  className,
  onReady,
  paused = false,
  demand = false,
  rootMargin = "120px",
  exposure = 1.05,
}: CanvasShellProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), { rootMargin });
    io.observe(el);
    const onVis = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [rootMargin]);

  if (failed) return <>{fallback}</>;

  const active = visible && pageVisible && !paused;

  return (
    <div ref={hostRef} className={cn("absolute inset-0", className)} aria-hidden="true">
      <SceneErrorBoundary fallback={fallback} onError={() => setFailed(true)}>
        <Canvas
          dpr={tier === "high" ? [1, 2] : [1, 1.5]}
          frameloop={active ? (demand ? "demand" : "always") : "never"}
          camera={{ position: camera.position, fov: camera.fov ?? 30, near: camera.near ?? 0.1, far: camera.far ?? 80 }}
          gl={{ antialias: true, alpha: false, stencil: false, powerPreference: "high-performance" }}
          onCreated={({ gl, camera: cam }) => {
            cam.lookAt(target[0], target[1], target[2]);
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = exposure;
            gl.outputColorSpace = THREE.SRGBColorSpace;
          }}
          style={{ touchAction: "pan-y" }}
        >
          <Lifecycle onLost={() => setFailed(true)} />
          <Suspense fallback={null}>
            {children}
            <ReadySignal onReady={onReady} />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
