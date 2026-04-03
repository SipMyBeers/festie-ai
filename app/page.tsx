"use client";

import dynamic from "next/dynamic";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

const Scene = dynamic(() => import("@/components/3d/Scene").then((m) => m.Scene), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="h-screen w-screen">
      <LoadingScreen />
      <Scene />
    </main>
  );
}
