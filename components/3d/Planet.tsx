"use client";

import { useRef, useState, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text, Html } from "@react-three/drei";
import * as THREE from "three";
import { Festival } from "@/lib/types";
import { useFestieStore } from "@/lib/store";
import { AtmosphereGlow } from "./effects/AtmosphereGlow";

interface PlanetProps {
  festival: Festival;
  orbitRadius: number;
  orbitSpeed: number;
  startAngle: number;
}

export function Planet({
  festival,
  orbitRadius,
  orbitSpeed,
  startAngle,
}: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const hoveredPlanet = useFestieStore((s) => s.hoveredPlanetSlug);
  const setHoveredPlanet = useFestieStore((s) => s.setHoveredPlanet);
  const setSelectedPlanet = useFestieStore((s) => s.setSelectedPlanet);
  const setCameraMode = useFestieStore((s) => s.setCameraMode);
  const setPlanetPosition = useFestieStore((s) => s.setPlanetPosition);

  const size = (festival.popularityScore / 100) * 1.5 + 0.5;
  const isLive = festival.status === "live";

  // Track last reported position to avoid spamming store updates
  const lastReportedPos = useRef<[number, number, number]>([0, 0, 0]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const angle = startAngle + clock.elapsedTime * orbitSpeed;
    groupRef.current.position.x = Math.cos(angle) * orbitRadius;
    groupRef.current.position.z = Math.sin(angle) * orbitRadius;
    groupRef.current.position.y = Math.sin(angle * 2) * orbitRadius * 0.05;

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }

    // Update planet position in store (throttled — only when moved significantly)
    const pos = groupRef.current.position;
    const dx = pos.x - lastReportedPos.current[0];
    const dy = pos.y - lastReportedPos.current[1];
    const dz = pos.z - lastReportedPos.current[2];
    if (dx * dx + dy * dy + dz * dz > 0.01) {
      const newPos: [number, number, number] = [pos.x, pos.y, pos.z];
      lastReportedPos.current = newPos;
      setPlanetPosition(festival.slug, newPos);
    }
  });

  const handlePointerEnter = useCallback(() => {
    setHovered(true);
    setHoveredPlanet(festival.slug);
    document.body.style.cursor = "pointer";
  }, [festival.slug, setHoveredPlanet]);

  const handlePointerLeave = useCallback(() => {
    setHovered(false);
    setHoveredPlanet(null);
    document.body.style.cursor = "default";
  }, [setHoveredPlanet]);

  const handleClick = useCallback(() => {
    setSelectedPlanet(festival.slug);
    setCameraMode("flying-in");
  }, [festival.slug, setSelectedPlanet, setCameraMode]);

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        scale={hovered ? 1.15 : 1}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={festival.planetColor}
          emissive={festival.planetColor}
          emissiveIntensity={isLive ? 0.8 : 0.2}
          roughness={0.7}
          metalness={0.1}
          transparent={festival.comingSoon}
          opacity={festival.comingSoon ? 0.4 : 1}
        />
      </mesh>

      <AtmosphereGlow
        color={festival.planetColor}
        size={size}
        intensity={isLive ? 0.6 : 0.2}
        pulse={isLive}
      />

      {isLive && <LiveRings size={size} color={festival.planetColor} />}

      {/* Always-visible planet label */}
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <Text
          position={[0, -size - 0.5, 0]}
          fontSize={0.35}
          color="white"
          anchorX="center"
          anchorY="top"
          fillOpacity={festival.comingSoon ? 0.4 : 0.85}
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {festival.name}
        </Text>
      </Billboard>

      {festival.comingSoon && (
        <Billboard follow lockX={false} lockY={false} lockZ={false}>
          <Text
            position={[0, size + 0.3, 0]}
            fontSize={0.2}
            color="white"
            anchorX="center"
            anchorY="bottom"
            fillOpacity={0.4}
          >
            Coming Soon
          </Text>
        </Billboard>
      )}

      {hoveredPlanet === festival.slug && (
        <Html center position={[0, -size - 1.2, 0]} distanceFactor={15}>
          <div className="bg-black/80 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 min-w-[200px] pointer-events-none">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-display font-bold text-sm">
                {festival.name}
              </h3>
              {isLive && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                  LIVE
                </span>
              )}
            </div>
            <p className="text-white/50 text-xs mt-1">
              {festival.location.city}, {festival.location.country}
            </p>
            <p className="text-white/40 text-xs">
              {festival.dates.start} — {festival.dates.end}
            </p>
            <div className="flex gap-1 mt-2">
              {festival.genreTags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/60"
                >
                  {tag}
                </span>
              ))}
            </div>
            {!festival.comingSoon && (
              <p className="text-white/30 text-[10px] mt-2">Click to explore</p>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

function LiveRings({ size, color }: { size: number; color: string }) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ring1Ref.current) {
      const scale = 1 + (clock.elapsedTime % 2) * 0.5;
      ring1Ref.current.scale.setScalar(scale);
      const mat = ring1Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 0.4 - (clock.elapsedTime % 2) * 0.2);
    }
    if (ring2Ref.current) {
      const scale = 1 + ((clock.elapsedTime + 1) % 2) * 0.5;
      ring2Ref.current.scale.setScalar(scale);
      const mat = ring2Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 0.4 - ((clock.elapsedTime + 1) % 2) * 0.2);
    }
  });

  return (
    <>
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * 1.1, size * 1.15, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * 1.1, size * 1.15, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}
