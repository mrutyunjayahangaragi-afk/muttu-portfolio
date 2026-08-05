-- ==============================================================================
-- System Management Tables (Notifications, Activity Logs, Backups, Theme Config)
-- Idempotent & Safe to execute.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
  category    TEXT NOT NULL DEFAULT 'system' CHECK (category IN ('system', 'content', 'security', 'messages', 'backups')),
  priority    TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  read        BOOLEAN DEFAULT FALSE,
  link        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  action      TEXT NOT NULL,
  module      TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'warning', 'error')),
  details     TEXT,
  ip_address  TEXT,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.backups (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name        TEXT NOT NULL,
  file_url    TEXT,
  size_bytes  BIGINT DEFAULT 0,
  type        TEXT NOT NULL DEFAULT 'full' CHECK (type IN ('database', 'media', 'full')),
  status      TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'restoring', 'failed')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.theme_config (
  id                UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  site_name         TEXT NOT NULL DEFAULT 'Dev Portfolio',
  logo_text         TEXT NOT NULL DEFAULT '<Dev/>',
  logo_url          TEXT,
  favicon_url       TEXT,
  footer_logo_url   TEXT,
  primary_color     TEXT NOT NULL DEFAULT '#3b82f6',
  secondary_color   TEXT NOT NULL DEFAULT '#a855f7',
  accent_color      TEXT NOT NULL DEFAULT '#10b981',
  background_color  TEXT NOT NULL DEFAULT '#020408',
  card_bg_color     TEXT NOT NULL DEFAULT 'rgba(255, 255, 255, 0.05)',
  border_color      TEXT NOT NULL DEFAULT 'rgba(255, 255, 255, 0.1)',
  font_heading      TEXT NOT NULL DEFAULT 'Inter',
  font_body         TEXT NOT NULL DEFAULT 'Inter',
  border_radius     TEXT NOT NULL DEFAULT '1rem',
  mode              TEXT NOT NULL DEFAULT 'dark' CHECK (mode IN ('light', 'dark', 'system', 'custom')),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Schema migration check for logo_text column
ALTER TABLE public.theme_config ADD COLUMN IF NOT EXISTS logo_text TEXT DEFAULT '<Dev/>';

-- Ensure a single default row in theme_config
INSERT INTO public.theme_config (id)
VALUES ('00000000-0000-0000-0000-000000000099')
ON CONFLICT (id) DO NOTHING;

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON public.activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_backups_created ON public.backups(created_at);

-- RLS Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backups       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_config   ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admin activity_logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Admin backups"       ON public.backups;
DROP POLICY IF EXISTS "Admin theme_config"  ON public.theme_config;
DROP POLICY IF EXISTS "Public read theme"   ON public.theme_config;

CREATE POLICY "Admin notifications" ON public.notifications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin activity_logs" ON public.activity_logs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin backups"       ON public.backups FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin theme_config"  ON public.theme_config FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public read theme"   ON public.theme_config FOR SELECT USING (true);
