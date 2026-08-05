-- ============================================================
-- Hero 3D Scene Config — Database Schema
-- Run AFTER database.sql — idempotent, safe to re-run.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.hero_3d_config (
  id                          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  show_laptop                 BOOLEAN DEFAULT TRUE,
  show_ai_globe               BOOLEAN DEFAULT TRUE,
  show_project_cards          BOOLEAN DEFAULT TRUE,
  show_certificate_card       BOOLEAN DEFAULT TRUE,
  show_hackathon_badge        BOOLEAN DEFAULT TRUE,
  show_trophy                 BOOLEAN DEFAULT TRUE,
  show_github_cube            BOOLEAN DEFAULT TRUE,
  show_tech_icons             BOOLEAN DEFAULT TRUE,
  show_particles              BOOLEAN DEFAULT TRUE,
  custom_glb_url              TEXT,
  hdr_environment_url         TEXT,
  environment_preset          TEXT DEFAULT 'night',
  background_color            TEXT DEFAULT '#020408',
  ambient_light_intensity     NUMERIC DEFAULT 0.4,
  directional_light_color     TEXT DEFAULT '#ffffff',
  directional_light_intensity NUMERIC DEFAULT 1.5,
  point_light_color           TEXT DEFAULT '#a855f7',
  point_light_intensity       NUMERIC DEFAULT 1.0,
  spot_light_color            TEXT DEFAULT '#60a5fa',
  camera_position_x           NUMERIC DEFAULT 0,
  camera_position_y           NUMERIC DEFAULT 0,
  camera_position_z           NUMERIC DEFAULT 9,
  floating_speed              NUMERIC DEFAULT 1.0,
  mouse_sensitivity           NUMERIC DEFAULT 1.0,
  orbit_auto_rotate           BOOLEAN DEFAULT TRUE,
  orbit_rotation_speed        NUMERIC DEFAULT 0.5,
  particle_count              INTEGER DEFAULT 300,
  updated_at                  TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure a single default row exists
INSERT INTO public.hero_3d_config (id)
VALUES ('00000000-0000-0000-0002-000000000001')
ON CONFLICT (id) DO NOTHING;

-- RLS Security
ALTER TABLE public.hero_3d_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read hero_3d_config" ON public.hero_3d_config;
DROP POLICY IF EXISTS "Admin all hero_3d_config"   ON public.hero_3d_config;

CREATE POLICY "Public read hero_3d_config"
  ON public.hero_3d_config FOR SELECT USING (true);

CREATE POLICY "Admin all hero_3d_config"
  ON public.hero_3d_config FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
