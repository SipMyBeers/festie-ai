"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "festie-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Already installed as PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Already dismissed
    if (localStorage.getItem(STORAGE_KEY)) return;

    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
    setShowBanner(true);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") dismiss();
      setDeferredPrompt(null);
    }
  };

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setShowBanner(false);
  };

  if (isInstalled || !showBanner) return null;

  return (
    <div className="relative px-4 mb-6">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-festie-purple/15 via-[#0a0a0f] to-festie-pink/10">
        {/* Shimmer */}
        <div className="absolute inset-0 animate-shimmer rounded-2xl" />

        {/* Dismiss */}
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 z-10 text-white/20 hover:text-white/50 p-1 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative p-5">
          {/* Header row */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-festie-purple to-festie-pink rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
            </div>
            <div>
              <p className="font-display font-bold text-white text-base">Get the Festival App</p>
              <p className="text-white/40 text-xs mt-0.5">Works offline at the festival — no signal needed</p>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { icon: "wifi-off", label: "Offline Mode" },
              { icon: "map", label: "Venue Map" },
              { icon: "clock", label: "Live Schedule" },
            ].map((f) => (
              <div key={f.label} className="glass rounded-xl p-2.5 text-center">
                <div className="w-8 h-8 mx-auto mb-1.5 rounded-lg bg-white/5 flex items-center justify-center">
                  {f.icon === "wifi-off" && (
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0" />
                    </svg>
                  )}
                  {f.icon === "map" && (
                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                    </svg>
                  )}
                  {f.icon === "clock" && (
                    <svg className="w-4 h-4 text-festie-cyan" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <span className="text-[10px] font-display font-bold text-white/50">{f.label}</span>
              </div>
            ))}
          </div>

          {/* Install action */}
          {deferredPrompt ? (
            <button
              onClick={handleInstall}
              className="w-full bg-gradient-to-r from-festie-purple to-festie-pink text-white text-sm font-display font-bold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
            >
              Add to Home Screen
            </button>
          ) : isIOS ? (
            <div className="glass rounded-xl p-3">
              <p className="text-white/60 text-xs font-display text-center">
                Tap <span className="inline-flex items-center mx-1 px-1.5 py-0.5 rounded bg-white/10 text-white/80 font-bold">
                  <svg className="w-3.5 h-3.5 mr-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3v11.25" />
                  </svg>
                  Share
                </span> then <span className="font-bold text-white/80">&ldquo;Add to Home Screen&rdquo;</span>
              </p>
            </div>
          ) : (
            <div className="glass rounded-xl p-3">
              <p className="text-white/60 text-xs font-display text-center">
                Tap your browser menu <span className="font-bold text-white/80">(&#8942;)</span> then <span className="font-bold text-white/80">&ldquo;Add to Home Screen&rdquo;</span> or <span className="font-bold text-white/80">&ldquo;Install App&rdquo;</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
