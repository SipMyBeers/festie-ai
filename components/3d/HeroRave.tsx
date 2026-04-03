"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { Lasers } from "./effects/Lasers";
import { Particles } from "./effects/Particles";

function RaveStage() {
  const ledRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ledRef.current) return;
    const mat = ledRef.current.material as THREE.MeshStandardMaterial;
    const pulse = Math.sin(clock.elapsedTime * 2) * 0.5 + 0.5;
    mat.emissiveIntensity = 0.5 + pulse * 1.5;
  });

  return (
    <group position={[0, 0, -8]}>
      {/* Main stage structure */}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[12, 5, 1]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* LED screen */}
      <mesh ref={ledRef} position={[0, 2.5, 0.6]}>
        <planeGeometry args={[10, 3.5]} />
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#7c3aed"
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>

      {/* FESTIE.AI text on the marquee */}
      <Text
        position={[0, 4.8, 0.7]}
        fontSize={0.8}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/SpaceGrotesk-Bold.ttf"
        outlineWidth={0.02}
        outlineColor="#7c3aed"
      >
        FESTIE.AI
      </Text>

      {/* Speaker stacks */}
      {[-5.5, 5.5].map((x) => (
        <group key={x} position={[x, 0, 0.5]}>
          {[0.5, 1.5, 2.5, 3.5].map((y) => (
            <mesh key={y} position={[0, y, 0]}>
              <boxGeometry args={[1.2, 0.8, 0.8]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Stage floor */}
      <mesh position={[0, 0, 1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 4]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
      </mesh>
    </group>
  );
}

function CrowdSprites({ count = 60 }: { count?: number }) {
  const positions = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 12,
      z: Math.random() * 6 - 2,
      height: 0.8 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  return (
    <group>
      {positions.map((p, i) => (
        <CrowdPerson key={i} x={p.x} z={p.z} height={p.height} phase={p.phase} />
      ))}
    </group>
  );
}

function CrowdPerson({
  x,
  z,
  height,
  phase,
}: {
  x: number;
  z: number;
  height: number;
  phase: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = Math.sin(clock.elapsedTime * 2 + phase) * 0.05;
  });

  return (
    <group ref={ref} position={[x, height / 2, z]}>
      <Billboard>
        <mesh>
          <planeGeometry args={[0.4, height]} />
          <meshBasicMaterial color="#0a0a0f" transparent opacity={0.85} />
        </mesh>
      </Billboard>
    </group>
  );
}

export function HeroRave() {
  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#0a0a0f" />
      </mesh>

      <RaveStage />
      <CrowdSprites count={60} />
      <Lasers origin={[0, 5, -8]} count={12} spread={6} color="#7c3aed" />
      <Lasers origin={[0, 5, -8]} count={8} spread={5} color="#ec4899" />
      <Particles count={300} area={[15, 8, 15]} color="#ec4899" size={0.02} speed={0.2} />
      <Particles count={100} area={[15, 8, 15]} color="#7c3aed" size={0.04} speed={0.1} />

      {/* Fog */}
      <fog attach="fog" args={["#0a0a0f", 5, 25]} />

      {/* Stage spotlights */}
      <spotLight
        position={[-4, 8, -6]}
        angle={0.4}
        penumbra={0.5}
        intensity={3}
        color="#7c3aed"
      />
      <spotLight
        position={[4, 8, -6]}
        angle={0.4}
        penumbra={0.5}
        intensity={3}
        color="#ec4899"
      />
    </group>
  );
}
