"use client";

import { Canvas } from "@react-three/fiber";
import { Preload, Stars } from "@react-three/drei";
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
      <ambientLight intensity={0.15} />
      <directionalLight position={[10, 15, 10]} intensity={0.6} />
      <SolarSystem />
      <Stars
        radius={200}
        depth={100}
        count={1500}
        factor={4}
        fade
        speed={0.3}
      />
      {/* Bloom removed — biggest performance killer */}
      <Preload all />
    </>
  );
}

export function Scene() {
  return (
    <Canvas
      className="!fixed inset-0"
      camera={{ position: [0, 30, 60], fov: 60, near: 0.1, far: 500 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
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
