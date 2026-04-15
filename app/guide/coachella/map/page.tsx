"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { FESTIVAL_INFO, WATER_STATIONS, RESTROOMS, FOOD_AREAS } from "@/lib/sms/knowledge";
import { BottomNav } from "@/components/ui/BottomNav";

type AmenityTab = "stages" | "water" | "restrooms" | "food";

const TABS: { key: AmenityTab; label: string; icon: React.ReactNode; color: string }[] = [
  {
    key: "stages",
    label: "Stages",
    color: "#7c3aed",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
      </svg>
    ),
  },
  {
    key: "water",
    label: "Water",
    color: "#3b82f6",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
  {
    key: "restrooms",
    label: "Restrooms",
    color: "#22c55e",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
  {
    key: "food",
    label: "Food",
    color: "#f97316",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      </svg>
    ),
  },
];

function CompassOverlay() {
  return (
    <div className="absolute top-3 left-3 z-10 flex flex-col items-center gap-0.5">
      <div className="glass rounded-xl px-2.5 py-1.5 flex flex-col items-center">
        <span className="text-[10px] font-display font-bold text-white/60 tracking-wider">N</span>
        <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l4 8H8l4-8z" />
        </svg>
        <div className="w-px h-2 bg-white/20" />
        <svg className="w-4 h-4 text-white/30 rotate-180" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l4 8H8l4-8z" />
        </svg>
        <span className="text-[10px] font-display font-bold text-white/30 tracking-wider">S</span>
      </div>
    </div>
  );
}

function MountainLabels() {
  return (
    <>
      {/* San Bernardino Mountains — North */}
      <div className="absolute top-3 right-3 z-10">
        <div className="glass rounded-lg px-2 py-1">
          <p className="text-[9px] font-display text-white/40 tracking-wider">
            <span className="text-white/60 font-bold">N</span> — San Bernardino Mtns
          </p>
        </div>
      </div>
      {/* Santa Rosa Mountains — South/East */}
      <div className="absolute bottom-3 right-3 z-10">
        <div className="glass rounded-lg px-2 py-1">
          <p className="text-[9px] font-display text-white/40 tracking-wider">
            <span className="text-white/60 font-bold">S/E</span> — Santa Rosa Mtns
          </p>
        </div>
      </div>
      {/* Little San Bernardino — West */}
      <div className="absolute bottom-3 left-3 z-10">
        <div className="glass rounded-lg px-2 py-1">
          <p className="text-[9px] font-display text-white/40 tracking-wider">
            <span className="text-white/60 font-bold">W</span> — Little San Bernardino
          </p>
        </div>
      </div>
    </>
  );
}

function ZoomableMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const lastDist = useRef(0);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newScale = Math.min(4, Math.max(1, scale - e.deltaY * 0.002));
    setScale(newScale);
    if (newScale === 1) setTranslate({ x: 0, y: 0 });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || scale <= 1) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setTranslate((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const handlePointerUp = () => setIsDragging(false);

  // Pinch-to-zoom
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (lastDist.current > 0) {
        const delta = dist - lastDist.current;
        const newScale = Math.min(4, Math.max(1, scale + delta * 0.005));
        setScale(newScale);
        if (newScale === 1) setTranslate({ x: 0, y: 0 });
      }
      lastDist.current = dist;
    }
  };

  const handleTouchEnd = () => {
    lastDist.current = 0;
  };

  const resetZoom = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#e8ddd0] touch-none"
        style={{ aspectRatio: "1080/1350" }}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <CompassOverlay />
        <MountainLabels />

        <div
          style={{
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
        >
          <Image
            src="/images/coachella-venue-map-2026.jpg"
            alt="Coachella 2026 Venue Map — Empire Polo Club, Indio CA"
            width={1080}
            height={1350}
            priority
            className="w-full h-auto select-none"
            draggable={false}
          />
        </div>

        {/* Zoom hint */}
        {scale === 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
            <div className="glass rounded-full px-3 py-1">
              <span className="text-[10px] font-display text-white/40">Pinch or scroll to zoom</span>
            </div>
          </div>
        )}
      </div>

      {/* Zoom controls */}
      {scale > 1 && (
        <button
          onClick={resetZoom}
          className="absolute top-3 left-1/2 -translate-x-1/2 z-20 glass rounded-full px-3 py-1.5 text-xs font-display font-bold text-white/60 hover:text-white transition-colors"
        >
          Reset Zoom
        </button>
      )}
    </div>
  );
}

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
  const [activeTab, setActiveTab] = useState<AmenityTab>("stages");

  return (
    <div className="noise pb-20 pt-safe">
      <div className="px-4 pt-6 pb-3 flex items-center gap-3">
        <Link href="/guide/coachella" className="text-white/30 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-display font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Venue Map</h1>
      </div>

      {/* Orientation banner */}
      <div className="px-4 mb-4">
        <div className="glass rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292M6.115 5.19A9 9 0 1017.18 4.64M6.115 5.19A8.965 8.965 0 0112 3c1.929 0 3.72.607 5.18 1.64" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-white/50 font-display">
              <span className="text-white/70 font-bold">North</span> = San Bernardino Mtns &middot;
              <span className="text-white/70 font-bold"> South/East</span> = Santa Rosa Mtns &middot;
              <span className="text-white/70 font-bold"> West</span> = Little San Bernardino
            </p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="px-4 mb-6">
        <ZoomableMap />
      </div>

      {/* Amenity tabs */}
      <div className="px-4 mb-4">
        <div className="glass rounded-2xl p-1.5 flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 rounded-xl text-xs font-display font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === tab.key
                  ? "text-white shadow-lg"
                  : "text-white/30 hover:text-white/50"
              }`}
              style={
                activeTab === tab.key
                  ? { background: `linear-gradient(135deg, ${tab.color}, ${tab.color}cc)`, boxShadow: `0 4px 20px ${tab.color}33` }
                  : undefined
              }
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Amenity content */}
      <div className="px-4 mb-8">
        {activeTab === "stages" && (
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
        )}

        {activeTab === "water" && (
          <div className="space-y-1.5">
            {WATER_STATIONS.map((station) => (
              <div key={station.name} className="glass rounded-xl p-3.5" style={{ borderLeft: "3px solid #3b82f6" }}>
                <p className="font-display font-bold text-sm text-white">{station.name}</p>
                <p className="text-white/30 text-xs mt-0.5">{station.landmark}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "restrooms" && (
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
        )}

        {activeTab === "food" && (
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
        )}
      </div>

      <BottomNav />
    </div>
  );
}
