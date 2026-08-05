-- ==============================================================================
-- Analytics Events & Visitor Tracking Table
-- Safe & Idempotent: safe to run multiple times.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_type  TEXT NOT NULL DEFAULT 'page_view', -- page_view, resume_download, project_click, ai_question, contact_sent
  path        TEXT NOT NULL DEFAULT '/',
  referrer    TEXT,
  user_agent  TEXT,
  ip_hash     TEXT,
  session_id  TEXT,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast time-series & event aggregation
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_path ON public.analytics_events(path);

-- RLS Policies
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert analytics" ON public.analytics_events;
DROP POLICY IF EXISTS "Admin read analytics"   ON public.analytics_events;

CREATE POLICY "Public insert analytics" ON public.analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read analytics"   ON public.analytics_events FOR SELECT USING (auth.role() = 'authenticated');
