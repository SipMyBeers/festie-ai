"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FestieAvatar } from "./FestieAvatar";

const STORAGE_KEY = "festie-onboarding-complete";

interface OnboardingStep {
  message: string;
  action?: string;
  highlight?: string; // CSS selector to highlight
}

const STEPS: OnboardingStep[] = [
  {
    message:
      "YOOO welcome to the festival universe!! 🛸 I'm Festie — your alien festival guide. Let me show you around real quick!",
  },
  {
    message:
      "See those planets orbiting? 🪐 Each one is a real music festival. Coachella is fully loaded — tap it to fly there!",
    highlight: "canvas",
  },
  {
    message:
      "Once you're on a planet, hit 'Explore on Foot' to walk around the festival grounds. On mobile, use the joystick to move! 🕹️",
  },
  {
    message:
      "Need info at the festival? Text me at (877) 509-2803 📱 I know every set time, water station, and food spot. Or just use the chat bubble!",
  },
  {
    message:
      "Want the FULL offline guide? Tap 'Get Festie' — it works without WiFi or cell service. Perfect for when you're deep in the crowd 🔥",
    action: "get-festie",
  },
  {
    message:
      "That's it! Go explore the universe. I'm always right here if you need me 👽✨",
  },
];

function useOnboardingState() {
  const [state, setState] = useState<"loading" | "active" | "dismissed">("loading");

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (done) {
      setState("dismissed");
      return;
    }
    // Delay start so the 3D scene loads first
    const timer = setTimeout(() => setState("active"), 2000);
    return () => clearTimeout(timer);
  }, []);

  return [state, setState] as const;
}

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [state, setState] = useOnboardingState();

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      complete();
    }
  };

  const complete = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setState("dismissed");
  };

  const handleAction = (action: string) => {
    if (action === "get-festie") {
      window.location.href = "/get-festie";
    }
  };

  if (state !== "active") return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <AnimatePresence>
      {state === "active" && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={complete}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="fixed bottom-8 left-4 right-4 md:left-auto md:right-8 md:max-w-sm z-50"
          >
            <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-5 shadow-2xl shadow-purple-500/10">
              {/* Avatar + message */}
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#7c3aed] to-[#ec4899] rounded-full flex items-center justify-center shrink-0 p-1">
                  <FestieAvatar size={32} animated />
                </div>
                <div className="flex-1">
                  <p
                    className="text-white/50 text-xs font-bold mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Festie 👽
                  </p>
                  <p className="text-white text-sm leading-relaxed">{current.message}</p>
                </div>
              </div>

              {/* Action button if step has one */}
              {current.action && (
                <button
                  onClick={() => handleAction(current.action!)}
                  className="mt-3 ml-15 bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {current.action === "get-festie" ? "Get Festie Offline — $4.99" : current.action}
                </button>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                {/* Progress dots */}
                <div className="flex gap-1.5">
                  {STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        i === step
                          ? "bg-[#7c3aed]"
                          : i < step
                          ? "bg-[#7c3aed]/40"
                          : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={complete}
                    className="text-white/30 text-xs hover:text-white/60 transition-colors"
                  >
                    Skip
                  </button>
                  <button
                    onClick={next}
                    className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {isLast ? "Let's go! 🚀" : "Next →"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
