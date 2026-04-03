"use client";

import { useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Festival, Performance, Stage } from "@/lib/types";
import { useFestieStore } from "@/lib/store";

interface TimelineProps {
  festival: Festival;
}

function getTimeRange(stages: Stage[]): { start: Date; end: Date } {
  let earliest = Infinity;
  let latest = -Infinity;
  for (const stage of stages) {
    for (const perf of stage.schedule) {
      const start = new Date(perf.startTime).getTime();
      const end = new Date(perf.endTime).getTime();
      if (start < earliest) earliest = start;
      if (end > latest) latest = end;
    }
  }
  return { start: new Date(earliest), end: new Date(latest) };
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function Timeline({ festival }: TimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedStageId = useFestieStore((s) => s.selectedStageId);
  const setSelectedStage = useFestieStore((s) => s.setSelectedStage);

  const timeRange = useMemo(() => getTimeRange(festival.stages), [festival.stages]);
  const totalMs = timeRange.end.getTime() - timeRange.start.getTime();
  const pxPerMs = 0.0003;
  const totalWidth = totalMs * pxPerMs;

  const now = new Date();
  const nowOffset = ((now.getTime() - timeRange.start.getTime()) / totalMs) * totalWidth;

  const days = useMemo(() => {
    const daySet = new Set<string>();
    for (const stage of festival.stages) {
      for (const perf of stage.schedule) {
        daySet.add(new Date(perf.startTime).toLocaleDateString());
      }
    }
    return Array.from(daySet).sort();
  }, [festival.stages]);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-16 left-0 right-0 z-20"
    >
      <div className="mx-2 bg-black/70 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
        <div className="flex border-b border-white/10 px-3 pt-2">
          {days.map((day, i) => (
            <button key={day} className="text-xs px-3 py-1.5 text-white/60 hover:text-white font-display transition-colors">
              Day {i + 1}
            </button>
          ))}
        </div>

        <div ref={scrollRef} className="overflow-x-auto overflow-y-hidden" style={{ maxHeight: `${festival.stages.length * 36 + 24}px` }}>
          <div style={{ width: totalWidth, minWidth: "100%" }} className="relative p-3">
            <div className="h-5 relative mb-1">
              {Array.from({ length: Math.ceil(totalMs / 3600000) + 1 }).map((_, i) => {
                const time = new Date(timeRange.start.getTime() + i * 3600000);
                const left = i * 3600000 * pxPerMs;
                return (
                  <span key={i} className="absolute text-[10px] text-white/30 top-0" style={{ left }}>
                    {formatTime(time)}
                  </span>
                );
              })}
            </div>

            {festival.stages.map((stage) => (
              <div key={stage.id} className="relative h-7 mb-1">
                <span className="absolute left-0 top-1 text-[10px] text-white/40 font-display z-10 bg-black/50 px-1 rounded">
                  {stage.name}
                </span>
                {stage.schedule.map((perf) => {
                  const startOffset = ((new Date(perf.startTime).getTime() - timeRange.start.getTime()) / totalMs) * totalWidth;
                  const width = ((new Date(perf.endTime).getTime() - new Date(perf.startTime).getTime()) / totalMs) * totalWidth;
                  return (
                    <button
                      key={perf.id}
                      className={`absolute top-0 h-full rounded text-[9px] text-white font-display truncate px-1.5 flex items-center transition-all ${
                        selectedStageId === stage.id ? "ring-1 ring-white" : "hover:brightness-125"
                      }`}
                      style={{ left: startOffset, width: Math.max(width, 30), backgroundColor: stage.color + "cc" }}
                      onClick={() => setSelectedStage(stage.id)}
                      title={`${perf.artistName} — ${formatTime(new Date(perf.startTime))}`}
                    >
                      {perf.artistName}
                    </button>
                  );
                })}
              </div>
            ))}

            {nowOffset > 0 && nowOffset < totalWidth && (
              <div className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20" style={{ left: nowOffset }}>
                <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
