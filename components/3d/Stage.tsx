"use client";

import { useRef, useState } from "react";
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
  const [hovered, setHovered] = useState(false);
  const selectedStageId = useFestieStore((s) => s.selectedStageId);
  const setSelectedStage = useFestieStore((s) => s.setSelectedStage);

  const isLive = currentPerformance !== null;
  const isSelected = selectedStageId === stage.id;

  useFrame(({ clock }) => {
    if (!ledRef.current) return;
    const mat = ledRef.current.material as THREE.MeshStandardMaterial;
    if (isLive) {
      const pulse = Math.sin(clock.elapsedTime * 3) * 0.5 + 0.5;
      mat.emissiveIntensity = 1 + pulse * 2;
    } else {
      mat.emissiveIntensity = 0.1;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    setSelectedStage(isSelected ? null : stage.id);
  };

  return (
    <group ref={groupRef} position={[stage.position.x, stage.position.y, stage.position.z]}>
      {/* Stage structure */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[3, 2.4, 1.5]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* LED screen */}
      <mesh
        ref={ledRef}
        position={[0, 1.2, 0.8]}
        onPointerEnter={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerLeave={() => { setHovered(false); document.body.style.cursor = "default"; }}
        onClick={handleClick}
      >
        <planeGeometry args={[2.6, 1.8]} />
        <meshStandardMaterial
          color={isLive ? stage.color : "#333"}
          emissive={isLive ? stage.color : "#111"}
          emissiveIntensity={isLive ? 2 : 0.1}
          toneMapped={false}
        />
      </mesh>

      {/* Stage name */}
      <Text position={[0, 2.6, 0.8]} fontSize={0.2} color="#ffffff" anchorX="center" anchorY="middle" font="/fonts/SpaceGrotesk-Bold.ttf">
        {stage.name}
      </Text>

      {/* Current/next artist on LED */}
      <Text position={[0, 1.2, 0.85]} fontSize={0.25} color="#ffffff" anchorX="center" anchorY="middle" font="/fonts/SpaceGrotesk-Bold.ttf" maxWidth={2.2}>
        {currentPerformance?.artistName ?? nextPerformance?.artistName ?? ""}
      </Text>

      {/* Speaker stacks */}
      {[-1.8, 1.8].map((x) => (
        <group key={x} position={[x, 0, 0.5]}>
          {[0.3, 0.9, 1.5].map((y) => (
            <mesh key={y} position={[0, y, 0]}>
              <boxGeometry args={[0.5, 0.4, 0.4]} />
              <meshStandardMaterial color="#111" metalness={0.5} roughness={0.5} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Live crowd dots */}
      {isLive && <StageCrowd color={stage.color} />}

      {/* Laser beams when live */}
      {isLive && (
        <>
          {[[-1, 2.5, 0.5], [1, 2.5, 0.5]].map(([x, y, z], i) => (
            <LaserBeam key={i} origin={[x!, y!, z!]} color={stage.color} index={i} />
          ))}
        </>
      )}

      {/* Selection highlight ring */}
      {(hovered || isSelected) && (
        <mesh position={[0, 0.01, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2, 2.3, 32]} />
          <meshBasicMaterial color={stage.color} transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

function StageCrowd({ color }: { color: string }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useRef(
    Float32Array.from(
      Array.from({ length: 30 * 3 }, (_, i) =>
        i % 3 === 0
          ? (Math.random() - 0.5) * 3
          : i % 3 === 1
            ? Math.random() * 0.3
            : Math.random() * 2 + 1.5
      )
    )
  ).current;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < 30; i++) {
      arr[i * 3 + 1] = Math.sin(clock.elapsedTime * 3 + i) * 0.05 + 0.15;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.1} transparent opacity={0.8} />
    </points>
  );
}

function LaserBeam({ origin, color, index }: { origin: number[]; color: string; index: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const angle = clock.elapsedTime * 2 + index * Math.PI;
    ref.current.rotation.z = Math.sin(angle) * 0.5;
    ref.current.visible = Math.sin(clock.elapsedTime * 4 + index) > -0.2;
  });

  return (
    <mesh ref={ref} position={origin as [number, number, number]}>
      <cylinderGeometry args={[0.005, 0.005, 4, 4]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}
