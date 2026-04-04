# Festie.ai Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                     USER DEVICES                        │
├─────────────────┬───────────────────┬───────────────────┤
│   Desktop/Mobile│   Mobile (PWA)    │   Any Phone (SMS) │
│   festie.ai     │   /guide/coachella│   Text (877)...   │
│   3D Universe   │   Offline Guide   │   Festival Bot    │
└────────┬────────┴────────┬──────────┴────────┬──────────┘
         │                 │                   │
         ▼                 ▼                   ▼
┌─────────────────────────────────────────────────────────┐
│                    VERCEL (Hosting)                      │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Next.js  │  │ Static PWA   │  │ /api/sms webhook  │  │
│  │ 3D Site  │  │ (cached by   │  │ (receives Twilio  │  │
│  │ (SSR)    │  │ service      │  │  POST, calls      │  │
│  │          │  │ worker)      │  │  Ollama, returns  │  │
│  │          │  │              │  │  TwiML)           │  │
│  └──────────┘  └──────────────┘  └────────┬──────────┘  │
└──────────────────────────────────────────┬──────────────┘
                                           │
                    ┌──────────────────────┐│┌──────────────┐
                    │    Twilio            │││  Stripe      │
                    │    SMS Gateway       ││├──────────────┤
                    │    (877) 509-2803    │││  $4 checkout  │
                    └──────────────────────┘│└──────────────┘
                                           │
                    ┌──────────────────────┐│┌──────────────┐
                    │  Mac Mini (M4)       │││  Supabase    │
                    │  ┌────────────────┐  ││├──────────────┤
                    │  │ Ollama         │  │││  sms_users   │
                    │  │ Gemma 3 (4B)   │◄─┘││  conversations│
                    │  └────────────────┘   │└──────────────┘
                    │  Cloudflare Tunnel    │
                    └──────────────────────┘
```

## Data Flow: SMS Message

1. User texts (877) 509-2803
2. Twilio receives SMS, POSTs to `https://festie.ai/api/sms`
3. Vercel API route extracts message body and phone number
4. (Future) Checks if phone number is in `sms_users` table (paid)
5. Loads last 6 messages from `conversations` table for context
6. Sends message + conversation history + Coachella knowledge to Ollama (via Cloudflare Tunnel to Mac Mini)
7. Gemma generates response in ~2-3 seconds
8. Saves user message + response to `conversations` table
9. Returns TwiML XML response to Twilio
10. Twilio delivers SMS to user

## Data Flow: PWA Guide (Offline)

1. User opens `festie.ai/guide/coachella` on their phone
2. Service worker caches all pages + assets
3. User taps "Add to Home Screen"
4. App works fully offline — all data is bundled in the JS
5. Schedule uses device clock for "what's live now"
6. Saved acts stored in localStorage

## Data Flow: 3D Site

1. User opens `festie.ai`
2. Loading screen while 3D assets load
3. Hero rave scene renders at eye level
4. User scrolls → camera pulls back through atmosphere → solar system
5. User clicks a planet → camera flies to it
6. Planet surface renders with stages, terrain, effects
7. All rendering is client-side via React Three Fiber

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Self-hosted Gemma vs API | Zero per-message cost, full control, works on $599 Mac Mini |
| PWA vs native app | No app store approval, instant updates, works offline via service worker |
| SMS vs in-app chat | Works without internet on user's phone, zero friction |
| Static festival data vs DB | MVP simplicity, one festival. DB comes with multi-festival support |
| Rule-based fallback | If Ollama is down, pattern-matching responder still works |
| Vercel vs self-hosted | Auto-deploy, CDN, SSL, zero DevOps for the web layer |
