-- ==============================================================================
-- Hackathon Participation Gallery Table
-- Safe & Idempotent
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.hackathon_gallery (
  id                UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  hackathon_id      UUID REFERENCES public.hackathons(id) ON DELETE CASCADE NOT NULL,
  image_url         TEXT NOT NULL,
  image_title       TEXT,
  image_description TEXT,
  category          TEXT DEFAULT 'Event', -- 'Opening Ceremony', 'Coding Session', 'Presentation', 'Judging', 'Prize Distribution', 'Team Photos', 'Networking'
  image_order       INTEGER DEFAULT 0,
  display_order     INTEGER DEFAULT 0,
  is_featured       BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Index
CREATE INDEX IF NOT EXISTS idx_hackathon_gallery_hackathon ON public.hackathon_gallery(hackathon_id);
CREATE INDEX IF NOT EXISTS idx_hackathon_gallery_order ON public.hackathon_gallery(image_order);

-- Row Level Security
ALTER TABLE public.hackathon_gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read hackathon_gallery" ON public.hackathon_gallery;
DROP POLICY IF EXISTS "Admin all hackathon_gallery"   ON public.hackathon_gallery;

CREATE POLICY "Public read hackathon_gallery" ON public.hackathon_gallery FOR SELECT USING (true);
CREATE POLICY "Admin all hackathon_gallery"   ON public.hackathon_gallery FOR ALL USING (auth.role() = 'authenticated');
