"use client";

import { useState } from "react";
import Link from "next/link";
import { FAQ } from "@/lib/sms/knowledge";
import { BottomNav } from "@/components/ui/BottomNav";

const FAQ_CATEGORIES = [
  { title: "Getting There", keys: ["parking", "shuttle", "rideshare"] },
  { title: "At the Festival", keys: ["weather", "prohibited", "re_entry", "cash", "phone_charging", "lockers"] },
  { title: "Camping", keys: ["camping"] },
  { title: "Health & Safety", keys: ["medical"] },
  { title: "Shopping", keys: ["merch"] },
  { title: "Accessibility", keys: ["accessibility"] },
  { title: "Other", keys: ["age", "set_times"] },
];

function formatKey(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <div className="pb-20 pt-safe">
      <div className="px-4 pt-6 pb-4 flex items-center gap-3">
        <Link href="/guide/coachella" className="text-white/40 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-display font-bold text-white">FAQ</h1>
      </div>

      <div className="px-4 space-y-6">
        {FAQ_CATEGORIES.map((cat) => (
          <div key={cat.title}>
            <h2 className="text-sm font-display font-bold text-festie-purple uppercase tracking-wider mb-2">{cat.title}</h2>
            <div className="space-y-1.5">
              {cat.keys.map((key) => {
                const answer = FAQ[key];
                if (!answer) return null;
                const isOpen = openItem === key;
                return (
                  <button
                    key={key}
                    onClick={() => setOpenItem(isOpen ? null : key)}
                    className="w-full text-left bg-white/5 rounded-xl border border-white/10 overflow-hidden"
                  >
                    <div className="flex justify-between items-center p-3">
                      <span className="font-display font-bold text-sm text-white">{formatKey(key)}</span>
                      <svg className={`w-4 h-4 text-white/30 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    {isOpen && (
                      <div className="px-3 pb-3">
                        <p className="text-white/60 text-sm leading-relaxed">{answer}</p>
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
