"use client";

import { useFestieStore } from "@/lib/store";

export function SearchBar() {
  const searchQuery = useFestieStore((s) => s.searchQuery);
  const setSearchQuery = useFestieStore((s) => s.setSearchQuery);

  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search festivals or artists..."
        className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 font-body focus:outline-none focus:border-festie-purple/50 transition-colors"
      />
    </div>
  );
}
