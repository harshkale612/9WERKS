"use client";

/**
 * "The anatomy of care" — an animated structural view of the supercar.
 *
 *  - X-ray structure: the body shell is smoked and translucent, traced by bronze
 *    structure lines (EdgesGeometry of every shell panel), so the cabin, seats,
 *    wheels, brakes and axles read through it.
 *  - Assembly: on first view the car starts exploded (bonnet, rear deck, doors,
 *    roof and wheels apart) and flies together while the lines draw in.
 *  - Per component: parts move (wheel lifts off the brake, doors and roof open,
 *    bonnet and rear deck lift, wheels push out and spin), the camera flies to
 *    the component (GSAP) and its parts pulse in bronze; electronics get a
 *    scanning light sheet; bodywork turns the shell solid with panel gaps open.
 *  - `exploded`: the whole car in exploded view.
 *
 * All motion is damped in one useFrame (no React re-renders per frame).
 * Model frame (car root's child): Z up, −Y towards the nose, ±X sideways.
 */
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { gsap } from "gsap";
import { useCarModel, type CarParts } from "./useCarModel";
import type { CameraView, CarPartGroup, EngineeringComponent } from "@/content/engineering";
import { establishingView } from "@/content/engineering";

const BRONZE = new THREE.Color("#b68c66");
const XRAY_OPACITY = 0.14;
const GLASS_XRAY = 0.05;

type Mat = THREE.MeshStandardMaterial;

interface Movable {
  key: string;
  obj: THREE.Object3D;
  home: THREE.Vector3;
  /** Exploded offset expressed in the part's parent frame. */
  offset: THREE.Vector3;
  target: THREE.Vector3;
}

/** A world-space direction (car frame: +Y up, +Z nose, +X left) expressed in `obj`'s parent frame. */
function toParentFrame(obj: THREE.Object3D, world: THREE.Vector3): THREE.Vector3 {
  const parent = obj.parent;
  if (!parent) return world.clone();
  const q = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  parent.getWorldQuaternion(q);
  parent.getWorldScale(scale);
  return world.clone().applyQuaternion(q.invert()).divide(scale);
}

/** World-space side (+1 left / −1 right) of an object relative to the car's centre line. */
function sideOf(obj: THREE.Object3D): number {
  const p = new THREE.Vector3();
  obj.getWorldPosition(p);
  return p.x >= 0 ? 1 : -1;
}

/** Movable assemblies with their exploded-view offsets (authored in world space). */
function collectMovable(car: CarParts): Movable[] {
  car.root.updateMatrixWorld(true);
  const out: Movable[] = [];
  const add = (key: string, obj: THREE.Object3D | undefined, world: [number, number, number]) => {
    if (!obj) return;
    out.push({ key, obj, home: obj.position.clone(), offset: toParentFrame(obj, new THREE.Vector3(...world)), target: obj.position.clone() });
  };
  add("hood", car.hood, [0, 0.62, 0.62]);
  add("rear", car.rearHatch, [0, 0.62, -0.7]);
  add("doorL", car.doorLeft, [0.85, 0.14, 0]);
  add("doorR", car.doorRight, [-0.85, 0.14, 0]);
  add("roof", car.byName.get("BodyRoofPanel"), [0, 0.74, 0]);
  for (const w of car.wheels) {
    const side = sideOf(w);
    add(`wheel:${w.name}`, w, [side * 0.42, 0, 0]);
    // Rim + tyre ("shell") lift off the brake assembly (disc + caliper stay put).
    for (const c of w.children) {
      if (!/Brake/.test(c.name)) add(`shell:${w.name}:${c.uuid}`, c, [side * 0.42, 0.78, 0]);
    }
  }
  return out;
}

/** Axle axis (world X) in each spinning part's own frame, so rotation is always about the axle. */
function spinAxes(car: CarParts): Map<THREE.Object3D, THREE.Vector3> {
  car.root.updateMatrixWorld(true);
  const axes = new Map<THREE.Object3D, THREE.Vector3>();
  for (const w of car.wheels) {
    for (const c of w.children) {
      if (/BrakePad/.test(c.name)) continue;
      const q = new THREE.Quaternion();
      c.getWorldQuaternion(q);
      axes.set(c, new THREE.Vector3(1, 0, 0).applyQuaternion(q.invert()).normalize());
    }
  }
  return axes;
}

/** How far (0–1+) each assembly is exploded for the current state. */
function explodeFactor(key: string, componentId: string, exploded: boolean): number {
  if (exploded) return key.startsWith("shell:") ? 0 : 1;
  switch (componentId) {
    case "engine":
      return key === "hood" || key === "rear" ? 1 : 0;
    case "finish":
      return key === "doorL" || key === "doorR" || key === "roof" ? 1 : 0;
    case "bodywork":
      return ["hood", "rear", "doorL", "doorR", "roof"].includes(key) ? 0.38 : 0;
    case "brakes":
      return key.startsWith("shell:WheelFrontL:") ? 1 : 0;
    case "wheels":
      return key.startsWith("wheel:") ? 0.75 : 0;
    default:
      return 0;
  }
}

/** Highlight groups → materials (the bonnet gets its own paint so it can glow alone). */
function buildGroups(car: CarParts) {
  const mats = (meshes: THREE.Mesh[]) => {
    const s = new Set<Mat>();
    meshes.forEach((m) => (Array.isArray(m.material) ? m.material : [m.material]).forEach((x) => s.add(x as Mat)));
    return Array.from(s);
  };
  const under = (obj?: THREE.Object3D) => {
    const out: THREE.Mesh[] = [];
    obj?.traverse((o) => (o as THREE.Mesh).isMesh && out.push(o as THREE.Mesh));
    return out;
  };
  const hoodPaint = car.materials.paint.clone();
  under(car.hood)
    .filter((m) => m.material === car.materials.paint)
    .forEach((m) => (m.material = hoodPaint));

  const interior: THREE.Mesh[] = [];
  let dash: THREE.Mesh | undefined;
  let engine: THREE.Mesh | undefined;
  car.root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    if (/^Interior/.test(mesh.name) && !/Steering(Dash|Emblem)/.test(mesh.name)) interior.push(mesh);
    if (mesh.name === "InteriorSteeringDash") dash = mesh;
    if (mesh.name === "Engine") engine = mesh;
  });
  // The engine block gets its own material so it can glow in the engine view.
  let engineMat: Mat | undefined;
  if (engine) {
    engineMat = (engine.material as Mat).clone();
    engine.material = engineMat;
  }

  const groups: Record<CarPartGroup, Mat[]> = {
    hood: [hoodPaint, ...(engineMat ? [engineMat] : [])],
    paint: [car.materials.paint, hoodPaint],
    glass: [car.materials.glass],
    headlights: [car.materials.headlight],
    taillights: [car.materials.taillight],
    dash: dash ? mats([dash]) : [],
    interior: mats(interior).filter((m) => !m.emissiveMap),
    calipers: [car.materials.caliper],
    discs: mats(car.discs),
    rims: [car.materials.rim],
    tyres: mats(car.tyres),
  };
  return { groups, hoodPaint, engineMat };
}

/** Bronze structure lines on every body-shell panel; returns them for animation/disposal. */
function addStructureLines(car: CarParts, shellMats: Set<THREE.Material>, material: THREE.LineBasicMaterial) {
  const meshes: THREE.Mesh[] = [];
  car.root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    if (list.some((m) => shellMats.has(m))) meshes.push(mesh);
  });
  return meshes.map((mesh) => {
    const lines = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 26), material);
    lines.name = "structure-lines";
    lines.renderOrder = 3;
    mesh.add(lines);
    return lines;
  });
}

interface EngineeringSceneProps {
  component: EngineeringComponent;
  narrow: boolean;
  reducedMotion: boolean;
  /** The section is in view: play the assembly and fly to the first component. */
  started: boolean;
  /** Whole-car exploded view (toggle in the UI). */
  exploded: boolean;
}

export function EngineeringScene({ component, narrow, reducedMotion, started, exploded }: EngineeringSceneProps) {
  const car = useCarModel("obsidian");
  const { camera, invalidate } = useThree();
  const persp = camera as THREE.PerspectiveCamera;

  const { groups, hoodPaint, engineMat } = useMemo(() => buildGroups(car), [car]);
  const movable = useMemo(() => collectMovable(car), [car]);
  const axes = useMemo(() => spinAxes(car), [car]);
  const lineMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: BRONZE, transparent: true, opacity: 0, depthWrite: false }),
    []
  );
  const shellMats = useMemo(() => [car.materials.paint, car.materials.paintSecondary, hoodPaint], [car, hoodPaint]);
  const frontLeft = useMemo(() => car.wheels.find((w) => w.name === "WheelFrontL"), [car]);

  // Structure lines are generated once, after the first frame (keeps the mount smooth).
  const lines = useRef<THREE.LineSegments[]>([]);
  useEffect(() => {
    const id = window.setTimeout(() => {
      lines.current = addStructureLines(car, new Set<THREE.Material>([...shellMats, car.materials.glass]), lineMat);
      invalidate();
    }, 60);
    return () => {
      window.clearTimeout(id);
      lines.current.forEach((l) => {
        l.removeFromParent();
        l.geometry.dispose();
      });
      lines.current = [];
    };
  }, [car, shellMats, lineMat, invalidate]);

  // X-ray shell: translucent, no depth write (re-enabled when the shell turns solid).
  useEffect(() => {
    for (const m of shellMats) {
      m.transparent = true;
      m.depthWrite = false;
      m.opacity = XRAY_OPACITY;
      m.needsUpdate = true;
    }
    car.materials.glass.opacity = GLASS_XRAY;
  }, [shellMats, car]);

  // Assembly intro: start exploded until the section is in view.
  const intro = useRef(!reducedMotion);
  const linesIn = useRef(reducedMotion ? 1 : 0);
  useEffect(() => {
    if (!started) return;
    const id = window.setTimeout(() => {
      intro.current = false;
      invalidate();
    }, 450);
    return () => window.clearTimeout(id);
  }, [started, invalidate]);

  // Initialise exploded positions for the intro.
  useEffect(() => {
    if (!intro.current) return;
    for (const p of movable) p.obj.position.copy(p.home).addScaledVector(p.offset, explodeFactor(p.key, "", true));
  }, [movable]);

  // Camera flight: component view, or the wide establishing view in exploded mode.
  const view = useRef({ ...toFlat(establishingView) });
  useEffect(() => {
    if (!started) return;
    const base = exploded ? establishingView : ({ ...component.view, ...(narrow ? component.viewNarrow : {}) } as CameraView);
    const target = toFlat(exploded ? base : pullBack(base, 1.22));
    if (reducedMotion) {
      Object.assign(view.current, target);
      invalidate();
      return;
    }
    const tween = gsap.to(view.current, { ...target, duration: 1.6, ease: "expo.inOut", onUpdate: invalidate });
    return () => {
      tween.kill();
    };
  }, [component, narrow, reducedMotion, started, exploded, invalidate]);

  // Bronze emissive on the selected component's parts.
  const pulse = useRef(0);
  useEffect(() => {
    const all = new Set(Object.values(groups).flat());
    all.forEach((m) => {
      if (!m.userData.baseEmissive) m.userData.baseEmissive = { color: m.emissive.clone(), intensity: m.emissiveIntensity };
      const base = m.userData.baseEmissive as { color: THREE.Color; intensity: number };
      m.emissive.copy(base.color);
      m.emissiveIntensity = base.intensity;
    });
    component.highlight.flatMap((g) => groups[g]).forEach((m) => {
      if (m !== car.materials.headlight && m !== car.materials.taillight) m.emissive.copy(BRONZE);
    });
    pulse.current = 0;
    invalidate();
  }, [component, groups, car, invalidate]);

  // Release per-instance GPU resources.
  useEffect(() => {
    const mats: THREE.Material[] = [...Object.values(car.materials), hoodPaint, lineMat, ...(engineMat ? [engineMat] : [])];
    return () => mats.forEach((m) => m.dispose());
  }, [car, hoodPaint, engineMat, lineMat]);

  const scan = useRef<THREE.Mesh>(null);
  const sweep = useRef<THREE.PointLight>(null);
  const solid = useRef(0);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 20);
    const t = state.clock.elapsedTime;
    const animate = !reducedMotion;
    let moving = false;

    // Camera.
    const v = view.current;
    camera.position.set(v.px, v.py, v.pz);
    if (Math.abs(persp.fov - v.fov) > 0.01) {
      persp.fov = v.fov;
      persp.updateProjectionMatrix();
    }
    camera.lookAt(v.tx, v.ty, v.tz);

    // Assemblies → targets (damped).
    const explodedNow = exploded || intro.current;
    const k = reducedMotion ? 1 : 1 - Math.exp(-3.2 * dt);
    for (const p of movable) {
      p.target.copy(p.home).addScaledVector(p.offset, explodeFactor(p.key, component.id, explodedNow));
      if (p.obj.position.distanceToSquared(p.target) > 1e-7) {
        p.obj.position.lerp(p.target, k);
        moving = true;
      }
    }

    // Structure lines draw in once the assembly starts.
    if (started && linesIn.current < 1) {
      linesIn.current = Math.min(1, linesIn.current + dt / 1.6);
      moving = true;
    }

    // Shell: x-ray ↔ solid paint (bodywork view).
    const goalSolid = !exploded && component.id === "bodywork" ? 1 : 0;
    const prevSolid = solid.current;
    solid.current = reducedMotion ? goalSolid : THREE.MathUtils.damp(solid.current, goalSolid, 2.6, dt);
    if (Math.abs(solid.current - prevSolid) > 1e-4) moving = true;
    const s = solid.current;
    for (const m of shellMats) {
      m.opacity = THREE.MathUtils.lerp(XRAY_OPACITY, 1, s);
      const wantSolid = s > 0.985;
      if (wantSolid === m.transparent) {
        m.transparent = !wantSolid;
        m.depthWrite = wantSolid;
        m.needsUpdate = true;
      }
    }
    car.materials.glass.opacity = THREE.MathUtils.lerp(GLASS_XRAY, 0.62, s);
    lineMat.opacity = linesIn.current * THREE.MathUtils.lerp(0.7, 0.16, s);

    // Bronze pulse on the highlighted parts.
    pulse.current = Math.min(1, pulse.current + dt * 1.5);
    const wave = animate ? 0.45 + 0.3 * (0.5 + 0.5 * Math.sin(t * 2.2)) : 0.6;
    for (const g of component.highlight) {
      for (const m of groups[g]) {
        const isLight = m === car.materials.headlight || m === car.materials.taillight;
        const base = (m.userData.baseEmissive as { intensity: number } | undefined)?.intensity ?? 1;
        const strength = g === "calipers" || g === "discs" ? 0.5 : g === "dash" ? 0.35 : 0.16;
        m.emissiveIntensity = isLight ? base * (1 + 0.6 * wave) : strength * wave * pulse.current;
      }
    }

    // Component mechanics.
    if (animate) {
      if (component.id === "wheels" && !exploded) {
        for (const [c, axis] of axes) c.rotateOnAxis(axis, -dt * 1.4);
      }
      if (component.id === "brakes" && frontLeft) {
        for (const c of frontLeft.children) {
          const axis = axes.get(c);
          if (axis && /BrakeDisc/.test(c.name)) c.rotateOnAxis(axis, -dt * 2.2);
        }
      }
      if (scan.current) {
        const on = component.id === "electronics" && !exploded;
        const mat = scan.current.material as THREE.MeshBasicMaterial;
        mat.opacity = THREE.MathUtils.damp(mat.opacity, on ? 0.32 : 0, 4, dt);
        scan.current.visible = mat.opacity > 0.005;
        if (scan.current.visible) scan.current.position.z = 2.5 - ((t * 1.25) % 5.1);
      }
      if (sweep.current) {
        const on = component.id === "bodywork" && !exploded;
        sweep.current.intensity = on ? 45 : 0;
        if (on) sweep.current.position.set(2.2, 1.1, 2.6 - ((t * 1.4) % 5.2));
      }
      moving = true;
    }

    if (moving) invalidate();
  });

  return (
    <>
      <primitive object={car.root} />
      <pointLight ref={sweep} intensity={0} distance={5} decay={2} color="#fff1dc" />
      {/* Electronics scan: a thin light sheet passing through the car. */}
      <mesh ref={scan} position={[0, 0.62, 2.5]} visible={false}>
        <planeGeometry args={[2.7, 1.35]} />
        <meshBasicMaterial color="#d2b49c" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      {!exploded && (
        <Html position={component.anchor as [number, number, number]} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
          <span aria-hidden="true" className="relative flex size-5 items-center justify-center">
            <span className="absolute inline-flex size-full animate-ping rounded-full border border-bronze opacity-70 motion-reduce:hidden" />
            <span className="relative inline-flex size-2 rounded-full bg-bronze" />
          </span>
        </Html>
      )}
    </>
  );
}

/** Move the camera further from its target along the same line (wider x-ray framing). */
function pullBack(v: CameraView, factor: number): CameraView {
  const [px, py, pz] = v.position;
  const [tx, ty, tz] = v.target;
  return { ...v, position: [tx + (px - tx) * factor, ty + (py - ty) * factor, tz + (pz - tz) * factor] };
}

function toFlat(v: CameraView) {
  return { px: v.position[0], py: v.position[1], pz: v.position[2], tx: v.target[0], ty: v.target[1], tz: v.target[2], fov: v.fov };
}
