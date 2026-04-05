"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "festie-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // Don't show if already dismissed or already installed
    if (localStorage.getItem(STORAGE_KEY)) return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    setDismissed(false);

    // Listen for the native install prompt (Chrome/Edge/Android)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // If no native prompt fires after 3s, show manual instructions (iOS Safari)
    const timer = setTimeout(() => {
      setShowFallback(true);
    }, 3000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        dismiss();
      }
      setDeferredPrompt(null);
    }
  };

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
  };

  if (dismissed) return null;

  // Only show if we have a native prompt or the fallback timer fired
  const show = deferredPrompt || showFallback;
  if (!show) return null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        className="fixed bottom-20 left-4 right-4 z-30 md:left-auto md:right-4 md:max-w-sm"
      >
        <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-4 shadow-2xl shadow-purple-500/10">
          <div className="flex items-start gap-3">
            <div className="text-2xl">📱</div>
            <div className="flex-1">
              <p
                className="text-white text-sm font-bold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Add to Home Screen
              </p>
              <p className="text-white/50 text-xs mt-1">
                {isIOS
                  ? "Tap the share button ↑ then \"Add to Home Screen\" for offline access"
                  : "Install Festie for instant offline access at the festival"}
              </p>
            </div>
            <button
              onClick={dismiss}
              className="text-white/30 hover:text-white/60 p-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {deferredPrompt && (
            <button
              onClick={handleInstall}
              className="mt-3 w-full bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white text-sm font-bold py-2.5 rounded-full hover:opacity-90 transition-opacity"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Install Now
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
