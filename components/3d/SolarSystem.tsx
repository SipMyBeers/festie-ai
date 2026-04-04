"use client";

import { useMemo } from "react";
import { festivals } from "@/lib/data/festivals";
import { useFestieStore } from "@/lib/store";
import { Sun } from "./Sun";
import { Planet } from "./Planet";

export function SolarSystem() {
  const cameraMode = useFestieStore((s) => s.cameraMode);
  const selectedPlanetSlug = useFestieStore((s) => s.selectedPlanetSlug);

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

  const isOnPlanet = cameraMode === "planet-surface" || cameraMode === "flying-in";

  return (
    <group position={[0, 0, 0]}>
      {/* Hide sun when on a planet */}
      {!isOnPlanet && <Sun />}

      {/* Hide orbit rings when on a planet */}
      {!isOnPlanet &&
        planetConfigs.map(({ orbitRadius }, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[orbitRadius - 0.02, orbitRadius + 0.02, 128]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.04}
              depthWrite={false}
              side={2}
            />
          </mesh>
        ))}

      {/* When on a planet, only render the selected planet */}
      {isOnPlanet
        ? planetConfigs
            .filter((c) => c.festival.slug === selectedPlanetSlug)
            .map((config) => <Planet key={config.festival.id} {...config} />)
        : planetConfigs.map((config) => (
            <Planet key={config.festival.id} {...config} />
          ))}
    </group>
  );
}
