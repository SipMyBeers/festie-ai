export type TerrainType =
  | "desert"
  | "urban"
  | "grassland"
  | "playa"
  | "coastal"
  | "forest"
  | "fantasy";

export type FestivalStatus = "upcoming" | "live" | "completed";
export type PerformanceStatus = "upcoming" | "live" | "finished";
export type CameraMode = "hero" | "solar-system" | "flying-in" | "planet-surface";

export interface Festival {
  id: string;
  name: string;
  slug: string;
  dates: { start: string; end: string };
  location: {
    city: string;
    state: string;
    country: string;
    lat: number;
    lng: number;
  };
  terrainType: TerrainType;
  popularityScore: number;
  stages: Stage[];
  ticketUrl: string;
  status: FestivalStatus;
  planetColor: string;
  planetSecondaryColor: string;
  description: string;
  genreTags: string[];
  comingSoon: boolean;
}

export interface Stage {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  color: string;
  schedule: Performance[];
}

export interface Performance {
  id: string;
  artistName: string;
  artistImage: string;
  startTime: string;
  endTime: string;
  genreTags: string[];
  spotifyUrl: string;
  status: PerformanceStatus;
}
