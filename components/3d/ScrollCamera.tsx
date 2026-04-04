"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useFestieStore } from "@/lib/store";

export function ScrollCamera() {
  const { camera, gl } = useThree();
  const setCameraMode = useFestieStore((s) => s.setCameraMode);
  const selectedPlanetSlug = useFestieStore((s) => s.selectedPlanetSlug);
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));

  // Orbit state
  const orbitAngle = useRef(0);
  const orbitTilt = useRef(0.35);
  const orbitDistance = useRef(55);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  // Start in solar-system mode
  useEffect(() => {
    setCameraMode("solar-system");
  }, [setCameraMode]);

  // When a planet is selected, zoom in a bit. When deselected, zoom out.
  useEffect(() => {
    if (selectedPlanetSlug) {
      setCameraMode("planet-surface");
    } else {
      setCameraMode("solar-system");
    }
  }, [selectedPlanetSlug, setCameraMode]);

  useEffect(() => {
    const canvas = gl.domElement;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      orbitDistance.current = Math.max(8, Math.min(120, orbitDistance.current + e.deltaY * 0.04));
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      orbitAngle.current -= dx * 0.005;
      orbitTilt.current = Math.max(0.05, Math.min(1.5, orbitTilt.current + dy * 0.005));
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

  useFrame(() => {
    // Don't control camera in exploring mode — PlayerController handles it
    const currentMode = useFestieStore.getState().cameraMode;
    if (currentMode === "exploring") return;

    const d = orbitDistance.current;
    const position = new THREE.Vector3(
      Math.sin(orbitAngle.current) * Math.cos(orbitTilt.current) * d,
      Math.sin(orbitTilt.current) * d,
      Math.cos(orbitAngle.current) * Math.cos(orbitTilt.current) * d
    );

    camera.position.lerp(position, 0.08);
    camera.lookAt(lookAtTarget.current);
  });

  return null;
}
