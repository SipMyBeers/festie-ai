"use client";

import { useState } from "react";
import Link from "next/link";
import { FAQ } from "@/lib/sms/knowledge";
import { BottomNav } from "@/components/ui/BottomNav";

const FAQ_CATEGORIES = [
  { title: "Getting There", color: "#7c3aed", keys: ["parking", "shuttle", "rideshare"] },
  { title: "At the Festival", color: "#ec4899", keys: ["weather", "prohibited", "re_entry", "cash", "phone_charging", "lockers"] },
  { title: "Camping", color: "#f97316", keys: ["camping"] },
  { title: "Health & Safety", color: "#ef4444", keys: ["medical"] },
  { title: "Shopping", color: "#eab308", keys: ["merch"] },
  { title: "Accessibility", color: "#06b6d4", keys: ["accessibility"] },
  { title: "Other", color: "#8b5cf6", keys: ["age", "set_times"] },
];

function formatKey(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <div className="noise pb-20 pt-safe">
      <div className="px-4 pt-6 pb-3 flex items-center gap-3">
        <Link href="/guide/coachella" className="text-white/30 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-display font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">FAQ</h1>
      </div>

      <div className="px-4 space-y-6">
        {FAQ_CATEGORIES.map((cat) => (
          <div key={cat.title}>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color, boxShadow: `0 0 8px ${cat.color}44` }} />
              <h2 className="text-xs font-display font-bold uppercase tracking-[0.15em]" style={{ color: cat.color }}>
                {cat.title}
              </h2>
              <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${cat.color}22, transparent)` }} />
            </div>
            <div className="space-y-1.5">
              {cat.keys.map((key) => {
                const answer = FAQ[key];
                if (!answer) return null;
                const isOpen = openItem === key;
                return (
                  <button
                    key={key}
                    onClick={() => setOpenItem(isOpen ? null : key)}
                    className={`w-full text-left glass rounded-xl overflow-hidden transition-all ${isOpen ? "ring-1" : ""}`}
                    style={isOpen ? { borderColor: `${cat.color}33`, boxShadow: `0 0 0 1px ${cat.color}22` } : undefined}
                  >
                    <div className="flex justify-between items-center p-3.5">
                      <span className="font-display font-bold text-sm text-white">{formatKey(key)}</span>
                      <svg
                        className="w-4 h-4 text-white/20 transition-transform duration-200"
                        style={isOpen ? { transform: "rotate(180deg)", color: cat.color } : undefined}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    {isOpen && (
                      <div className="px-3.5 pb-3.5">
                        <div className="h-px mb-3" style={{ background: `linear-gradient(90deg, ${cat.color}22, transparent)` }} />
                        <p className="text-white/50 text-sm leading-relaxed">{answer}</p>
                      </div>
                    )}
                  </button>
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
