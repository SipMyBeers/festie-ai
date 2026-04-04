"use client";

import { motion } from "framer-motion";
import { useFestieStore } from "@/lib/store";
import { getFestivalBySlug } from "@/lib/data/festivals";

export function PlanetOverlay() {
  const selectedSlug = useFestieStore((s) => s.selectedPlanetSlug);
  const setSelectedPlanet = useFestieStore((s) => s.setSelectedPlanet);
  const setCameraMode = useFestieStore((s) => s.setCameraMode);

  if (!selectedSlug) return null;

  const festival = getFestivalBySlug(selectedSlug);
  if (!festival) return null;

  const handleBack = () => {
    setSelectedPlanet(null);
    setCameraMode("solar-system");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-10 p-4 flex items-center justify-between pointer-events-none"
    >
      <button
        onClick={handleBack}
        className="text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors pointer-events-auto"
        style={{ fontFamily: "var(--font-display)" }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Universe
      </button>

      <div className="flex items-center gap-3">
        <h1 className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>
          {festival.name}
        </h1>
        {festival.comingSoon && (
          <span className="bg-white/10 text-white/60 text-xs px-2 py-1 rounded-full" style={{ fontFamily: "var(--font-display)" }}>
            Coming Soon
          </span>
        )}
      </div>

      <a
        href={festival.ticketUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white text-sm font-bold px-4 py-2 rounded-full hover:opacity-90 transition-opacity pointer-events-auto"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Buy Tickets
      </a>
    </motion.div>
  );
}
