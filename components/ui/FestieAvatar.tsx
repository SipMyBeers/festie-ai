"use client";

// Each row is a string where each char represents a pixel color
// . = transparent, P = purple, G = green, C = cyan, W = white, B = black, M = pink, R = orange
const FESTIE_PIXELS = [
  "....CC....",
  "....CC....",
  "...CPPC...",
  "..PPPPPP..",
  ".PCGGCGGCP",
  ".PPPPPPPP.",
  ".PCWPPWCP.",
  ".PPPMMPPP.",
  "..PPPPPP..",
  "..PGGGPP..",
  "...PPPP...",
  "..RPPPPR..",
  "..PP..PP..",
  "..PP..PP..",
  "..CC..CC..",
];

const COLORS: Record<string, string> = {
  P: "#7c3aed", // purple body
  G: "#22c55e", // green eyes
  C: "#06b6d4", // cyan accents/antenna
  W: "#ffffff", // white eye shine
  B: "#000000", // black
  M: "#ec4899", // pink mouth/smile
  R: "#f97316", // orange wristband
  Y: "#eab308", // yellow
};

interface FestieAvatarProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function FestieAvatar({ size = 48, className = "", animated = true }: FestieAvatarProps) {
  const pixelSize = size / 10; // 10 columns wide

  return (
    <div
      className={`inline-block ${className}`}
      style={{
        width: size,
        height: size * 1.5,
        animation: animated ? "festie-bob 2s ease-in-out infinite" : undefined,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(10, ${pixelSize}px)`,
          gap: 0,
        }}
      >
        {FESTIE_PIXELS.map((row, y) =>
          row.split("").map((pixel, x) => (
            <div
              key={`${y}-${x}`}
              style={{
                width: pixelSize,
                height: pixelSize,
                backgroundColor: pixel === "." ? "transparent" : COLORS[pixel] || "transparent",
                boxShadow:
                  pixel === "G" || pixel === "C"
                    ? `0 0 ${pixelSize}px ${COLORS[pixel]}40`
                    : undefined,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
