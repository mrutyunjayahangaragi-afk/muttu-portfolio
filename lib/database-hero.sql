-- ============================================================
-- Hero Section — Database Schema
-- Run AFTER database.sql — idempotent, safe to re-run.
-- All hero content is managed through the admin dashboard.
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── hero_profile (single row — admin edits this) ─────────────────────────
CREATE TABLE IF NOT EXISTS public.hero_profile (
  id                UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  greeting          TEXT NOT NULL DEFAULT 'Hello, I''m',
  name              TEXT NOT NULL DEFAULT '',
  roles             TEXT[] DEFAULT '{}',
  tagline           TEXT DEFAULT '',
  availability_text TEXT DEFAULT '',
  resume_url        TEXT,
  github_url        TEXT,
  linkedin_url      TEXT,
  twitter_url       TEXT,
  email             TEXT,
  instagram_url     TEXT,
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure exactly one row exists (admin edits it, never inserts more)
INSERT INTO public.hero_profile (id)
VALUES ('00000000-0000-0000-0001-000000000001')
ON CONFLICT (id) DO NOTHING;

-- ─── hero_stats (admin manages these counters) ────────────────────────────
CREATE TABLE IF NOT EXISTS public.hero_stats (
  id      UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  label   TEXT NOT NULL,
  value   TEXT NOT NULL,
  icon    TEXT NOT NULL DEFAULT '🚀',
  color   TEXT NOT NULL DEFAULT 'from-blue-500 to-cyan-500',
  "order" INTEGER DEFAULT 0
);

-- ─── RLS Policies ─────────────────────────────────────────────────────────
ALTER TABLE public.hero_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_stats   ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read hero_profile" ON public.hero_profile;
DROP POLICY IF EXISTS "Public read hero_stats"   ON public.hero_stats;
DROP POLICY IF EXISTS "Admin all hero_profile"   ON public.hero_profile;
DROP POLICY IF EXISTS "Admin all hero_stats"     ON public.hero_stats;

CREATE POLICY "Public read hero_profile"
  ON public.hero_profile FOR SELECT USING (true);

CREATE POLICY "Public read hero_stats"
  ON public.hero_stats FOR SELECT USING (true);

CREATE POLICY "Admin all hero_profile"
  ON public.hero_profile FOR ALL
  USING (
    auth.role() = 'authenticated' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    auth.role() = 'authenticated' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin all hero_stats"
  ON public.hero_stats FOR ALL
  USING (
    auth.role() = 'authenticated' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    auth.role() = 'authenticated' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
