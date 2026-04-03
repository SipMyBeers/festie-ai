"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticlesProps {
  count?: number;
  area?: [number, number, number];
  color?: string;
  size?: number;
  speed?: number;
}

export function Particles({
  count = 200,
  area = [10, 5, 10],
  color = "#ec4899",
  size = 0.03,
  speed = 0.3,
}: ParticlesProps) {
  const meshRef = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * area[0];
      positions[i * 3 + 1] = Math.random() * area[1];
      positions[i * 3 + 2] = (Math.random() - 0.5) * area[2];
      velocities[i * 3] = (Math.random() - 0.5) * speed * 0.1;
      velocities[i * 3 + 1] = Math.random() * speed;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * speed * 0.1;
    }
    return { positions, velocities };
  }, [count, area, speed]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const pos = meshRef.current.geometry.attributes.position;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3] * delta;
      arr[i * 3 + 1] += velocities[i * 3 + 1] * delta;
      arr[i * 3 + 2] += velocities[i * 3 + 2] * delta;
      if (arr[i * 3 + 1] > area[1]) {
        arr[i * 3] = (Math.random() - 0.5) * area[0];
        arr[i * 3 + 1] = 0;
        arr[i * 3 + 2] = (Math.random() - 0.5) * area[2];
      }
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
