"use client";

import { useMemo } from "react";
import { festivals } from "@/lib/data/festivals";
import { Sun } from "./Sun";
import { Planet } from "./Planet";

export function SolarSystem() {
  const planetConfigs = useMemo(() => {
    const sorted = [...festivals].sort(
      (a, b) => b.popularityScore - a.popularityScore
    );
    return sorted.map((festival, i) => ({
      festival,
      orbitRadius: 8 + i * 3.5,
      orbitSpeed: 0.03 + (sorted.length - i) * 0.005,
      startAngle: (i / sorted.length) * Math.PI * 2,
    }));
  }, []);

  return (
    <group position={[0, 0, 0]}>
      <Sun />

      {planetConfigs.map(({ orbitRadius }, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry
            args={[orbitRadius - 0.02, orbitRadius + 0.02, 128]}
          />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.04}
            depthWrite={false}
            side={2}
          />
        </mesh>
      ))}

      {planetConfigs.map((config) => (
        <Planet key={config.festival.id} {...config} />
      ))}
    </group>
  );
}
