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
    <>
      {/* Top nav bar */}
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

      {/* Coming Soon overlay for stub planets */}
      {festival.comingSoon && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none"
        >
          <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl p-8 max-w-sm mx-4 text-center pointer-events-auto">
            <div
              className="text-4xl mb-4"
              style={{
                color: festival.planetColor,
                textShadow: `0 0 30px ${festival.planetColor}40`,
              }}
            >
              {festival.name === "Burning Man" ? "🔥" :
               festival.name === "Tomorrowland" ? "🏰" :
               festival.name === "Rolling Loud" ? "🎤" :
               festival.name === "Glastonbury" ? "🌧️" :
               festival.name === "EDC Las Vegas" ? "⚡" :
               festival.name === "Lollapalooza" ? "🎸" :
               festival.name === "Bonnaroo" ? "🌻" :
               festival.name === "Primavera Sound" ? "🌊" :
               festival.name === "Ultra Music Festival" ? "🌴" : "🪐"}
            </div>
            <h2
              className="text-white text-2xl font-bold mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {festival.name}
            </h2>
            <p className="text-white/50 text-sm mb-1">
              {festival.location.city}, {festival.location.country}
            </p>
            <p className="text-white/40 text-xs mb-4">
              {festival.dates.start} — {festival.dates.end}
            </p>
            <div className="bg-gradient-to-r from-[#7c3aed]/20 to-[#ec4899]/20 border border-white/10 rounded-xl p-4 mb-4">
              <p className="text-white/70 text-sm">
                Festie is building this planet! Full schedule, stages, and offline guide coming before the festival.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleBack}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm font-bold py-3 rounded-full transition-colors"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Back to Universe
              </button>
              <a
                href={festival.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white text-sm font-bold py-3 rounded-full hover:opacity-90 transition-opacity text-center"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Get Tickets
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
