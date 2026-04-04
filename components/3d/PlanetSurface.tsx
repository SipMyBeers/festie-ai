"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Festival, Performance } from "@/lib/types";
import { Stage } from "./Stage";
import { Amenities } from "./Amenities";

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
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[35, 48]} />
        <meshStandardMaterial color={terrainColor} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Paths connecting areas */}
      <Pathways />

      {/* Landscape — palms and scrub for desert */}
      {festival.terrainType === "desert" && <DesertLandscape />}

      {/* Stages */}
      {festival.stages.map((stage) => (
        <Stage
          key={stage.id}
          stage={stage}
          currentPerformance={getCurrentPerformance(stage.schedule)}
          nextPerformance={getNextPerformance(stage.schedule)}
        />
      ))}

      {/* Amenities */}
      <Amenities />

      {/* Crowd — single points buffer */}
      <WanderingCrowd />

      {/* String lights — single points buffer (no individual meshes) */}
      <StringLights />

      {/* Lighting — minimal pointLights for performance */}
      <ambientLight intensity={0.5} color="#ffeedd" />
      <directionalLight position={[15, 20, 10]} intensity={0.8} color="#ffddbb" />
      <directionalLight position={[-10, 5, -15]} intensity={0.2} color="#ff8844" />
    </group>
  );
}

// ---- PATHWAYS ----
function Pathways() {
  // Paths as simple planes — barely any geometry
  const paths = [
    // Main north-south spine
    { from: [0, -14], to: [0, 28], width: 1.5 },
    // East-west connector through middle
    { from: [-18, 0], to: [18, 0], width: 1.2 },
    // To Gobi/Mojave
    { from: [-6, 4], to: [-10, 12], width: 0.8 },
    { from: [6, 4], to: [10, 12], width: 0.8 },
    // To parking/entrance
    { from: [-4, 18], to: [-12, 22], width: 0.8 },
    { from: [4, 18], to: [12, 24], width: 0.8 },
  ];

  return (
    <group>
      {paths.map((p, i) => {
        const dx = p.to[0] - p.from[0];
        const dz = p.to[1] - p.from[1];
        const length = Math.sqrt(dx * dx + dz * dz);
        const mx = (p.from[0] + p.to[0]) / 2;
        const mz = (p.from[1] + p.to[1]) / 2;
        const angle = Math.atan2(dx, dz);
        return (
          <mesh key={i} position={[mx, 0.02, mz]} rotation={[-Math.PI / 2, 0, -angle]}>
            <planeGeometry args={[p.width, length]} />
            <meshStandardMaterial color="#e0c070" roughness={0.95} transparent opacity={0.35} />
          </mesh>
        );
      })}
    </group>
  );
}

// ---- STRING LIGHTS — as a single points buffer ----
function StringLights() {
  const positions = useMemo(() => {
    const pts: number[] = [];
    // Outer arc
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 1.8 - Math.PI * 0.9;
      const r = 20 + Math.sin(i * 0.4) * 2;
      pts.push(Math.cos(angle) * r, 2.5 + Math.sin(i * 0.6) * 0.4, Math.sin(angle) * r);
    }
    // Inner ring
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      pts.push(Math.cos(angle) * 8, 2 + Math.sin(i * 0.8) * 0.3, Math.sin(angle) * 8 + 5);
    }
    return new Float32Array(pts);
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffcc55" size={0.2} transparent opacity={0.9} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

// ---- WANDERING CROWD ----
function WanderingCrowd() {
  const positions = useMemo(() => {
    const arr = new Float32Array(80 * 3);
    for (let i = 0; i < 80; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 28;
      arr[i * 3 + 1] = 0.15 + Math.random() * 0.25;
      arr[i * 3 + 2] = (Math.random() - 0.2) * 25;
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffddbb" size={0.15} transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

// ---- DESERT LANDSCAPE ----
function DesertLandscape() {
  const palms = useMemo(
    () => Array.from({ length: 12 }, () => ({
      x: (Math.random() - 0.5) * 50,
      z: -12 + (Math.random() - 0.5) * 40,
      scale: 0.6 + Math.random() * 0.5,
    })).filter((p) => {
      // Keep palms away from the festival center
      const dist = Math.sqrt(p.x * p.x + p.z * p.z);
      return dist > 15;
    }),
    []
  );

  return (
    <group>
      {/* Palm trees — simple: cylinder trunk + 4 plane fronds */}
      {palms.map((p, i) => (
        <group key={i} position={[p.x, 0, p.z]} scale={p.scale}>
          <mesh position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.06, 0.1, 3.6, 6]} />
            <meshStandardMaterial color="#7a6040" roughness={0.9} />
          </mesh>
          {[0, 1, 2, 3].map((j) => {
            const a = (j / 4) * Math.PI * 2;
            return (
              <mesh key={j} position={[Math.cos(a) * 0.5, 3.8, Math.sin(a) * 0.5]} rotation={[0.5, a, 0]}>
                <planeGeometry args={[0.25, 1.2]} />
                <meshStandardMaterial color="#3a7a30" roughness={0.8} side={THREE.DoubleSide} />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* Desert scrub — single points buffer */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(Array.from({ length: 40 * 3 }, (_, i) => {
              const idx = Math.floor(i / 3);
              const axis = i % 3;
              const angle = (idx / 40) * Math.PI * 2 + Math.random() * 0.5;
              const dist = 18 + Math.random() * 12;
              if (axis === 0) return Math.cos(angle) * dist;
              if (axis === 1) return 0.1;
              return Math.sin(angle) * dist;
            })), 3]}
          />
        </bufferGeometry>
        <pointsMaterial color="#5a7a40" size={0.4} transparent opacity={0.6} sizeAttenuation />
      </points>
    </group>
  );
}
