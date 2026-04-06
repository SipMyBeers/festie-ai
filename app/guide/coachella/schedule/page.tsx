"use client";

import { useState, useEffect } from "react";
import { coachellaStages } from "@/lib/data/coachella-lineup";
import Link from "next/link";
import { BottomNav } from "@/components/ui/BottomNav";

type Day = "friday" | "saturday" | "sunday";

const DAYS: { key: Day; label: string; shortLabel: string; date: string }[] = [
  { key: "friday", label: "Friday", shortLabel: "FRI", date: "2026-04-10" },
  { key: "saturday", label: "Saturday", shortLabel: "SAT", date: "2026-04-11" },
  { key: "sunday", label: "Sunday", shortLabel: "SUN", date: "2026-04-12" },
];

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState<Day>("friday");
  const [activeStage, setActiveStage] = useState<string | null>(null);

  const dayDate = DAYS.find((d) => d.key === activeDay)!.date;

  const filteredStages = coachellaStages
    .map((stage) => ({
      ...stage,
      schedule: stage.schedule.filter((perf) => perf.startTime.startsWith(dayDate)),
    }))
    .filter((stage) => stage.schedule.length > 0)
    .filter((stage) => !activeStage || stage.id === activeStage);

  return (
    <div className="noise pb-20 pt-safe">
      {/* Header */}
      <div className="px-4 pt-6 pb-3 flex items-center gap-3">
        <Link href="/guide/coachella" className="text-white/30 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-display font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Schedule</h1>
      </div>

      {/* Day Tabs */}
      <div className="px-4 mb-4">
        <div className="glass rounded-2xl p-1.5 flex gap-1">
          {DAYS.map((day) => (
            <button
              key={day.key}
              onClick={() => setActiveDay(day.key)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-display font-bold transition-all ${
                activeDay === day.key
                  ? "bg-gradient-to-r from-festie-purple to-festie-pink text-white shadow-lg shadow-purple-500/20"
                  : "text-white/30 hover:text-white/50"
              }`}
            >
              <span className="hidden sm:inline">{day.label}</span>
              <span className="sm:hidden">{day.shortLabel}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stage Filters */}
      <div className="px-4 mb-5 overflow-x-auto">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveStage(null)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-display font-bold transition-all ${
              activeStage === null
                ? "bg-white text-black shadow-lg shadow-white/10"
                : "glass text-white/40"
            }`}
          >
            All Stages
          </button>
          {coachellaStages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => setActiveStage(activeStage === stage.id ? null : stage.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-display font-bold transition-all ${
                activeStage === stage.id
                  ? "text-white shadow-lg"
                  : "glass text-white/40"
              }`}
              style={
                activeStage === stage.id
                  ? { background: stage.color, boxShadow: `0 4px 20px ${stage.color}33` }
                  : undefined
              }
            >
              {stage.name}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule List */}
      <div className="px-4 space-y-6">
        {filteredStages.map((stage) => (
          <div key={stage.id}>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color, boxShadow: `0 0 8px ${stage.color}66` }} />
              <h3 className="font-display font-bold text-xs uppercase tracking-[0.15em]" style={{ color: stage.color }}>
                {stage.name}
              </h3>
              <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${stage.color}33, transparent)` }} />
            </div>
            <div className="space-y-1.5">
              {stage.schedule
                .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                .map((perf) => {
                  const now = new Date();
                  const start = new Date(perf.startTime);
                  const end = new Date(perf.endTime);
                  const isLive = start <= now && end > now;
                  const isPast = end < now;

                  return (
                    <div
                      key={perf.id}
                      className={`stage-card rounded-xl p-3.5 flex items-center justify-between transition-all ${
                        isLive ? "glow-purple" : isPast ? "opacity-40" : ""
                      }`}
                      style={{ "--stage-color": stage.color } as React.CSSProperties}
                    >
                      <div className="flex items-center gap-3">
                        {isLive && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                          </span>
                        )}
                        <div>
                          <p className="font-display font-bold text-sm text-white">{perf.artistName}</p>
                          <p className="text-white/30 text-xs mt-0.5">
                            {formatTime(perf.startTime)} — {formatTime(perf.endTime)}
                          </p>
                        </div>
                      </div>
                      <SaveButton perfId={perf.id} />
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

function SaveButton({ perfId }: { perfId: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const savedActs = JSON.parse(localStorage.getItem("festie-saved-acts") || "[]");
      setSaved(savedActs.includes(perfId));
    } catch {
      setSaved(false);
    }
  }, [perfId]);

  const toggle = () => {
    let savedActs: string[] = [];
    try {
      savedActs = JSON.parse(localStorage.getItem("festie-saved-acts") || "[]");
    } catch { /* corrupted, start fresh */ }
    if (saved) {
      const updated = savedActs.filter((id: string) => id !== perfId);
      localStorage.setItem("festie-saved-acts", JSON.stringify(updated));
    } else {
      savedActs.push(perfId);
      localStorage.setItem("festie-saved-acts", JSON.stringify(savedActs));
    }
    setSaved(!saved);
  };

  return (
    <button onClick={toggle} className="p-2 -m-2 group">
      <svg
        className={`w-5 h-5 transition-all ${
          saved
            ? "text-festie-gold fill-festie-gold drop-shadow-[0_0_6px_rgba(234,179,8,0.4)]"
            : "text-white/15 group-hover:text-white/30"
        }`}
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    </button>
  );
}
