"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LaserProps {
  count?: number;
  origin: [number, number, number];
  spread?: number;
  color?: string;
}

export function Lasers({
  count = 8,
  origin,
  spread = 4,
  color = "#7c3aed",
}: LaserProps) {
  const groupRef = useRef<THREE.Group>(null);

  const beams = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const targetX = Math.cos(angle) * spread;
      const targetZ = Math.sin(angle) * spread;
      return {
        target: [targetX, 4 + Math.random() * 2, targetZ] as [number, number, number],
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5,
      };
    });
  }, [count, spread]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.elapsedTime * 0.1;
    groupRef.current.children.forEach((child, i) => {
      const beam = beams[i];
      if (beam) {
        child.visible =
          Math.sin(clock.elapsedTime * beam.speed + beam.phase) > -0.3;
      }
    });
  });

  return (
    <group ref={groupRef} position={origin}>
      {beams.map((beam, i) => {
        const dir = new THREE.Vector3(...beam.target).normalize();
        const length = new THREE.Vector3(...beam.target).length();
        const midpoint = dir.clone().multiplyScalar(length / 2);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir
        );

        return (
          <mesh
            key={i}
            position={[midpoint.x, midpoint.y, midpoint.z]}
            quaternion={quaternion}
          >
            <cylinderGeometry args={[0.01, 0.01, length, 4]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.6}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}
    </group>
  );
}
