"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AtmosphereGlowProps {
  color: string;
  size: number;
  intensity?: number;
  pulse?: boolean;
}

export function AtmosphereGlow({
  color,
  size,
  intensity = 0.5,
  pulse = false,
}: AtmosphereGlowProps) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current || !pulse) return;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = intensity * (0.7 + Math.sin(clock.elapsedTime * 1.5) * 0.3);
  });

  return (
    <mesh ref={ref} scale={size * 1.2}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={intensity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.BackSide}
      />
    </mesh>
  );
}
