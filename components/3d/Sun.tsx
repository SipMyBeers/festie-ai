"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

export function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.elapsedTime * 0.05;
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(clock.elapsedTime * 0.5) * 0.03;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {/* Smaller sun */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f97316"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Glow */}
      <mesh ref={glowRef} scale={1.4}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color="#f97316"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      <pointLight intensity={3} color="#fff8e7" distance={80} decay={2} />

      <Text
        position={[0, 2, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/SpaceGrotesk-Bold.ttf"
        fillOpacity={0.8}
      >
        FESTIE.AI
      </Text>
    </group>
  );
}
