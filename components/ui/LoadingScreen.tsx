"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useFestieStore } from "@/lib/store";

export function LoadingScreen() {
  const { assetsLoaded, loadingProgress } = useFestieStore();

  return (
    <AnimatePresence>
      {!assetsLoaded && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-festie-dark"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-display font-bold bg-gradient-to-r from-festie-purple via-festie-pink to-festie-cyan bg-clip-text text-transparent mb-8">
            FESTIE.AI
          </h1>
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-festie-purple to-festie-pink rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="mt-4 text-white/40 text-sm font-body">
            Entering the festival universe...
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
