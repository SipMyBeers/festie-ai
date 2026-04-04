"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useFestieStore } from "@/lib/store";

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

export function ScrollCamera() {
  const { camera, gl } = useThree();
  const cameraMode = useFestieStore((s) => s.cameraMode);
  const setCameraMode = useFestieStore((s) => s.setCameraMode);
  const selectedPlanetSlug = useFestieStore((s) => s.selectedPlanetSlug);
  const planetPositions = useFestieStore((s) => s.planetPositions);
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));
  const arrivalProgress = useRef(0);

  // Orbit state
  const orbitAngle = useRef(0);
  const orbitTilt = useRef(0.35);
  const orbitDistance = useRef(60);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  // Return animation
  const isReturning = useRef(false);
  const returnProgress = useRef(0);
  const returnStartPos = useRef(new THREE.Vector3());
  const returnStartLookAt = useRef(new THREE.Vector3());

  // Start in solar-system mode
  useEffect(() => {
    setCameraMode("solar-system");
  }, [setCameraMode]);

  useEffect(() => {
    const canvas = gl.domElement;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const mode = useFestieStore.getState().cameraMode;

      if (mode === "solar-system") {
        orbitDistance.current = Math.max(20, Math.min(120, orbitDistance.current + e.deltaY * 0.05));
      } else if (mode === "planet-surface") {
        orbitDistance.current = Math.max(10, Math.min(60, orbitDistance.current + e.deltaY * 0.03));
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

  // Reset when planet changes
  useEffect(() => {
    arrivalProgress.current = 0;
    if (selectedPlanetSlug) {
      orbitDistance.current = 30;
      orbitAngle.current = 0;
      orbitTilt.current = 0.5;
    }
  }, [selectedPlanetSlug]);

  // Handle returning to solar system
  useEffect(() => {
    if (cameraMode === "solar-system" && !selectedPlanetSlug) {
      isReturning.current = true;
      returnProgress.current = 0;
      returnStartPos.current.copy(camera.position);
      returnStartLookAt.current.copy(lookAtTarget.current);
      orbitDistance.current = 60;
      orbitTilt.current = 0.35;
    }
  }, [cameraMode, selectedPlanetSlug, camera]);

  useFrame(() => {
    if (cameraMode === "solar-system" || cameraMode === "hero") {
      const d = orbitDistance.current;
      const position = new THREE.Vector3(
        Math.sin(orbitAngle.current) * Math.cos(orbitTilt.current) * d,
        Math.sin(orbitTilt.current) * d,
        Math.cos(orbitAngle.current) * Math.cos(orbitTilt.current) * d
      );
      const lookAt = new THREE.Vector3(0, 0, 0);

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

      camera.position.lerp(cameraTarget, 0.03);
      lookAtTarget.current.lerp(planetVec, 0.03);
      camera.lookAt(lookAtTarget.current);
    }
  });

  return null;
}
