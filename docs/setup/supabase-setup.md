# Supabase Database Setup

## 1. Create Project

1. Go to https://supabase.com → New Project
2. Name: `festie`
3. Region: US West (closest to Coachella)
4. Generate a database password (save it)

## 2. Get Credentials

Go to **Project Settings** → **API**:
- **Project URL** → `SUPABASE_URL`
- **service_role key** (under "Project API keys") → `SUPABASE_SERVICE_ROLE_KEY`

Add both to Vercel environment variables.

## 3. Create Tables

Run this SQL in the Supabase SQL Editor:

```sql
-- Paid SMS users
CREATE TABLE sms_users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number text UNIQUE NOT NULL,
  festival_slug text NOT NULL DEFAULT 'coachella',
  stripe_payment_id text,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- Conversation history (for AI context)
CREATE TABLE conversations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Index for fast phone lookups
CREATE INDEX idx_sms_users_phone ON sms_users(phone_number);
CREATE INDEX idx_conversations_phone ON conversations(phone_number);
```

## 4. Row Level Security

```sql
-- Enable RLS but allow service role full access
ALTER TABLE sms_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
```

The service role key bypasses RLS, so the API routes can read/write freely.
