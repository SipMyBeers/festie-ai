"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useFestieStore } from "@/lib/store";

const KEYFRAMES = {
  raveStart: {
    position: new THREE.Vector3(0, 1.6, 3),
    lookAt: new THREE.Vector3(0, 2.5, -8),
  },
  risingAbove: {
    position: new THREE.Vector3(0, 15, 10),
    lookAt: new THREE.Vector3(0, 0, -2),
  },
  planetReveal: {
    position: new THREE.Vector3(0, 30, 40),
    lookAt: new THREE.Vector3(0, 0, 0),
  },
  solarSystem: {
    position: new THREE.Vector3(0, 20, 60),
    lookAt: new THREE.Vector3(0, 0, 0),
  },
};

function lerp3(a: THREE.Vector3, b: THREE.Vector3, t: number): THREE.Vector3 {
  return new THREE.Vector3(
    THREE.MathUtils.lerp(a.x, b.x, t),
    THREE.MathUtils.lerp(a.y, b.y, t),
    THREE.MathUtils.lerp(a.z, b.z, t)
  );
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

export function ScrollCamera() {
  const { camera, gl } = useThree();
  const cameraMode = useFestieStore((s) => s.cameraMode);
  const setCameraMode = useFestieStore((s) => s.setCameraMode);
  const selectedPlanetSlug = useFestieStore((s) => s.selectedPlanetSlug);
  const planetPositions = useFestieStore((s) => s.planetPositions);
  const lookAtTarget = useRef(new THREE.Vector3(0, 2.5, -8));
  const arrivalProgress = useRef(0);
  const returnProgress = useRef(0);
  const returnStartPos = useRef(new THREE.Vector3());
  const returnStartLookAt = useRef(new THREE.Vector3());
  const isReturning = useRef(false);

  // Custom scroll offset (0 to 1) driven by wheel events
  const scrollOffset = useRef(0);

  useEffect(() => {
    const canvas = gl.domElement;
    const handleWheel = (e: WheelEvent) => {
      // Only scroll when in hero or solar-system mode
      const mode = useFestieStore.getState().cameraMode;
      if (mode !== "hero" && mode !== "solar-system") return;

      e.preventDefault();
      const delta = e.deltaY * 0.0003;
      scrollOffset.current = Math.max(0, Math.min(1, scrollOffset.current + delta));
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [gl.domElement]);

  // Reset arrival progress when selected planet changes
  useEffect(() => {
    arrivalProgress.current = 0;
  }, [selectedPlanetSlug]);

  // Handle returning to solar system view
  useEffect(() => {
    if (
      (cameraMode === "hero" || cameraMode === "solar-system") &&
      !selectedPlanetSlug
    ) {
      isReturning.current = true;
      returnProgress.current = 0;
      returnStartPos.current.copy(camera.position);
      returnStartLookAt.current.copy(lookAtTarget.current);
    }
  }, [cameraMode, selectedPlanetSlug, camera]);

  useFrame(() => {
    if (cameraMode === "hero" || cameraMode === "solar-system") {
      const offset = scrollOffset.current;

      let position: THREE.Vector3;
      let lookAt: THREE.Vector3;

      if (offset < 0.25) {
        const t = smoothstep(offset / 0.25);
        position = lerp3(KEYFRAMES.raveStart.position, KEYFRAMES.risingAbove.position, t);
        lookAt = lerp3(KEYFRAMES.raveStart.lookAt, KEYFRAMES.risingAbove.lookAt, t);
        setCameraMode("hero");
      } else if (offset < 0.5) {
        const t = smoothstep((offset - 0.25) / 0.25);
        position = lerp3(KEYFRAMES.risingAbove.position, KEYFRAMES.planetReveal.position, t);
        lookAt = lerp3(KEYFRAMES.risingAbove.lookAt, KEYFRAMES.planetReveal.lookAt, t);
        setCameraMode("hero");
      } else if (offset < 0.75) {
        const t = smoothstep((offset - 0.5) / 0.25);
        position = lerp3(KEYFRAMES.planetReveal.position, KEYFRAMES.solarSystem.position, t);
        lookAt = lerp3(KEYFRAMES.planetReveal.lookAt, KEYFRAMES.solarSystem.lookAt, t);
        setCameraMode("solar-system");
      } else {
        position = KEYFRAMES.solarSystem.position.clone();
        lookAt = KEYFRAMES.solarSystem.lookAt.clone();
        setCameraMode("solar-system");
      }

      if (isReturning.current) {
        returnProgress.current = Math.min(returnProgress.current + 0.02, 1);
        const t = smoothstep(returnProgress.current);
        camera.position.lerpVectors(returnStartPos.current, position, t);
        lookAtTarget.current.lerpVectors(returnStartLookAt.current, lookAt, t);
        if (returnProgress.current >= 1) {
          isReturning.current = false;
        }
      } else {
        camera.position.lerp(position, 0.1);
        lookAtTarget.current.lerp(lookAt, 0.1);
      }

      camera.lookAt(lookAtTarget.current);
    } else if (cameraMode === "flying-in" && selectedPlanetSlug) {
      const targetPos = planetPositions[selectedPlanetSlug];
      if (!targetPos) return;

      const planetVec = new THREE.Vector3(...targetPos);
      const cameraTarget = planetVec.clone().add(new THREE.Vector3(0, 8, 12));

      arrivalProgress.current = Math.min(arrivalProgress.current + 0.012, 1);
      const t = smoothstep(arrivalProgress.current);

      camera.position.lerp(cameraTarget, t * 0.06);
      lookAtTarget.current.lerp(planetVec, t * 0.06);
      camera.lookAt(lookAtTarget.current);

      if (arrivalProgress.current > 0.92) {
        setCameraMode("planet-surface");
      }
    } else if (cameraMode === "planet-surface" && selectedPlanetSlug) {
      const targetPos = planetPositions[selectedPlanetSlug];
      if (!targetPos) return;

      const planetVec = new THREE.Vector3(...targetPos);
      const cameraTarget = planetVec.clone().add(new THREE.Vector3(0, 8, 12));

      camera.position.lerp(cameraTarget, 0.03);
      lookAtTarget.current.lerp(planetVec, 0.03);
      camera.lookAt(lookAtTarget.current);
    }
  });

  return null;
}
