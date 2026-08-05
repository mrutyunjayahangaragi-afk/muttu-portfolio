-- ============================================================
-- Career Journey Module — Extended Schema
-- Run AFTER the main database.sql
-- Idempotent: safe to run multiple times.
-- ============================================================

-- ─── Extend experience table ──────────────────────────────────────────────────
ALTER TABLE public.experience
  ADD COLUMN IF NOT EXISTS employment_type TEXT DEFAULT 'full_time',
  ADD COLUMN IF NOT EXISTS responsibilities TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS achievements     TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS skills_learned   TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS team_size        INTEGER,
  ADD COLUMN IF NOT EXISTS display_order    INTEGER DEFAULT 0;

-- ─── Extend education table ───────────────────────────────────────────────────
ALTER TABLE public.education
  ADD COLUMN IF NOT EXISTS branch         TEXT,
  ADD COLUMN IF NOT EXISTS university     TEXT,
  ADD COLUMN IF NOT EXISTS cgpa           TEXT,
  ADD COLUMN IF NOT EXISTS percentage     TEXT,
  ADD COLUMN IF NOT EXISTS subjects       TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS activities     TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS display_order  INTEGER DEFAULT 0;

-- ─── Extend certificates table ────────────────────────────────────────────────
ALTER TABLE public.certificates
  ADD COLUMN IF NOT EXISTS slug          TEXT,
  ADD COLUMN IF NOT EXISTS category      TEXT DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS pdf_url       TEXT,
  ADD COLUMN IF NOT EXISTS featured      BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Add unique constraint on slug if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'certificates_slug_key'
  ) THEN
    ALTER TABLE public.certificates ADD CONSTRAINT certificates_slug_key UNIQUE (slug);
  END IF;
END$$;

-- Populate slugs for existing certificates
UPDATE public.certificates
  SET slug = LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(TRIM(title), '[^a-zA-Z0-9\s]', '', 'g'),
      '\s+', '-', 'g'
    )
  ) || '-' || SUBSTRING(id::TEXT, 1, 8)
  WHERE slug IS NULL OR slug = '';

-- ─── Extend hackathons table ──────────────────────────────────────────────────
ALTER TABLE public.hackathons
  ADD COLUMN IF NOT EXISTS slug                TEXT,
  ADD COLUMN IF NOT EXISTS event_name          TEXT,
  ADD COLUMN IF NOT EXISTS theme               TEXT,
  ADD COLUMN IF NOT EXISTS team_name           TEXT,
  ADD COLUMN IF NOT EXISTS my_role             TEXT,
  ADD COLUMN IF NOT EXISTS problem_statement   TEXT,
  ADD COLUMN IF NOT EXISTS solution            TEXT,
  ADD COLUMN IF NOT EXISTS ai_models           TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS duration            TEXT,
  ADD COLUMN IF NOT EXISTS mentor_names        TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS prize               TEXT,
  ADD COLUMN IF NOT EXISTS ranking             TEXT,
  ADD COLUMN IF NOT EXISTS certificate_url     TEXT,
  ADD COLUMN IF NOT EXISTS github_url          TEXT,
  ADD COLUMN IF NOT EXISTS demo_url            TEXT,
  ADD COLUMN IF NOT EXISTS gallery             TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS lessons_learned     TEXT,
  ADD COLUMN IF NOT EXISTS future_improvements TEXT,
  ADD COLUMN IF NOT EXISTS featured            BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS display_order       INTEGER DEFAULT 0;

-- Add unique constraint on hackathon slug if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'hackathons_slug_key'
  ) THEN
    ALTER TABLE public.hackathons ADD CONSTRAINT hackathons_slug_key UNIQUE (slug);
  END IF;
END$$;

-- Populate slugs for existing hackathons
UPDATE public.hackathons
  SET slug = LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(TRIM(name), '[^a-zA-Z0-9\s]', '', 'g'),
      '\s+', '-', 'g'
    )
  ) || '-' || SUBSTRING(id::TEXT, 1, 8)
  WHERE slug IS NULL OR slug = '';

-- ─── Achievements ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.achievements (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  category      TEXT NOT NULL DEFAULT 'award',
  organization  TEXT,
  image_url     TEXT,
  award_date    DATE,
  featured      BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Leadership ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.leadership (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title         TEXT NOT NULL,
  organization  TEXT NOT NULL,
  start_date    DATE,
  end_date      DATE,
  current       BOOLEAN DEFAULT FALSE,
  description   TEXT,
  achievements  TEXT[] DEFAULT '{}',
  logo_url      TEXT,
  display_order INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Volunteering ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.volunteering (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title         TEXT NOT NULL,
  organization  TEXT NOT NULL,
  start_date    DATE,
  end_date      DATE,
  current       BOOLEAN DEFAULT FALSE,
  description   TEXT,
  impact        TEXT,
  logo_url      TEXT,
  display_order INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE public.achievements  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leadership    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteering  ENABLE ROW LEVEL SECURITY;

-- ─── Drop + Recreate policies ─────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public read achievements"  ON public.achievements;
DROP POLICY IF EXISTS "Public read leadership"    ON public.leadership;
DROP POLICY IF EXISTS "Public read volunteering"  ON public.volunteering;
DROP POLICY IF EXISTS "Admin all achievements"    ON public.achievements;
DROP POLICY IF EXISTS "Admin all leadership"      ON public.leadership;
DROP POLICY IF EXISTS "Admin all volunteering"    ON public.volunteering;

CREATE POLICY "Public read achievements"
  ON public.achievements FOR SELECT USING (true);

CREATE POLICY "Public read leadership"
  ON public.leadership FOR SELECT USING (true);

CREATE POLICY "Public read volunteering"
  ON public.volunteering FOR SELECT USING (true);

CREATE POLICY "Admin all achievements"
  ON public.achievements FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all leadership"
  ON public.leadership FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all volunteering"
  ON public.volunteering FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ─── Auto-update updated_at for achievements ──────────────────────────────────
DROP TRIGGER IF EXISTS set_achievements_updated_at ON public.achievements;
CREATE TRIGGER set_achievements_updated_at
  BEFORE UPDATE ON public.achievements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
