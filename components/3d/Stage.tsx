"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { Stage as StageType, Performance } from "@/lib/types";
import { useFestieStore } from "@/lib/store";

interface StageProps {
  stage: StageType;
  currentPerformance: Performance | null;
  nextPerformance: Performance | null;
}

export function Stage({ stage, currentPerformance, nextPerformance }: StageProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ledRef = useRef<THREE.Mesh>(null);
  const setSelectedStage = useFestieStore((s) => s.setSelectedStage);
  const selectedStageId = useFestieStore((s) => s.selectedStageId);

  const isLive = currentPerformance !== null;
  const isSelected = selectedStageId === stage.id;
  const displayArtist = currentPerformance?.artistName ?? nextPerformance?.artistName ?? "";

  useFrame(({ clock }) => {
    if (!ledRef.current) return;
    const mat = ledRef.current.material as THREE.MeshStandardMaterial;
    if (isLive) {
      const pulse = Math.sin(clock.elapsedTime * 2) * 0.3 + 0.7;
      mat.emissiveIntensity = 1.5 + pulse;
    } else {
      mat.emissiveIntensity = 0.4;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    setSelectedStage(isSelected ? null : stage.id);
  };

  return (
    <group ref={groupRef} position={[stage.position.x, stage.position.y, stage.position.z]}>
      {/* Stage platform / base */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[4, 0.3, 3]} />
        <meshStandardMaterial color="#444" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Back wall with LED */}
      <mesh position={[0, 1.5, -1.2]}>
        <boxGeometry args={[3.8, 2.4, 0.2]} />
        <meshStandardMaterial color="#555" metalness={0.3} roughness={0.5} />
      </mesh>

      {/* LED screen - bright and colorful */}
      <mesh
        ref={ledRef}
        position={[0, 1.5, -1.05]}
        onPointerEnter={() => { document.body.style.cursor = "pointer"; }}
        onPointerLeave={() => { document.body.style.cursor = "default"; }}
        onClick={handleClick}
      >
        <planeGeometry args={[3.4, 2]} />
        <meshStandardMaterial
          color={stage.color}
          emissive={stage.color}
          emissiveIntensity={isLive ? 2 : 0.4}
          toneMapped={false}
        />
      </mesh>

      {/* Truss / roof structure */}
      <mesh position={[0, 2.9, -0.5]}>
        <boxGeometry args={[4.2, 0.15, 2.5]} />
        <meshStandardMaterial color="#666" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Side pillars */}
      {[-1.9, 1.9].map((x) => (
        <mesh key={x} position={[x, 1.5, 0.3]}>
          <boxGeometry args={[0.15, 3, 0.15]} />
          <meshStandardMaterial color="#777" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}

      {/* Stage name on top */}
      <Text
        position={[0, 3.2, -0.5]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/SpaceGrotesk-Bold.ttf"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {stage.name}
      </Text>

      {/* Artist name on LED */}
      <Text
        position={[0, 1.5, -1]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/SpaceGrotesk-Bold.ttf"
        maxWidth={3}
      >
        {displayArtist}
      </Text>

      {/* Speaker stacks - darker, more visible */}
      {[-2.2, 2.2].map((x) => (
        <group key={x} position={[x, 0, -0.5]}>
          {[0.3, 0.8, 1.3].map((y) => (
            <mesh key={y} position={[0, y, 0]}>
              <boxGeometry args={[0.6, 0.4, 0.5]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.4} roughness={0.6} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Stage lights (colored spotlights) */}
      <pointLight
        position={[0, 2.8, 0]}
        color={stage.color}
        intensity={isLive ? 5 : 1}
        distance={8}
        decay={2}
      />

      {/* Ground glow under stage */}
      <mesh position={[0, 0.02, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3, 32]} />
        <meshBasicMaterial
          color={stage.color}
          transparent
          opacity={isLive ? 0.15 : 0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Crowd - spread out in front of stage */}
      <StageCrowd color={stage.color} count={isLive ? 80 : 30} />

      {/* Laser beams when live */}
      {isLive && (
        <>
          {[[-1.5, 2.8, -1], [1.5, 2.8, -1], [0, 2.8, -1]].map((pos, i) => (
            <LaserBeam key={i} origin={pos} color={stage.color} index={i} />
          ))}
        </>
      )}

      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0.03, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.5, 3.8, 32]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

function StageCrowd({ color, count = 50 }: { color: string; count?: number }) {
  const people = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (Math.random() - 0.5) * Math.PI * 0.7;
      const dist = 1.5 + Math.random() * 2.5;
      return {
        x: Math.sin(angle) * dist,
        z: Math.cos(angle) * dist,
        height: 0.4 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2,
        shade: Math.random() * 0.3,
      };
    });
  }, [count]);

  return (
    <group>
      {people.map((p, i) => (
        <CrowdPerson key={i} x={p.x} z={p.z} height={p.height} phase={p.phase} shade={p.shade} color={color} />
      ))}
    </group>
  );
}

function CrowdPerson({ x, z, height, phase, shade, color }: {
  x: number; z: number; height: number; phase: number; shade: number; color: string;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = Math.sin(clock.elapsedTime * 2.5 + phase) * 0.04;
  });

  // Mix between warm skin-like tones and the stage color
  const bodyColor = shade > 0.2 ? "#2a2a3a" : shade > 0.1 ? "#3a3a4a" : "#4a4a5a";

  return (
    <group ref={ref} position={[x, 0, z]}>
      {/* Body - thin tall capsule */}
      <mesh position={[0, height * 0.5, 0]}>
        <capsuleGeometry args={[0.06, height, 4, 8]} />
        <meshStandardMaterial color={bodyColor} roughness={0.9} />
      </mesh>
      {/* Head */}
      <mesh position={[0, height + 0.1, 0]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#ddb89a" roughness={0.8} />
      </mesh>
    </group>
  );
}

function LaserBeam({ origin, color, index }: { origin: number[]; color: string; index: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * 1.5 + index * 2;
    ref.current.rotation.x = Math.sin(t) * 0.4;
    ref.current.rotation.z = Math.cos(t * 0.7) * 0.3;
    ref.current.visible = Math.sin(clock.elapsedTime * 3 + index) > -0.5;
  });

  return (
    <mesh ref={ref} position={origin as [number, number, number]}>
      <cylinderGeometry args={[0.01, 0.01, 6, 4]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
