"use client";

import Link from "next/link";
import { FESTIVAL_INFO, WATER_STATIONS, RESTROOMS, FOOD_AREAS } from "@/lib/sms/knowledge";
import { BottomNav } from "@/components/ui/BottomNav";

function SectionHeader({ color, title, icon }: { color: string; title: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div
        className="icon-badge text-white shadow-lg"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, boxShadow: `0 4px 20px ${color}33` }}
      >
        {icon}
      </div>
      <div>
        <h2 className="font-display font-bold text-sm text-white">{title}</h2>
      </div>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}33, transparent)` }} />
    </div>
  );
}

export default function MapPage() {
  return (
    <div className="noise pb-20 pt-safe">
      <div className="px-4 pt-6 pb-3 flex items-center gap-3">
        <Link href="/guide/coachella" className="text-white/30 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-display font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Venue Guide</h1>
      </div>

      {/* Stages */}
      <div className="px-4 mb-8">
        <SectionHeader
          color="#7c3aed"
          title="Stages"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
            </svg>
          }
        />
        <div className="space-y-1.5">
          {FESTIVAL_INFO.stages.map((stage) => (
            <div key={stage.name} className="glass rounded-xl p-3.5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-8 rounded-full bg-festie-purple" />
                <span className="font-display font-bold text-sm text-white">{stage.name}</span>
              </div>
              <span className="text-white/25 text-xs font-display capitalize">{stage.area}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Water */}
      <div className="px-4 mb-8">
        <SectionHeader
          color="#3b82f6"
          title="Water Stations"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          }
        />
        <div className="space-y-1.5">
          {WATER_STATIONS.map((station) => (
            <div key={station.name} className="glass rounded-xl p-3.5" style={{ borderLeft: "3px solid #3b82f6" }}>
              <p className="font-display font-bold text-sm text-white">{station.name}</p>
              <p className="text-white/30 text-xs mt-0.5">{station.landmark}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Restrooms */}
      <div className="px-4 mb-8">
        <SectionHeader
          color="#22c55e"
          title="Restrooms"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          }
        />
        <div className="space-y-1.5">
          {RESTROOMS.map((restroom) => (
            <div key={restroom.name} className="glass rounded-xl p-3.5" style={{ borderLeft: "3px solid #22c55e" }}>
              <div className="flex justify-between items-center">
                <p className="font-display font-bold text-sm text-white">{restroom.name}</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-display">{restroom.type}</span>
              </div>
              <p className="text-white/30 text-xs mt-0.5">Near {restroom.near}{restroom.note ? ` — ${restroom.note}` : ""}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Food */}
      <div className="px-4 mb-8">
        <SectionHeader
          color="#f97316"
          title="Food & Drink"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
            </svg>
          }
        />
        <div className="space-y-1.5">
          {FOOD_AREAS.map((area) => (
            <div key={area.name} className="glass rounded-xl p-3.5" style={{ borderLeft: "3px solid #f97316" }}>
              <p className="font-display font-bold text-sm text-white">{area.name}</p>
              <p className="text-white/30 text-xs mt-0.5">Near {area.near}{area.note ? ` — ${area.note}` : ""}</p>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {area.cuisine.map((c) => (
                  <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-300/70 capitalize font-display">{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
