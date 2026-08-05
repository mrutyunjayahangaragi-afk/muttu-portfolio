-- ============================================================
-- About Section Tables
-- Run after database.sql — idempotent, safe to re-run.
--
-- NO seed data. All content is created through the admin dashboard.
-- ============================================================

-- ─── About Profile (single row — admin edits this) ────────────────────────
CREATE TABLE IF NOT EXISTS public.about_profile (
  id                  UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name                TEXT NOT NULL DEFAULT '',
  tagline             TEXT NOT NULL DEFAULT '',
  bio                 TEXT NOT NULL DEFAULT '',
  avatar_url          TEXT,
  availability_status TEXT NOT NULL DEFAULT 'available'
                        CHECK (availability_status IN ('available', 'busy', 'not_available')),
  availability_text   TEXT NOT NULL DEFAULT '',
  location            TEXT NOT NULL DEFAULT '',
  degree              TEXT NOT NULL DEFAULT '',
  university          TEXT NOT NULL DEFAULT '',
  languages           TEXT[] DEFAULT '{}',
  interests           TEXT[] DEFAULT '{}',
  career_goal         TEXT NOT NULL DEFAULT '',
  resume_url          TEXT,
  github_url          TEXT,
  linkedin_url        TEXT,
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure exactly one profile row exists for the admin to edit
INSERT INTO public.about_profile (id)
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- ─── About Stats ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.about_stats (
  id      UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  label   TEXT NOT NULL,
  value   TEXT NOT NULL,
  icon    TEXT NOT NULL DEFAULT '🚀',
  color   TEXT NOT NULL DEFAULT 'from-blue-500 to-cyan-500',
  "order" INTEGER DEFAULT 0
);

-- ─── Journey Milestones ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.journey_milestones (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  year        TEXT NOT NULL,
  icon        TEXT NOT NULL DEFAULT '⚡',
  color       TEXT NOT NULL DEFAULT 'from-blue-500 to-purple-500',
  "order"     INTEGER DEFAULT 0
);

-- ─── Core Values ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.core_values (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  icon        TEXT NOT NULL DEFAULT '⚡',
  color       TEXT NOT NULL DEFAULT 'from-blue-500 to-purple-500',
  "order"     INTEGER DEFAULT 0
);

-- ─── Fun Facts ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.fun_facts (
  id      UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  label   TEXT NOT NULL,
  value   TEXT NOT NULL,
  icon    TEXT NOT NULL DEFAULT '⚡',
  "order" INTEGER DEFAULT 0
);

-- ─── RLS Policies ─────────────────────────────────────────────────────────
ALTER TABLE public.about_profile      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_stats        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_values        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fun_facts          ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read about_profile"      ON public.about_profile;
DROP POLICY IF EXISTS "Public read about_stats"        ON public.about_stats;
DROP POLICY IF EXISTS "Public read journey_milestones" ON public.journey_milestones;
DROP POLICY IF EXISTS "Public read core_values"        ON public.core_values;
DROP POLICY IF EXISTS "Public read fun_facts"          ON public.fun_facts;
DROP POLICY IF EXISTS "Admin all about_profile"        ON public.about_profile;
DROP POLICY IF EXISTS "Admin all about_stats"          ON public.about_stats;
DROP POLICY IF EXISTS "Admin all journey_milestones"   ON public.journey_milestones;
DROP POLICY IF EXISTS "Admin all core_values"          ON public.core_values;
DROP POLICY IF EXISTS "Admin all fun_facts"            ON public.fun_facts;

CREATE POLICY "Public read about_profile"      ON public.about_profile FOR SELECT USING (true);
CREATE POLICY "Public read about_stats"        ON public.about_stats FOR SELECT USING (true);
CREATE POLICY "Public read journey_milestones" ON public.journey_milestones FOR SELECT USING (true);
CREATE POLICY "Public read core_values"        ON public.core_values FOR SELECT USING (true);
CREATE POLICY "Public read fun_facts"          ON public.fun_facts FOR SELECT USING (true);

CREATE POLICY "Admin all about_profile" ON public.about_profile FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all about_stats" ON public.about_stats FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all journey_milestones" ON public.journey_milestones FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all core_values" ON public.core_values FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all fun_facts" ON public.fun_facts FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
