"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { coachellaStages } from "@/lib/data/coachella-lineup";
import { BottomNav } from "@/components/ui/BottomNav";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function MySchedulePage() {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      setSavedIds(JSON.parse(localStorage.getItem("festie-saved-acts") || "[]"));
    } catch {
      setSavedIds([]);
    }
  }, []);

  const saved = coachellaStages
    .flatMap((s) =>
      s.schedule
        .filter((p) => savedIds.includes(p.id))
        .map((p) => ({ ...p, stageName: s.name, stageColor: s.color }))
    )
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

  const grouped: Record<string, typeof saved> = {};
  for (const p of saved) {
    const day = new Date(p.startTime).toLocaleDateString("en-US", {
      weekday: "long",
    });
    (grouped[day] ??= []).push(p);
  }

  const remove = (id: string) => {
    const updated = savedIds.filter((i) => i !== id);
    localStorage.setItem("festie-saved-acts", JSON.stringify(updated));
    setSavedIds(updated);
  };

  return (
    <div className="noise pb-20 pt-safe">
      <div className="px-4 pt-6 pb-4 flex items-center gap-3">
        <Link href="/guide/coachella" className="text-white/30 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-display font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">My Schedule</h1>
        {saved.length > 0 && (
          <span className="ml-auto text-xs font-display text-white/30">{saved.length} act{saved.length !== 1 ? "s" : ""}</span>
        )}
      </div>

      {saved.length === 0 ? (
        <div className="px-4">
          <div className="glass-warm rounded-2xl p-10 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-festie-gold/20 to-festie-orange/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-festie-gold/60" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </div>
            <p className="text-white/50 font-display font-bold">No saved acts yet</p>
            <p className="text-white/25 text-sm mt-1">
              Star your must-see sets in the schedule
            </p>
            <Link
              href="/guide/coachella/schedule"
              className="inline-block mt-5 bg-gradient-to-r from-festie-purple to-festie-pink text-white text-sm font-display font-bold px-6 py-2.5 rounded-full shadow-lg shadow-purple-500/20 hover:opacity-90 transition-opacity"
            >
              Browse Schedule
            </Link>
          </div>
        </div>
      ) : (
        <div className="px-4 space-y-6">
          {Object.entries(grouped).map(([day, perfs]) => (
            <div key={day}>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-2 h-2 rounded-full bg-festie-cyan" style={{ boxShadow: "0 0 8px rgba(6,182,212,0.4)" }} />
                <h2 className="text-xs font-display font-bold text-festie-cyan/80 uppercase tracking-[0.15em]">{day}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-festie-cyan/20 to-transparent" />
              </div>
              <div className="space-y-1.5">
                {perfs.map((p) => {
                  const isLive =
                    new Date(p.startTime) <= new Date() &&
                    new Date(p.endTime) > new Date();
                  return (
                    <div
                      key={p.id}
                      className={`stage-card rounded-xl p-3.5 flex items-center justify-between ${isLive ? "glow-purple" : ""}`}
                      style={{ "--stage-color": p.stageColor } as React.CSSProperties}
                    >
                      <div className="flex items-center gap-3">
                        {isLive && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                          </span>
                        )}
                        <div>
                          <p className="font-display font-bold text-sm text-white">{p.artistName}</p>
                          <p className="text-xs mt-0.5">
                            <span style={{ color: p.stageColor }}>{p.stageName}</span>
                            <span className="text-white/20"> &middot; </span>
                            <span className="text-white/30">{formatTime(p.startTime)} — {formatTime(p.endTime)}</span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => remove(p.id)}
                        className="p-2 -m-2 text-white/15 hover:text-red-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
