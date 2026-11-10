"use client";

/**
 * The 9WERKS studio: near-black cyclorama, an environment built from light
 * formers (art-directable, zero-download equivalent of a studio HDRI), a soft
 * reflective floor on capable devices and contact shadows everywhere.
 *
 *   tier "high"   → MeshReflectorMaterial floor (blurred reflections)
 *   tier "medium" → matte floor + baked contact shadow (phones, low GPUs)
 */
import { ContactShadows, Environment, Lightformer, MeshReflectorMaterial } from "@react-three/drei";
import type { QualityTier } from "@/lib/device";

export const STUDIO_BLACK = "#090807";

interface StudioProps {
  tier: QualityTier;
  /** Overall environment intensity multiplier. */
  intensity?: number;
  /** Fog [near, far] in metres from the camera — set past the car so it never greys out. */
  fog?: [number, number];
}

export function Studio({ tier, intensity = 1, fog = [10, 24] }: StudioProps) {
  return (
    <>
      <color attach="background" args={[STUDIO_BLACK]} />
      <fog attach="fog" args={[STUDIO_BLACK, fog[0], fog[1]]} />

      {/* Environment (reflections + image-based light), rendered once into a cube map. */}
      <Environment resolution={256} frames={1} environmentIntensity={intensity}>
        {/* Long overhead softbox strip — the defining highlight along the body. */}
        <Lightformer form="rect" intensity={2.6} color="#fff7ec" position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[12, 1.4, 1]} />
        <Lightformer form="rect" intensity={1.1} color="#fff7ec" position={[0, 6, -3.5]} rotation-x={Math.PI / 2} scale={[12, 0.5, 1]} />
        {/* Warm champagne side strips. */}
        <Lightformer form="rect" intensity={1.6} color="#e8d8bc" position={[-7, 1.6, 1]} rotation-y={Math.PI / 2} scale={[10, 0.7, 1]} />
        <Lightformer form="rect" intensity={1.3} color="#e8d8bc" position={[7, 1.6, -1]} rotation-y={-Math.PI / 2} scale={[10, 0.7, 1]} />
        {/* Cool rim from behind to separate the silhouette from the black. */}
        <Lightformer form="ring" intensity={1.4} color="#cfd8e6" position={[0, 2.4, -9]} scale={5} />
        {/* Gentle front fill so the nose never drops to pure black. */}
        <Lightformer form="rect" intensity={0.5} color="#ffffff" position={[0, 1.2, 10]} scale={[12, 3, 1]} />
      </Environment>

      {/* A single soft key from above-front for form definition. */}
      <spotLight position={[3, 7, 5]} angle={0.5} penumbra={1} intensity={170 * intensity} color="#fff3e2" decay={2} />
      <spotLight position={[-5, 4, -6]} angle={0.6} penumbra={1} intensity={90 * intensity} color="#d6dcea" decay={2} />
      <ambientLight intensity={0.04} />

      {tier === "high" ? (
        <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
          <planeGeometry args={[60, 60]} />
          <MeshReflectorMaterial
            blur={[420, 120]}
            resolution={1024}
            mixBlur={1}
            mixStrength={4.2}
            roughness={0.92}
            depthScale={1.15}
            minDepthThreshold={0.35}
            maxDepthThreshold={1.35}
            color="#0e0d0c"
            metalness={0.6}
            mirror={0.75}
          />
        </mesh>
      ) : (
        <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
          <planeGeometry args={[60, 60]} />
          <meshStandardMaterial color="#0b0a09" roughness={0.88} metalness={0.2} />
        </mesh>
      )}

      <ContactShadows position={[0, 0.002, 0]} opacity={0.85} scale={11} blur={2.6} far={2.2} resolution={512} frames={1} color="#000000" />
    </>
  );
}
