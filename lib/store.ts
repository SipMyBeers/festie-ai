import { create } from "zustand";
import { CameraMode } from "./types";

interface FestieStore {
  cameraMode: CameraMode;
  setCameraMode: (mode: CameraMode) => void;
  selectedPlanetSlug: string | null;
  hoveredPlanetSlug: string | null;
  setSelectedPlanet: (slug: string | null) => void;
  setHoveredPlanet: (slug: string | null) => void;
  selectedStageId: string | null;
  setSelectedStage: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeGenreFilter: string | null;
  setActiveGenreFilter: (genre: string | null) => void;
  showTimeline: boolean;
  setShowTimeline: (show: boolean) => void;
  assetsLoaded: boolean;
  setAssetsLoaded: (loaded: boolean) => void;
  loadingProgress: number;
  setLoadingProgress: (progress: number) => void;
  planetPositions: Record<string, [number, number, number]>;
  setPlanetPosition: (slug: string, pos: [number, number, number]) => void;
}

export const useFestieStore = create<FestieStore>((set) => ({
  cameraMode: "solar-system",
  setCameraMode: (mode) => set({ cameraMode: mode }),
  selectedPlanetSlug: null,
  hoveredPlanetSlug: null,
  setSelectedPlanet: (slug) => set({ selectedPlanetSlug: slug }),
  setHoveredPlanet: (slug) => set({ hoveredPlanetSlug: slug }),
  selectedStageId: null,
  setSelectedStage: (id) => set({ selectedStageId: id }),
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  activeGenreFilter: null,
  setActiveGenreFilter: (genre) => set({ activeGenreFilter: genre }),
  showTimeline: false,
  setShowTimeline: (show) => set({ showTimeline: show }),
  assetsLoaded: false,
  setAssetsLoaded: (loaded) => set({ assetsLoaded: loaded }),
  loadingProgress: 0,
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  planetPositions: {},
  setPlanetPosition: (slug, pos) =>
    set((state) => ({
      planetPositions: { ...state.planetPositions, [slug]: pos },
    })),
}));
