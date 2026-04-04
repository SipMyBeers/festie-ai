"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFestieStore } from "@/lib/store";

export function ExploreHint() {
  const cameraMode = useFestieStore((s) => s.cameraMode);
  const [show, setShow] = useState(true);

  // Auto-hide after 5 seconds
  useEffect(() => {
    if (cameraMode === "exploring") {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [cameraMode]);

  if (cameraMode !== "exploring") return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        >
          <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-xl px-5 py-3 text-center">
            <p className="text-white text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>
              WASD to move — Space to jump — Drag to look around
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
