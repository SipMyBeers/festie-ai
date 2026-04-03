"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Festival } from "@/lib/types";
import { useFestieStore } from "@/lib/store";

interface StagePanelProps {
  festival: Festival;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function StagePanel({ festival }: StagePanelProps) {
  const selectedStageId = useFestieStore((s) => s.selectedStageId);
  const setSelectedStage = useFestieStore((s) => s.setSelectedStage);

  const stage = festival.stages.find((s) => s.id === selectedStageId);

  return (
    <AnimatePresence>
      {stage && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="fixed right-2 top-16 bottom-20 z-20 w-72"
        >
          <div className="h-full bg-black/70 backdrop-blur-md rounded-xl border border-white/10 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg" style={{ color: stage.color }}>
                {stage.name}
              </h2>
              <button onClick={() => setSelectedStage(null)} className="text-white/40 hover:text-white text-lg">
                x
              </button>
            </div>

            <div className="space-y-3">
              {stage.schedule.map((perf) => {
                const now = new Date();
                const isCurrent = new Date(perf.startTime) <= now && new Date(perf.endTime) > now;

                return (
                  <div
                    key={perf.id}
                    className={`rounded-lg p-3 transition-colors ${
                      isCurrent ? "bg-white/10 border border-white/20" : "bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-sm text-white">{perf.artistName}</h3>
                      {isCurrent && (
                        <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">LIVE</span>
                      )}
                    </div>
                    <p className="text-white/40 text-xs mt-1">
                      {formatTime(perf.startTime)} — {formatTime(perf.endTime)}
                    </p>
                    <div className="flex gap-1 mt-2">
                      {perf.genreTags.map((tag) => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/50">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                      {perf.spotifyUrl && (
                        <a href={perf.spotifyUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-green-400 hover:text-green-300 font-display">
                          Listen on Spotify
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <a
              href={festival.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 w-full text-center bg-gradient-to-r from-festie-purple to-festie-pink text-white text-sm font-display font-bold px-4 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Buy Tickets
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
