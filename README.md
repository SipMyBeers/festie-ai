# Festie.ai — 3D Festival Universe + Offline Guide

A 3D festival discovery platform where users explore festivals as planets in an immersive WebGL solar system, plus an offline PWA guide and SMS companion for at-the-festival use.

## Live URLs

- **Main site:** https://festie.ai (3D solar system experience)
- **Coachella Guide:** https://festie.ai/guide/coachella (offline PWA)
- **SMS Bot:** Text (877) 509-2803

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| 3D Engine | React Three Fiber + drei + postprocessing |
| State | Zustand |
| Styling | Tailwind CSS 4 + Framer Motion |
| SMS | Twilio (webhook) |
| AI | Gemma 4 via Ollama (self-hosted on Mac Mini) |
| Hosting | Vercel (site) + Mac Mini (AI) |
| Database | Supabase (Postgres) |
| Payments | Stripe |

## Project Structure

```
festie-ai/
├── app/
│   ├── page.tsx                    # 3D landing (hero rave + solar system)
│   ├── planet/[slug]/              # Planet explorer pages
│   ├── guide/coachella/            # Offline PWA guide
│   │   ├── page.tsx                # Guide home (live now, quick access)
│   │   ├── schedule/page.tsx       # Full schedule with save
│   │   ├── map/page.tsx            # Venue map (water, food, restrooms)
│   │   ├── faq/page.tsx            # FAQ accordion
│   │   └── my-schedule/page.tsx    # Saved acts
│   └── api/sms/route.ts           # Twilio SMS webhook
├── components/
│   ├── 3d/                         # All Three.js/R3F components
│   └── ui/                         # 2D UI components
├── lib/
│   ├── data/                       # Festival + lineup data
│   ├── sms/                        # SMS responder + Ollama client
│   ├── store.ts                    # Zustand global state
│   └── types.ts                    # TypeScript types
├── public/
│   ├── fonts/                      # Space Grotesk for 3D text
│   ├── sw.js                       # Service worker (offline PWA)
│   └── manifest.json               # PWA manifest
└── docs/superpowers/               # Design specs + implementation plans
```

## Getting Started

### Prerequisites
- Node.js 20+
- npm

### Install & Run
```bash
git clone https://github.com/SipMyBeers/festie-ai.git
cd festie-ai
npm install
npm run dev
```

Open http://localhost:3000 for the 3D site, http://localhost:3000/guide/coachella for the PWA guide.

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `OLLAMA_URL` | For AI SMS | URL to Ollama instance (e.g. `https://your-tunnel.trycloudflare.com`) |
| `OLLAMA_MODEL` | For AI SMS | Model name (default: `gemma3:12b`) |
| `TWILIO_ACCOUNT_SID` | For SMS | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | For SMS | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | For SMS | Twilio phone number |
| `SUPABASE_URL` | For payments | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | For payments | Supabase service role key |
| `STRIPE_SECRET_KEY` | For payments | Stripe secret key (live mode) |
| `STRIPE_WEBHOOK_SECRET` | For payments | Stripe webhook signing secret |

**Note:** The 3D site and PWA guide work without any env vars. Env vars are only needed for SMS bot and payment features.

## Deployment

### Vercel (Main Site + PWA)

1. Install Vercel CLI: `npm i -g vercel`
2. Link the project: `vercel link`
3. Add env vars in Vercel dashboard: Settings → Environment Variables
4. Deploy: `vercel --prod`
5. Point `festie.ai` domain: Vercel dashboard → Domains → Add `festie.ai`
6. Update DNS at your registrar to point to Vercel

Every push to `main` auto-deploys to production.

### Mac Mini (Ollama AI for SMS)

1. Install Ollama: `brew install ollama`
2. Start Ollama: `ollama serve`
3. Pull the model: `ollama pull gemma3:12b`
4. Install Cloudflare Tunnel: `brew install cloudflared`
5. Create tunnel: `cloudflared tunnel --url http://localhost:11434`
6. Copy the tunnel URL and set it as `OLLAMA_URL` in Vercel env vars

To make it persistent (survives reboots):
- Set Mac Mini to never sleep (System Settings → Energy)
- Enable "Restart after power failure" (System Settings → Energy)
- Auto-start Ollama via launchd (see docs/setup-mac-mini.md)

### Twilio (SMS)

1. Upgrade Twilio account from trial at console.twilio.com
2. Go to Phone Numbers → (877) 509-2803 → Messaging
3. Set webhook URL to: `https://festie.ai/api/sms` (HTTP POST)
4. Save

### Supabase (Database)

1. Create new project "festie" at supabase.com
2. Copy project URL and service role key to env vars
3. Tables will be created automatically on first deploy

## Features

### 3D Festival Universe (festie.ai)
- Immersive hero rave scene with scroll-driven camera pull-back
- Solar system with 10 festival planets (orbiting, labeled, interactive)
- Click any planet to fly the camera to it
- Coachella fully built with desert terrain + 5 stage replicas
- Bloom, lasers, particles, atmosphere effects

### Offline PWA Guide (/guide/coachella)
- Works fully offline after first load (service worker)
- "Add to Home Screen" for native app feel
- Live schedule with "what's playing now" (uses device clock)
- Save acts to personal schedule (localStorage)
- Venue map with water, restrooms, food locations
- FAQ with parking, weather, rules

### SMS Bot (text the Twilio number)
- Powered by Gemma via Ollama (self-hosted, zero per-message cost)
- Falls back to rule-based responder if AI is down
- Knows full Coachella schedule, venue info, FAQ
- Works on any phone with cell signal (no internet needed on user's end)

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit
3. Push and create a PR against `main`
4. PRs auto-deploy to a preview URL for testing
