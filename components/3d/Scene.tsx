"use client";

import { Canvas } from "@react-three/fiber";
import { Preload, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense, useEffect } from "react";
import { useFestieStore } from "@/lib/store";
import { SolarSystem } from "./SolarSystem";
import { ScrollCamera } from "./ScrollCamera";

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
      <SolarSystem />
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
      camera={{ position: [0, 30, 60], fov: 60, near: 0.1, far: 1000 }}
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
