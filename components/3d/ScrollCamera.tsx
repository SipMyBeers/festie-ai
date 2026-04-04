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

  const scrollOffset = useRef(0);

  // Drag orbit state
  const orbitAngle = useRef(0);
  const orbitTilt = useRef(0.3);
  const orbitDistance = useRef(60);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  // Return animation
  const isReturning = useRef(false);
  const returnProgress = useRef(0);
  const returnStartPos = useRef(new THREE.Vector3());
  const returnStartLookAt = useRef(new THREE.Vector3());

  useEffect(() => {
    const canvas = gl.domElement;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const mode = useFestieStore.getState().cameraMode;

      if (mode === "hero" || (mode === "solar-system" && scrollOffset.current < 0.75)) {
        const delta = e.deltaY * 0.0003;
        scrollOffset.current = Math.max(0, Math.min(1, scrollOffset.current + delta));
      } else if (mode === "solar-system") {
        orbitDistance.current = Math.max(25, Math.min(120, orbitDistance.current + e.deltaY * 0.05));
      } else if (mode === "planet-surface") {
        orbitDistance.current = Math.max(4, Math.min(25, orbitDistance.current + e.deltaY * 0.02));
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      const mode = useFestieStore.getState().cameraMode;
      if (mode === "solar-system" || mode === "planet-surface") {
        isDragging.current = true;
        lastMouse.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      orbitAngle.current -= dx * 0.005;
      orbitTilt.current = Math.max(0.1, Math.min(1.4, orbitTilt.current + dy * 0.005));
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointerleave", handlePointerUp);

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointerleave", handlePointerUp);
    };
  }, [gl.domElement]);

  useEffect(() => {
    arrivalProgress.current = 0;
    if (selectedPlanetSlug) {
      orbitDistance.current = 12;
      orbitAngle.current = 0;
      orbitTilt.current = 0.6;
    }
  }, [selectedPlanetSlug]);

  useEffect(() => {
    if ((cameraMode === "hero" || cameraMode === "solar-system") && !selectedPlanetSlug) {
      isReturning.current = true;
      returnProgress.current = 0;
      returnStartPos.current.copy(camera.position);
      returnStartLookAt.current.copy(lookAtTarget.current);
      orbitDistance.current = 60;
      orbitTilt.current = 0.3;
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
        if (cameraMode !== "hero") setCameraMode("hero");
      } else if (offset < 0.5) {
        const t = smoothstep((offset - 0.25) / 0.25);
        position = lerp3(KEYFRAMES.risingAbove.position, KEYFRAMES.planetReveal.position, t);
        lookAt = lerp3(KEYFRAMES.risingAbove.lookAt, KEYFRAMES.planetReveal.lookAt, t);
        if (cameraMode !== "hero") setCameraMode("hero");
      } else if (offset < 0.75) {
        const t = smoothstep((offset - 0.5) / 0.25);
        position = lerp3(KEYFRAMES.planetReveal.position, KEYFRAMES.solarSystem.position, t);
        lookAt = lerp3(KEYFRAMES.planetReveal.lookAt, KEYFRAMES.solarSystem.lookAt, t);
        if (cameraMode !== "solar-system") setCameraMode("solar-system");
      } else {
        // Full orbit mode
        const d = orbitDistance.current;
        position = new THREE.Vector3(
          Math.sin(orbitAngle.current) * Math.cos(orbitTilt.current) * d,
          Math.sin(orbitTilt.current) * d,
          Math.cos(orbitAngle.current) * Math.cos(orbitTilt.current) * d
        );
        lookAt = new THREE.Vector3(0, 0, 0);
        if (cameraMode !== "solar-system") setCameraMode("solar-system");
      }

      if (isReturning.current) {
        returnProgress.current = Math.min(returnProgress.current + 0.025, 1);
        const t = smoothstep(returnProgress.current);
        camera.position.lerpVectors(returnStartPos.current, position, t);
        lookAtTarget.current.lerpVectors(returnStartLookAt.current, lookAt, t);
        if (returnProgress.current >= 1) isReturning.current = false;
      } else {
        camera.position.lerp(position, 0.08);
        lookAtTarget.current.lerp(lookAt, 0.08);
      }
      camera.lookAt(lookAtTarget.current);

    } else if (cameraMode === "flying-in" && selectedPlanetSlug) {
      const targetPos = planetPositions[selectedPlanetSlug];
      if (!targetPos) return;

      const planetVec = new THREE.Vector3(...targetPos);
      arrivalProgress.current = Math.min(arrivalProgress.current + 0.025, 1);
      const t = smoothstep(arrivalProgress.current);

      const d = orbitDistance.current;
      const camOffset = new THREE.Vector3(
        Math.sin(orbitAngle.current) * Math.cos(orbitTilt.current) * d,
        Math.sin(orbitTilt.current) * d,
        Math.cos(orbitAngle.current) * Math.cos(orbitTilt.current) * d
      );
      const cameraTarget = planetVec.clone().add(camOffset);

      camera.position.lerp(cameraTarget, t * 0.12);
      lookAtTarget.current.lerp(planetVec, t * 0.12);
      camera.lookAt(lookAtTarget.current);

      if (arrivalProgress.current > 0.85) {
        setCameraMode("planet-surface");
      }

    } else if (cameraMode === "planet-surface" && selectedPlanetSlug) {
      const targetPos = planetPositions[selectedPlanetSlug];
      if (!targetPos) return;

      const planetVec = new THREE.Vector3(...targetPos);
      const d = orbitDistance.current;
      const camOffset = new THREE.Vector3(
        Math.sin(orbitAngle.current) * Math.cos(orbitTilt.current) * d,
        Math.sin(orbitTilt.current) * d,
        Math.cos(orbitAngle.current) * Math.cos(orbitTilt.current) * d
      );
      const cameraTarget = planetVec.clone().add(camOffset);

      camera.position.lerp(cameraTarget, 0.06);
      lookAtTarget.current.lerp(planetVec, 0.06);
      camera.lookAt(lookAtTarget.current);
    }
  });

  return null;
}
