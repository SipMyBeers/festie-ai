"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { coachellaStages } from "@/lib/data/coachella-lineup";
import { FESTIVAL_INFO } from "@/lib/sms/knowledge";
import { ServiceWorkerRegister } from "../sw-register";
import { BottomNav } from "@/components/ui/BottomNav";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function LiveNow() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const liveActs: { artist: string; stage: string; endTime: string }[] = [];
  const upNext: { artist: string; stage: string; startTime: string; minsUntil: number }[] = [];

  for (const stage of coachellaStages) {
    for (const perf of stage.schedule) {
      const start = new Date(perf.startTime);
      const end = new Date(perf.endTime);
      if (start <= now && end > now) {
        liveActs.push({ artist: perf.artistName, stage: stage.name, endTime: formatTime(perf.endTime) });
      }
      const minsUntil = (start.getTime() - now.getTime()) / 60000;
      if (minsUntil > 0 && minsUntil <= 60) {
        upNext.push({ artist: perf.artistName, stage: stage.name, startTime: formatTime(perf.startTime), minsUntil: Math.round(minsUntil) });
      }
    }
  }
  upNext.sort((a, b) => a.minsUntil - b.minsUntil);

  return (
    <div className="space-y-4">
      {liveActs.length > 0 && (
        <div>
          <h2 className="text-sm font-display font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Live Now
          </h2>
          <div className="space-y-2">
            {liveActs.map((act) => (
              <div key={act.artist} className="bg-white/5 rounded-xl p-3 border border-white/10">
                <p className="font-display font-bold text-white">{act.artist}</p>
                <p className="text-white/50 text-sm">{act.stage} — til {act.endTime}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {upNext.length > 0 && (
        <div>
          <h2 className="text-sm font-display font-bold text-festie-cyan uppercase tracking-wider mb-2">Coming Up</h2>
          <div className="space-y-2">
            {upNext.slice(0, 4).map((act) => (
              <div key={act.artist} className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-display font-bold text-white text-sm">{act.artist}</p>
                    <p className="text-white/50 text-xs">{act.stage}</p>
                  </div>
                  <span className="text-festie-cyan text-xs font-display font-bold">{act.minsUntil}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {liveActs.length === 0 && upNext.length === 0 && (
        <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
          <p className="text-white/60 text-sm">No live sets right now</p>
          <p className="text-white/30 text-xs mt-1">Music runs 1pm — 1am Fri/Sat, 1pm — 12am Sun</p>
        </div>
      )}
    </div>
  );
}

export default function GuidePage() {
  return (
    <div className="pb-20 pt-safe">
      <ServiceWorkerRegister />

      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-festie-purple to-festie-pink bg-clip-text text-transparent">
              Coachella 2026
            </h1>
            <p className="text-white/40 text-sm mt-0.5">{FESTIVAL_INFO.venue} — {FESTIVAL_INFO.hours.split(",")[0]}</p>
          </div>
          <div className="bg-white/5 rounded-full px-3 py-1.5 border border-white/10">
            <span className="text-xs text-white/60 font-display">Offline Ready</span>
          </div>
        </div>
      </div>

      {/* Live / Coming Up */}
      <div className="px-4 mb-6">
        <LiveNow />
      </div>

      {/* Quick Actions Grid */}
      <div className="px-4 mb-6">
        <h2 className="text-sm font-display font-bold text-white/60 uppercase tracking-wider mb-3">Quick Access</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/guide/coachella/schedule" className="bg-white/5 rounded-xl p-4 border border-white/10 active:bg-white/10 transition-colors">
            <span className="text-2xl mb-2 block">📋</span>
            <span className="font-display font-bold text-sm text-white">Full Schedule</span>
            <span className="text-white/40 text-xs block mt-0.5">All stages & set times</span>
          </Link>
          <Link href="/guide/coachella/map" className="bg-white/5 rounded-xl p-4 border border-white/10 active:bg-white/10 transition-colors">
            <span className="text-2xl mb-2 block">🗺️</span>
            <span className="font-display font-bold text-sm text-white">Venue Map</span>
            <span className="text-white/40 text-xs block mt-0.5">Water, food, restrooms</span>
          </Link>
          <Link href="/guide/coachella/faq" className="bg-white/5 rounded-xl p-4 border border-white/10 active:bg-white/10 transition-colors">
            <span className="text-2xl mb-2 block">❓</span>
            <span className="font-display font-bold text-sm text-white">FAQ</span>
            <span className="text-white/40 text-xs block mt-0.5">Parking, weather, rules</span>
          </Link>
          <Link href="/guide/coachella/my-schedule" className="bg-white/5 rounded-xl p-4 border border-white/10 active:bg-white/10 transition-colors">
            <span className="text-2xl mb-2 block">⭐</span>
            <span className="font-display font-bold text-sm text-white">My Schedule</span>
            <span className="text-white/40 text-xs block mt-0.5">Your saved acts</span>
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
