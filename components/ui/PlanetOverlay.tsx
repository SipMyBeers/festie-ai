"use client";

import { motion } from "framer-motion";
import { useFestieStore } from "@/lib/store";
import { getFestivalBySlug } from "@/lib/data/festivals";
import { Timeline } from "./Timeline";
import { StagePanel } from "./StagePanel";

export function PlanetOverlay() {
  const selectedSlug = useFestieStore((s) => s.selectedPlanetSlug);
  const cameraMode = useFestieStore((s) => s.cameraMode);
  const setSelectedPlanet = useFestieStore((s) => s.setSelectedPlanet);
  const setCameraMode = useFestieStore((s) => s.setCameraMode);

  if (!selectedSlug) return null;

  const festival = getFestivalBySlug(selectedSlug);
  if (!festival) return null;

  const handleBack = () => {
    setSelectedPlanet(null);
    setCameraMode("solar-system");
  };

  const hasSchedule = festival.stages.length > 0;

  return (
    <>
      {/* Top nav */}
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
          {festival.status === "live" && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">LIVE</span>
          )}
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

      {/* Info card for coming-soon planets */}
      {!hasSchedule && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-0 right-0 z-10 flex justify-center pointer-events-none"
        >
          <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-xl px-6 py-4 max-w-sm text-center pointer-events-auto">
            <p className="text-white/80 text-sm" style={{ fontFamily: "var(--font-display)" }}>
              {festival.description}
            </p>
            <p className="text-white/40 text-xs mt-2">
              {festival.location.city}, {festival.location.country} — {festival.dates.start} to {festival.dates.end}
            </p>
            <div className="flex gap-1 justify-center mt-2">
              {festival.genreTags.map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/50">{tag}</span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Timeline + stage panel for planets with schedule */}
      {hasSchedule && (
        <>
          <StagePanel festival={festival} />
          <Timeline festival={festival} />
        </>
      )}
    </>
  );
}
