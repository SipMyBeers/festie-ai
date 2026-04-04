"use client";

import Link from "next/link";
import { FestieAvatar } from "@/components/ui/FestieAvatar";

export default function GetFestiePage() {
  const handlePurchase = async () => {
    // TODO: Stripe checkout — for now, just redirect to the guide
    // Once Stripe is configured, this will create a Checkout Session
    // and redirect to Stripe's hosted checkout page
    if (process.env.NEXT_PUBLIC_STRIPE_ENABLED === "true") {
      const res = await fetch("/api/checkout", { method: "POST" });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } else {
      // Free access during beta / before Stripe is configured
      window.location.href = "/guide/coachella";
    }
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
          Take Festie to the{" "}
          <span className="bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#f97316] bg-clip-text text-transparent">
            festival
          </span>
        </h1>
        <p className="text-white/60 text-lg mb-8">
          Your pocket festival guide that works without WiFi or cell service. Built for Coachella
          2026.
        </p>
        <button
          onClick={handlePurchase}
          className="bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white font-bold text-lg px-8 py-4 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Get Festie for Coachella — $4.99
        </button>
        <p className="text-white/30 text-xs mt-3">One-time purchase. No subscription. No ads.</p>
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
              emoji: "❓",
              title: "Festival FAQ",
              desc: "Parking, weather, what to bring, camping, rideshare tips. Everything you'd Google.",
            },
            {
              emoji: "📱",
              title: "Add to Home Screen",
              desc: "Opens like a real app. No app store download. Installs in 2 seconds.",
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
            { step: "1", title: "Buy Festie", desc: "One tap. $4.99. Instant access." },
            {
              step: "2",
              title: "Open on your phone",
              desc: "We'll text you a link (or just visit festie.ai/guide/coachella on WiFi before the fest).",
            },
            {
              step: "3",
              title: "Add to Home Screen",
              desc: "Tap the share button → 'Add to Home Screen'. It downloads everything for offline use.",
            },
            {
              step: "4",
              title: "Use at the festival",
              desc: "Open from your home screen. Works with zero signal. Schedule, map, FAQ — all there.",
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
            Get Festie for Coachella
          </button>
          <p className="text-white/30 text-xs mt-3">
            Works offline. No subscription. Instant access.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-white/5 text-center">
        <p className="text-white/20 text-xs">festie.ai — your pocket festival guide</p>
      </footer>
    </div>
  );
}
