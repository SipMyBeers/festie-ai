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

function FoodArea({ position, name }: { position: [number, number, number]; name: string }) {
  return (
    <group position={position}>
      {/* Food stall structure */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1.8, 1.2, 1]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.3, 0.2]}>
        <boxGeometry args={[2, 0.08, 1.3]} />
        <meshStandardMaterial color="#f97316" />
      </mesh>
      <Label text={name} color="#fb923c" y={1.6} />
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
      <Label text="MAIN ENTRANCE" color="#a78bfa" y={3} />
    </group>
  );
}

function FerrisWheel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Center hub */}
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.3, 8]} />
        <meshStandardMaterial color="#888" metalness={0.6} />
      </mesh>
      {/* Wheel ring */}
      <mesh position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.5, 0.08, 4, 24]} />
        <meshStandardMaterial color="#aaa" metalness={0.5} />
      </mesh>
      {/* Spokes */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[0, 4 + Math.sin(angle) * 3.5, Math.cos(angle) * 3.5]}>
            <sphereGeometry args={[0.2, 6, 6]} />
            <meshStandardMaterial color={["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#ec4899", "#7c3aed", "#06b6d4", "#ff6600"][i]} />
          </mesh>
        );
      })}
      {/* Support legs */}
      {[-1.5, 1.5].map((x) => (
        <mesh key={x} position={[x, 2, 0]} rotation={[0, 0, x > 0 ? -0.15 : 0.15]}>
          <cylinderGeometry args={[0.06, 0.1, 4.2, 6]} />
          <meshStandardMaterial color="#777" metalness={0.5} />
        </mesh>
      ))}
      <Label text="Ferris Wheel" color="#fbbf24" y={8} />
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

export function Amenities() {
  return (
    <group>
      {/* Positions match official 2026 venue map */}
      {/* Water stations */}
      <WaterStation position={[-4, 0, -14]} />     {/* Near Coachella Stage */}
      <WaterStation position={[10, 0, -4]} />      {/* Between Sonora & Gobi */}
      <WaterStation position={[-8, 0, 4]} />       {/* Center grounds */}
      <WaterStation position={[0, 0, 14]} />       {/* Near Sahara */}
      <WaterStation position={[-16, 0, 2]} />      {/* Near camping */}

      {/* Restrooms */}
      <Restroom position={[3, 0, -16]} type="porta-potty" />   {/* Near Coachella Stage */}
      <Restroom position={[16, 0, -4]} type="porta-potty" />   {/* Near Gobi */}
      <Restroom position={[10, 0, 10]} type="flush" />         {/* Near Mojave */}
      <Restroom position={[-8, 0, 14]} type="porta-potty" />   {/* Near Sahara */}
      <Restroom position={[-16, 0, -2]} type="flush" />        {/* Near Yuma */}

      {/* Food areas */}
      <FoodArea position={[4, 0, -10]} name="Terrace" />           {/* Between stages */}
      <FoodArea position={[18, 0, -6]} name="Indio Central Market" /> {/* East side */}
      <FoodArea position={[8, 0, 8]} name="Mojave Food" />         {/* Near Mojave */}
      <FoodArea position={[-6, 0, 18]} name="Sahara Food" />       {/* Near Sahara */}
      <FoodArea position={[6, 0, 10]} name="Rose Garden" />        {/* Near Quasar */}

      {/* Ferris wheel — iconic Coachella landmark, near entrance */}
      <FerrisWheel position={[-10, 0, 2]} />

      {/* Parking */}
      <ParkingLot position={[-22, 0, 14]} name="Parking" />
      <ParkingLot position={[-24, 0, 8]} name="VIP Parking" />
      <RideshareLot position={[-20, 0, 18]} />

      {/* Medical */}
      <MedicalTent position={[-14, 0, 6]} />
      <MedicalTent position={[12, 0, -8]} />

      {/* Other */}
      <ChargingLockers position={[-12, 0, 4]} />
      <EntranceGate position={[-18, 0, 6]} />
    </group>
  );
}
