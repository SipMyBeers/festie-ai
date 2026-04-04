"use client";

import Link from "next/link";
import { FESTIVAL_INFO, WATER_STATIONS, RESTROOMS, FOOD_AREAS } from "@/lib/sms/knowledge";
import { BottomNav } from "@/components/ui/BottomNav";

export default function MapPage() {
  return (
    <div className="pb-20 pt-safe">
      <div className="px-4 pt-6 pb-2 flex items-center gap-3">
        <Link href="/guide/coachella" className="text-white/40 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-display font-bold text-white">Venue Guide</h1>
      </div>

      {/* Stages */}
      <div className="px-4 mb-6">
        <h2 className="text-sm font-display font-bold text-festie-purple uppercase tracking-wider mb-3">Stages</h2>
        <div className="space-y-2">
          {FESTIVAL_INFO.stages.map((stage) => (
            <div key={stage.name} className="bg-white/5 rounded-xl p-3 border border-white/10 flex justify-between items-center">
              <span className="font-display font-bold text-sm text-white">{stage.name}</span>
              <span className="text-white/40 text-xs capitalize">{stage.area} area</span>
            </div>
          ))}
        </div>
      </div>

      {/* Water */}
      <div className="px-4 mb-6">
        <h2 className="text-sm font-display font-bold text-blue-400 uppercase tracking-wider mb-3">💧 Water Stations</h2>
        <div className="space-y-2">
          {WATER_STATIONS.map((station) => (
            <div key={station.name} className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="font-display font-bold text-sm text-white">{station.name}</p>
              <p className="text-white/40 text-xs">{station.landmark}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Restrooms */}
      <div className="px-4 mb-6">
        <h2 className="text-sm font-display font-bold text-green-400 uppercase tracking-wider mb-3">🚻 Restrooms</h2>
        <div className="space-y-2">
          {RESTROOMS.map((restroom) => (
            <div key={restroom.name} className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex justify-between items-center">
                <p className="font-display font-bold text-sm text-white">{restroom.name}</p>
                <span className="text-white/30 text-xs">{restroom.type}</span>
              </div>
              <p className="text-white/40 text-xs">Near {restroom.near}{restroom.note ? ` — ${restroom.note}` : ""}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Food */}
      <div className="px-4 mb-6">
        <h2 className="text-sm font-display font-bold text-orange-400 uppercase tracking-wider mb-3">🍕 Food & Drink</h2>
        <div className="space-y-2">
          {FOOD_AREAS.map((area) => (
            <div key={area.name} className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="font-display font-bold text-sm text-white">{area.name}</p>
              <p className="text-white/40 text-xs">Near {area.near}{area.note ? ` — ${area.note}` : ""}</p>
              <div className="flex gap-1 mt-1.5 flex-wrap">
                {area.cuisine.map((c) => (
                  <span key={c} className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/50 capitalize">{c}</span>
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
