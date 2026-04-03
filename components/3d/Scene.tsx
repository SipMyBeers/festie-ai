"use client";

import { Canvas } from "@react-three/fiber";
import { Preload, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense, useEffect } from "react";
import { useFestieStore } from "@/lib/store";
import { HeroRave } from "./HeroRave";

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
      <ambientLight intensity={0.05} />
      <HeroRave />
      <Stars radius={100} depth={50} count={2000} factor={4} fade speed={1} />
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          intensity={1.5}
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
