"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// All amenity positions laid out around the festival grounds
// Stages are at: Mainstage(0,-14), Outdoor(-14,-4), Sahara(18,0), Gobi(10,12), Mojave(-10,12)

// ---- WATER STATIONS ----
function WaterStation({ position, name }: { position: [number, number, number]; name: string }) {
  return (
    <group position={position}>
      {/* Blue water tank */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.8, 8]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.6} />
      </mesh>
      {/* Spout */}
      <mesh position={[0.3, 0.3, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 6]} />
        <meshStandardMaterial color="#888" metalness={0.7} />
      </mesh>
      {/* Label */}
      <Text position={[0, 1.1, 0]} fontSize={0.2} color="#3b82f6" anchorX="center" anchorY="middle" font="/fonts/SpaceGrotesk-Bold.ttf" outlineWidth={0.01} outlineColor="#000">
        {name}
      </Text>
      {/* Blue glow on ground */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.6, 16]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ---- RESTROOMS ----
function Restroom({ position, name, type }: { position: [number, number, number]; name: string; type: string }) {
  const isFlush = type.includes("flush");
  return (
    <group position={position}>
      {/* Porta potty row or building */}
      {isFlush ? (
        // Flush restroom building
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[1.2, 1.2, 0.8]} />
          <meshStandardMaterial color="#666" roughness={0.8} />
        </mesh>
      ) : (
        // Row of porta potties
        <>
          {[-0.4, 0, 0.4].map((x) => (
            <mesh key={x} position={[x, 0.5, 0]}>
              <boxGeometry args={[0.3, 1, 0.3]} />
              <meshStandardMaterial color="#22c55e" roughness={0.7} />
            </mesh>
          ))}
        </>
      )}
      {/* Label */}
      <Text position={[0, 1.5, 0]} fontSize={0.18} color="#22c55e" anchorX="center" anchorY="middle" font="/fonts/SpaceGrotesk-Bold.ttf" outlineWidth={0.01} outlineColor="#000">
        {name}
      </Text>
    </group>
  );
}

// ---- PARKING LOT ----
function ParkingLot({ position, name }: { position: [number, number, number]; name: string }) {
  return (
    <group position={position}>
      {/* Parking surface */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial color="#333" roughness={0.95} />
      </mesh>
      {/* Parking lines */}
      {[-1.2, -0.4, 0.4, 1.2].map((x) => (
        <mesh key={x} position={[x, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.05, 2.5]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
        </mesh>
      ))}
      {/* Cars (simple colored boxes) */}
      {[
        [-0.8, 0.15, -0.5], [0, 0.15, -0.5], [0.8, 0.15, -0.5],
        [-0.8, 0.15, 0.5], [0.8, 0.15, 0.5],
      ].map((pos, i) => {
        const colors = ["#ef4444", "#3b82f6", "#ffffff", "#1a1a1a", "#f59e0b"];
        return (
          <mesh key={i} position={pos as [number, number, number]}>
            <boxGeometry args={[0.5, 0.25, 0.3]} />
            <meshStandardMaterial color={colors[i]} roughness={0.6} />
          </mesh>
        );
      })}
      {/* Label */}
      <Text position={[0, 1, 0]} fontSize={0.25} color="#f59e0b" anchorX="center" anchorY="middle" font="/fonts/SpaceGrotesk-Bold.ttf" outlineWidth={0.01} outlineColor="#000">
        {name}
      </Text>
    </group>
  );
}

// ---- MEDICAL TENT ----
function MedicalTent({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* White tent */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1.2, 1.2, 1]} />
        <meshStandardMaterial color="#ffffff" roughness={0.7} />
      </mesh>
      {/* Red cross */}
      <mesh position={[0, 0.6, 0.51]}>
        <planeGeometry args={[0.3, 0.8]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0, 0.6, 0.51]}>
        <planeGeometry args={[0.8, 0.3]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      {/* Label */}
      <Text position={[0, 1.5, 0]} fontSize={0.2} color="#ef4444" anchorX="center" anchorY="middle" font="/fonts/SpaceGrotesk-Bold.ttf" outlineWidth={0.01} outlineColor="#000">
        Medical
      </Text>
      {/* Red glow */}
      <pointLight position={[0, 0.8, 0.5]} color="#ef4444" intensity={1} distance={4} decay={2} />
    </group>
  );
}

// ---- CHARGING LOCKERS ----
function ChargingLockers({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Bank of lockers */}
      {[-0.3, 0, 0.3].map((x) => (
        <mesh key={x} position={[x, 0.5, 0]}>
          <boxGeometry args={[0.25, 1, 0.3]} />
          <meshStandardMaterial color="#6b7280" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      {/* Charging indicator lights */}
      {[-0.3, 0, 0.3].map((x) => (
        <mesh key={x} position={[x, 0.9, 0.16]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      ))}
      {/* Label */}
      <Text position={[0, 1.3, 0]} fontSize={0.18} color="#a855f7" anchorX="center" anchorY="middle" font="/fonts/SpaceGrotesk-Bold.ttf" outlineWidth={0.01} outlineColor="#000">
        Charging Lockers
      </Text>
    </group>
  );
}

// ---- MERCH TENT ----
function MerchTent({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Tent structure */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[2, 1.4, 1.2]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.7} />
      </mesh>
      {/* Awning */}
      <mesh position={[0, 1.5, 0.3]}>
        <boxGeometry args={[2.4, 0.1, 1.6]} />
        <meshStandardMaterial color="#f97316" />
      </mesh>
      {/* "MERCH" sign */}
      <Text position={[0, 1.8, 0.3]} fontSize={0.3} color="#f97316" anchorX="center" anchorY="middle" font="/fonts/SpaceGrotesk-Bold.ttf" outlineWidth={0.02} outlineColor="#000">
        MERCH
      </Text>
      <pointLight position={[0, 1.3, 0.6]} color="#ffeecc" intensity={1} distance={4} decay={2} />
    </group>
  );
}

// ---- CAMPING AREA ----
function CampingArea({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Ground area */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3, 16]} />
        <meshStandardMaterial color="#8a7a5a" roughness={0.95} />
      </mesh>
      {/* Tents */}
      {[
        [-1, 0, -0.5], [0.5, 0, -1], [-0.5, 0, 1], [1.2, 0, 0.5], [-1.5, 0, 0.8],
      ].map((pos, i) => {
        const colors = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7"];
        return (
          <mesh key={i} position={pos as [number, number, number]}>
            <coneGeometry args={[0.3, 0.4, 4]} />
            <meshStandardMaterial color={colors[i]} roughness={0.7} />
          </mesh>
        );
      })}
      {/* RVs */}
      {[[1.8, 0.2, -0.3], [-1.8, 0.2, -0.8]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.8, 0.4, 0.4]} />
          <meshStandardMaterial color={i === 0 ? "#ddd" : "#c4b5a0"} roughness={0.7} />
        </mesh>
      ))}
      {/* Label */}
      <Text position={[0, 1.2, 0]} fontSize={0.25} color="#f59e0b" anchorX="center" anchorY="middle" font="/fonts/SpaceGrotesk-Bold.ttf" outlineWidth={0.01} outlineColor="#000">
        Camping
      </Text>
    </group>
  );
}

// ---- RIDESHARE LOT ----
function RideshareLot({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, 2]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.95} />
      </mesh>
      {/* Waiting cars */}
      {[[-0.6, 0.15, 0], [0.6, 0.15, 0]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.5, 0.25, 0.3]} />
          <meshStandardMaterial color={i === 0 ? "#1a1a1a" : "#ffffff"} roughness={0.5} />
        </mesh>
      ))}
      <Text position={[0, 1, 0]} fontSize={0.2} color="#a855f7" anchorX="center" anchorY="middle" font="/fonts/SpaceGrotesk-Bold.ttf" outlineWidth={0.01} outlineColor="#000">
        Uber / Lyft
      </Text>
    </group>
  );
}

// ---- ENTRANCE GATE ----
function EntranceGate({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Gate posts */}
      {[-1.5, 1.5].map((x) => (
        <mesh key={x} position={[x, 1.5, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 3, 8]} />
          <meshStandardMaterial color="#888" metalness={0.6} />
        </mesh>
      ))}
      {/* Top bar */}
      <mesh position={[0, 3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 3.2, 8]} />
        <meshStandardMaterial color="#888" metalness={0.6} />
      </mesh>
      {/* ENTRANCE sign */}
      <Text position={[0, 3.4, 0]} fontSize={0.3} color="#ffffff" anchorX="center" anchorY="middle" font="/fonts/SpaceGrotesk-Bold.ttf" outlineWidth={0.02} outlineColor="#7c3aed">
        ENTRANCE
      </Text>
      <pointLight position={[0, 2.5, 0.5]} color="#7c3aed" intensity={2} distance={5} decay={2} />
    </group>
  );
}

// ---- MAIN EXPORT ----
export function Amenities() {
  return (
    <group>
      {/* === WATER STATIONS === */}
      <WaterStation position={[4, 0, 5]} name="Water" />
      <WaterStation position={[15, 0, 5]} name="Water" />
      <WaterStation position={[-16, 0, -2]} name="Water" />
      <WaterStation position={[-5, 0, 20]} name="Water" />

      {/* === RESTROOMS === */}
      <Restroom position={[3, 0, -12]} name="Restrooms" type="porta-potty" />
      <Restroom position={[16, 0, 4]} name="Restrooms" type="porta-potty" />
      <Restroom position={[-16, 0, 0]} name="Restrooms" type="flush" />
      <Restroom position={[-6, 0, 18]} name="Restrooms" type="porta-potty" />

      {/* === PARKING === */}
      <ParkingLot position={[0, 0, 25]} name="General Parking" />
      <ParkingLot position={[-12, 0, 22]} name="Preferred Parking" />

      {/* === RIDESHARE === */}
      <RideshareLot position={[12, 0, 24]} />

      {/* === MEDICAL === */}
      <MedicalTent position={[2, 0, 16]} />
      <MedicalTent position={[14, 0, 8]} />

      {/* === CHARGING LOCKERS === */}
      <ChargingLockers position={[0, 0, 18]} />

      {/* === MERCH === */}
      <MerchTent position={[-2, 0, 20]} />

      {/* === CAMPING === */}
      <CampingArea position={[-18, 0, 20]} />

      {/* === ENTRANCE === */}
      <EntranceGate position={[0, 0, 28]} />
    </group>
  );
}
