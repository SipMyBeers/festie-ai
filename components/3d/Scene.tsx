"use client";

import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import { useFestieStore } from "@/lib/store";

function SceneContent() {
  const setAssetsLoaded = useFestieStore((s) => s.setAssetsLoaded);
  const setLoadingProgress = useFestieStore((s) => s.setLoadingProgress);

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setLoadingProgress(Math.min(progress, 100));
      if (progress >= 100) {
        clearInterval(interval);
        setAssetsLoaded(true);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [setAssetsLoaded, setLoadingProgress]);

  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#fff8e7" />
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.3} />
      </mesh>
      <Preload all />
    </>
  );
}

export function Scene() {
  return (
    <Canvas
      className="!fixed inset-0"
      camera={{ position: [0, 0, 5], fov: 60 }}
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
