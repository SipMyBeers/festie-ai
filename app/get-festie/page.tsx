"use client";

import Link from "next/link";
import { FestieAvatar } from "@/components/ui/FestieAvatar";

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/5kQaEX0BY5pB3G88ww3F602";

const FEATURES = [
  {
    title: "AI Festival Guide",
    desc: "Ask anything about Coachella. Gemma 4 AI runs directly on your phone — zero internet, zero tracking.",
    gradient: "from-festie-purple to-violet-600",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
  },
  {
    title: "Live Schedule",
    desc: "Every stage, every set time. Uses your phone's clock to show who's on right now — no signal needed.",
    gradient: "from-festie-pink to-rose-600",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Venue Map",
    desc: "Water stations, restrooms, food courts, medical tents — all pinned and searchable, works in airplane mode.",
    gradient: "from-emerald-500 to-teal-600",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
  {
    title: "My Schedule",
    desc: "Star your must-sees, build your day, never miss a set. All saved locally on your device.",
    gradient: "from-festie-gold to-amber-600",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
  {
    title: "100% Private",
    desc: "No cloud. No analytics. No data leaves your device. Ever. The AI runs entirely on your hardware.",
    gradient: "from-cyan-500 to-blue-600",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    title: "Works Offline Forever",
    desc: "Download once on WiFi before the fest. Opens like a native app from your home screen. No app store.",
    gradient: "from-festie-orange to-red-600",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
];

const STEPS = [
  { num: "01", title: "Buy Festie AI", desc: "One tap. $4.99. Instant access to everything." },
  { num: "02", title: "Download the AI on WiFi", desc: "~500MB one-time download. Gets cached on your phone permanently." },
  { num: "03", title: "Add to Home Screen", desc: "Tap share, then 'Add to Home Screen'. Opens like a real app." },
  { num: "04", title: "Use at the festival", desc: "Ask Festie anything. Schedule, food, water, tips. Zero signal required." },
];

export default function GetFestiePage() {
  return (
    <div className="min-h-screen bg-festie-dark text-white noise">
      {/* Ambient glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-festie-purple/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-1/3 right-0 w-[400px] h-[400px] bg-festie-pink/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-festie-orange/6 rounded-full blur-[80px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative px-4 py-4 flex items-center justify-between max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-white/30 hover:text-white text-sm flex items-center gap-2 transition-colors font-display"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          festie.ai
        </Link>
      </nav>

      {/* Hero */}
      <div className="relative px-4 pt-8 pb-14 text-center max-w-xl mx-auto">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-festie-purple to-festie-pink rounded-full blur-2xl opacity-30 scale-150" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-festie-purple to-festie-pink rounded-full flex items-center justify-center p-2">
              <FestieAvatar size={64} animated />
            </div>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-display leading-tight">
          Your{" "}
          <span className="bg-gradient-to-r from-festie-purple via-festie-pink to-festie-orange bg-clip-text text-transparent">
            AI festival buddy
          </span>
          <br />that works offline
        </h1>
        <p className="text-white/40 text-lg mt-4 leading-relaxed max-w-md mx-auto">
          Festie runs Gemma 4 AI directly on your phone. No WiFi, no cell service, no problem.
        </p>
        <a
          href={STRIPE_PAYMENT_LINK}
          className="inline-block mt-8 bg-gradient-to-r from-festie-purple to-festie-pink text-white font-bold text-lg px-10 py-4 rounded-full hover:opacity-90 transition-all shadow-lg shadow-purple-500/25 font-display hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          Get Festie AI — $4.99
        </a>
        <p className="text-white/20 text-xs mt-3 tracking-wide">One-time purchase &middot; No subscription &middot; No data leaves your phone</p>
      </div>

      <div className="warm-divider max-w-2xl mx-auto mb-14" />

      {/* Features */}
      <div className="relative px-4 pb-14 max-w-2xl mx-auto">
        <h2 className="text-xs font-display font-bold text-white/25 uppercase tracking-[0.25em] text-center mb-10">
          Everything you need, zero signal required
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map((item) => (
            <div key={item.title} className="glass rounded-2xl p-5 group hover:scale-[1.01] transition-transform">
              <div className={`icon-badge bg-gradient-to-br ${item.gradient} text-white mb-4 shadow-lg`}>
                {item.icon}
              </div>
              <h3 className="font-display font-bold text-white text-sm">{item.title}</h3>
              <p className="text-white/35 text-sm mt-1.5 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="warm-divider max-w-xl mx-auto mb-14" />

      {/* How it works */}
      <div className="relative px-4 pb-14 max-w-xl mx-auto">
        <h2 className="text-xs font-display font-bold text-white/25 uppercase tracking-[0.25em] text-center mb-10">
          How it works
        </h2>
        <div className="space-y-1">
          {STEPS.map((item, i) => (
            <div key={item.num} className="flex gap-5 items-start py-5">
              <div className="relative">
                <span className="text-2xl font-display font-bold bg-gradient-to-b from-festie-purple to-festie-purple/20 bg-clip-text text-transparent">
                  {item.num}
                </span>
                {i < STEPS.length - 1 && (
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-festie-purple/20 to-transparent" />
                )}
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-sm">{item.title}</h3>
                <p className="text-white/35 text-sm mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compatibility */}
      <div className="px-4 pb-8 max-w-xl mx-auto">
        <div className="glass rounded-2xl p-5 text-center">
          <p className="text-white/50 text-xs font-display font-bold uppercase tracking-wider">Supported devices</p>
          <p className="text-white/25 text-xs mt-2 leading-relaxed">
            Chrome on Android &middot; Safari on iOS 18+ &middot; Chrome / Edge on desktop<br />
            Best on phones from 2022 or newer
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="relative px-4 pb-16 text-center max-w-xl mx-auto">
        <div className="glass-warm rounded-2xl p-8 glow-purple">
          <p className="text-xs font-display font-bold text-white/25 uppercase tracking-wider">Coachella 2026</p>
          <p className="text-white/30 text-xs mt-1">April 10–12 &middot; Indio, CA</p>
          <p className="text-4xl font-bold my-5 font-display bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">$4.99</p>
          <a
            href={STRIPE_PAYMENT_LINK}
            className="block w-full bg-gradient-to-r from-festie-purple to-festie-pink text-white font-bold text-lg px-8 py-4 rounded-full hover:opacity-90 transition-all font-display hover:scale-[1.01] active:scale-[0.98]"
          >
            Get Festie AI
          </a>
          <p className="text-white/15 text-xs mt-3">
            Offline AI &middot; No subscription &middot; Instant access
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 py-8 text-center">
        <div className="warm-divider max-w-xs mx-auto mb-6" />
        <p className="text-white/15 text-xs">festie.ai — AI that runs on your phone, not in a cloud</p>
      </footer>
    </div>
  );
}
