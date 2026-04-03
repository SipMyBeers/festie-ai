# Festie.ai MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first 3D festival discovery platform with an immersive hero rave pull-back, a solar system of festival planets, and a fully explorable Coachella planet with stage replicas and lineup data.

**Architecture:** Next.js 15 App Router serves the shell and API routes. React Three Fiber renders all 3D scenes. Zustand manages global state (camera mode, selected planet, live status). Festival data is static JSON for MVP (Supabase in phase 2). Vercel handles deployment with auto-deploy on push to main.

**Tech Stack:** Next.js 15, React Three Fiber, @react-three/drei, @react-three/postprocessing, Zustand, Tailwind CSS 4, Framer Motion, TypeScript

---

## File Map

### Data & State
- `lib/types.ts` — All TypeScript types (Festival, Stage, Performance, CameraMode)
- `lib/data/festivals.ts` — Static festival data (Coachella full, others as stubs)
- `lib/data/coachella-lineup.ts` — Full Coachella 2026 lineup extracted from existing HTML
- `lib/store.ts` — Zustand store (camera state, selected planet, selected stage, UI state)
- `lib/utils.ts` — Shared helpers (time formatting, responsive breakpoints)

### App Routes
- `app/layout.tsx` — Root layout with fonts, metadata, Tailwind
- `app/page.tsx` — Landing page: hero rave + solar system (single scroll experience)
- `app/planet/[slug]/page.tsx` — Planet explorer page (Coachella surface)

### 3D Components
- `components/3d/HeroRave.tsx` — The rave scene (stage, crowd, lasers, particles)
- `components/3d/SolarSystem.tsx` — All planets, sun, orbits, camera controls
- `components/3d/Planet.tsx` — Single planet sphere with atmosphere, LOD, click handler
- `components/3d/Sun.tsx` — Central glowing sun with Festie.ai logo
- `components/3d/PlanetSurface.tsx` — On-planet view with terrain + stage placement
- `components/3d/Stage.tsx` — Individual stage model with live/idle states
- `components/3d/effects/Lasers.tsx` — Laser beam effect component
- `components/3d/effects/Particles.tsx` — Particle systems (crowd, confetti, atmosphere)
- `components/3d/effects/AtmosphereGlow.tsx` — Planet atmosphere shader

### UI Components
- `components/ui/Timeline.tsx` — Bottom timeline rail with swim lanes
- `components/ui/StagePanel.tsx` — Artist info slide-up panel
- `components/ui/PlanetTooltip.tsx` — Hover tooltip for planets in solar system
- `components/ui/SearchBar.tsx` — Search festivals/artists
- `components/ui/FilterChips.tsx` — Genre/date/live filter chips
- `components/ui/LoadingScreen.tsx` — 3D asset loading progress indicator

### Config & CI
- `tailwind.config.ts` — Tailwind config with custom festival theme colors
- `next.config.ts` — Next.js config (webpack for GLB, transpile packages)
- `.github/workflows/ci.yml` — Lint + type check on push
- `tsconfig.json` — TypeScript strict config
- `.gitignore` — Node modules, .next, .env, large model files
- `public/models/.gitkeep` — Placeholder for GLB models

---

## Task 1: Project Scaffolding & CI/CD

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `app/layout.tsx`, `app/page.tsx`, `.gitignore`, `.github/workflows/ci.yml`, `postcss.config.mjs`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /Users/beers/Projects/active/festie-ai
npx create-next-app@latest . --typescript --tailwind --eslint --app --src=no --import-alias="@/*" --use-npm --yes
```

Expected: Next.js project scaffolded with App Router, Tailwind, TypeScript.

- [ ] **Step 2: Install 3D and UI dependencies**

```bash
cd /Users/beers/Projects/active/festie-ai
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing zustand framer-motion
npm install -D @types/three
```

- [ ] **Step 3: Update next.config.ts for 3D asset support**

Replace `next.config.ts` with:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf|hdr)$/,
      type: "asset/resource",
    });
    return config;
  },
};

export default nextConfig;
```

- [ ] **Step 4: Update tailwind.config.ts with festival theme**

Replace `tailwind.config.ts` with:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        festie: {
          dark: "#0a0a0f",
          purple: "#7c3aed",
          pink: "#ec4899",
          cyan: "#06b6d4",
          orange: "#f97316",
          gold: "#eab308",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui"],
        body: ["var(--font-body)", "system-ui"],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 5: Create root layout with fonts and metadata**

Replace `app/layout.tsx` with:

```tsx
import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Festie.ai — Explore Festivals in 3D",
  description:
    "Navigate the festival universe. Explore Coachella, Burning Man, Tomorrowland and more as immersive 3D worlds.",
  openGraph: {
    title: "Festie.ai — Explore Festivals in 3D",
    description: "Navigate the festival universe in immersive 3D.",
    url: "https://festie.ai",
    siteName: "Festie.ai",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0a0f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body className="bg-festie-dark text-white font-body antialiased">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Create placeholder landing page**

Replace `app/page.tsx` with:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="text-6xl font-display font-bold bg-gradient-to-r from-festie-purple via-festie-pink to-festie-cyan bg-clip-text text-transparent">
        FESTIE.AI
      </h1>
    </main>
  );
}
```

- [ ] **Step 7: Update globals.css**

Replace `app/globals.css` with:

```css
@import "tailwindcss";

@theme {
  --color-festie-dark: #0a0a0f;
  --color-festie-purple: #7c3aed;
  --color-festie-pink: #ec4899;
  --color-festie-cyan: #06b6d4;
  --color-festie-orange: #f97316;
  --color-festie-gold: #eab308;
  --font-display: var(--font-display);
  --font-body: var(--font-body);
}

html {
  scroll-behavior: smooth;
}

body {
  overscroll-behavior: none;
}

canvas {
  touch-action: none;
}
```

- [ ] **Step 8: Update .gitignore**

Append to `.gitignore`:

```
# 3D assets (stored in Vercel Blob, not git)
public/models/*.glb
public/models/*.gltf
public/models/*.hdr
!public/models/.gitkeep

# Environment
.env
.env.local
```

- [ ] **Step 9: Create GitHub Actions CI workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm run build
```

- [ ] **Step 10: Create models directory placeholder**

```bash
mkdir -p public/models
touch public/models/.gitkeep
```

- [ ] **Step 11: Verify dev server starts**

```bash
cd /Users/beers/Projects/active/festie-ai
npm run dev &
sleep 5
curl -s http://localhost:3000 | head -20
kill %1
```

Expected: HTML response containing "FESTIE.AI"

- [ ] **Step 12: Commit scaffolding**

```bash
cd /Users/beers/Projects/active/festie-ai
git add -A
git commit -m "feat: project scaffolding — Next.js 15, R3F, Tailwind, CI pipeline"
git push origin main
```

---

## Task 2: Data Layer — Types, Festival Data, Zustand Store

**Files:**
- Create: `lib/types.ts`, `lib/data/festivals.ts`, `lib/data/coachella-lineup.ts`, `lib/store.ts`

- [ ] **Step 1: Create TypeScript types**

Create `lib/types.ts`:

```ts
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
  dates: { start: string; end: string }; // ISO date strings
  location: {
    city: string;
    state: string;
    country: string;
    lat: number;
    lng: number;
  };
  terrainType: TerrainType;
  popularityScore: number; // 1-100, determines planet size
  stages: Stage[];
  ticketUrl: string;
  status: FestivalStatus;
  planetColor: string; // hex color for atmosphere glow
  planetSecondaryColor: string; // hex for surface accents
  description: string;
  genreTags: string[];
  comingSoon: boolean;
}

export interface Stage {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  color: string; // hex color for timeline swim lane
  schedule: Performance[];
}

export interface Performance {
  id: string;
  artistName: string;
  artistImage: string;
  startTime: string; // ISO datetime
  endTime: string;
  genreTags: string[];
  spotifyUrl: string;
  status: PerformanceStatus;
}
```

- [ ] **Step 2: Create Coachella lineup data**

Create `lib/data/coachella-lineup.ts`:

```ts
import { Stage } from "../types";

// Coachella 2026 — Weekend 1: April 10-12
// Schedule data extracted from existing coachella-2026-final.html
export const coachellaStages: Stage[] = [
  {
    id: "mainstage",
    name: "Coachella Stage",
    position: { x: 0, y: 0, z: -2 },
    color: "#f97316",
    schedule: [
      // Friday
      {
        id: "fri-main-1",
        artistName: "Foster the People",
        artistImage: "/artists/foster-the-people.jpg",
        startTime: "2026-04-10T17:00:00-07:00",
        endTime: "2026-04-10T18:00:00-07:00",
        genreTags: ["indie", "alt-rock"],
        spotifyUrl: "https://open.spotify.com/artist/7gP3bB2nilZXLfPHJhMdvc",
        status: "upcoming",
      },
      {
        id: "fri-main-2",
        artistName: "The XX",
        artistImage: "/artists/the-xx.jpg",
        startTime: "2026-04-10T19:00:00-07:00",
        endTime: "2026-04-10T20:15:00-07:00",
        genreTags: ["indie", "electronic"],
        spotifyUrl: "https://open.spotify.com/artist/3iOvXCl6edW5Um0fXEBRXy",
        status: "upcoming",
      },
      {
        id: "fri-main-hl",
        artistName: "Sabrina Carpenter",
        artistImage: "/artists/sabrina-carpenter.jpg",
        startTime: "2026-04-10T21:30:00-07:00",
        endTime: "2026-04-10T23:00:00-07:00",
        genreTags: ["pop"],
        spotifyUrl: "https://open.spotify.com/artist/74KM79TiuVKeVCqs8QtB0B",
        status: "upcoming",
      },
      // Saturday
      {
        id: "sat-main-1",
        artistName: "The Strokes",
        artistImage: "/artists/the-strokes.jpg",
        startTime: "2026-04-11T19:00:00-07:00",
        endTime: "2026-04-11T20:15:00-07:00",
        genreTags: ["rock", "indie"],
        spotifyUrl: "https://open.spotify.com/artist/0epOFNiUfyON9EYx7Tpr6V",
        status: "upcoming",
      },
      {
        id: "sat-main-hl",
        artistName: "Justin Bieber",
        artistImage: "/artists/justin-bieber.jpg",
        startTime: "2026-04-11T21:30:00-07:00",
        endTime: "2026-04-11T23:00:00-07:00",
        genreTags: ["pop", "r&b"],
        spotifyUrl: "https://open.spotify.com/artist/1uNFoZAHBGtllmzznpCI3s",
        status: "upcoming",
      },
      // Sunday
      {
        id: "sun-main-1",
        artistName: "Young Thug",
        artistImage: "/artists/young-thug.jpg",
        startTime: "2026-04-12T19:00:00-07:00",
        endTime: "2026-04-12T20:15:00-07:00",
        genreTags: ["hip-hop", "rap"],
        spotifyUrl: "https://open.spotify.com/artist/50co4Is1HCEo8bhOyUWKpn",
        status: "upcoming",
      },
      {
        id: "sun-main-hl",
        artistName: "Karol G",
        artistImage: "/artists/karol-g.jpg",
        startTime: "2026-04-12T21:30:00-07:00",
        endTime: "2026-04-12T23:00:00-07:00",
        genreTags: ["reggaeton", "latin"],
        spotifyUrl: "https://open.spotify.com/artist/790FomKkXshlbRYZFtlgla",
        status: "upcoming",
      },
    ],
  },
  {
    id: "sahara",
    name: "Sahara Tent",
    position: { x: 3, y: 0, z: 1 },
    color: "#7c3aed",
    schedule: [
      {
        id: "fri-sahara-1",
        artistName: "Disclosure",
        artistImage: "/artists/disclosure.jpg",
        startTime: "2026-04-10T18:00:00-07:00",
        endTime: "2026-04-10T19:30:00-07:00",
        genreTags: ["electronic", "house"],
        spotifyUrl: "https://open.spotify.com/artist/6nB0iY1cjSY1KyhYyuIIKH",
        status: "upcoming",
      },
      {
        id: "fri-sahara-hl",
        artistName: "Anyma",
        artistImage: "/artists/anyma.jpg",
        startTime: "2026-04-10T22:00:00-07:00",
        endTime: "2026-04-11T00:00:00-07:00",
        genreTags: ["electronic", "melodic techno"],
        spotifyUrl: "https://open.spotify.com/artist/0Z7zcsIphrPDnfZj9Ppqw0",
        status: "upcoming",
      },
      {
        id: "sat-sahara-1",
        artistName: "Kaskade",
        artistImage: "/artists/kaskade.jpg",
        startTime: "2026-04-11T20:00:00-07:00",
        endTime: "2026-04-11T21:30:00-07:00",
        genreTags: ["electronic", "house"],
        spotifyUrl: "https://open.spotify.com/artist/6TQj5BFPRhOlanLOjiiChZ",
        status: "upcoming",
      },
    ],
  },
  {
    id: "outdoor",
    name: "Outdoor Theatre",
    position: { x: -3, y: 0, z: 1 },
    color: "#06b6d4",
    schedule: [
      {
        id: "fri-outdoor-1",
        artistName: "Turnstile",
        artistImage: "/artists/turnstile.jpg",
        startTime: "2026-04-10T17:30:00-07:00",
        endTime: "2026-04-10T18:30:00-07:00",
        genreTags: ["punk", "hardcore"],
        spotifyUrl: "https://open.spotify.com/artist/5RADpgYLOuS2ZxDq7ggYYH",
        status: "upcoming",
      },
      {
        id: "fri-outdoor-2",
        artistName: "Ethel Cain",
        artistImage: "/artists/ethel-cain.jpg",
        startTime: "2026-04-10T19:30:00-07:00",
        endTime: "2026-04-10T20:30:00-07:00",
        genreTags: ["alt", "indie"],
        spotifyUrl: "https://open.spotify.com/artist/7IfculRW2AXkbMmMHMhZYK",
        status: "upcoming",
      },
      {
        id: "sat-outdoor-1",
        artistName: "Interpol",
        artistImage: "/artists/interpol.jpg",
        startTime: "2026-04-11T18:00:00-07:00",
        endTime: "2026-04-11T19:15:00-07:00",
        genreTags: ["rock", "post-punk"],
        spotifyUrl: "https://open.spotify.com/artist/3WaJSfKnzc65VDgmj2zU8B",
        status: "upcoming",
      },
      {
        id: "sun-outdoor-1",
        artistName: "FKA twigs",
        artistImage: "/artists/fka-twigs.jpg",
        startTime: "2026-04-12T19:00:00-07:00",
        endTime: "2026-04-12T20:15:00-07:00",
        genreTags: ["art-pop", "electronic"],
        spotifyUrl: "https://open.spotify.com/artist/6nB0iY1cjSY1KyhYyuIIKH",
        status: "upcoming",
      },
    ],
  },
  {
    id: "gobi",
    name: "Gobi Tent",
    position: { x: 2, y: 0, z: 3 },
    color: "#ec4899",
    schedule: [
      {
        id: "fri-gobi-1",
        artistName: "Dijon",
        artistImage: "/artists/dijon.jpg",
        startTime: "2026-04-10T18:30:00-07:00",
        endTime: "2026-04-10T19:30:00-07:00",
        genreTags: ["r&b", "indie"],
        spotifyUrl: "https://open.spotify.com/artist/0BvkDsjIUla7X0k6CSWh1I",
        status: "upcoming",
      },
      {
        id: "sat-gobi-1",
        artistName: "Alex G",
        artistImage: "/artists/alex-g.jpg",
        startTime: "2026-04-11T17:00:00-07:00",
        endTime: "2026-04-11T18:00:00-07:00",
        genreTags: ["indie", "lo-fi"],
        spotifyUrl: "https://open.spotify.com/artist/6lcTw2JFfFWDV0z4GIObHO",
        status: "upcoming",
      },
      {
        id: "sun-gobi-1",
        artistName: "Laufey",
        artistImage: "/artists/laufey.jpg",
        startTime: "2026-04-12T18:00:00-07:00",
        endTime: "2026-04-12T19:00:00-07:00",
        genreTags: ["jazz", "pop"],
        spotifyUrl: "https://open.spotify.com/artist/7gW0r5CkdEUMm42mGOkUKp",
        status: "upcoming",
      },
    ],
  },
  {
    id: "mojave",
    name: "Mojave Tent",
    position: { x: -2, y: 0, z: 3 },
    color: "#eab308",
    schedule: [
      {
        id: "fri-mojave-1",
        artistName: "Blood Orange",
        artistImage: "/artists/blood-orange.jpg",
        startTime: "2026-04-10T19:00:00-07:00",
        endTime: "2026-04-10T20:00:00-07:00",
        genreTags: ["r&b", "electronic"],
        spotifyUrl: "https://open.spotify.com/artist/6LEjJsEHOqJf2OaGaZcIcS",
        status: "upcoming",
      },
      {
        id: "sat-mojave-1",
        artistName: "Addison Rae",
        artistImage: "/artists/addison-rae.jpg",
        startTime: "2026-04-11T17:30:00-07:00",
        endTime: "2026-04-11T18:30:00-07:00",
        genreTags: ["pop"],
        spotifyUrl: "https://open.spotify.com/artist/4obzFoKoKRHIphyHzJ35G3",
        status: "upcoming",
      },
      {
        id: "sun-mojave-1",
        artistName: "Wet Leg",
        artistImage: "/artists/wet-leg.jpg",
        startTime: "2026-04-12T17:30:00-07:00",
        endTime: "2026-04-12T18:30:00-07:00",
        genreTags: ["indie", "rock"],
        spotifyUrl: "https://open.spotify.com/artist/2TwOrUcYnAlIiKmVQkkoSZ",
        status: "upcoming",
      },
    ],
  },
];
```

- [ ] **Step 3: Create festivals data with all planets**

Create `lib/data/festivals.ts`:

```ts
import { Festival } from "../types";
import { coachellaStages } from "./coachella-lineup";

export const festivals: Festival[] = [
  {
    id: "coachella",
    name: "Coachella",
    slug: "coachella",
    dates: { start: "2026-04-10", end: "2026-04-12" },
    location: {
      city: "Indio",
      state: "CA",
      country: "US",
      lat: 33.6803,
      lng: -116.2378,
    },
    terrainType: "desert",
    popularityScore: 95,
    stages: coachellaStages,
    ticketUrl: "https://www.coachella.com/tickets",
    status: "upcoming",
    planetColor: "#f97316",
    planetSecondaryColor: "#fbbf24",
    description: "The iconic desert festival in Indio, California",
    genreTags: ["EDM", "Pop", "Hip-Hop", "Indie"],
    comingSoon: false,
  },
  {
    id: "burning-man",
    name: "Burning Man",
    slug: "burning-man",
    dates: { start: "2026-08-30", end: "2026-09-07" },
    location: {
      city: "Black Rock City",
      state: "NV",
      country: "US",
      lat: 40.7864,
      lng: -119.2065,
    },
    terrainType: "playa",
    popularityScore: 85,
    stages: [],
    ticketUrl: "https://burningman.org/event/",
    status: "upcoming",
    planetColor: "#dc2626",
    planetSecondaryColor: "#f97316",
    description: "A week-long experiment in community and art in the Nevada desert",
    genreTags: ["Electronic", "Art", "Experimental"],
    comingSoon: true,
  },
  {
    id: "tomorrowland",
    name: "Tomorrowland",
    slug: "tomorrowland",
    dates: { start: "2026-07-17", end: "2026-07-26" },
    location: {
      city: "Boom",
      state: "Antwerp",
      country: "Belgium",
      lat: 51.0925,
      lng: 4.368,
    },
    terrainType: "fantasy",
    popularityScore: 92,
    stages: [],
    ticketUrl: "https://www.tomorrowland.com/en/festival/tickets",
    status: "upcoming",
    planetColor: "#22c55e",
    planetSecondaryColor: "#eab308",
    description: "The world's premier electronic music festival in Belgium",
    genreTags: ["EDM", "House", "Techno", "Trance"],
    comingSoon: true,
  },
  {
    id: "rolling-loud",
    name: "Rolling Loud",
    slug: "rolling-loud",
    dates: { start: "2026-12-11", end: "2026-12-13" },
    location: {
      city: "Miami",
      state: "FL",
      country: "US",
      lat: 25.958,
      lng: -80.239,
    },
    terrainType: "coastal",
    popularityScore: 88,
    stages: [],
    ticketUrl: "https://www.rollingloud.com/miami",
    status: "upcoming",
    planetColor: "#8b5cf6",
    planetSecondaryColor: "#06b6d4",
    description: "The world's largest hip-hop festival in Miami",
    genreTags: ["Hip-Hop", "Rap", "R&B"],
    comingSoon: true,
  },
  {
    id: "lollapalooza",
    name: "Lollapalooza",
    slug: "lollapalooza",
    dates: { start: "2026-07-30", end: "2026-08-02" },
    location: {
      city: "Chicago",
      state: "IL",
      country: "US",
      lat: 41.8758,
      lng: -87.6189,
    },
    terrainType: "urban",
    popularityScore: 82,
    stages: [],
    ticketUrl: "https://www.lollapalooza.com/tickets",
    status: "upcoming",
    planetColor: "#3b82f6",
    planetSecondaryColor: "#a855f7",
    description: "Chicago's legendary multi-genre music festival in Grant Park",
    genreTags: ["Rock", "Pop", "EDM", "Hip-Hop"],
    comingSoon: true,
  },
  {
    id: "glastonbury",
    name: "Glastonbury",
    slug: "glastonbury",
    dates: { start: "2026-06-24", end: "2026-06-28" },
    location: {
      city: "Pilton",
      state: "Somerset",
      country: "UK",
      lat: 51.1497,
      lng: -2.5857,
    },
    terrainType: "grassland",
    popularityScore: 90,
    stages: [],
    ticketUrl: "https://www.glastonburyfestivals.co.uk/information/tickets/",
    status: "upcoming",
    planetColor: "#6b7280",
    planetSecondaryColor: "#22c55e",
    description: "The UK's iconic festival on the rolling hills of Somerset",
    genreTags: ["Rock", "Pop", "Electronic", "World"],
    comingSoon: true,
  },
  {
    id: "edc-vegas",
    name: "EDC Las Vegas",
    slug: "edc-vegas",
    dates: { start: "2026-05-15", end: "2026-05-17" },
    location: {
      city: "Las Vegas",
      state: "NV",
      country: "US",
      lat: 36.272,
      lng: -115.0152,
    },
    terrainType: "desert",
    popularityScore: 87,
    stages: [],
    ticketUrl: "https://lasvegas.electricdaisycarnival.com/tickets/",
    status: "upcoming",
    planetColor: "#ec4899",
    planetSecondaryColor: "#7c3aed",
    description: "Electric Daisy Carnival — the biggest dance music festival in North America",
    genreTags: ["EDM", "House", "Techno", "Dubstep"],
    comingSoon: true,
  },
  {
    id: "ultra",
    name: "Ultra Music Festival",
    slug: "ultra",
    dates: { start: "2026-03-27", end: "2026-03-29" },
    location: {
      city: "Miami",
      state: "FL",
      country: "US",
      lat: 25.774,
      lng: -80.186,
    },
    terrainType: "coastal",
    popularityScore: 86,
    stages: [],
    ticketUrl: "https://ultramusicfestival.com/tickets/",
    status: "completed",
    planetColor: "#06b6d4",
    planetSecondaryColor: "#ffffff",
    description: "Miami's premier electronic music festival on Bayfront Park",
    genreTags: ["EDM", "House", "Techno"],
    comingSoon: true,
  },
  {
    id: "bonnaroo",
    name: "Bonnaroo",
    slug: "bonnaroo",
    dates: { start: "2026-06-11", end: "2026-06-14" },
    location: {
      city: "Manchester",
      state: "TN",
      country: "US",
      lat: 35.4753,
      lng: -86.0589,
    },
    terrainType: "grassland",
    popularityScore: 78,
    stages: [],
    ticketUrl: "https://www.bonnaroo.com/tickets",
    status: "upcoming",
    planetColor: "#f59e0b",
    planetSecondaryColor: "#84cc16",
    description: "A multi-day music and arts festival on a 700-acre farm in Tennessee",
    genreTags: ["Rock", "Indie", "Electronic", "Hip-Hop"],
    comingSoon: true,
  },
  {
    id: "primavera",
    name: "Primavera Sound",
    slug: "primavera",
    dates: { start: "2026-06-04", end: "2026-06-06" },
    location: {
      city: "Barcelona",
      state: "Catalonia",
      country: "Spain",
      lat: 41.3851,
      lng: 2.1734,
    },
    terrainType: "coastal",
    popularityScore: 80,
    stages: [],
    ticketUrl: "https://www.primaverasound.com/en/tickets",
    status: "upcoming",
    planetColor: "#e11d48",
    planetSecondaryColor: "#0ea5e9",
    description: "Barcelona's beloved indie and alternative music festival",
    genreTags: ["Indie", "Rock", "Electronic", "Pop"],
    comingSoon: true,
  },
];

export function getFestivalBySlug(slug: string): Festival | undefined {
  return festivals.find((f) => f.slug === slug);
}

export function getLiveFestivals(): Festival[] {
  return festivals.filter((f) => f.status === "live");
}
```

- [ ] **Step 4: Create Zustand store**

Create `lib/store.ts`:

```ts
import { create } from "zustand";
import { CameraMode } from "./types";

interface FestieStore {
  // Camera
  cameraMode: CameraMode;
  setCameraMode: (mode: CameraMode) => void;

  // Solar system
  selectedPlanetSlug: string | null;
  hoveredPlanetSlug: string | null;
  setSelectedPlanet: (slug: string | null) => void;
  setHoveredPlanet: (slug: string | null) => void;

  // Planet surface
  selectedStageId: string | null;
  setSelectedStage: (id: string | null) => void;

  // UI
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeGenreFilter: string | null;
  setActiveGenreFilter: (genre: string | null) => void;
  showTimeline: boolean;
  setShowTimeline: (show: boolean) => void;

  // Loading
  assetsLoaded: boolean;
  setAssetsLoaded: (loaded: boolean) => void;
  loadingProgress: number;
  setLoadingProgress: (progress: number) => void;
}

export const useFestieStore = create<FestieStore>((set) => ({
  cameraMode: "hero",
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
}));
```

- [ ] **Step 5: Verify types compile**

```bash
cd /Users/beers/Projects/active/festie-ai
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 6: Commit data layer**

```bash
cd /Users/beers/Projects/active/festie-ai
git add lib/
git commit -m "feat: data layer — types, festival data (10 planets), Coachella lineup, Zustand store"
git push origin main
```

---

## Task 3: Loading Screen & 3D Canvas Shell

**Files:**
- Create: `components/ui/LoadingScreen.tsx`, `components/3d/Scene.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create loading screen component**

Create `components/ui/LoadingScreen.tsx`:

```tsx
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
```

- [ ] **Step 2: Create the main 3D scene shell**

Create `components/3d/Scene.tsx`:

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import { useFestieStore } from "@/lib/store";

function SceneContent() {
  const setAssetsLoaded = useFestieStore((s) => s.setAssetsLoaded);
  const setLoadingProgress = useFestieStore((s) => s.setLoadingProgress);

  useEffect(() => {
    // Simulate loading for now — will be replaced by real asset loading
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setLoadingProgress(Math.min(progress, 100));
      if (progress >= 100) {
        clearInterval(interval);
        setAssetsLoaded(true);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [setAssetsLoaded, setLoadingProgress]);

  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#fff8e7" />
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.3} />
      </mesh>
      <Preload all />
    </>
  );
}

export function Scene() {
  return (
    <Canvas
      className="!fixed inset-0"
      camera={{ position: [0, 0, 5], fov: 60 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      style={{ background: "#0a0a0f" }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}
```

- [ ] **Step 3: Wire up the landing page**

Replace `app/page.tsx` with:

```tsx
"use client";

import dynamic from "next/dynamic";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

const Scene = dynamic(() => import("@/components/3d/Scene").then((m) => m.Scene), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <LoadingScreen />
      <Scene />
    </main>
  );
}
```

- [ ] **Step 4: Verify the 3D canvas renders**

```bash
cd /Users/beers/Projects/active/festie-ai
npm run dev &
sleep 5
curl -s http://localhost:3000 | grep -c "canvas"
kill %1
```

Expected: Page loads, loading screen shows, then a 3D orange sphere appears.

- [ ] **Step 5: Commit canvas shell**

```bash
cd /Users/beers/Projects/active/festie-ai
git add components/ app/page.tsx
git commit -m "feat: 3D canvas shell with loading screen"
git push origin main
```

---

## Task 4: Hero Rave Scene — Stage, Crowd, Lasers

**Files:**
- Create: `components/3d/HeroRave.tsx`, `components/3d/effects/Lasers.tsx`, `components/3d/effects/Particles.tsx`
- Modify: `components/3d/Scene.tsx`

- [ ] **Step 1: Create laser beam effect**

Create `components/3d/effects/Lasers.tsx`:

```tsx
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LaserProps {
  count?: number;
  origin: [number, number, number];
  spread?: number;
  color?: string;
}

export function Lasers({
  count = 8,
  origin,
  spread = 4,
  color = "#7c3aed",
}: LaserProps) {
  const groupRef = useRef<THREE.Group>(null);

  const beams = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const targetX = Math.cos(angle) * spread;
      const targetZ = Math.sin(angle) * spread;
      return {
        target: [targetX, 4 + Math.random() * 2, targetZ] as [number, number, number],
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5,
      };
    });
  }, [count, spread]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.elapsedTime * 0.1;
    groupRef.current.children.forEach((child, i) => {
      const beam = beams[i];
      if (beam) {
        child.visible =
          Math.sin(clock.elapsedTime * beam.speed + beam.phase) > -0.3;
      }
    });
  });

  return (
    <group ref={groupRef} position={origin}>
      {beams.map((beam, i) => {
        const dir = new THREE.Vector3(...beam.target).normalize();
        const length = new THREE.Vector3(...beam.target).length();
        const midpoint = dir.clone().multiplyScalar(length / 2);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir
        );

        return (
          <mesh
            key={i}
            position={[midpoint.x, midpoint.y, midpoint.z]}
            quaternion={quaternion}
          >
            <cylinderGeometry args={[0.01, 0.01, length, 4]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.6}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}
    </group>
  );
}
```

- [ ] **Step 2: Create particle system**

Create `components/3d/effects/Particles.tsx`:

```tsx
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticlesProps {
  count?: number;
  area?: [number, number, number];
  color?: string;
  size?: number;
  speed?: number;
}

export function Particles({
  count = 200,
  area = [10, 5, 10],
  color = "#ec4899",
  size = 0.03,
  speed = 0.3,
}: ParticlesProps) {
  const meshRef = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * area[0];
      positions[i * 3 + 1] = Math.random() * area[1];
      positions[i * 3 + 2] = (Math.random() - 0.5) * area[2];
      velocities[i * 3] = (Math.random() - 0.5) * speed * 0.1;
      velocities[i * 3 + 1] = Math.random() * speed;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * speed * 0.1;
    }
    return { positions, velocities };
  }, [count, area, speed]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const pos = meshRef.current.geometry.attributes.position;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3] * delta;
      arr[i * 3 + 1] += velocities[i * 3 + 1] * delta;
      arr[i * 3 + 2] += velocities[i * 3 + 2] * delta;
      // Reset particles that fly too high
      if (arr[i * 3 + 1] > area[1]) {
        arr[i * 3] = (Math.random() - 0.5) * area[0];
        arr[i * 3 + 1] = 0;
        arr[i * 3 + 2] = (Math.random() - 0.5) * area[2];
      }
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
```

- [ ] **Step 3: Create the Hero Rave scene**

Create `components/3d/HeroRave.tsx`:

```tsx
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { Lasers } from "./effects/Lasers";
import { Particles } from "./effects/Particles";

function RaveStage() {
  const ledRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ledRef.current) return;
    const mat = ledRef.current.material as THREE.MeshStandardMaterial;
    const pulse = Math.sin(clock.elapsedTime * 2) * 0.5 + 0.5;
    mat.emissiveIntensity = 0.5 + pulse * 1.5;
  });

  return (
    <group position={[0, 0, -8]}>
      {/* Main stage structure */}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[12, 5, 1]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* LED screen */}
      <mesh ref={ledRef} position={[0, 2.5, 0.6]}>
        <planeGeometry args={[10, 3.5]} />
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#7c3aed"
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>

      {/* FESTIE.AI text on the marquee */}
      <Text
        position={[0, 4.8, 0.7]}
        fontSize={0.8}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/SpaceGrotesk-Bold.ttf"
        outlineWidth={0.02}
        outlineColor="#7c3aed"
      >
        FESTIE.AI
      </Text>

      {/* Speaker stacks */}
      {[-5.5, 5.5].map((x) => (
        <group key={x} position={[x, 0, 0.5]}>
          {[0.5, 1.5, 2.5, 3.5].map((y) => (
            <mesh key={y} position={[0, y, 0]}>
              <boxGeometry args={[1.2, 0.8, 0.8]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Stage floor */}
      <mesh position={[0, 0, 1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 4]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
      </mesh>
    </group>
  );
}

function CrowdSprites({ count = 60 }: { count?: number }) {
  const positions = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 12,
      z: Math.random() * 6 - 2,
      height: 0.8 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  return (
    <group>
      {positions.map((p, i) => (
        <CrowdPerson key={i} x={p.x} z={p.z} height={p.height} phase={p.phase} />
      ))}
    </group>
  );
}

function CrowdPerson({
  x,
  z,
  height,
  phase,
}: {
  x: number;
  z: number;
  height: number;
  phase: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    // Subtle bobbing like dancing
    ref.current.position.y = Math.sin(clock.elapsedTime * 2 + phase) * 0.05;
  });

  return (
    <group ref={ref} position={[x, height / 2, z]}>
      <Billboard>
        <mesh>
          <planeGeometry args={[0.4, height]} />
          <meshBasicMaterial color="#0a0a0f" transparent opacity={0.85} />
        </mesh>
      </Billboard>
    </group>
  );
}

export function HeroRave() {
  return (
    <group>
      {/* Ground plane — dark rave floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#0a0a0f" />
      </mesh>

      <RaveStage />
      <CrowdSprites count={60} />
      <Lasers origin={[0, 5, -8]} count={12} spread={6} color="#7c3aed" />
      <Lasers origin={[0, 5, -8]} count={8} spread={5} color="#ec4899" />
      <Particles count={300} area={[15, 8, 15]} color="#ec4899" size={0.02} speed={0.2} />
      <Particles count={100} area={[15, 8, 15]} color="#7c3aed" size={0.04} speed={0.1} />

      {/* Haze/fog light */}
      <fog attach="fog" args={["#0a0a0f", 5, 25]} />

      {/* Stage spotlights */}
      <spotLight
        position={[-4, 8, -6]}
        angle={0.4}
        penumbra={0.5}
        intensity={3}
        color="#7c3aed"
        target-position={[0, 0, 0]}
      />
      <spotLight
        position={[4, 8, -6]}
        angle={0.4}
        penumbra={0.5}
        intensity={3}
        color="#ec4899"
        target-position={[0, 0, 0]}
      />
    </group>
  );
}
```

- [ ] **Step 4: Wire hero into the Scene**

Replace `components/3d/Scene.tsx` with:

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { Preload, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense, useEffect } from "react";
import { useFestieStore } from "@/lib/store";
import { HeroRave } from "./HeroRave";

function SceneContent() {
  const setAssetsLoaded = useFestieStore((s) => s.setAssetsLoaded);
  const setLoadingProgress = useFestieStore((s) => s.setLoadingProgress);

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 15;
      setLoadingProgress(Math.min(progress, 100));
      if (progress >= 100) {
        clearInterval(interval);
        setAssetsLoaded(true);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [setAssetsLoaded, setLoadingProgress]);

  return (
    <>
      <ambientLight intensity={0.05} />
      <HeroRave />
      <Stars radius={100} depth={50} count={2000} factor={4} fade speed={1} />
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          intensity={1.5}
          mipmapBlur
        />
      </EffectComposer>
      <Preload all />
    </>
  );
}

export function Scene() {
  return (
    <Canvas
      className="!fixed inset-0"
      camera={{ position: [0, 1.6, 3], fov: 70, near: 0.1, far: 1000 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      style={{ background: "#0a0a0f" }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}
```

- [ ] **Step 5: Download Space Grotesk font for 3D text**

```bash
cd /Users/beers/Projects/active/festie-ai
mkdir -p public/fonts
curl -L "https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj62UUsjNsFjTDJK.ttf" -o public/fonts/SpaceGrotesk-Bold.ttf
```

- [ ] **Step 6: Verify the hero rave renders**

```bash
cd /Users/beers/Projects/active/festie-ai
npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 7: Commit hero rave**

```bash
cd /Users/beers/Projects/active/festie-ai
git add components/ public/fonts/
git commit -m "feat: hero rave scene — stage, crowd sprites, lasers, particles, bloom"
git push origin main
```

---

## Task 5: Scroll-Driven Camera Pull-Back

**Files:**
- Modify: `components/3d/Scene.tsx`, `app/page.tsx`
- Create: `components/3d/ScrollCamera.tsx`

- [ ] **Step 1: Create scroll-driven camera controller**

Create `components/3d/ScrollCamera.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";
import { useFestieStore } from "@/lib/store";

// Keyframes for the camera journey
const KEYFRAMES = {
  // Frame 1: Inside the rave (0-25%)
  raveStart: {
    position: new THREE.Vector3(0, 1.6, 3),
    lookAt: new THREE.Vector3(0, 2.5, -8),
  },
  // Frame 2: Rising above (25-50%)
  risingAbove: {
    position: new THREE.Vector3(0, 15, 10),
    lookAt: new THREE.Vector3(0, 0, -2),
  },
  // Frame 3: Planet reveal (50-75%)
  planetReveal: {
    position: new THREE.Vector3(0, 30, 40),
    lookAt: new THREE.Vector3(0, 0, 0),
  },
  // Frame 4: Solar system (75-100%)
  solarSystem: {
    position: new THREE.Vector3(0, 20, 60),
    lookAt: new THREE.Vector3(0, 0, 0),
  },
};

function lerp3(a: THREE.Vector3, b: THREE.Vector3, t: number): THREE.Vector3 {
  return new THREE.Vector3(
    THREE.MathUtils.lerp(a.x, b.x, t),
    THREE.MathUtils.lerp(a.y, b.y, t),
    THREE.MathUtils.lerp(a.z, b.z, t)
  );
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

export function ScrollCamera() {
  const scroll = useScroll();
  const { camera } = useThree();
  const setCameraMode = useFestieStore((s) => s.setCameraMode);
  const lookAtTarget = useRef(new THREE.Vector3());

  useFrame(() => {
    const offset = scroll.offset; // 0 to 1

    let position: THREE.Vector3;
    let lookAt: THREE.Vector3;

    if (offset < 0.25) {
      // Frame 1 → Frame 2
      const t = smoothstep(offset / 0.25);
      position = lerp3(KEYFRAMES.raveStart.position, KEYFRAMES.risingAbove.position, t);
      lookAt = lerp3(KEYFRAMES.raveStart.lookAt, KEYFRAMES.risingAbove.lookAt, t);
      setCameraMode("hero");
    } else if (offset < 0.5) {
      // Frame 2 → Frame 3
      const t = smoothstep((offset - 0.25) / 0.25);
      position = lerp3(KEYFRAMES.risingAbove.position, KEYFRAMES.planetReveal.position, t);
      lookAt = lerp3(KEYFRAMES.risingAbove.lookAt, KEYFRAMES.planetReveal.lookAt, t);
      setCameraMode("hero");
    } else if (offset < 0.75) {
      // Frame 3 → Frame 4
      const t = smoothstep((offset - 0.5) / 0.25);
      position = lerp3(KEYFRAMES.planetReveal.position, KEYFRAMES.solarSystem.position, t);
      lookAt = lerp3(KEYFRAMES.planetReveal.lookAt, KEYFRAMES.solarSystem.lookAt, t);
      setCameraMode("solar-system");
    } else {
      // Stay at solar system
      position = KEYFRAMES.solarSystem.position.clone();
      lookAt = KEYFRAMES.solarSystem.lookAt.clone();
      setCameraMode("solar-system");
    }

    camera.position.lerp(position, 0.1);
    lookAtTarget.current.lerp(lookAt, 0.1);
    camera.lookAt(lookAtTarget.current);
  });

  return null;
}
```

- [ ] **Step 2: Update Scene to use ScrollControls**

Replace `components/3d/Scene.tsx` with:

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { Preload, Stars, ScrollControls, Scroll } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense, useEffect } from "react";
import { useFestieStore } from "@/lib/store";
import { HeroRave } from "./HeroRave";
import { ScrollCamera } from "./ScrollCamera";

function SceneContent() {
  const setAssetsLoaded = useFestieStore((s) => s.setAssetsLoaded);
  const setLoadingProgress = useFestieStore((s) => s.setLoadingProgress);

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 15;
      setLoadingProgress(Math.min(progress, 100));
      if (progress >= 100) {
        clearInterval(interval);
        setAssetsLoaded(true);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [setAssetsLoaded, setLoadingProgress]);

  return (
    <ScrollControls pages={4} damping={0.25}>
      <ScrollCamera />
      <Scroll>
        <ambientLight intensity={0.05} />
        <HeroRave />
        <Stars
          radius={100}
          depth={50}
          count={2000}
          factor={4}
          fade
          speed={1}
        />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.6}
            luminanceSmoothing={0.9}
            intensity={1.5}
            mipmapBlur
          />
        </EffectComposer>
      </Scroll>
      <Preload all />
    </ScrollControls>
  );
}

export function Scene() {
  return (
    <Canvas
      className="!fixed inset-0"
      camera={{ position: [0, 1.6, 3], fov: 70, near: 0.1, far: 1000 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      style={{ background: "#0a0a0f" }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}
```

- [ ] **Step 3: Update page to remove overflow-hidden (scroll must work)**

Replace `app/page.tsx` with:

```tsx
"use client";

import dynamic from "next/dynamic";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

const Scene = dynamic(
  () => import("@/components/3d/Scene").then((m) => m.Scene),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="h-screen w-screen">
      <LoadingScreen />
      <Scene />
    </main>
  );
}
```

- [ ] **Step 4: Verify scroll camera compiles**

```bash
cd /Users/beers/Projects/active/festie-ai
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit scroll camera**

```bash
cd /Users/beers/Projects/active/festie-ai
git add components/ app/page.tsx
git commit -m "feat: scroll-driven camera pull-back — rave to solar system in 4 frames"
git push origin main
```

---

## Task 6: Solar System — Sun, Planets, Orbits

**Files:**
- Create: `components/3d/Sun.tsx`, `components/3d/Planet.tsx`, `components/3d/SolarSystem.tsx`, `components/3d/effects/AtmosphereGlow.tsx`
- Modify: `components/3d/Scene.tsx`

- [ ] **Step 1: Create atmosphere glow shader**

Create `components/3d/effects/AtmosphereGlow.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AtmosphereGlowProps {
  color: string;
  size: number;
  intensity?: number;
  pulse?: boolean;
}

export function AtmosphereGlow({
  color,
  size,
  intensity = 0.5,
  pulse = false,
}: AtmosphereGlowProps) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current || !pulse) return;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = intensity * (0.7 + Math.sin(clock.elapsedTime * 1.5) * 0.3);
  });

  return (
    <mesh ref={ref} scale={size * 1.2}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={intensity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.BackSide}
      />
    </mesh>
  );
}
```

- [ ] **Step 2: Create Sun component**

Create `components/3d/Sun.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

export function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.elapsedTime * 0.05;
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(clock.elapsedTime * 0.5) * 0.05;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {/* Core sun sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f97316"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Outer glow */}
      <mesh ref={glowRef} scale={1.3}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#f97316"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Second glow layer */}
      <mesh scale={1.6}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#fbbf24"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Light source */}
      <pointLight intensity={5} color="#fff8e7" distance={100} decay={2} />

      {/* Logo text floating above */}
      <Text
        position={[0, 3.5, 0]}
        fontSize={0.8}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/SpaceGrotesk-Bold.ttf"
      >
        FESTIE.AI
      </Text>
    </group>
  );
}
```

- [ ] **Step 3: Create Planet component**

Create `components/3d/Planet.tsx`:

```tsx
"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { Festival } from "@/lib/types";
import { useFestieStore } from "@/lib/store";
import { AtmosphereGlow } from "./effects/AtmosphereGlow";

interface PlanetProps {
  festival: Festival;
  orbitRadius: number;
  orbitSpeed: number;
  startAngle: number;
}

export function Planet({
  festival,
  orbitRadius,
  orbitSpeed,
  startAngle,
}: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const hoveredPlanet = useFestieStore((s) => s.hoveredPlanetSlug);
  const setHoveredPlanet = useFestieStore((s) => s.setHoveredPlanet);

  const size = (festival.popularityScore / 100) * 1.5 + 0.5; // 0.5 to 2.0
  const isLive = festival.status === "live";

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const angle = startAngle + clock.elapsedTime * orbitSpeed;
    groupRef.current.position.x = Math.cos(angle) * orbitRadius;
    groupRef.current.position.z = Math.sin(angle) * orbitRadius;
    // Slight orbital tilt
    groupRef.current.position.y = Math.sin(angle * 2) * orbitRadius * 0.05;

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  const handlePointerEnter = () => {
    setHovered(true);
    setHoveredPlanet(festival.slug);
    document.body.style.cursor = "pointer";
  };

  const handlePointerLeave = () => {
    setHovered(false);
    setHoveredPlanet(null);
    document.body.style.cursor = "default";
  };

  const handleClick = () => {
    if (festival.comingSoon) return;
    window.location.href = `/planet/${festival.slug}`;
  };

  return (
    <group ref={groupRef}>
      {/* Planet sphere */}
      <mesh
        ref={meshRef}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        scale={hovered ? 1.15 : 1}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={festival.planetColor}
          emissive={festival.planetColor}
          emissiveIntensity={isLive ? 0.8 : 0.2}
          roughness={0.7}
          metalness={0.1}
          transparent={festival.comingSoon}
          opacity={festival.comingSoon ? 0.4 : 1}
        />
      </mesh>

      {/* Atmosphere */}
      <AtmosphereGlow
        color={festival.planetColor}
        size={size}
        intensity={isLive ? 0.6 : 0.2}
        pulse={isLive}
      />

      {/* Live indicator rings */}
      {isLive && (
        <LiveRings size={size} color={festival.planetColor} />
      )}

      {/* Coming soon lock */}
      {festival.comingSoon && (
        <Html center position={[0, size + 0.3, 0]} distanceFactor={15}>
          <div className="text-white/50 text-xs font-display whitespace-nowrap">
            Coming Soon
          </div>
        </Html>
      )}

      {/* Hover tooltip */}
      {hoveredPlanet === festival.slug && (
        <Html center position={[0, -size - 0.5, 0]} distanceFactor={15}>
          <div className="bg-black/80 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 min-w-[200px] pointer-events-none">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-display font-bold text-sm">
                {festival.name}
              </h3>
              {isLive && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                  LIVE
                </span>
              )}
            </div>
            <p className="text-white/50 text-xs mt-1">
              {festival.location.city}, {festival.location.country}
            </p>
            <p className="text-white/40 text-xs">
              {festival.dates.start} — {festival.dates.end}
            </p>
            <div className="flex gap-1 mt-2">
              {festival.genreTags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function LiveRings({ size, color }: { size: number; color: string }) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ring1Ref.current) {
      const scale = 1 + (clock.elapsedTime % 2) * 0.5;
      ring1Ref.current.scale.setScalar(scale);
      const mat = ring1Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 0.4 - (clock.elapsedTime % 2) * 0.2);
    }
    if (ring2Ref.current) {
      const scale = 1 + ((clock.elapsedTime + 1) % 2) * 0.5;
      ring2Ref.current.scale.setScalar(scale);
      const mat = ring2Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 0.4 - ((clock.elapsedTime + 1) % 2) * 0.2);
    }
  });

  return (
    <>
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * 1.1, size * 1.15, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * 1.1, size * 1.15, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}
```

- [ ] **Step 4: Create SolarSystem component**

Create `components/3d/SolarSystem.tsx`:

```tsx
"use client";

import { useMemo } from "react";
import { festivals } from "@/lib/data/festivals";
import { Sun } from "./Sun";
import { Planet } from "./Planet";

export function SolarSystem() {
  const planetConfigs = useMemo(() => {
    // Sort by popularity to place larger planets at inner orbits
    const sorted = [...festivals].sort(
      (a, b) => b.popularityScore - a.popularityScore
    );
    return sorted.map((festival, i) => ({
      festival,
      orbitRadius: 8 + i * 3.5, // Start at 8 units from center, 3.5 apart
      orbitSpeed: 0.03 + (sorted.length - i) * 0.005, // Inner = faster
      startAngle: (i / sorted.length) * Math.PI * 2, // Evenly spaced
    }));
  }, []);

  return (
    <group position={[0, 0, 0]}>
      <Sun />

      {/* Orbit rings (faint) */}
      {planetConfigs.map(({ orbitRadius }, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry
            args={[orbitRadius - 0.02, orbitRadius + 0.02, 128]}
          />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.04}
            depthWrite={false}
            side={2}
          />
        </mesh>
      ))}

      {/* Planets */}
      {planetConfigs.map((config) => (
        <Planet key={config.festival.id} {...config} />
      ))}
    </group>
  );
}
```

- [ ] **Step 5: Add SolarSystem to Scene**

Replace `components/3d/Scene.tsx` with:

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { Preload, Stars, ScrollControls, Scroll } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense, useEffect } from "react";
import { useFestieStore } from "@/lib/store";
import { HeroRave } from "./HeroRave";
import { SolarSystem } from "./SolarSystem";
import { ScrollCamera } from "./ScrollCamera";

function SceneContent() {
  const setAssetsLoaded = useFestieStore((s) => s.setAssetsLoaded);
  const setLoadingProgress = useFestieStore((s) => s.setLoadingProgress);

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 15;
      setLoadingProgress(Math.min(progress, 100));
      if (progress >= 100) {
        clearInterval(interval);
        setAssetsLoaded(true);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [setAssetsLoaded, setLoadingProgress]);

  return (
    <ScrollControls pages={4} damping={0.25}>
      <ScrollCamera />
      <Scroll>
        <ambientLight intensity={0.05} />

        {/* Hero rave sits on a planet at origin */}
        <HeroRave />

        {/* Solar system is centered at origin — hero is "on" the first planet */}
        <SolarSystem />

        <Stars
          radius={200}
          depth={100}
          count={3000}
          factor={4}
          fade
          speed={0.5}
        />

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.5}
            luminanceSmoothing={0.9}
            intensity={1.2}
            mipmapBlur
          />
        </EffectComposer>
      </Scroll>
      <Preload all />
    </ScrollControls>
  );
}

export function Scene() {
  return (
    <Canvas
      className="!fixed inset-0"
      camera={{ position: [0, 1.6, 3], fov: 70, near: 0.1, far: 1000 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      style={{ background: "#0a0a0f" }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}
```

- [ ] **Step 6: Verify everything compiles**

```bash
cd /Users/beers/Projects/active/festie-ai
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 7: Commit solar system**

```bash
cd /Users/beers/Projects/active/festie-ai
git add components/
git commit -m "feat: solar system — sun, 10 orbiting planets, atmosphere glow, hover tooltips"
git push origin main
```

---

## Task 7: Planet Explorer Page — Coachella Surface

**Files:**
- Create: `app/planet/[slug]/page.tsx`, `components/3d/PlanetSurface.tsx`, `components/3d/Stage.tsx`, `components/3d/PlanetScene.tsx`

- [ ] **Step 1: Create Stage component**

Create `components/3d/Stage.tsx`:

```tsx
"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Html } from "@react-three/drei";
import * as THREE from "three";
import { Stage as StageType, Performance } from "@/lib/types";
import { useFestieStore } from "@/lib/store";

interface StageProps {
  stage: StageType;
  currentPerformance: Performance | null;
  nextPerformance: Performance | null;
}

export function Stage({ stage, currentPerformance, nextPerformance }: StageProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ledRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const selectedStageId = useFestieStore((s) => s.selectedStageId);
  const setSelectedStage = useFestieStore((s) => s.setSelectedStage);

  const isLive = currentPerformance !== null;
  const isSelected = selectedStageId === stage.id;

  useFrame(({ clock }) => {
    if (!ledRef.current) return;
    const mat = ledRef.current.material as THREE.MeshStandardMaterial;
    if (isLive) {
      const pulse = Math.sin(clock.elapsedTime * 3) * 0.5 + 0.5;
      mat.emissiveIntensity = 1 + pulse * 2;
    } else {
      mat.emissiveIntensity = 0.1;
    }
  });

  const handleClick = (e: THREE.Event) => {
    e.stopPropagation();
    setSelectedStage(isSelected ? null : stage.id);
  };

  return (
    <group
      ref={groupRef}
      position={[stage.position.x, stage.position.y, stage.position.z]}
    >
      {/* Stage structure */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[3, 2.4, 1.5]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* LED screen */}
      <mesh
        ref={ledRef}
        position={[0, 1.2, 0.8]}
        onPointerEnter={() => {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
        onClick={handleClick}
      >
        <planeGeometry args={[2.6, 1.8]} />
        <meshStandardMaterial
          color={isLive ? stage.color : "#333"}
          emissive={isLive ? stage.color : "#111"}
          emissiveIntensity={isLive ? 2 : 0.1}
          toneMapped={false}
        />
      </mesh>

      {/* Stage name */}
      <Text
        position={[0, 2.6, 0.8]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/SpaceGrotesk-Bold.ttf"
      >
        {stage.name}
      </Text>

      {/* Current/next artist on LED */}
      <Text
        position={[0, 1.2, 0.85]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/SpaceGrotesk-Bold.ttf"
        maxWidth={2.2}
      >
        {currentPerformance?.artistName ?? nextPerformance?.artistName ?? ""}
      </Text>

      {/* Speaker stacks */}
      {[-1.8, 1.8].map((x) => (
        <group key={x} position={[x, 0, 0.5]}>
          {[0.3, 0.9, 1.5].map((y) => (
            <mesh key={y} position={[0, y, 0]}>
              <boxGeometry args={[0.5, 0.4, 0.4]} />
              <meshStandardMaterial color="#111" metalness={0.5} roughness={0.5} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Live crowd (simple dots) */}
      {isLive && <StageCrowd color={stage.color} />}

      {/* Laser beams when live */}
      {isLive && (
        <>
          {[
            [-1, 2.5, 0.5],
            [1, 2.5, 0.5],
          ].map(([x, y, z], i) => (
            <LaserBeam key={i} origin={[x, y, z]} color={stage.color} index={i} />
          ))}
        </>
      )}

      {/* Selection highlight */}
      {(hovered || isSelected) && (
        <mesh position={[0, 0.01, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2, 2.3, 32]} />
          <meshBasicMaterial
            color={stage.color}
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

function StageCrowd({ color }: { color: string }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useRef(
    Float32Array.from(
      Array.from({ length: 30 * 3 }, (_, i) =>
        i % 3 === 0
          ? (Math.random() - 0.5) * 3
          : i % 3 === 1
            ? Math.random() * 0.3
            : Math.random() * 2 + 1.5
      )
    )
  ).current;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < 30; i++) {
      arr[i * 3 + 1] = Math.sin(clock.elapsedTime * 3 + i) * 0.05 + 0.15;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.1} transparent opacity={0.8} />
    </points>
  );
}

function LaserBeam({
  origin,
  color,
  index,
}: {
  origin: number[];
  color: string;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const angle = clock.elapsedTime * 2 + index * Math.PI;
    ref.current.rotation.z = Math.sin(angle) * 0.5;
    ref.current.visible = Math.sin(clock.elapsedTime * 4 + index) > -0.2;
  });

  return (
    <mesh ref={ref} position={origin as [number, number, number]}>
      <cylinderGeometry args={[0.005, 0.005, 4, 4]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
```

- [ ] **Step 2: Create PlanetSurface component**

Create `components/3d/PlanetSurface.tsx`:

```tsx
"use client";

import { useMemo } from "react";
import { Festival, Performance } from "@/lib/types";
import { Stage } from "./Stage";

interface PlanetSurfaceProps {
  festival: Festival;
}

function getCurrentPerformance(
  schedule: Performance[]
): Performance | null {
  const now = new Date();
  return (
    schedule.find(
      (p) => new Date(p.startTime) <= now && new Date(p.endTime) > now
    ) ?? null
  );
}

function getNextPerformance(
  schedule: Performance[]
): Performance | null {
  const now = new Date();
  const upcoming = schedule
    .filter((p) => new Date(p.startTime) > now)
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  return upcoming[0] ?? null;
}

export function PlanetSurface({ festival }: PlanetSurfaceProps) {
  const terrainColor = useMemo(() => {
    switch (festival.terrainType) {
      case "desert":
        return "#c2a04e";
      case "playa":
        return "#8b7355";
      case "coastal":
        return "#2d6a4f";
      case "urban":
        return "#4a4a4a";
      case "grassland":
        return "#4a7c59";
      case "forest":
        return "#2d5a27";
      case "fantasy":
        return "#1a5c3a";
      default:
        return "#666";
    }
  }, [festival.terrainType]);

  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[20, 64]} />
        <meshStandardMaterial
          color={terrainColor}
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* Terrain features based on type */}
      {festival.terrainType === "desert" && <DesertTerrain />}

      {/* Stages */}
      {festival.stages.map((stage) => (
        <Stage
          key={stage.id}
          stage={stage}
          currentPerformance={getCurrentPerformance(stage.schedule)}
          nextPerformance={getNextPerformance(stage.schedule)}
        />
      ))}

      {/* Ambient festival lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 15, 5]}
        intensity={1}
        color="#ffeedd"
        castShadow
      />
    </group>
  );
}

function DesertTerrain() {
  // Scattered palm trees and mountains for Coachella
  const palms = useMemo(
    () =>
      Array.from({ length: 15 }, () => ({
        x: (Math.random() - 0.5) * 35,
        z: (Math.random() - 0.5) * 35,
        scale: 0.5 + Math.random() * 0.5,
      })),
    []
  );

  return (
    <group>
      {/* Background mountains */}
      {[
        { pos: [-12, 0, -15] as [number, number, number], scale: [8, 5, 4] as [number, number, number] },
        { pos: [10, 0, -18] as [number, number, number], scale: [10, 7, 5] as [number, number, number] },
        { pos: [0, 0, -20] as [number, number, number], scale: [12, 4, 6] as [number, number, number] },
      ].map((mt, i) => (
        <mesh key={i} position={mt.pos}>
          <coneGeometry args={[mt.scale[0], mt.scale[1], 6]} />
          <meshStandardMaterial
            color="#5c4a32"
            roughness={1}
            metalness={0}
          />
        </mesh>
      ))}

      {/* Palm trees (simple) */}
      {palms.map((p, i) => (
        <group key={i} position={[p.x, 0, p.z]} scale={p.scale}>
          {/* Trunk */}
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 3, 6]} />
            <meshStandardMaterial color="#8b6f47" roughness={0.9} />
          </mesh>
          {/* Canopy */}
          <mesh position={[0, 3.2, 0]}>
            <sphereGeometry args={[0.8, 8, 6]} />
            <meshStandardMaterial color="#2d5a27" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
```

- [ ] **Step 3: Create PlanetScene (the 3D canvas for planet pages)**

Create `components/3d/PlanetScene.tsx`:

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Preload, Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense } from "react";
import { Festival } from "@/lib/types";
import { PlanetSurface } from "./PlanetSurface";

interface PlanetSceneProps {
  festival: Festival;
}

export function PlanetScene({ festival }: PlanetSceneProps) {
  return (
    <Canvas
      className="!fixed inset-0"
      camera={{ position: [0, 12, 15], fov: 50, near: 0.1, far: 500 }}
      dpr={[1, 2]}
      shadows
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      style={{ background: "#0a0a0f" }}
    >
      <Suspense fallback={null}>
        <PlanetSurface festival={festival} />

        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={40}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2.2}
          enableDamping
          dampingFactor={0.05}
        />

        <Stars
          radius={100}
          depth={50}
          count={1500}
          factor={3}
          fade
          speed={0.5}
        />

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.8}
            luminanceSmoothing={0.9}
            intensity={0.8}
            mipmapBlur
          />
        </EffectComposer>

        <Preload all />
      </Suspense>
    </Canvas>
  );
}
```

- [ ] **Step 4: Create planet page route**

Create `app/planet/[slug]/page.tsx`:

```tsx
import { festivals, getFestivalBySlug } from "@/lib/data/festivals";
import { notFound } from "next/navigation";
import { PlanetPageClient } from "./client";

export function generateStaticParams() {
  return festivals
    .filter((f) => !f.comingSoon)
    .map((f) => ({ slug: f.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const festival = getFestivalBySlug(params.slug);
  if (!festival) return {};
  return {
    title: `${festival.name} — Festie.ai`,
    description: `Explore ${festival.name} in 3D. ${festival.description}`,
  };
}

export default function PlanetPage({
  params,
}: {
  params: { slug: string };
}) {
  const festival = getFestivalBySlug(params.slug);
  if (!festival || festival.comingSoon) notFound();
  return <PlanetPageClient festival={festival} />;
}
```

- [ ] **Step 5: Create planet page client component**

Create `app/planet/[slug]/client.tsx`:

```tsx
"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Festival } from "@/lib/types";

const PlanetScene = dynamic(
  () => import("@/components/3d/PlanetScene").then((m) => m.PlanetScene),
  { ssr: false }
);

export function PlanetPageClient({ festival }: { festival: Festival }) {
  return (
    <main className="h-screen w-screen relative">
      <PlanetScene festival={festival} />

      {/* Top nav bar */}
      <div className="fixed top-0 left-0 right-0 z-10 p-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-white/60 hover:text-white text-sm font-display flex items-center gap-2 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Universe
        </Link>

        <div className="flex items-center gap-3">
          <h1 className="text-white font-display font-bold text-lg">
            {festival.name}
          </h1>
          {festival.status === "live" && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
              LIVE
            </span>
          )}
        </div>

        <a
          href={festival.ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-festie-purple to-festie-pink text-white text-sm font-display font-bold px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
        >
          Buy Tickets
        </a>
      </div>

      {/* Festival info bar */}
      <div className="fixed bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <p className="text-white/50 text-xs">
              {festival.location.city}, {festival.location.state},{" "}
              {festival.location.country}
            </p>
            <p className="text-white/40 text-xs">
              {festival.dates.start} — {festival.dates.end}
            </p>
          </div>
          <div className="flex gap-1">
            {festival.genreTags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 6: Verify everything compiles**

```bash
cd /Users/beers/Projects/active/festie-ai
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 7: Commit planet explorer**

```bash
cd /Users/beers/Projects/active/festie-ai
git add app/ components/
git commit -m "feat: planet explorer — Coachella surface with stages, terrain, orbit controls"
git push origin main
```

---

## Task 8: Timeline Rail & Stage Info Panel

**Files:**
- Create: `components/ui/Timeline.tsx`, `components/ui/StagePanel.tsx`
- Modify: `app/planet/[slug]/client.tsx`

- [ ] **Step 1: Create Timeline component**

Create `components/ui/Timeline.tsx`:

```tsx
"use client";

import { useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Festival, Performance, Stage } from "@/lib/types";
import { useFestieStore } from "@/lib/store";

interface TimelineProps {
  festival: Festival;
}

// Get earliest and latest times from all schedules
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

  const timeRange = useMemo(
    () => getTimeRange(festival.stages),
    [festival.stages]
  );

  const totalMs = timeRange.end.getTime() - timeRange.start.getTime();
  const pxPerMs = 0.0003; // Scale factor: ms to pixels
  const totalWidth = totalMs * pxPerMs;

  // Current time position
  const now = new Date();
  const nowOffset =
    ((now.getTime() - timeRange.start.getTime()) / totalMs) * totalWidth;

  // Group performances by day
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
        {/* Day tabs */}
        <div className="flex border-b border-white/10 px-3 pt-2">
          {days.map((day, i) => (
            <button
              key={day}
              className="text-xs px-3 py-1.5 text-white/60 hover:text-white font-display transition-colors"
            >
              Day {i + 1}
            </button>
          ))}
        </div>

        {/* Scrollable timeline */}
        <div
          ref={scrollRef}
          className="overflow-x-auto overflow-y-hidden"
          style={{ maxHeight: `${festival.stages.length * 36 + 24}px` }}
        >
          <div style={{ width: totalWidth, minWidth: "100%" }} className="relative p-3">
            {/* Time markers */}
            <div className="h-5 relative mb-1">
              {Array.from({ length: Math.ceil(totalMs / 3600000) + 1 }).map(
                (_, i) => {
                  const time = new Date(
                    timeRange.start.getTime() + i * 3600000
                  );
                  const left = i * 3600000 * pxPerMs;
                  return (
                    <span
                      key={i}
                      className="absolute text-[10px] text-white/30 top-0"
                      style={{ left }}
                    >
                      {formatTime(time)}
                    </span>
                  );
                }
              )}
            </div>

            {/* Stage swim lanes */}
            {festival.stages.map((stage) => (
              <div key={stage.id} className="relative h-7 mb-1">
                {/* Stage label */}
                <span className="absolute left-0 top-1 text-[10px] text-white/40 font-display z-10 bg-black/50 px-1 rounded">
                  {stage.name}
                </span>

                {/* Performance blocks */}
                {stage.schedule.map((perf) => {
                  const startOffset =
                    ((new Date(perf.startTime).getTime() -
                      timeRange.start.getTime()) /
                      totalMs) *
                    totalWidth;
                  const width =
                    ((new Date(perf.endTime).getTime() -
                      new Date(perf.startTime).getTime()) /
                      totalMs) *
                    totalWidth;

                  return (
                    <button
                      key={perf.id}
                      className={`absolute top-0 h-full rounded text-[9px] text-white font-display truncate px-1.5 flex items-center transition-all ${
                        selectedStageId === stage.id
                          ? "ring-1 ring-white"
                          : "hover:brightness-125"
                      }`}
                      style={{
                        left: startOffset,
                        width: Math.max(width, 30),
                        backgroundColor: stage.color + "cc",
                      }}
                      onClick={() => setSelectedStage(stage.id)}
                      title={`${perf.artistName} — ${formatTime(new Date(perf.startTime))}`}
                    >
                      {perf.artistName}
                    </button>
                  );
                })}
              </div>
            ))}

            {/* Current time indicator */}
            {nowOffset > 0 && nowOffset < totalWidth && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20"
                style={{ left: nowOffset }}
              >
                <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Create StagePanel component**

Create `components/ui/StagePanel.tsx`:

```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Festival, Stage, Performance } from "@/lib/types";
import { useFestieStore } from "@/lib/store";

interface StagePanelProps {
  festival: Festival;
}

function getCurrentOrNextPerformance(
  schedule: Performance[]
): { performance: Performance; isCurrent: boolean } | null {
  const now = new Date();
  const current = schedule.find(
    (p) => new Date(p.startTime) <= now && new Date(p.endTime) > now
  );
  if (current) return { performance: current, isCurrent: true };

  const upcoming = schedule
    .filter((p) => new Date(p.startTime) > now)
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  if (upcoming[0]) return { performance: upcoming[0], isCurrent: false };
  return null;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function StagePanel({ festival }: StagePanelProps) {
  const selectedStageId = useFestieStore((s) => s.selectedStageId);
  const setSelectedStage = useFestieStore((s) => s.setSelectedStage);

  const stage = festival.stages.find((s) => s.id === selectedStageId);

  return (
    <AnimatePresence>
      {stage && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="fixed right-2 top-16 bottom-20 z-20 w-72"
        >
          <div className="h-full bg-black/70 backdrop-blur-md rounded-xl border border-white/10 overflow-y-auto p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2
                className="font-display font-bold text-lg"
                style={{ color: stage.color }}
              >
                {stage.name}
              </h2>
              <button
                onClick={() => setSelectedStage(null)}
                className="text-white/40 hover:text-white text-lg"
              >
                x
              </button>
            </div>

            {/* Schedule list */}
            <div className="space-y-3">
              {stage.schedule.map((perf) => {
                const info = getCurrentOrNextPerformance([perf]);
                const isCurrent = info?.isCurrent ?? false;

                return (
                  <div
                    key={perf.id}
                    className={`rounded-lg p-3 transition-colors ${
                      isCurrent
                        ? "bg-white/10 border border-white/20"
                        : "bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-sm text-white">
                        {perf.artistName}
                      </h3>
                      {isCurrent && (
                        <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                          LIVE
                        </span>
                      )}
                    </div>

                    <p className="text-white/40 text-xs mt-1">
                      {formatTime(perf.startTime)} —{" "}
                      {formatTime(perf.endTime)}
                    </p>

                    <div className="flex gap-1 mt-2">
                      {perf.genreTags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-3">
                      {perf.spotifyUrl && (
                        <a
                          href={perf.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-green-400 hover:text-green-300 font-display"
                        >
                          Listen on Spotify
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Buy tickets CTA */}
            <a
              href={festival.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 w-full text-center bg-gradient-to-r from-festie-purple to-festie-pink text-white text-sm font-display font-bold px-4 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Buy Tickets
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 3: Wire Timeline and StagePanel into planet page**

Replace `app/planet/[slug]/client.tsx` with:

```tsx
"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Festival } from "@/lib/types";
import { Timeline } from "@/components/ui/Timeline";
import { StagePanel } from "@/components/ui/StagePanel";

const PlanetScene = dynamic(
  () => import("@/components/3d/PlanetScene").then((m) => m.PlanetScene),
  { ssr: false }
);

export function PlanetPageClient({ festival }: { festival: Festival }) {
  return (
    <main className="h-screen w-screen relative">
      <PlanetScene festival={festival} />

      {/* Top nav bar */}
      <div className="fixed top-0 left-0 right-0 z-10 p-4 flex items-center justify-between pointer-events-none">
        <Link
          href="/"
          className="text-white/60 hover:text-white text-sm font-display flex items-center gap-2 transition-colors pointer-events-auto"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Universe
        </Link>

        <div className="flex items-center gap-3">
          <h1 className="text-white font-display font-bold text-lg">
            {festival.name}
          </h1>
          {festival.status === "live" && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
              LIVE
            </span>
          )}
        </div>

        <a
          href={festival.ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-festie-purple to-festie-pink text-white text-sm font-display font-bold px-4 py-2 rounded-full hover:opacity-90 transition-opacity pointer-events-auto"
        >
          Buy Tickets
        </a>
      </div>

      {/* Stage info panel (right side) */}
      <StagePanel festival={festival} />

      {/* Timeline rail (bottom) */}
      <Timeline festival={festival} />
    </main>
  );
}
```

- [ ] **Step 4: Verify everything compiles**

```bash
cd /Users/beers/Projects/active/festie-ai
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit timeline and stage panel**

```bash
cd /Users/beers/Projects/active/festie-ai
git add components/ app/
git commit -m "feat: timeline rail with swim lanes + stage info panel with Spotify links"
git push origin main
```

---

## Task 9: Solar System UI — Search & Filters

**Files:**
- Create: `components/ui/SearchBar.tsx`, `components/ui/FilterChips.tsx`, `components/ui/SolarSystemUI.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create SearchBar**

Create `components/ui/SearchBar.tsx`:

```tsx
"use client";

import { useFestieStore } from "@/lib/store";

export function SearchBar() {
  const searchQuery = useFestieStore((s) => s.searchQuery);
  const setSearchQuery = useFestieStore((s) => s.setSearchQuery);

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
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
```

- [ ] **Step 2: Create FilterChips**

Create `components/ui/FilterChips.tsx`:

```tsx
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
          onClick={() =>
            setActiveGenreFilter(activeGenreFilter === genre ? null : genre)
          }
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
```

- [ ] **Step 3: Create SolarSystemUI overlay**

Create `components/ui/SolarSystemUI.tsx`:

```tsx
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
```

- [ ] **Step 4: Add SolarSystemUI to landing page**

Replace `app/page.tsx` with:

```tsx
"use client";

import dynamic from "next/dynamic";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { SolarSystemUI } from "@/components/ui/SolarSystemUI";

const Scene = dynamic(
  () => import("@/components/3d/Scene").then((m) => m.Scene),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="h-screen w-screen">
      <LoadingScreen />
      <Scene />
      <SolarSystemUI />
    </main>
  );
}
```

- [ ] **Step 5: Verify everything compiles**

```bash
cd /Users/beers/Projects/active/festie-ai
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 6: Commit search and filters**

```bash
cd /Users/beers/Projects/active/festie-ai
git add components/ app/page.tsx
git commit -m "feat: solar system UI — search bar and genre filter chips"
git push origin main
```

---

## Task 10: Vercel Deployment & Domain Setup

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Create vercel.json config**

Create `vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/models/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/fonts/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

- [ ] **Step 2: Link to Vercel and deploy**

```bash
cd /Users/beers/Projects/active/festie-ai
npx vercel link --yes
npx vercel --prod
```

Expected: Deployment URL returned, site live.

- [ ] **Step 3: Add festie.ai custom domain**

```bash
cd /Users/beers/Projects/active/festie-ai
npx vercel domains add festie.ai
```

Expected: DNS instructions shown. User will need to update DNS records at their registrar.

- [ ] **Step 4: Commit vercel config**

```bash
cd /Users/beers/Projects/active/festie-ai
git add vercel.json
git commit -m "feat: Vercel deployment config with asset caching headers"
git push origin main
```

---

## Task 11: Final Polish & Mobile Testing

**Files:**
- Modify: `app/globals.css`, `components/3d/Scene.tsx`

- [ ] **Step 1: Add mobile-specific CSS**

Append to `app/globals.css`:

```css
/* Mobile touch improvements */
@media (max-width: 768px) {
  .fixed {
    -webkit-transform: translateZ(0);
  }
}

/* Smooth scrollbar hiding for timeline */
.overflow-x-auto::-webkit-scrollbar {
  display: none;
}
.overflow-x-auto {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Safe area padding for notched phones */
@supports (padding: env(safe-area-inset-bottom)) {
  .fixed.bottom-0 {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
```

- [ ] **Step 2: Add device-aware particle counts to HeroRave**

At the top of `components/3d/HeroRave.tsx`, add a hook before the component:

```tsx
import { useState, useEffect } from "react";

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);
  return isMobile;
}
```

Then update `HeroRave` to use it — change the particle counts:

```tsx
export function HeroRave() {
  const isMobile = useIsMobile();
  const particleCount = isMobile ? 100 : 300;
  const crowdCount = isMobile ? 30 : 60;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#0a0a0f" />
      </mesh>

      <RaveStage />
      <CrowdSprites count={crowdCount} />
      <Lasers origin={[0, 5, -8]} count={isMobile ? 6 : 12} spread={6} color="#7c3aed" />
      <Lasers origin={[0, 5, -8]} count={isMobile ? 4 : 8} spread={5} color="#ec4899" />
      <Particles count={particleCount} area={[15, 8, 15]} color="#ec4899" size={0.02} speed={0.2} />
      <Particles count={isMobile ? 50 : 100} area={[15, 8, 15]} color="#7c3aed" size={0.04} speed={0.1} />

      <fog attach="fog" args={["#0a0a0f", 5, 25]} />

      <spotLight position={[-4, 8, -6]} angle={0.4} penumbra={0.5} intensity={3} color="#7c3aed" />
      <spotLight position={[4, 8, -6]} angle={0.4} penumbra={0.5} intensity={3} color="#ec4899" />
    </group>
  );
}
```

- [ ] **Step 3: Run final type check and build**

```bash
cd /Users/beers/Projects/active/festie-ai
npx tsc --noEmit && npm run build
```

Expected: Clean build with no errors.

- [ ] **Step 4: Commit polish**

```bash
cd /Users/beers/Projects/active/festie-ai
git add -A
git commit -m "feat: mobile optimization — adaptive particle counts, safe areas, scroll hiding"
git push origin main
```

- [ ] **Step 5: Final production deploy**

```bash
cd /Users/beers/Projects/active/festie-ai
npx vercel --prod
```

Expected: Clean deployment. Site live at festie.ai (once DNS is configured).
