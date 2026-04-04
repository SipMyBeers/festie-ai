"use client";

import dynamic from "next/dynamic";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { SolarSystemUI } from "@/components/ui/SolarSystemUI";
import { PlanetOverlay } from "@/components/ui/PlanetOverlay";
import { ChatWidget } from "@/components/ui/ChatWidget";
import { ExploreToggle } from "@/components/ui/ExploreToggle";
import { ExploreHint } from "@/components/ui/ExploreHint";

const Scene = dynamic(
  () => import("@/components/3d/Scene").then((m) => m.Scene),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="h-screen w-screen">
      <LoadingScreen />
      <Scene />
      <SolarSystemUI />
      <PlanetOverlay />
      <ExploreToggle />
      <ExploreHint />
      <ChatWidget />
    </main>
  );
}
