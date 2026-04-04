# Vercel Deployment Guide

## First-Time Setup

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Link the Project
```bash
cd festie-ai
vercel link
```

Follow the prompts to connect to your Vercel account.

### 3. Add Environment Variables

Go to [Vercel Dashboard](https://vercel.com) → festie-ai → Settings → Environment Variables.

Add these:

| Variable | Value | Required For |
|----------|-------|-------------|
| `OLLAMA_URL` | Your Cloudflare Tunnel URL (e.g. `https://festie-ai.your-domain.com`) | SMS AI bot |
| `OLLAMA_MODEL` | `gemma3:4b` | SMS AI bot |
| `TWILIO_ACCOUNT_SID` | From Twilio console | SMS |
| `TWILIO_AUTH_TOKEN` | From Twilio console | SMS |
| `TWILIO_PHONE_NUMBER` | `+18775092803` | SMS |
| `SUPABASE_URL` | From Supabase project settings | Payments |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase project settings | Payments |
| `STRIPE_SECRET_KEY` | From Stripe dashboard | Payments |
| `STRIPE_WEBHOOK_SECRET` | From Stripe webhooks page | Payments |

### 4. Deploy
```bash
vercel --prod
```

### 5. Add Custom Domain

```bash
vercel domains add festie.ai
```

Then update DNS at your domain registrar:
- **A Record:** `76.76.21.21`
- **CNAME:** `cname.vercel-dns.com` (for www subdomain)

SSL is automatic.

## Ongoing Deployment

Every push to `main` auto-deploys to production. PRs get preview URLs.

```bash
git push origin main  # → auto deploys to festie.ai
```

## Manual Deploy
```bash
vercel --prod
```
