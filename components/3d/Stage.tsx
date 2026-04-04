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
        <meshStandardMaterial color="#222" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Back wall with LED */}
      <mesh position={[0, 1.5, -1.2]}>
        <boxGeometry args={[3.8, 2.4, 0.2]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.4} />
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
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Side pillars */}
      {[-1.9, 1.9].map((x) => (
        <mesh key={x} position={[x, 1.5, 0.3]}>
          <boxGeometry args={[0.15, 3, 0.15]} />
          <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} />
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
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spread crowd in a semi-circle in front of the stage
      const angle = (Math.random() - 0.5) * Math.PI * 0.8;
      const dist = 1 + Math.random() * 3;
      arr[i * 3] = Math.sin(angle) * dist;         // x
      arr[i * 3 + 1] = 0.2 + Math.random() * 0.6;  // y (varying heights = heads)
      arr[i * 3 + 2] = Math.cos(angle) * dist;      // z (in front of stage)
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      // Bobbing animation - each person at different phase
      arr[i * 3 + 1] = 0.2 + Math.random() * 0.1 + Math.sin(clock.elapsedTime * 3 + i * 0.5) * 0.08;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.15}
        transparent
        opacity={0.9}
        sizeAttenuation
      />
    </points>
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
