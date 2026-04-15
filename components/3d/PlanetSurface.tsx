"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
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
      {/* Ground — larger to accommodate mountains */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[55, 64]} />
        <meshStandardMaterial color="#c4a060" roughness={0.9} metalness={0.02} />
      </mesh>

      {/* Festival grounds inner area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[30, 48]} />
        <meshStandardMaterial color={terrainColor} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Surrounding mountains */}
      <MountainRanges />

      {/* Compass labels */}
      <CompassLabels />

      {/* Paths connecting areas */}
      <Pathways />

      {/* Landscape */}
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

      {/* Crowd */}
      <WanderingCrowd />

      {/* String lights */}
      <StringLights />

      {/* Lighting */}
      <ambientLight intensity={0.5} color="#ffeedd" />
      <directionalLight position={[15, 20, 10]} intensity={0.8} color="#ffddbb" />
      <directionalLight position={[-10, 5, -15]} intensity={0.2} color="#ff8844" />
    </group>
  );
}

// ---- MOUNTAIN RANGES ----
function MountainRanges() {
  return (
    <group>
      {/* San Bernardino Mountains — NORTH (-Z) */}
      <MountainRange
        label="San Bernardino Mtns"
        baseZ={-42}
        baseX={0}
        spread={60}
        count={14}
        direction="north"
        color="#6b5a4a"
        snowColor="#d4cfc8"
      />

      {/* Santa Rosa Mountains — SOUTH/EAST (+Z, +X) */}
      <MountainRange
        label="Santa Rosa Mtns"
        baseZ={38}
        baseX={15}
        spread={50}
        count={12}
        direction="southeast"
        color="#7a6a55"
        snowColor="#ccc5bb"
      />

      {/* Little San Bernardino — WEST (-X) */}
      <MountainRange
        label="Little San Bernardino"
        baseZ={0}
        baseX={-42}
        spread={55}
        count={11}
        direction="west"
        color="#6d5d4d"
        snowColor="#d0c9c0"
      />
    </group>
  );
}

interface MountainRangeProps {
  label: string;
  baseX: number;
  baseZ: number;
  spread: number;
  count: number;
  direction: "north" | "southeast" | "west";
  color: string;
  snowColor: string;
}

function MountainRange({ baseX, baseZ, spread, count, direction, color, snowColor }: MountainRangeProps) {
  const mountains = useMemo(() => {
    const peaks: { x: number; z: number; height: number; radius: number }[] = [];
    for (let i = 0; i < count; i++) {
      const t = (i / (count - 1)) - 0.5; // -0.5 to 0.5
      let x: number, z: number;

      if (direction === "north") {
        x = baseX + t * spread;
        z = baseZ + (Math.random() - 0.5) * 8;
      } else if (direction === "southeast") {
        x = baseX + t * spread * 0.6;
        z = baseZ + t * spread * 0.4 + (Math.random() - 0.5) * 8;
      } else {
        // west
        x = baseX + (Math.random() - 0.5) * 8;
        z = baseZ + t * spread;
      }

      const height = 6 + Math.random() * 8;
      const radius = 4 + Math.random() * 4;
      peaks.push({ x, z, height, radius });
    }
    return peaks;
  }, [baseX, baseZ, spread, count, direction]);

  return (
    <group>
      {mountains.map((peak, i) => (
        <group key={i} position={[peak.x, 0, peak.z]}>
          {/* Mountain body */}
          <mesh position={[0, peak.height / 2, 0]}>
            <coneGeometry args={[peak.radius, peak.height, 7, 1]} />
            <meshStandardMaterial color={color} roughness={0.9} flatShading />
          </mesh>
          {/* Snow cap on taller peaks */}
          {peak.height > 9 && (
            <mesh position={[0, peak.height * 0.85, 0]}>
              <coneGeometry args={[peak.radius * 0.3, peak.height * 0.3, 7, 1]} />
              <meshStandardMaterial color={snowColor} roughness={0.7} flatShading />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

// ---- COMPASS LABELS ----
function CompassLabels() {
  const labelStyle = {
    fontSize: 1.8,
    color: "#ffffff",
    anchorX: "center" as const,
    anchorY: "middle" as const,
    font: "/fonts/SpaceGrotesk-Bold.ttf",
    outlineWidth: 0.06,
    outlineColor: "#000000",
  };

  return (
    <group>
      {/* N */}
      <Text position={[0, 8, -48]} {...labelStyle}>
        N
      </Text>
      <Text position={[0, 5.5, -48]} fontSize={0.6} color="#ffffff99" anchorX="center" anchorY="middle" font="/fonts/SpaceGrotesk-Bold.ttf">
        San Bernardino Mtns
      </Text>

      {/* S */}
      <Text position={[10, 8, 46]} {...labelStyle}>
        S
      </Text>
      <Text position={[10, 5.5, 46]} fontSize={0.6} color="#ffffff99" anchorX="center" anchorY="middle" font="/fonts/SpaceGrotesk-Bold.ttf">
        Santa Rosa Mtns
      </Text>

      {/* E */}
      <Text position={[32, 6, 0]} {...labelStyle} rotation={[0, -Math.PI / 2, 0]}>
        E
      </Text>

      {/* W */}
      <Text position={[-48, 8, 0]} {...labelStyle} rotation={[0, Math.PI / 2, 0]}>
        W
      </Text>
      <Text position={[-48, 5.5, 0]} fontSize={0.6} color="#ffffff99" anchorX="center" anchorY="middle" font="/fonts/SpaceGrotesk-Bold.ttf" rotation={[0, Math.PI / 2, 0]}>
        Little San Bernardino
      </Text>

      {/* Compass rose on ground */}
      <group position={[22, 0.05, -22]} rotation={[-Math.PI / 2, 0, 0]}>
        {/* N arrow */}
        <mesh position={[0, 1.2, 0]}>
          <coneGeometry args={[0.4, 1.2, 3]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        {/* S arrow */}
        <mesh position={[0, -1.2, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.3, 1, 3]} />
          <meshBasicMaterial color="#ffffff55" />
        </mesh>
        {/* Circle */}
        <mesh>
          <ringGeometry args={[1.6, 1.8, 16]} />
          <meshBasicMaterial color="#ffffff33" side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

// ---- PATHWAYS ----
function Pathways() {
  // Updated to match real venue layout
  const paths = [
    // Main north-south spine (entrance to Coachella Stage)
    { from: [-18, 6], to: [0, -18], width: 1.5 },
    // East connector (to Outdoor Theatre)
    { from: [0, -12], to: [14, -16], width: 1.2 },
    // To Sonora / Gobi area
    { from: [2, -6], to: [14, -2], width: 1 },
    { from: [10, -2], to: [12, 6], width: 0.8 },
    // To Sahara (south)
    { from: [-4, 2], to: [-12, 16], width: 1 },
    // To Yuma (west)
    { from: [-6, -4], to: [-14, -8], width: 1 },
    // To Quasar / Do LaB area
    { from: [-4, 4], to: [-4, 10], width: 0.8 },
    // Entrance road
    { from: [-18, 6], to: [-24, 10], width: 1.5 },
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

// ---- STRING LIGHTS ----
function StringLights() {
  const positions = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 1.8 - Math.PI * 0.9;
      const r = 22 + Math.sin(i * 0.4) * 2;
      pts.push(Math.cos(angle) * r, 2.5 + Math.sin(i * 0.6) * 0.4, Math.sin(angle) * r);
    }
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      pts.push(Math.cos(angle) * 10, 2 + Math.sin(i * 0.8) * 0.3, Math.sin(angle) * 10);
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
    const arr = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 35;
      arr[i * 3 + 1] = 0.15 + Math.random() * 0.25;
      arr[i * 3 + 2] = (Math.random() - 0.3) * 35;
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
    () => Array.from({ length: 18 }, () => ({
      x: (Math.random() - 0.5) * 60,
      z: (Math.random() - 0.5) * 60,
      scale: 0.6 + Math.random() * 0.5,
    })).filter((p) => {
      const dist = Math.sqrt(p.x * p.x + p.z * p.z);
      return dist > 20 && dist < 40;
    }),
    []
  );

  return (
    <group>
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

      {/* Desert scrub */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(Array.from({ length: 60 * 3 }, (_, i) => {
              const idx = Math.floor(i / 3);
              const axis = i % 3;
              const angle = (idx / 60) * Math.PI * 2 + Math.random() * 0.5;
              const dist = 22 + Math.random() * 15;
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
