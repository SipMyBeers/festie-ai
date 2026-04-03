"use client";

import { Canvas } from "@react-three/fiber";
import { Preload, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense, useEffect } from "react";
import { useFestieStore } from "@/lib/store";
import { HeroRave } from "./HeroRave";
import { SolarSystem } from "./SolarSystem";
import { ScrollCamera } from "./ScrollCamera";
import { PlanetSurface } from "./PlanetSurface";
import { getFestivalBySlug } from "@/lib/data/festivals";

function ActivePlanetSurface() {
  const selectedSlug = useFestieStore((s) => s.selectedPlanetSlug);
  const cameraMode = useFestieStore((s) => s.cameraMode);
  const planetPositions = useFestieStore((s) => s.planetPositions);

  if (!selectedSlug || cameraMode === "hero" || cameraMode === "solar-system")
    return null;

  const festival = getFestivalBySlug(selectedSlug);
  const pos = planetPositions[selectedSlug];
  if (!festival || !pos) return null;

  return (
    <group position={pos}>
      <PlanetSurface festival={festival} />
    </group>
  );
}

function SceneContent() {
  const setAssetsLoaded = useFestieStore((s) => s.setAssetsLoaded);
  const setLoadingProgress = useFestieStore((s) => s.setLoadingProgress);

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 15;
      setLoadingProgress(Math.min(progress, 100));
      if (progress >= 100) {
        clearInterval(interval);
        setAssetsLoaded(true);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [setAssetsLoaded, setLoadingProgress]);

  return (
    <>
      <ScrollCamera />
      <ambientLight intensity={0.05} />
      <HeroRave />
      <SolarSystem />
      <ActivePlanetSurface />
      <Stars
        radius={200}
        depth={100}
        count={3000}
        factor={4}
        fade
        speed={0.5}
      />
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.5}
          luminanceSmoothing={0.9}
          intensity={1.2}
          mipmapBlur
        />
      </EffectComposer>
      <Preload all />
    </>
  );
}

export function Scene() {
  return (
    <Canvas
      className="!fixed inset-0"
      camera={{ position: [0, 1.6, 3], fov: 70, near: 0.1, far: 1000 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      style={{ background: "#0a0a0f" }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}
