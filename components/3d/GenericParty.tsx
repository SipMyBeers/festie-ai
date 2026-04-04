"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { Festival } from "@/lib/types";

interface GenericPartyProps {
  festival: Festival;
}

export function GenericParty({ festival }: GenericPartyProps) {
  const lightsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (lightsRef.current) {
      lightsRef.current.rotation.y = clock.elapsedTime * 0.2;
    }
  });

  return (
    <group>
      {/* Ground disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[8, 64]} />
        <meshStandardMaterial
          color={festival.planetColor}
          roughness={0.9}
          metalness={0}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Festival name */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.8}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/SpaceGrotesk-Bold.ttf"
        outlineWidth={0.03}
        outlineColor={festival.planetColor}
      >
        {festival.name}
      </Text>

      {festival.comingSoon && (
        <Text
          position={[0, 3, 0]}
          fontSize={0.35}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/SpaceGrotesk-Bold.ttf"
          fillOpacity={0.5}
        >
          Coming Soon
        </Text>
      )}

      <Text
        position={[0, 2.3, 0]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/SpaceGrotesk-Bold.ttf"
        fillOpacity={0.4}
      >
        {festival.location.city}, {festival.location.country} — {festival.dates.start}
      </Text>

      {/* Rotating light beams */}
      <group ref={lightsRef}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i / 6) * Math.PI * 2;
          const x = Math.cos(angle) * 3;
          const z = Math.sin(angle) * 3;
          return (
            <mesh key={i} position={[x, 2, z]}>
              <cylinderGeometry args={[0.02, 0.02, 5, 4]} />
              <meshBasicMaterial
                color={festival.planetColor}
                transparent
                opacity={0.3}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          );
        })}
      </group>

      <pointLight position={[0, 1, 0]} color={festival.planetColor} intensity={3} distance={15} decay={2} />

      {/* Genre tags floating around */}
      {festival.genreTags.slice(0, 4).map((tag, i) => {
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const x = Math.cos(angle) * 4.5;
        const z = Math.sin(angle) * 4.5;
        return (
          <Text
            key={tag}
            position={[x, 0.5, z]}
            fontSize={0.2}
            color={festival.planetColor}
            anchorX="center"
            anchorY="middle"
            font="/fonts/SpaceGrotesk-Bold.ttf"
            fillOpacity={0.5}
          >
            {tag}
          </Text>
        );
      })}

      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 10, 5]} intensity={0.5} color="#ffffff" />
    </group>
  );
}
