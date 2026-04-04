"use client";

import * as THREE from "three";
import { Html } from "@react-three/drei";

function Label({ text, color, y = 1.2 }: { text: string; color: string; y?: number }) {
  return (
    <Html center position={[0, y, 0]} distanceFactor={20}>
      <div className="text-xs font-bold whitespace-nowrap px-1.5 py-0.5 rounded bg-black/60" style={{ color, fontFamily: "var(--font-display)" }}>
        {text}
      </div>
    </Html>
  );
}

function WaterStation({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.8, 6]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.6} />
      </mesh>
      <Label text="Water" color="#60a5fa" />
    </group>
  );
}

function Restroom({ position, type }: { position: [number, number, number]; type: string }) {
  return (
    <group position={position}>
      {type.includes("flush") ? (
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1, 1, 0.7]} />
          <meshStandardMaterial color="#666" roughness={0.8} />
        </mesh>
      ) : (
        <>
          {[-0.35, 0, 0.35].map((x) => (
            <mesh key={x} position={[x, 0.45, 0]}>
              <boxGeometry args={[0.28, 0.9, 0.28]} />
              <meshStandardMaterial color="#22c55e" roughness={0.7} />
            </mesh>
          ))}
        </>
      )}
      <Label text="Restrooms" color="#4ade80" y={1.3} />
    </group>
  );
}

function ParkingLot({ position, name }: { position: [number, number, number]; name: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.5, 2.5]} />
        <meshStandardMaterial color="#333" roughness={0.95} />
      </mesh>
      {[[-0.8, 0.15, -0.3], [0, 0.15, -0.3], [0.8, 0.15, -0.3], [-0.8, 0.15, 0.4], [0.8, 0.15, 0.4]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.45, 0.2, 0.25]} />
          <meshStandardMaterial color={["#ef4444", "#3b82f6", "#fff", "#111", "#f59e0b"][i]} roughness={0.5} />
        </mesh>
      ))}
      <Label text={name} color="#fbbf24" />
    </group>
  );
}

function MedicalTent({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 0.8]} />
        <meshStandardMaterial color="#fff" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.5, 0.41]}>
        <planeGeometry args={[0.25, 0.7]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0, 0.5, 0.41]}>
        <planeGeometry args={[0.7, 0.25]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <Label text="Medical" color="#f87171" y={1.3} />
    </group>
  );
}

function ChargingLockers({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[-0.25, 0, 0.25].map((x) => (
        <mesh key={x} position={[x, 0.45, 0]}>
          <boxGeometry args={[0.2, 0.9, 0.25]} />
          <meshStandardMaterial color="#6b7280" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      <Label text="Charging" color="#c084fc" y={1.2} />
    </group>
  );
}

function MerchTent({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1.8, 1.2, 1]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.3, 0.2]}>
        <boxGeometry args={[2, 0.08, 1.3]} />
        <meshStandardMaterial color="#f97316" />
      </mesh>
      <Label text="MERCH" color="#fb923c" y={1.6} />
    </group>
  );
}

function CampingArea({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5, 12]} />
        <meshStandardMaterial color="#8a7a5a" roughness={0.95} />
      </mesh>
      {[[-0.8, 0, -0.4], [0.4, 0, -0.8], [-0.4, 0, 0.7], [1, 0, 0.3]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <coneGeometry args={[0.25, 0.35, 4]} />
          <meshStandardMaterial color={["#ef4444", "#3b82f6", "#22c55e", "#f59e0b"][i]} roughness={0.7} />
        </mesh>
      ))}
      <Label text="Camping" color="#fbbf24" />
    </group>
  );
}

function RideshareLot({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 1.5]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.95} />
      </mesh>
      {[[-0.5, 0.12, 0], [0.5, 0.12, 0]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.45, 0.2, 0.25]} />
          <meshStandardMaterial color={i === 0 ? "#111" : "#fff"} roughness={0.5} />
        </mesh>
      ))}
      <Label text="Uber/Lyft" color="#c084fc" />
    </group>
  );
}

function EntranceGate({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[-1.3, 1.3].map((x) => (
        <mesh key={x} position={[x, 1.3, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 2.6, 6]} />
          <meshStandardMaterial color="#888" metalness={0.5} />
        </mesh>
      ))}
      <mesh position={[0, 2.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 2.8, 6]} />
        <meshStandardMaterial color="#888" metalness={0.5} />
      </mesh>
      <Label text="ENTRANCE" color="#a78bfa" y={3} />
    </group>
  );
}

export function Amenities() {
  return (
    <group>
      <WaterStation position={[4, 0, 5]} />
      <WaterStation position={[15, 0, 5]} />
      <WaterStation position={[-16, 0, -2]} />
      <WaterStation position={[-5, 0, 20]} />

      <Restroom position={[3, 0, -12]} type="porta-potty" />
      <Restroom position={[16, 0, 4]} type="porta-potty" />
      <Restroom position={[-16, 0, 0]} type="flush" />
      <Restroom position={[-6, 0, 18]} type="porta-potty" />

      <ParkingLot position={[0, 0, 25]} name="Parking" />
      <ParkingLot position={[-12, 0, 22]} name="VIP Parking" />

      <RideshareLot position={[12, 0, 24]} />

      <MedicalTent position={[2, 0, 16]} />
      <MedicalTent position={[14, 0, 8]} />

      <ChargingLockers position={[0, 0, 18]} />
      <MerchTent position={[-2, 0, 20]} />
      <CampingArea position={[-18, 0, 20]} />
      <EntranceGate position={[0, 0, 28]} />
    </group>
  );
}
