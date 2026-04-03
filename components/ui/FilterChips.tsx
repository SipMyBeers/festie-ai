"use client";

import { useFestieStore } from "@/lib/store";

const GENRES = ["EDM", "Hip-Hop", "Rock", "Pop", "Indie", "Latin"];

export function FilterChips() {
  const activeGenreFilter = useFestieStore((s) => s.activeGenreFilter);
  const setActiveGenreFilter = useFestieStore((s) => s.setActiveGenreFilter);

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => setActiveGenreFilter(null)}
        className={`text-xs px-3 py-1.5 rounded-full font-display transition-colors ${
          activeGenreFilter === null
            ? "bg-white text-black"
            : "bg-white/10 text-white/60 hover:bg-white/20"
        }`}
      >
        All
      </button>
      {GENRES.map((genre) => (
        <button
          key={genre}
          onClick={() => setActiveGenreFilter(activeGenreFilter === genre ? null : genre)}
          className={`text-xs px-3 py-1.5 rounded-full font-display transition-colors ${
            activeGenreFilter === genre
              ? "bg-white text-black"
              : "bg-white/10 text-white/60 hover:bg-white/20"
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}
