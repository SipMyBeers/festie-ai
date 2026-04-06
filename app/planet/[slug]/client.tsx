"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Festival } from "@/lib/types";
import { Timeline } from "@/components/ui/Timeline";
import { StagePanel } from "@/components/ui/StagePanel";
import { ExploreToggle } from "@/components/ui/ExploreToggle";
import { ExploreHint } from "@/components/ui/ExploreHint";
import { VirtualJoystick } from "@/components/ui/VirtualJoystick";

const PlanetScene = dynamic(
  () => import("@/components/3d/PlanetScene").then((m) => m.PlanetScene),
  { ssr: false }
);

export function PlanetPageClient({ festival }: { festival: Festival }) {
  return (
    <main className="h-screen w-screen relative">
      <PlanetScene festival={festival} />

      {/* Top nav bar */}
      <div className="fixed top-0 left-0 right-0 z-10 p-4 flex items-center justify-between pointer-events-none">
        <Link
          href="/"
          className="text-white/60 hover:text-white text-sm font-display flex items-center gap-2 transition-colors pointer-events-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Universe
        </Link>

        <div className="flex items-center gap-3">
          <h1 className="text-white font-display font-bold text-lg">{festival.name}</h1>
          {festival.status === "live" && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">LIVE</span>
          )}
        </div>

        <Link
          href="/get-festie"
          className="glass text-white/60 hover:text-white text-xs font-display font-bold px-3 py-1.5 rounded-full transition-colors pointer-events-auto flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          Festie AI
        </Link>
      </div>

      <StagePanel festival={festival} />
      <Timeline festival={festival} />
      <ExploreToggle />
      <ExploreHint />
      <VirtualJoystick />
    </main>
  );
}
