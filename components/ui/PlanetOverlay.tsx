"use client";

import { motion } from "framer-motion";
import { useFestieStore } from "@/lib/store";
import { getFestivalBySlug } from "@/lib/data/festivals";
import Link from "next/link";

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
          className="text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors pointer-events-auto font-display"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Universe
        </button>

        <div className="flex items-center gap-3">
          <h1 className="text-white font-bold text-lg font-display">
            {festival.name}
          </h1>
          {festival.comingSoon && (
            <span className="bg-white/10 text-white/60 text-xs px-2 py-1 rounded-full font-display">
              Coming Soon
            </span>
          )}
        </div>

        {/* Subtle Festie AI link — not in your face */}
        <Link
          href="/get-festie"
          className="glass text-white/60 hover:text-white text-xs font-display font-bold px-3 py-1.5 rounded-full transition-colors pointer-events-auto flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          Festie AI
        </Link>
      </motion.div>

      {/* Coming Soon overlay for stub planets */}
      {festival.comingSoon && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none"
        >
          <div className="glass-warm border border-white/10 rounded-2xl p-8 max-w-sm mx-4 text-center pointer-events-auto">
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
            <h2 className="text-white text-2xl font-bold mb-2 font-display">
              {festival.name}
            </h2>
            <p className="text-white/50 text-sm mb-1">
              {festival.location.city}, {festival.location.country}
            </p>
            <p className="text-white/40 text-xs mb-5">
              {festival.dates.start} — {festival.dates.end}
            </p>
            <div className="glass rounded-xl p-4 mb-5">
              <p className="text-white/60 text-sm">
                Festie is building this planet! Full schedule, stages, and offline AI guide coming before the festival.
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={handleBack}
                className="w-full bg-gradient-to-r from-festie-purple to-festie-pink text-white text-sm font-bold py-3 rounded-full hover:opacity-90 transition-opacity font-display"
              >
                Back to Universe
              </button>
              <Link
                href="/get-festie"
                className="block w-full glass text-white/60 hover:text-white text-sm font-bold py-3 rounded-full transition-colors text-center font-display"
              >
                Get Festie AI for Coachella — $4.99
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
