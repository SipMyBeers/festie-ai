"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Preload } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense } from "react";
import { Festival } from "@/lib/types";
import { PlanetSurface } from "./PlanetSurface";

interface PlanetSceneProps {
  festival: Festival;
}

export function PlanetScene({ festival }: PlanetSceneProps) {
  return (
    <Canvas
      className="!fixed inset-0"
      camera={{ position: [0, 12, 15], fov: 50, near: 0.1, far: 500 }}
      dpr={[1, 2]}
      shadows
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      style={{ background: "#0a0a0f" }}
    >
      <Suspense fallback={null}>
        <PlanetSurface festival={festival} />
        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={40}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2.2}
          enableDamping
          dampingFactor={0.05}
        />
        <Stars radius={100} depth={50} count={1500} factor={3} fade speed={0.5} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.9} intensity={0.8} mipmapBlur />
        </EffectComposer>
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
