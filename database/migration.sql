-- ═══════════════════════════════════════════════════════════════
-- Gigzora Database Migration
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ═══════════════════════════════════════════════════════════════

-- ── 1. LEADS TABLE ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.leads (
  id              BIGSERIAL PRIMARY KEY,
  business_name   TEXT,
  category        TEXT,
  website         TEXT,
  email           TEXT,
  phone           TEXT,
  address         TEXT,
  rating          REAL,
  reviews_count   INTEGER,
  business_size   TEXT,
  lead_score      INTEGER DEFAULT 0,
  lead_grade      TEXT,
  opportunity_signals TEXT,
  score_breakdown TEXT,
  status          TEXT DEFAULT 'NEW',

  -- Email tracking
  last_email_subject   TEXT,
  last_email_body      TEXT,
  last_email_sent_at   TIMESTAMPTZ,
  brevo_message_id     TEXT,

  -- AI report
  ai_report              JSONB,
  ai_report_generated_at TIMESTAMPTZ,

  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),

  -- Upsert constraint used by the Python scraper
  UNIQUE (business_name, phone)
);

-- Enable RLS but allow all for now (service role key bypasses RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow anon reads (the frontend uses the anon key to display leads)
CREATE POLICY "Allow anon read leads"
  ON public.leads FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow service role full access (used by API routes)
CREATE POLICY "Allow service role all on leads"
  ON public.leads FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- ── 2. EMAILS_SENT TABLE ────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.emails_sent (
  id          BIGSERIAL PRIMARY KEY,
  lead_id     BIGINT REFERENCES public.leads(id) ON DELETE CASCADE,
  subject     TEXT,
  body        TEXT,
  recipient   TEXT,
  status      TEXT DEFAULT 'SENT',
  message_id  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.emails_sent ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon read emails_sent"
  ON public.emails_sent FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow service role all on emails_sent"
  ON public.emails_sent FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- ── 3. ACTIVITIES TABLE ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.activities (
  id             BIGSERIAL PRIMARY KEY,
  lead_id        BIGINT REFERENCES public.leads(id) ON DELETE CASCADE,
  activity_type  TEXT,
  title          TEXT,
  description    TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon read activities"
  ON public.activities FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow service role all on activities"
  ON public.activities FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- ── Done! ────────────────────────────────────────────────────
-- You can verify by running: SELECT * FROM public.leads LIMIT 1;
