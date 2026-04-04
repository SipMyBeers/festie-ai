"use client";

import { useMemo } from "react";
import * as THREE from "three";
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
      case "desert": return "#d4a843";
      case "playa": return "#a08060";
      case "coastal": return "#3a8a5c";
      case "urban": return "#555555";
      case "grassland": return "#5a8c60";
      case "forest": return "#3a6a30";
      case "fantasy": return "#2a6c44";
      default: return "#777";
    }
  }, [festival.terrainType]);

  return (
    <group>
      {/* Ground - warmer, brighter */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[25, 64]} />
        <meshStandardMaterial color={terrainColor} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Terrain features */}
      {festival.terrainType === "desert" && <DesertTerrain />}

      {/* Festival ground lights - warm ambient glow between stages */}
      {[
        [0, 0.05, 2],
        [-2, 0.05, 0],
        [2, 0.05, 0],
      ].map((pos, i) => (
        <pointLight
          key={i}
          position={pos as [number, number, number]}
          color="#ff9944"
          intensity={1.5}
          distance={10}
          decay={2}
        />
      ))}

      {/* Stages */}
      {festival.stages.map((stage) => (
        <Stage
          key={stage.id}
          stage={stage}
          currentPerformance={getCurrentPerformance(stage.schedule)}
          nextPerformance={getNextPerformance(stage.schedule)}
        />
      ))}

      {/* General crowd scattered between stages */}
      <WanderingCrowd />

      {/* Festival string lights */}
      <StringLights />

      {/* Warm lighting */}
      <ambientLight intensity={0.35} color="#ffeedd" />
      <directionalLight position={[10, 15, 5]} intensity={0.8} color="#ffddbb" />
      {/* Sunset sky color from behind */}
      <directionalLight position={[-5, 3, -10]} intensity={0.3} color="#ff6633" />
    </group>
  );
}

function WanderingCrowd() {
  const people = useMemo(() => {
    return Array.from({ length: 40 }, () => ({
      x: (Math.random() - 0.5) * 14,
      z: (Math.random() - 0.5) * 10,
      height: 0.35 + Math.random() * 0.2,
      shade: Math.random(),
    }));
  }, []);

  const bodyColors = ["#2a2a3a", "#3a3a4a", "#4a3a3a", "#3a4a4a", "#4a4a5a"];

  return (
    <group>
      {people.map((p, i) => (
        <group key={i} position={[p.x, 0, p.z]}>
          <mesh position={[0, p.height * 0.5, 0]}>
            <capsuleGeometry args={[0.05, p.height, 4, 8]} />
            <meshStandardMaterial color={bodyColors[i % bodyColors.length]} roughness={0.9} />
          </mesh>
          <mesh position={[0, p.height + 0.08, 0]}>
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshStandardMaterial color="#ddb89a" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function StringLights() {
  // Create paths of warm lights connecting stage areas
  const lights = useMemo(() => {
    const points: [number, number, number][] = [];
    // Arc of lights
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 1.5 - Math.PI * 0.75;
      const r = 6 + Math.sin(i * 0.5) * 0.5;
      points.push([Math.cos(angle) * r, 1.8 + Math.sin(i * 0.8) * 0.3, Math.sin(angle) * r]);
    }
    return points;
  }, []);

  return (
    <group>
      {lights.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial
            color="#ffaa33"
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
      {/* Glow from string lights */}
      {lights.filter((_, i) => i % 3 === 0).map((pos, i) => (
        <pointLight
          key={i}
          position={pos}
          color="#ffaa33"
          intensity={0.3}
          distance={3}
          decay={2}
        />
      ))}
    </group>
  );
}

function DesertTerrain() {
  const palms = useMemo(
    () => Array.from({ length: 12 }, () => ({
      x: (Math.random() - 0.5) * 40,
      z: -8 - Math.random() * 15, // Push behind stages
      scale: 0.6 + Math.random() * 0.6,
      lean: (Math.random() - 0.5) * 0.15,
    })),
    []
  );

  return (
    <group>
      {/* Background mountains - smoother, more segments */}
      {[
        { pos: [-14, 0, -18] as [number, number, number], r: 6, h: 4 },
        { pos: [12, 0, -20] as [number, number, number], r: 8, h: 6 },
        { pos: [0, 0, -22] as [number, number, number], r: 10, h: 3.5 },
        { pos: [-6, 0, -25] as [number, number, number], r: 12, h: 5 },
        { pos: [8, 0, -24] as [number, number, number], r: 7, h: 4.5 },
      ].map((mt, i) => (
        <mesh key={i} position={mt.pos}>
          <coneGeometry args={[mt.r, mt.h, 16]} />
          <meshStandardMaterial color="#6b5a40" roughness={1} metalness={0} />
        </mesh>
      ))}

      {/* Palm trees - only behind/around stages */}
      {palms.map((p, i) => (
        <group key={i} position={[p.x, 0, p.z]} scale={p.scale} rotation={[0, 0, p.lean]}>
          {/* Trunk - curved */}
          <mesh position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.06, 0.1, 3.6, 8]} />
            <meshStandardMaterial color="#7a6040" roughness={0.9} />
          </mesh>
          {/* Fronds - multiple flat leaves */}
          {[0, 1, 2, 3, 4].map((j) => {
            const a = (j / 5) * Math.PI * 2;
            return (
              <mesh key={j} position={[Math.cos(a) * 0.5, 3.6, Math.sin(a) * 0.5]} rotation={[0.5, a, 0]}>
                <planeGeometry args={[0.3, 1.2]} />
                <meshStandardMaterial color="#3a7a30" roughness={0.8} side={THREE.DoubleSide} />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* Desert scrub / small bushes */}
      {Array.from({ length: 20 }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 10 + Math.random() * 12;
        return (
          <mesh key={i} position={[Math.cos(angle) * dist, 0.15, Math.sin(angle) * dist]}>
            <sphereGeometry args={[0.2 + Math.random() * 0.2, 6, 6]} />
            <meshStandardMaterial color="#5a7a40" roughness={1} />
          </mesh>
        );
      })}
    </group>
  );
}
