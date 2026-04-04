"use client";

import { useFestieStore } from "@/lib/store";

export function ExploreToggle() {
  const selectedPlanet = useFestieStore((s) => s.selectedPlanetSlug);
  const cameraMode = useFestieStore((s) => s.cameraMode);
  const setCameraMode = useFestieStore((s) => s.setCameraMode);

  if (!selectedPlanet) return null;

  const isExploring = cameraMode === "exploring";

  const toggle = () => {
    setCameraMode(isExploring ? "planet-surface" : "exploring");
  };

  return (
    <button
      onClick={toggle}
      className="fixed bottom-6 left-6 z-20 bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white font-bold text-sm px-5 py-3 rounded-full shadow-lg shadow-purple-500/25 hover:opacity-90 transition-opacity pointer-events-auto flex items-center gap-2"
      style={{ fontFamily: "var(--font-display)" }}
    >
      {isExploring ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Orbit View
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Explore on Foot
        </>
      )}
    </button>
  );
}
