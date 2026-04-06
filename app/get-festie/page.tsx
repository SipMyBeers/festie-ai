"use client";

import Link from "next/link";
import { FestieAvatar } from "@/components/ui/FestieAvatar";

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/5kQaEX0BY5pB3G88ww3F602";

export default function GetFestiePage() {
  const handlePurchase = () => {
    window.location.href = STRIPE_PAYMENT_LINK;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="px-4 py-4 flex items-center justify-between max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          festie.ai
        </Link>
      </nav>

      {/* Hero */}
      <div className="px-4 pt-8 pb-12 text-center max-w-xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-[#7c3aed] to-[#ec4899] rounded-full flex items-center justify-center p-2">
            <FestieAvatar size={64} animated />
          </div>
        </div>
        <h1
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your{" "}
          <span className="bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#f97316] bg-clip-text text-transparent">
            AI festival buddy
          </span>
          {" "}that works offline
        </h1>
        <p className="text-white/60 text-lg mb-2">
          Festie runs Gemma 4 AI directly on your phone. No WiFi, no cell service, no problem.
        </p>
        <p className="text-white/40 text-sm mb-8">
          Ask anything about Coachella — stages, food, water, set times, tips — and get instant answers even in the desert.
        </p>
        <button
          onClick={handlePurchase}
          className="bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white font-bold text-lg px-8 py-4 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Get Festie AI — $4.99
        </button>
        <p className="text-white/30 text-xs mt-3">One-time purchase. No subscription. No data leaves your phone.</p>
      </div>

      {/* What you get */}
      <div className="px-4 pb-12 max-w-2xl mx-auto">
        <h2
          className="text-xl font-bold text-center mb-8"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Everything you need, zero signal required
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              emoji: "🤖",
              title: "AI Festival Guide",
              desc: "Ask Festie anything — powered by Gemma 4 running 100% on your phone. No internet needed.",
            },
            {
              emoji: "📋",
              title: "Full Schedule",
              desc: "Every stage, every set time. Filter by day, stage, or genre. Star your favorites.",
            },
            {
              emoji: "🔴",
              title: "What's Live Now",
              desc: "Uses your phone's clock — knows who's playing right now without any internet.",
            },
            {
              emoji: "🗺️",
              title: "Venue Map",
              desc: "Water stations, restrooms, food vendors, medical tents. All pinned and searchable.",
            },
            {
              emoji: "⭐",
              title: "My Schedule",
              desc: "Build your perfect day. Save acts, see conflicts, never miss your must-sees.",
            },
            {
              emoji: "🔒",
              title: "100% Private",
              desc: "No cloud. No tracking. No data leaves your device. Ever. Runs entirely on-device.",
            },
          ].map((item) => (
            <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-5">
              <span className="text-2xl">{item.emoji}</span>
              <h3
                className="font-bold text-sm text-white mt-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.title}
              </h3>
              <p className="text-white/50 text-sm mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="px-4 pb-12 max-w-xl mx-auto">
        <h2
          className="text-xl font-bold text-center mb-8"
          style={{ fontFamily: "var(--font-display)" }}
        >
          How it works
        </h2>
        <div className="space-y-6">
          {[
            { step: "1", title: "Buy Festie AI", desc: "One tap. $4.99. Instant access." },
            {
              step: "2",
              title: "Download the AI on WiFi",
              desc: "~500MB one-time download. Festie AI gets cached on your phone forever.",
            },
            {
              step: "3",
              title: "Add to Home Screen",
              desc: "Tap share → 'Add to Home Screen'. Opens like a real app.",
            },
            {
              step: "4",
              title: "Use at the festival",
              desc: "Ask Festie anything — stages, food, water, tips. Works with zero signal. AI runs right on your phone.",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 items-start">
              <div
                className="w-8 h-8 bg-gradient-to-br from-[#7c3aed] to-[#ec4899] rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.step}
              </div>
              <div>
                <h3
                  className="font-bold text-sm text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.title}
                </h3>
                <p className="text-white/50 text-sm mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compatibility note */}
      <div className="px-4 pb-8 max-w-xl mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
          <p className="text-white/60 text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Works on
          </p>
          <p className="text-white/40 text-xs mt-1">
            Chrome on Android, Safari on iOS 18+, Chrome/Edge on desktop.
            Requires a phone from 2022 or newer for best performance.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-4 pb-16 text-center max-w-xl mx-auto">
        <div className="bg-gradient-to-r from-[#7c3aed]/20 to-[#ec4899]/20 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
            Coachella 2026
          </h2>
          <p className="text-white/50 mb-1">April 10-12 — Indio, CA</p>
          <p className="text-3xl font-bold my-4" style={{ fontFamily: "var(--font-display)" }}>
            $4.99
          </p>
          <button
            onClick={handlePurchase}
            className="w-full bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white font-bold text-lg px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Get Festie AI
          </button>
          <p className="text-white/30 text-xs mt-3">
            Offline AI. No subscription. Instant access.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-white/5 text-center">
        <p className="text-white/20 text-xs">festie.ai — AI that runs on your phone, not in a cloud</p>
      </footer>
    </div>
  );
}
