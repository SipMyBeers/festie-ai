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
    setSavedIds(JSON.parse(localStorage.getItem("festie-saved-acts") || "[]"));
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
    <div className="pb-20 pt-safe">
      <div className="px-4 pt-6 pb-4 flex items-center gap-3">
        <Link href="/guide/coachella" className="text-white/40 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-display font-bold text-white">My Schedule</h1>
      </div>

      {saved.length === 0 ? (
        <div className="px-4">
          <div className="bg-white/5 rounded-xl p-8 text-center border border-white/10">
            <p className="text-3xl mb-3">⭐</p>
            <p className="text-white/60 font-display font-bold">No saved acts yet</p>
            <p className="text-white/30 text-sm mt-1">
              Tap the star on acts in the schedule!
            </p>
            <Link
              href="/guide/coachella/schedule"
              className="inline-block mt-4 bg-festie-purple text-white text-sm font-display font-bold px-6 py-2.5 rounded-full"
            >
              Browse Schedule
            </Link>
          </div>
        </div>
      ) : (
        <div className="px-4 space-y-6">
          {Object.entries(grouped).map(([day, perfs]) => (
            <div key={day}>
              <h2 className="text-sm font-display font-bold text-festie-cyan uppercase tracking-wider mb-2">
                {day}
              </h2>
              <div className="space-y-1.5">
                {perfs.map((p) => {
                  const isLive =
                    new Date(p.startTime) <= new Date() &&
                    new Date(p.endTime) > new Date();
                  return (
                    <div
                      key={p.id}
                      className={`flex items-center justify-between rounded-xl p-3 border ${
                        isLive
                          ? "bg-white/10 border-festie-purple/50"
                          : "bg-white/5 border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isLive && (
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shrink-0" />
                        )}
                        <div>
                          <p className="font-display font-bold text-sm text-white">
                            {p.artistName}
                          </p>
                          <p className="text-xs">
                            <span style={{ color: p.stageColor }}>
                              {p.stageName}
                            </span>
                            <span className="text-white/30">
                              {" "}
                              — {formatTime(p.startTime)} to{" "}
                              {formatTime(p.endTime)}
                            </span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => remove(p.id)}
                        className="p-2 -m-2 text-white/20 hover:text-red-400"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
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
