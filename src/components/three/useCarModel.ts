"use client";

/**
 * Loads the prepared 9WERKS concept car (Draco-compressed GLB, local decoder),
 * returns an independent, grounded and centred clone with 9WERKS materials,
 * plus handles to the parts that scenes animate or highlight.
 *
 * Each call clones geometry references but creates its OWN materials, so two
 * scenes (hero + engineering) can use different finishes/highlights safely.
 *
 * Car orientation after preparation: nose towards +Z, wheels on y = 0,
 * centred on x/z. Length ≈ 4.36 m, width ≈ 2.0 m (2.54 m incl. mirrors), height ≈ 1.15 m.
 */
import { useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { DRACO_PATH, FINISHES, MODEL_URL, type FinishId } from "./finishes";

export interface CarParts {
  root: THREE.Group;
  /** Body paint meshes (primary finish). */
  paint: THREE.Mesh[];
  /** Every mesh, keyed by mesh name (first match). */
  byName: Map<string, THREE.Mesh>;
  /** Wheel groups (FL, FR, RL, RR) for spin/highlight. */
  wheels: THREE.Object3D[];
  calipers: THREE.Mesh[];
  discs: THREE.Mesh[];
  rims: THREE.Mesh[];
  tyres: THREE.Mesh[];
  glass: THREE.Mesh[];
  headlights: THREE.Mesh[];
  taillights: THREE.Mesh[];
  /** Hinged parts (pivot = node origin). */
  hood?: THREE.Object3D;
  doorLeft?: THREE.Object3D;
  doorRight?: THREE.Object3D;
  rearHatch?: THREE.Object3D;
  materials: {
    paint: THREE.MeshPhysicalMaterial;
    paintSecondary: THREE.MeshPhysicalMaterial;
    caliper: THREE.MeshStandardMaterial;
    rim: THREE.MeshStandardMaterial;
    glass: THREE.MeshPhysicalMaterial;
    headlight: THREE.MeshStandardMaterial;
    taillight: THREE.MeshStandardMaterial;
  };
  /** Axis-aligned size of the prepared car (metres). */
  size: THREE.Vector3;
}

export function applyFinish(material: THREE.MeshPhysicalMaterial, finish: FinishId) {
  const f = FINISHES[finish];
  material.color.set(f.color);
  material.metalness = f.metalness;
  material.roughness = f.roughness;
  material.clearcoat = f.clearcoat;
  material.clearcoatRoughness = f.clearcoatRoughness;
  material.needsUpdate = true;
}

function physicalFrom(src: THREE.Material | undefined, params: THREE.MeshPhysicalMaterialParameters) {
  const m = new THREE.MeshPhysicalMaterial(params);
  const s = src as THREE.MeshStandardMaterial | undefined;
  if (s) {
    m.normalMap = s.normalMap ?? null;
    m.normalScale = s.normalScale?.clone() ?? new THREE.Vector2(1, 1);
    m.aoMap = s.aoMap ?? null;
    m.aoMapIntensity = s.aoMapIntensity ?? 1;
    m.side = s.side;
  }
  return m;
}

export function useCarModel(initialFinish: FinishId = "obsidian"): CarParts {
  const gltf = useGLTF(MODEL_URL, DRACO_PATH);

  return useMemo(() => {
    const root = gltf.scene.clone(true) as THREE.Group;
    root.name = "9werks-car";

    // Shared, per-instance materials.
    const paint = physicalFrom(undefined, { envMapIntensity: 1.15 });
    applyFinish(paint, initialFinish);
    const paintSecondary = physicalFrom(undefined, {
      color: "#090909",
      metalness: 0.45,
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      envMapIntensity: 1.1,
    });
    const caliper = new THREE.MeshStandardMaterial({ color: "#b68c66", metalness: 0.88, roughness: 0.3, envMapIntensity: 1.2 });
    const rim = new THREE.MeshStandardMaterial({ color: "#2c2a28", metalness: 1, roughness: 0.27, envMapIntensity: 1.25 });
    const glass = new THREE.MeshPhysicalMaterial({
      color: "#07080a",
      metalness: 0,
      roughness: 0.02,
      transparent: true,
      opacity: 0.62,
      depthWrite: false,
      envMapIntensity: 1.6,
      clearcoat: 1,
      clearcoatRoughness: 0,
      side: THREE.DoubleSide,
    });
    const headlight = new THREE.MeshStandardMaterial({ color: "#000000", emissive: "#fff2df", emissiveIntensity: 7, roughness: 0.4 });
    const taillight = new THREE.MeshStandardMaterial({ color: "#000000", emissive: "#ff2a12", emissiveIntensity: 3.2, roughness: 0.4 });

    const parts: CarParts = {
      root,
      paint: [],
      byName: new Map(),
      wheels: [],
      calipers: [],
      discs: [],
      rims: [],
      tyres: [],
      glass: [],
      headlights: [],
      taillights: [],
      materials: { paint, paintSecondary, caliper, rim, glass, headlight, taillight },
      size: new THREE.Vector3(),
    };

    const flakes = { normalMap: null as THREE.Texture | null };

    root.traverse((obj) => {
      if (/^Wheel(Front|Rear)(L|R)$/.test(obj.name)) parts.wheels.push(obj);
      if (obj.name === "BodyHood") parts.hood = obj;
      if (obj.name === "BodyDoorLColor1") parts.doorLeft = obj;
      if (obj.name === "BodyDoorRColor1") parts.doorRight = obj;
      if (obj.name === "BodyRearPanelsColor1") parts.rearHatch = obj;

      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      if (mesh.name && !parts.byName.has(mesh.name)) parts.byName.set(mesh.name, mesh);
      mesh.castShadow = false;
      mesh.receiveShadow = false;

      const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const replaced = list.map((mat) => {
        const name = mat?.name ?? "";
        switch (name) {
          case "paint_primary":
            flakes.normalMap ??= (mat as THREE.MeshStandardMaterial).normalMap ?? null;
            parts.paint.push(mesh);
            return paint;
          case "paint_secondary":
            return paintSecondary;
          case "brake_caliper":
            parts.calipers.push(mesh);
            return caliper;
          case "brake_disc": {
            // The source disc texture is a white drilled-hole pattern; tint it to read as steel.
            parts.discs.push(mesh);
            const disc = (mat as THREE.MeshStandardMaterial).clone();
            disc.color.set("#5c5a58");
            disc.metalness = 1;
            disc.roughness = 0.42;
            return disc;
          }
          case "rim_face":
            parts.rims.push(mesh);
            return rim;
          case "tyre_sidewall":
          case "tyre_tread":
            parts.tyres.push(mesh);
            return mat;
          case "glass":
            parts.glass.push(mesh);
            mesh.renderOrder = 2;
            return glass;
          case "light_head":
            parts.headlights.push(mesh);
            return headlight;
          case "light_brake":
            parts.taillights.push(mesh);
            return taillight;
          default:
            return mat;
        }
      });
      mesh.material = Array.isArray(mesh.material) ? replaced : replaced[0]!;
    });

    // Metallic flake normal map from the source paint, kept very subtle.
    if (flakes.normalMap) {
      for (const m of [paint, paintSecondary]) {
        m.normalMap = flakes.normalMap;
        m.normalScale = new THREE.Vector2(0.12, 0.12);
      }
      flakes.normalMap.wrapS = flakes.normalMap.wrapT = THREE.RepeatWrapping;
    }

    // Ground and centre the car.
    const box = new THREE.Box3().setFromObject(root);
    const center = box.getCenter(new THREE.Vector3());
    root.position.x -= center.x;
    root.position.z -= center.z;
    root.position.y -= box.min.y;
    box.getSize(parts.size);

    return parts;
    // The clone is tied to the loaded GLTF; the finish is applied imperatively afterwards.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gltf]);
}

/** Start fetching the model early (call when a 3D scene is about to mount). */
export function preloadCarModel() {
  useGLTF.preload(MODEL_URL, DRACO_PATH);
}
