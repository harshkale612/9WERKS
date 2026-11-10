"use client";

/**
 * The signature hero scene: the 9WERKS concept car in the studio, framed with
 * a long lens in a low three-quarter view. All motion is driven by refs the
 * DOM layer writes (scroll progress, pointer, drag) and applied with damping
 * in a single useFrame — no React re-renders per frame.
 *
 *  - idle: a slow camera "breath" (off for reduced motion / still mode)
 *  - pointer parallax on fine pointers
 *  - drag-to-rotate (fine pointers), clamped ±0.6 rad, eases home after idle
 *  - scroll: as the hero leaves, the camera pulls back and orbits
 *  - finish changes tween the paint (colour, metalness, roughness)
 */
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { useCarModel } from "./useCarModel";
import { FINISHES, type FinishId } from "./finishes";

export interface HeroRig {
  /** Hero scroll-out progress, 0–1. */
  scroll: RefObject<number>;
  /** Pointer position normalised to -1..1. */
  pointer: RefObject<{ x: number; y: number }>;
  /** Target car yaw from dragging (radians). */
  drag: RefObject<number>;
}

interface Framing {
  fov: number;
  radius: number;
  /** Camera azimuth around the car, from the nose (+Z) towards +X. */
  azimuth: number;
  /** Polar angle from +Y (π/2 = horizon). */
  polar: number;
  /** Look-at offset along the camera's right vector (negative = car sits right of centre). */
  shift: number;
  /** Look-at offset along world up (negative = car sits higher in frame). */
  lift: number;
}

export function framingFor(aspect: number): Framing {
  if (aspect >= 1.25) return { fov: 25, radius: 12.1, azimuth: 0.74, polar: 1.43, shift: -2.1, lift: -0.5 };
  if (aspect >= 0.8) return { fov: 29, radius: 10.6, azimuth: 0.68, polar: 1.41, shift: -0.3, lift: -0.45 };
  return { fov: 32, radius: 13.4, azimuth: 0.62, polar: 1.4, shift: 0, lift: -1.95 };
}

const CAR_CENTRE = new THREE.Vector3(0, 0.52, 0);
const UP = new THREE.Vector3(0, 1, 0);

interface HeroSceneProps {
  finish: FinishId;
  rig: HeroRig;
  /** Deterministic frame for stills: no idle, pointer or scroll motion. */
  still?: boolean;
  reducedMotion?: boolean;
}

export function HeroScene({ finish, rig, still = false, reducedMotion = false }: HeroSceneProps) {
  const car = useCarModel(finish);
  const { camera, size, invalidate } = useThree();
  const persp = camera as THREE.PerspectiveCamera;
  const framing = useMemo(() => framingFor(size.width / Math.max(1, size.height)), [size.width, size.height]);

  // Live (damped) camera state.
  const live = useRef({ azimuth: framing.azimuth, polar: framing.polar, radius: framing.radius, yaw: 0 });
  const tmp = useMemo(() => ({ pos: new THREE.Vector3(), target: new THREE.Vector3(), fwd: new THREE.Vector3(), right: new THREE.Vector3() }), []);

  useEffect(() => {
    persp.fov = framing.fov;
    persp.updateProjectionMatrix();
    invalidate();
  }, [framing, persp, invalidate]);

  // Tween the paint to the selected finish.
  const firstFinish = useRef(true);
  useEffect(() => {
    const f = FINISHES[finish];
    const mat = car.materials.paint;
    const target = new THREE.Color(f.color);
    if (firstFinish.current || reducedMotion || still) {
      firstFinish.current = false;
      mat.color.copy(target);
      mat.metalness = f.metalness;
      mat.roughness = f.roughness;
      mat.clearcoatRoughness = f.clearcoatRoughness;
      invalidate();
      return;
    }
    const tl = gsap.timeline({ onUpdate: () => invalidate() });
    tl.to(mat.color, { r: target.r, g: target.g, b: target.b, duration: 0.9, ease: "power2.inOut" }, 0);
    tl.to(mat, { metalness: f.metalness, roughness: f.roughness, clearcoatRoughness: f.clearcoatRoughness, duration: 0.9, ease: "power2.inOut" }, 0);
    return () => {
      tl.kill();
    };
  }, [finish, car, reducedMotion, still, invalidate]);

  // Release per-instance materials when the scene unmounts.
  useEffect(() => {
    const mats = Object.values(car.materials);
    return () => mats.forEach((m) => m.dispose());
  }, [car]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 20);
    const animate = !still && !reducedMotion;
    const t = state.clock.elapsedTime;
    const scroll = animate ? (rig.scroll.current ?? 0) : 0;
    const p = animate ? (rig.pointer.current ?? { x: 0, y: 0 }) : { x: 0, y: 0 };

    const goalAzimuth = framing.azimuth + (animate ? Math.sin(t * 0.21) * 0.035 : 0) + p.x * 0.07 + scroll * 0.5;
    const goalPolar = framing.polar + p.y * 0.035 - scroll * 0.09;
    const goalRadius = framing.radius + scroll * 2.4;
    const goalYaw = still ? 0 : (rig.drag.current ?? 0);

    const L = live.current;
    L.azimuth = THREE.MathUtils.damp(L.azimuth, goalAzimuth, 3, dt);
    L.polar = THREE.MathUtils.damp(L.polar, goalPolar, 3, dt);
    L.radius = THREE.MathUtils.damp(L.radius, goalRadius, 3, dt);
    L.yaw = THREE.MathUtils.damp(L.yaw, goalYaw, 4, dt);
    if (still) Object.assign(L, { azimuth: goalAzimuth, polar: goalPolar, radius: goalRadius, yaw: 0 });

    const sinP = Math.sin(L.polar);
    tmp.pos.set(sinP * Math.sin(L.azimuth), Math.cos(L.polar), sinP * Math.cos(L.azimuth)).multiplyScalar(L.radius).add(CAR_CENTRE);
    camera.position.copy(tmp.pos);

    // Compose: shift the look-at point so the car sits where the layout needs it.
    tmp.fwd.copy(CAR_CENTRE).sub(tmp.pos).normalize();
    tmp.right.crossVectors(tmp.fwd, UP).normalize();
    tmp.target.copy(CAR_CENTRE).addScaledVector(tmp.right, framing.shift).addScaledVector(UP, framing.lift);
    camera.lookAt(tmp.target);

    car.root.rotation.y = L.yaw;

    // In on-demand mode keep rendering only while still settling.
    if (reducedMotion && Math.abs(L.yaw - goalYaw) > 0.0005) invalidate();
  });

  return <primitive object={car.root} />;
}
