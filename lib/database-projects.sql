-- ============================================================
-- Projects Extended Schema
-- Run AFTER database.sql — idempotent, safe to re-run.
-- ============================================================

-- ─── Extend projects table ────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='short_description') THEN
    ALTER TABLE public.projects ADD COLUMN short_description TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='full_description') THEN
    ALTER TABLE public.projects ADD COLUMN full_description TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='tags') THEN
    ALTER TABLE public.projects ADD COLUMN tags TEXT[] DEFAULT '{}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='live_demo_url') THEN
    ALTER TABLE public.projects ADD COLUMN live_demo_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='documentation_url') THEN
    ALTER TABLE public.projects ADD COLUMN documentation_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='pdf_url') THEN
    ALTER TABLE public.projects ADD COLUMN pdf_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='cover_image') THEN
    ALTER TABLE public.projects ADD COLUMN cover_image TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='logo_url') THEN
    ALTER TABLE public.projects ADD COLUMN logo_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='architecture_image') THEN
    ALTER TABLE public.projects ADD COLUMN architecture_image TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='published') THEN
    ALTER TABLE public.projects ADD COLUMN published BOOLEAN DEFAULT TRUE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='published_at') THEN
    ALTER TABLE public.projects ADD COLUMN published_at TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='display_order') THEN
    ALTER TABLE public.projects ADD COLUMN display_order INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='duration') THEN
    ALTER TABLE public.projects ADD COLUMN duration TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='team_size') THEN
    ALTER TABLE public.projects ADD COLUMN team_size INTEGER DEFAULT 1;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='version') THEN
    ALTER TABLE public.projects ADD COLUMN version TEXT DEFAULT '1.0.0';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='likes') THEN
    ALTER TABLE public.projects ADD COLUMN likes INTEGER DEFAULT 0;
  END IF;
END
$$;

-- ─── project_gallery ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.project_gallery (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id    UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  image_url     TEXT NOT NULL,
  caption       TEXT,
  display_order INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── project_videos ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.project_videos (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  video_url  TEXT NOT NULL,
  video_type TEXT NOT NULL DEFAULT 'mp4' CHECK (video_type IN ('mp4','youtube','vimeo')),
  title      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── project_features ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.project_features (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id  UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  icon        TEXT DEFAULT '✨',
  display_order INTEGER DEFAULT 0
);

-- ─── project_tags ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.project_tags (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  tag_name   TEXT NOT NULL
);

-- ─── project_timeline ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.project_timeline (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id       UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  milestone        TEXT NOT NULL,
  description      TEXT,
  milestone_date   DATE,
  display_order    INTEGER DEFAULT 0
);

-- ─── RLS ──────────────────────────────────────────────────────────────────
ALTER TABLE public.project_gallery  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_videos   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tags     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_timeline ENABLE ROW LEVEL SECURITY;

-- Drop then recreate (idempotent)
DROP POLICY IF EXISTS "Public read project_gallery"  ON public.project_gallery;
DROP POLICY IF EXISTS "Public read project_videos"   ON public.project_videos;
DROP POLICY IF EXISTS "Public read project_features" ON public.project_features;
DROP POLICY IF EXISTS "Public read project_tags"     ON public.project_tags;
DROP POLICY IF EXISTS "Public read project_timeline" ON public.project_timeline;
DROP POLICY IF EXISTS "Admin all project_gallery"    ON public.project_gallery;
DROP POLICY IF EXISTS "Admin all project_videos"     ON public.project_videos;
DROP POLICY IF EXISTS "Admin all project_features"   ON public.project_features;
DROP POLICY IF EXISTS "Admin all project_tags"       ON public.project_tags;
DROP POLICY IF EXISTS "Admin all project_timeline"   ON public.project_timeline;

CREATE POLICY "Public read project_gallery"  ON public.project_gallery  FOR SELECT USING (true);
CREATE POLICY "Public read project_videos"   ON public.project_videos   FOR SELECT USING (true);
CREATE POLICY "Public read project_features" ON public.project_features FOR SELECT USING (true);
CREATE POLICY "Public read project_tags"     ON public.project_tags     FOR SELECT USING (true);
CREATE POLICY "Public read project_timeline" ON public.project_timeline FOR SELECT USING (true);

CREATE POLICY "Admin all project_gallery" ON public.project_gallery FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role='admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role='admin'));

CREATE POLICY "Admin all project_videos" ON public.project_videos FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role='admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role='admin'));

CREATE POLICY "Admin all project_features" ON public.project_features FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role='admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role='admin'));

CREATE POLICY "Admin all project_tags" ON public.project_tags FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role='admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role='admin'));

CREATE POLICY "Admin all project_timeline" ON public.project_timeline FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role='admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role='admin'));

-- Like increment function
CREATE OR REPLACE FUNCTION increment_project_likes(project_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.projects SET likes = likes + 1 WHERE id = project_id;
END;
$$;
