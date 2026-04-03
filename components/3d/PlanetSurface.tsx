"use client";

import { useMemo } from "react";
import { Festival, Performance } from "@/lib/types";
import { Stage } from "./Stage";

interface PlanetSurfaceProps {
  festival: Festival;
}

function getCurrentPerformance(schedule: Performance[]): Performance | null {
  const now = new Date();
  return schedule.find((p) => new Date(p.startTime) <= now && new Date(p.endTime) > now) ?? null;
}

function getNextPerformance(schedule: Performance[]): Performance | null {
  const now = new Date();
  const upcoming = schedule
    .filter((p) => new Date(p.startTime) > now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  return upcoming[0] ?? null;
}

export function PlanetSurface({ festival }: PlanetSurfaceProps) {
  const terrainColor = useMemo(() => {
    switch (festival.terrainType) {
      case "desert": return "#c2a04e";
      case "playa": return "#8b7355";
      case "coastal": return "#2d6a4f";
      case "urban": return "#4a4a4a";
      case "grassland": return "#4a7c59";
      case "forest": return "#2d5a27";
      case "fantasy": return "#1a5c3a";
      default: return "#666";
    }
  }, [festival.terrainType]);

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[20, 64]} />
        <meshStandardMaterial color={terrainColor} roughness={0.9} metalness={0} />
      </mesh>

      {festival.terrainType === "desert" && <DesertTerrain />}

      {festival.stages.map((stage) => (
        <Stage
          key={stage.id}
          stage={stage}
          currentPerformance={getCurrentPerformance(stage.schedule)}
          nextPerformance={getNextPerformance(stage.schedule)}
        />
      ))}

      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 15, 5]} intensity={1} color="#ffeedd" castShadow />
    </group>
  );
}

function DesertTerrain() {
  const palms = useMemo(
    () => Array.from({ length: 15 }, () => ({
      x: (Math.random() - 0.5) * 35,
      z: (Math.random() - 0.5) * 35,
      scale: 0.5 + Math.random() * 0.5,
    })),
    []
  );

  return (
    <group>
      {/* Mountains */}
      {[
        { pos: [-12, 0, -15] as [number, number, number], scale: [8, 5, 4] as [number, number, number] },
        { pos: [10, 0, -18] as [number, number, number], scale: [10, 7, 5] as [number, number, number] },
        { pos: [0, 0, -20] as [number, number, number], scale: [12, 4, 6] as [number, number, number] },
      ].map((mt, i) => (
        <mesh key={i} position={mt.pos}>
          <coneGeometry args={[mt.scale[0], mt.scale[1], 6]} />
          <meshStandardMaterial color="#5c4a32" roughness={1} metalness={0} />
        </mesh>
      ))}

      {/* Palm trees */}
      {palms.map((p, i) => (
        <group key={i} position={[p.x, 0, p.z]} scale={p.scale}>
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 3, 6]} />
            <meshStandardMaterial color="#8b6f47" roughness={0.9} />
          </mesh>
          <mesh position={[0, 3.2, 0]}>
            <sphereGeometry args={[0.8, 8, 6]} />
            <meshStandardMaterial color="#2d5a27" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
