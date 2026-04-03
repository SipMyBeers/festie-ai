"use client";

import { motion } from "framer-motion";
import { useFestieStore } from "@/lib/store";
import { SearchBar } from "./SearchBar";
import { FilterChips } from "./FilterChips";

export function SolarSystemUI() {
  const cameraMode = useFestieStore((s) => s.cameraMode);

  if (cameraMode !== "solar-system") return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="fixed top-0 left-0 right-0 z-10 p-4 pointer-events-none"
    >
      <div className="max-w-md mx-auto space-y-3 pointer-events-auto">
        <SearchBar />
        <FilterChips />
      </div>
    </motion.div>
  );
}
