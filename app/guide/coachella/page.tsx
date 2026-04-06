"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { coachellaStages } from "@/lib/data/coachella-lineup";
import { FESTIVAL_INFO } from "@/lib/sms/knowledge";
import { ServiceWorkerRegister } from "../sw-register";
import { BottomNav } from "@/components/ui/BottomNav";
import { InstallPrompt } from "@/components/ui/InstallPrompt";

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

  const liveActs: { artist: string; stage: string; endTime: string; color: string }[] = [];
  const upNext: { artist: string; stage: string; startTime: string; minsUntil: number; color: string }[] = [];

  for (const stage of coachellaStages) {
    for (const perf of stage.schedule) {
      const start = new Date(perf.startTime);
      const end = new Date(perf.endTime);
      if (start <= now && end > now) {
        liveActs.push({ artist: perf.artistName, stage: stage.name, endTime: formatTime(perf.endTime), color: stage.color });
      }
      const minsUntil = (start.getTime() - now.getTime()) / 60000;
      if (minsUntil > 0 && minsUntil <= 60) {
        upNext.push({ artist: perf.artistName, stage: stage.name, startTime: formatTime(perf.startTime), minsUntil: Math.round(minsUntil), color: stage.color });
      }
    }
  }
  upNext.sort((a, b) => a.minsUntil - b.minsUntil);

  return (
    <div className="space-y-4">
      {liveActs.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <h2 className="text-xs font-display font-bold text-red-400 uppercase tracking-[0.2em]">Live Now</h2>
          </div>
          <div className="space-y-2">
            {liveActs.map((act) => (
              <div
                key={act.artist}
                className="stage-card rounded-xl p-3.5"
                style={{ "--stage-color": act.color } as React.CSSProperties}
              >
                <p className="font-display font-bold text-white">{act.artist}</p>
                <p className="text-white/40 text-sm mt-0.5">
                  <span style={{ color: act.color }}>{act.stage}</span>
                  <span className="text-white/20"> &middot; </span>
                  til {act.endTime}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {upNext.length > 0 && (
        <div>
          <h2 className="text-xs font-display font-bold text-festie-cyan/80 uppercase tracking-[0.2em] mb-3">Coming Up</h2>
          <div className="space-y-2">
            {upNext.slice(0, 4).map((act) => (
              <div
                key={act.artist}
                className="glass rounded-xl p-3.5 flex justify-between items-center"
              >
                <div>
                  <p className="font-display font-bold text-white text-sm">{act.artist}</p>
                  <p className="text-white/35 text-xs mt-0.5">
                    <span style={{ color: act.color }}>{act.stage}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-festie-cyan font-display font-bold text-sm">{act.minsUntil}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {liveActs.length === 0 && upNext.length === 0 && (
        <div className="glass-warm rounded-2xl p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-festie-purple/20 to-festie-pink/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-festie-purple/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <p className="text-white/50 text-sm font-display font-bold">No live sets right now</p>
          <p className="text-white/25 text-xs mt-1">Music runs 1pm — 1am Fri/Sat, 1pm — 12am Sun</p>
        </div>
      )}
    </div>
  );
}

const QUICK_LINKS = [
  {
    href: "/guide/coachella/schedule",
    title: "Schedule",
    desc: "All stages & set times",
    gradient: "from-festie-purple to-violet-600",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    href: "/guide/coachella/map",
    title: "Venue Guide",
    desc: "Water, food, restrooms",
    gradient: "from-emerald-500 to-teal-600",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
  {
    href: "/guide/coachella/faq",
    title: "FAQ",
    desc: "Parking, weather, rules",
    gradient: "from-amber-500 to-orange-600",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    href: "/guide/coachella/my-schedule",
    title: "My Schedule",
    desc: "Your saved acts",
    gradient: "from-festie-pink to-rose-600",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
];

export default function GuidePage() {
  return (
    <div className="noise pb-20 pt-safe">
      <ServiceWorkerRegister />

      {/* Ambient background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-festie-purple/8 via-festie-pink/4 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">
              <span className="bg-gradient-to-r from-festie-purple via-festie-pink to-festie-orange bg-clip-text text-transparent">
                Coachella 2026
              </span>
            </h1>
            <p className="text-white/30 text-xs mt-1 tracking-wide">{FESTIVAL_INFO.venue} &middot; Weekend 1</p>
          </div>
          <div className="glass rounded-full px-3 py-1.5">
            <span className="text-[10px] text-green-400 font-display font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              Offline
            </span>
          </div>
        </div>
      </div>

      {/* Live / Coming Up */}
      <div className="relative px-4 mb-6">
        <LiveNow />
      </div>

      {/* Festie AI CTA */}
      <div className="relative px-4 mb-6">
        <Link href="/guide/coachella/ai" className="block">
          <div className="glass-warm rounded-2xl p-4 glow-purple relative overflow-hidden">
            {/* Animated shimmer */}
            <div className="absolute inset-0 animate-shimmer rounded-2xl" />
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-festie-purple to-festie-pink rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-display font-bold text-white text-sm">Ask Festie AI</p>
                <p className="text-white/35 text-xs mt-0.5">On-device AI &middot; works offline &middot; no data leaves your phone</p>
              </div>
              <svg className="w-5 h-5 text-white/20 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      <div className="warm-divider mx-4 mb-6" />

      {/* Quick Actions Grid */}
      <div className="relative px-4 mb-6">
        <h2 className="text-xs font-display font-bold text-white/30 uppercase tracking-[0.2em] mb-3">Quick Access</h2>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="glass rounded-2xl p-4 active:scale-[0.98] transition-transform"
            >
              <div className={`icon-badge bg-gradient-to-br ${link.gradient} text-white mb-3 shadow-lg`}>
                {link.icon}
              </div>
              <span className="font-display font-bold text-sm text-white block">{link.title}</span>
              <span className="text-white/30 text-xs block mt-0.5">{link.desc}</span>
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
      <InstallPrompt />
    </div>
  );
}
