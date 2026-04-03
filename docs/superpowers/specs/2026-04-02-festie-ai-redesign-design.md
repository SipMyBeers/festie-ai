# Festie.ai — 3D Festival Universe Platform

**Date:** 2026-04-02
**Status:** Approved
**Owner:** Dylan "Beers"

## Overview

Festie.ai is a mobile-first, fully 3D festival discovery platform. Users explore a solar system of festival planets — each sized by popularity, themed by real-world geography, and populated with replica stages. When a festival is live, its planet lights up and users can see which stages are active and who's performing in real-time. The site is a visual promoter, not a ticketing platform — "Buy Tickets" links out to official festival pages.

**MVP Scope:** Hero rave experience + solar system navigation + 1 fully built planet (Coachella) as proof of concept.

## 1. Hero Experience — "The Rave Pull-Back"

Scroll-driven camera journey spanning ~4 viewport heights:

### Frame 1 — Inside the Rave (0-25% scroll)
- First-person POV at ground level inside a massive rave
- 3D crowd silhouettes surrounding the camera
- Volumetric laser beams cutting through haze
- Towering mainstage ahead with LED panels pulsing
- "FESTIE.AI" displayed as the headliner on the stage marquee
- Bass-reactive particle effects
- Subtle muffled bass thump audio on interaction

### Frame 2 — Rising Above (25-50% scroll)
- Camera lifts and pulls back
- Festival grounds visible from above — multiple lit stages, pathways, ferris wheel spinning, glowing art installations
- Planet curvature begins appearing at the edges

### Frame 3 — The Planet Reveal (50-75% scroll)
- Camera continues pulling back
- Full sphere visible — this was all on a festival planet
- Atmosphere glow around the planet
- Stars appear in the background
- Other planets fade into view in the distance

### Frame 4 — The Solar System (75-100% scroll)
- Full solar system view with 15-20 festival planets
- Varying sizes orbiting a central glowing sun/logo
- Smaller moons (band tours, local festivals) orbit parent planets
- Everything slowly rotates
- UI chrome fades in: search bar, filters, "EXPLORE" CTA

### Mobile Optimization
- Reduced particle count
- Crowd as billboard sprites instead of 3D models
- Lower shadow resolution
- Same camera journey and visual impact

## 2. The Solar System — Festival Universe Navigation

### Layout & Scale
- Central element: glowing pulsing sun with Festie.ai logo embedded
- Planets orbit at varying distances in a slightly tilted orbital plane
- Planet size = popularity/attendance score
- Moons = band tours, side events, afterparties tied to parent festival
- Slow ambient rotation so it always feels alive

### Planet Visual Identity (from a distance)
Each planet has distinct color palette and atmosphere glow matching real-world location:
- **Coachella:** Warm desert orange, palm tree silhouettes on surface
- **Burning Man:** Deep red/ember glow, cracked surface, heat shimmer
- **Rolling Loud:** Teal/purple urban glow, tiny skyline silhouette
- **Tomorrowland:** Lush green with fantasy sparkle, golden atmosphere
- **Glastonbury:** Misty grey-green, rain particle effect
- **"Coming Soon" planets:** Darker, semi-transparent with lock icon

### Live Indicator
When a festival is currently happening:
- Planet pulses with energy — rings of light radiating outward
- Brighter glow, firework particles
- Impossible to miss from any zoom level

### Interactions
- **Hover/tap planet** — scales up, tooltip card: festival name, dates, location, stage count, "LIVE" badge
- **Click planet** — smooth camera fly-in, atmosphere transition, land on planet surface
- **Pinch/scroll zoom** — zoom in/out, more detail revealed at closer distances
- **Drag to orbit** — rotate the whole solar system
- **Search bar** — type festival or artist name, matching planet pulses, camera auto-navigates
- **Filter chips** — by genre (EDM, Hip-Hop, Rock, Country), date range, "Live Now"

### Mobile Gestures
- Single finger drag to orbit
- Pinch to zoom
- Tap to select
- Bottom sheet for search/filters

## 3. Planet Explorer — On the Surface

### Entry Transition
Camera flies through atmosphere (color-tinted blur matching planet vibe), lands at elevated overview angle looking down at festival grounds.

### Terrain & Environment
Each planet's surface = miniature of real geography:
- **Coachella:** Flat desert floor, Indio mountain range background, scattered palms, golden hour lighting
- **Burning Man:** Cracked playa, dust storms in distance, the Man at center, deep red sky
- **Rolling Loud:** Miami coastline, palm-lined streets, ocean at edge, sunset tones
- Skybox matches real-world location conditions

### Stage Replicas
- Positioned matching real festival layout
- Coachella MVP: Sahara tent, Outdoor Theatre, Gobi, Mojave, Mainstage — recognizable silhouettes
- Each stage = GLTF model with LED screen surfaces, speaker stacks, lighting rigs
- **Live state:** LED screens pulse with color, laser beams, volumetric light cones, particle confetti/sparks. Current artist name on marquee. 3D crowd gathered in front.
- **Idle/upcoming state:** Dimly lit, no crowd, next artist name and set time on marquee. Subtle ambient glow.
- **Finished state:** Dark, minimal glow

### Surface Navigation
- Drag to orbit around planet (planet rotates under you)
- Pinch/scroll to zoom to individual stages
- Tap stage to focus — camera swoops to stage level, info panel slides up
- Double-tap empty ground to reset to overview

### Timeline Rail
- Horizontal scrollable timeline bar anchored at bottom of screen
- All stages shown as color-coded swim lanes with artist blocks
- Current time = vertical glowing line moving in real-time during live festivals
- Tap artist block on timeline → camera flies to that stage
- Synced with 3D: tapping stages in 3D highlights corresponding timeline block

### Stage Info Panel (on focus)
- Artist name, photo, genre tags
- Set time (start — end)
- "Listen on Spotify" button
- "Buy Tickets" → external link to festival's official ticketing page
- Stage name and capacity indicator

## 4. Data Architecture & Real-Time System

### Data Model
```
Festival {
  id, name, slug
  dates: { start, end }
  location: { city, state, country, lat, lng }
  terrain_type: "desert" | "urban" | "grassland" | "playa" | "coastal"
  popularity_score: number (determines planet size)
  stages: Stage[]
  ticket_url: string (external link)
  status: "upcoming" | "live" | "completed"
  planet_model_url: string (GLB path)
}

Stage {
  id, name
  position: { x, y, z } (on planet surface)
  model_url: string (GLB for stage replica)
  schedule: Performance[]
}

Performance {
  artist_name, artist_image
  start_time, end_time
  genre_tags: string[]
  spotify_url
  status: "upcoming" | "live" | "finished"
}
```

### Data Sources (Hybrid)
- **Manual curation:** Flagship festivals hand-entered with custom planet models, stage layouts, terrain. Stored in Supabase (Postgres).
- **API enrichment:** Bandsintown/Songkick APIs for smaller festivals as moons, artist metadata, tour dates.
- **Spotify API:** Artist images, genre tags, "Listen" links.

### Real-Time System
- Next.js API route `/api/festivals/[slug]/live` checks current UTC time against performance schedule every 60 seconds via Vercel Cron
- Returns which stages are active and current performer
- Client subscribes to SSE (Server-Sent Events) stream when on a planet surface
- R3F scene reacts to state changes — stages light up/dim, artist names swap, crowd appears/disappears

### Monetization (Phase 2)
- **Free:** Solar system exploration, planet overviews, basic lineup info
- **Paid (one-time per planet):** Real-time stage status, live visualizer effects, detailed schedule timeline, stage-level zoom
- Stripe Checkout, access stored in localStorage (MVP), upgrade to user accounts later

## 5. Tech Stack

### Core
- **Next.js 15** (App Router) — framework, SSR, API routes, SEO
- **React Three Fiber** — 3D rendering engine
- **@react-three/drei** — ScrollControls, Html overlays, GLTF loaders, Environment maps, Stars, Float
- **@react-three/postprocessing** — bloom, god rays, chromatic aberration
- **Zustand** — global state management
- **Tailwind CSS** — all 2D UI
- **Framer Motion** — 2D UI animations

### 3D Assets Pipeline
- Models created in Blender, exported as compressed GLB
- Draco compression for geometry, KTX2 for textures
- LOD variants: high (on-planet), medium (solar system close), low (solar system far)
- Assets hosted on Vercel Blob with CDN edge caching
- Large 3D assets stay out of git repo

### Backend
- **Supabase** (Postgres) — festival data, schedules, stage layouts
- **Next.js API routes** — SSE for live status, data fetching
- **Vercel Cron** — live status checks every 60s during active festivals
- **Stripe** — per-planet purchase (phase 2)

### Performance Budget (Mobile)
- Initial JS bundle: < 500KB (code-split 3D scenes)
- Hero scene loads first, solar system lazy-loads behind it
- Planet surfaces loaded on-demand on click
- Target: 30fps on iPhone 13+, 60fps on desktop
- Fallback: static rendered image with "View in 3D" prompt if WebGL2 unsupported

## 6. Project Structure

```
festie-ai/
├── app/
│   ├── page.tsx                 (hero + solar system landing)
│   ├── planet/[slug]/page.tsx   (planet explorer view)
│   └── api/
│       └── festivals/           (data + SSE endpoints)
├── components/
│   ├── 3d/
│   │   ├── HeroRave.tsx         (the rave pull-back scene)
│   │   ├── SolarSystem.tsx      (all planets, orbits, sun)
│   │   ├── Planet.tsx           (individual planet with LOD)
│   │   ├── PlanetSurface.tsx    (on-planet terrain + stages)
│   │   ├── Stage.tsx            (stage replica with live state)
│   │   └── effects/             (lasers, particles, bloom)
│   └── ui/
│       ├── Timeline.tsx         (bottom timeline rail)
│       ├── SearchBar.tsx
│       ├── FilterChips.tsx
│       ├── StagePanel.tsx       (artist info panel)
│       └── PlanetTooltip.tsx
├── lib/
│   ├── store.ts                 (Zustand state)
│   ├── supabase.ts              (DB client)
│   └── festivals.ts             (data fetching + types)
├── public/
│   └── models/                  (GLB files)
└── styles/
```

## 7. Deployment & CI/CD

- **Hosting:** Vercel — native Next.js, edge CDN, preview deploys on every PR
- **Production:** Push to `main` → auto-deploys to `festie.ai`
- **Preview:** Push to any branch / open PR → auto preview URL
- **CI:** GitHub Actions for linting + type checking on every push
- **Domain:** `festie.ai` DNS pointed to Vercel (A record + CNAME), auto SSL
- **Assets:** GLB models on Vercel Blob with edge caching, outside of git

## 8. MVP Scope (Phase 1)

1. Hero rave pull-back experience (scroll-driven)
2. Solar system with Coachella as the one fully built planet + 5-10 "coming soon" placeholder planets
3. Coachella planet surface with terrain, stage replicas, and schedule data (from existing HTML data)
4. Timeline rail with stage swim lanes
5. Stage info panels with Spotify + external ticket links
6. GitHub repo with Vercel auto-deploy pipeline
7. Mobile-optimized with LOD system

## Phase 2 (Post-MVP)
- Additional flagship planets (Burning Man, Tomorrowland, Rolling Loud, Lollapalooza)
- Real-time SSE live status system
- Stripe per-planet paid tier
- API integrations (Bandsintown, Songkick, Spotify)
- Moon system for smaller festivals/tours
