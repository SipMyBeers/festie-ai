"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
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
      {/* Ground disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[30, 64]} />
        <meshStandardMaterial color={terrainColor} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Skip terrain features at planet scale — they clip through the sphere */}

      {/* Coachella-specific landmarks */}
      <FerrisWheel />
      <ArtInstallations />
      <FoodCourt />
      <StringLights />

      {/* Stages */}
      {festival.stages.map((stage) => (
        <Stage
          key={stage.id}
          stage={stage}
          currentPerformance={getCurrentPerformance(stage.schedule)}
          nextPerformance={getNextPerformance(stage.schedule)}
        />
      ))}

      {/* All amenities: water, restrooms, parking, medical, charging, merch, camping, entrance */}
      <Amenities />

      {/* Wandering crowd between stages */}
      <WanderingCrowd />

      {/* Warm festival lighting */}
      <ambientLight intensity={0.4} color="#ffeedd" />
      <directionalLight position={[15, 20, 10]} intensity={0.8} color="#ffddbb" />
      <directionalLight position={[-10, 5, -15]} intensity={0.3} color="#ff6633" />
      {/* Ground lights between stages */}
      {[
        [0, 0.1, 5], [-6, 0.1, 8], [6, 0.1, 8],
        [0, 0.1, 14], [-10, 0.1, 3], [10, 0.1, 3],
      ].map((pos, i) => (
        <pointLight key={i} position={pos as [number, number, number]} color="#ff9944" intensity={2} distance={12} decay={2} />
      ))}
    </group>
  );
}

// ---- FERRIS WHEEL ----
function FerrisWheel() {
  const wheelRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (wheelRef.current) {
      wheelRef.current.rotation.z = clock.elapsedTime * 0.15;
    }
  });

  return (
    <group position={[5, 0, 6]}>
      {/* Center post */}
      <mesh position={[0, 5, 0]}>
        <cylinderGeometry args={[0.15, 0.3, 10, 8]} />
        <meshStandardMaterial color="#888" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Support legs */}
      {[-1.5, 1.5].map((x) => (
        <mesh key={x} position={[x, 2.5, 0]} rotation={[0, 0, x > 0 ? -0.15 : 0.15]}>
          <cylinderGeometry args={[0.1, 0.15, 5.5, 6]} />
          <meshStandardMaterial color="#777" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      {/* Rotating wheel */}
      <group ref={wheelRef} position={[0, 5, 0]}>
        {/* Rim */}
        <mesh>
          <torusGeometry args={[3.5, 0.08, 8, 32]} />
          <meshStandardMaterial color="#aaa" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Spokes */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <mesh key={i} rotation={[0, 0, angle]}>
              <boxGeometry args={[0.04, 7, 0.04]} />
              <meshStandardMaterial color="#999" metalness={0.7} roughness={0.3} />
            </mesh>
          );
        })}
        {/* Gondolas */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const x = Math.cos(angle) * 3.5;
          const y = Math.sin(angle) * 3.5;
          const colors = ["#ff4444", "#4488ff", "#ffaa00", "#44ff44", "#ff44ff", "#44ffff",
                          "#ff8844", "#8844ff", "#ff4488", "#88ff44", "#4444ff", "#ffff44"];
          return (
            <mesh key={i} position={[x, y, 0]}>
              <boxGeometry args={[0.3, 0.4, 0.3]} />
              <meshStandardMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={0.3} />
            </mesh>
          );
        })}
      </group>
      {/* Lights on the wheel */}
      <pointLight position={[0, 5, 1]} color="#ffaa44" intensity={2} distance={8} decay={2} />
    </group>
  );
}

// ---- ART INSTALLATIONS ----
function ArtInstallations() {
  return (
    <group>
      {/* Giant balloon-like sculpture */}
      <group position={[-5, 0, 10]}>
        <mesh position={[0, 2, 0]}>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshStandardMaterial color="#ff6b9d" emissive="#ff6b9d" emissiveIntensity={0.2} metalness={0.3} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 1, 8]} />
          <meshStandardMaterial color="#888" metalness={0.6} />
        </mesh>
      </group>

      {/* Neon arch gateway */}
      <group position={[0, 0, 18]}>
        <mesh position={[-2, 2.5, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 5, 8]} />
          <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[2, 2.5, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 5, 8]} />
          <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 4.2, 8]} />
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Glowing pyramid */}
      <group position={[12, 0, 12]}>
        <mesh position={[0, 1.5, 0]}>
          <coneGeometry args={[1.5, 3, 4]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.3} transparent opacity={0.7} />
        </mesh>
        <pointLight position={[0, 1.5, 0]} color="#06b6d4" intensity={2} distance={6} decay={2} />
      </group>

      {/* Tall totems/flags */}
      {[[-15, 0, 5], [15, 0, 5], [-10, 0, 15], [10, 0, 15]].map((pos, i) => {
        const colors = ["#f97316", "#7c3aed", "#ec4899", "#06b6d4"];
        return (
          <group key={i} position={pos as [number, number, number]}>
            <mesh position={[0, 3, 0]}>
              <cylinderGeometry args={[0.05, 0.08, 6, 6]} />
              <meshStandardMaterial color="#aaa" metalness={0.5} />
            </mesh>
            {/* Flag/banner */}
            <mesh position={[0.4, 5, 0]}>
              <planeGeometry args={[0.8, 1.2]} />
              <meshStandardMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={0.2} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ---- FOOD COURT ----
function FoodCourt() {
  // Row of food stalls between stages
  const stalls = useMemo(() => [
    { pos: [-3, 0, 3] as [number, number, number], color: "#f97316", name: "Tacos" },
    { pos: [-1, 0, 3] as [number, number, number], color: "#ef4444", name: "Pizza" },
    { pos: [1, 0, 3] as [number, number, number], color: "#22c55e", name: "Vegan" },
    { pos: [3, 0, 3] as [number, number, number], color: "#3b82f6", name: "Drinks" },
  ], []);

  return (
    <group>
      {stalls.map((stall, i) => (
        <group key={i} position={stall.pos}>
          {/* Stall structure */}
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[1.5, 1.6, 1]} />
            <meshStandardMaterial color="#ddd" roughness={0.8} />
          </mesh>
          {/* Awning */}
          <mesh position={[0, 1.7, 0.3]}>
            <boxGeometry args={[1.8, 0.1, 1.4]} />
            <meshStandardMaterial color={stall.color} />
          </mesh>
          {/* Counter light */}
          <pointLight position={[0, 1.5, 0.5]} color="#ffeecc" intensity={0.5} distance={3} decay={2} />
        </group>
      ))}
      {/* People queuing at food stalls - simple points */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(Array.from({ length: 12 * 3 }, (_, i) => {
              const idx = Math.floor(i / 3);
              const axis = i % 3;
              const stall = stalls[idx % stalls.length];
              if (axis === 0) return stall.pos[0] + (Math.random() - 0.5) * 0.8;
              if (axis === 1) return 0.2 + Math.random() * 0.2;
              return stall.pos[2] + 1.2 + Math.random() * 1.5;
            })), 3]}
          />
        </bufferGeometry>
        <pointsMaterial color="#ffddbb" size={0.15} transparent opacity={0.8} sizeAttenuation />
      </points>
    </group>
  );
}

// ---- PATHWAYS ----
function Pathways() {
  return (
    <group>
      {/* Main paths connecting stages - slightly lighter sand */}
      {[
        { from: [0, 0.02, -6], to: [0, 0.02, 18], width: 1.5 },
        { from: [-14, 0.02, 3], to: [14, 0.02, 3], width: 1.2 },
        { from: [-10, 0.02, 3], to: [-8, 0.02, 14], width: 1 },
        { from: [10, 0.02, 3], to: [8, 0.02, 14], width: 1 },
      ].map((path, i) => {
        const from = new THREE.Vector3(...(path.from as [number, number, number]));
        const to = new THREE.Vector3(...(path.to as [number, number, number]));
        const mid = from.clone().add(to).multiplyScalar(0.5);
        const length = from.distanceTo(to);
        const angle = Math.atan2(to.x - from.x, to.z - from.z);
        return (
          <mesh key={i} position={[mid.x, 0.02, mid.z]} rotation={[-Math.PI / 2, 0, -angle]}>
            <planeGeometry args={[path.width, length]} />
            <meshStandardMaterial color="#e0c070" roughness={0.95} metalness={0} transparent opacity={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}

// ---- STRING LIGHTS ----
function StringLights() {
  const lights = useMemo(() => {
    const points: [number, number, number][] = [];
    // Large arc around the festival
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 1.8 - Math.PI * 0.9;
      const r = 18 + Math.sin(i * 0.4) * 2;
      points.push([Math.cos(angle) * r, 2.8 + Math.sin(i * 0.6) * 0.5, Math.sin(angle) * r]);
    }
    // Inner ring connecting stages
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const r = 8;
      points.push([Math.cos(angle) * r, 2.2 + Math.sin(i * 0.8) * 0.3, Math.sin(angle) * r + 5]);
    }
    return points;
  }, []);

  return (
    <group>
      {lights.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshBasicMaterial color="#ffcc55" transparent opacity={0.9} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
      {lights.filter((_, i) => i % 4 === 0).map((pos, i) => (
        <pointLight key={i} position={pos} color="#ffaa33" intensity={0.4} distance={4} decay={2} />
      ))}
    </group>
  );
}

// ---- WANDERING CROWD ----
function WanderingCrowd() {
  const positions = useMemo(() => {
    const arr = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = 0.15 + Math.random() * 0.3;
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

// ---- DESERT TERRAIN ----
function DesertTerrain() {
  const palms = useMemo(
    () => Array.from({ length: 20 }, () => ({
      x: (Math.random() - 0.5) * 80,
      z: -20 - Math.random() * 30,
      scale: 0.7 + Math.random() * 0.5,
      lean: (Math.random() - 0.5) * 0.12,
    })),
    []
  );

  return (
    <group>
      {/* Background mountains - Indio mountain range */}
      {[
        { pos: [-30, 0, -40] as [number, number, number], r: 12, h: 9 },
        { pos: [25, 0, -45] as [number, number, number], r: 16, h: 12 },
        { pos: [0, 0, -50] as [number, number, number], r: 20, h: 8 },
        { pos: [-15, 0, -48] as [number, number, number], r: 22, h: 10 },
        { pos: [18, 0, -42] as [number, number, number], r: 14, h: 9 },
        { pos: [35, 0, -48] as [number, number, number], r: 13, h: 7 },
        { pos: [-35, 0, -44] as [number, number, number], r: 15, h: 8 },
        { pos: [-5, 0, -55] as [number, number, number], r: 25, h: 6 },
      ].map((mt, i) => (
        <mesh key={i} position={mt.pos}>
          <coneGeometry args={[mt.r, mt.h, 24]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#6b5a40" : "#7a6848"} roughness={1} metalness={0} />
        </mesh>
      ))}

      {/* Palm trees along the perimeter */}
      {palms.map((p, i) => (
        <group key={i} position={[p.x, 0, p.z]} scale={p.scale} rotation={[0, 0, p.lean]}>
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[0.06, 0.1, 4, 8]} />
            <meshStandardMaterial color="#7a6040" roughness={0.9} />
          </mesh>
          {[0, 1, 2, 3, 4, 5].map((j) => {
            const a = (j / 6) * Math.PI * 2;
            return (
              <mesh key={j} position={[Math.cos(a) * 0.6, 4.2, Math.sin(a) * 0.6]} rotation={[0.6, a, 0]}>
                <planeGeometry args={[0.3, 1.5]} />
                <meshStandardMaterial color="#3a7a30" roughness={0.8} side={THREE.DoubleSide} />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* Desert scrub scattered around */}
      {Array.from({ length: 30 }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 20 + Math.random() * 25;
        return (
          <mesh key={i} position={[Math.cos(angle) * dist, 0.12, Math.sin(angle) * dist]}>
            <sphereGeometry args={[0.15 + Math.random() * 0.2, 6, 6]} />
            <meshStandardMaterial color="#5a7a40" roughness={1} />
          </mesh>
        );
      })}
    </group>
  );
}
