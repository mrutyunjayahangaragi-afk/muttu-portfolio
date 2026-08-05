-- ============================================================
-- Contact Messages & Lead Management — Database Schema & Migration
-- Run in Supabase SQL Editor. Safe to run on existing tables.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name       TEXT,
  name            TEXT,
  email           TEXT NOT NULL,
  phone           TEXT,
  company         TEXT,
  country         TEXT,
  subject         TEXT NOT NULL,
  project_type    TEXT,
  budget          TEXT,
  timeline        TEXT,
  message         TEXT NOT NULL,
  attachment_url  TEXT,
  status          TEXT DEFAULT 'new', -- 'new', 'read', 'replied', 'archived'
  is_read         BOOLEAN DEFAULT FALSE,
  read            BOOLEAN DEFAULT FALSE,
  replied         BOOLEAN DEFAULT FALSE,
  archived        BOOLEAN DEFAULT FALSE,
  ip_address      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Safely add any missing columns if the table already existed previously
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS project_type TEXT;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS budget TEXT;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS timeline TEXT;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS attachment_url TEXT;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS read BOOLEAN DEFAULT FALSE;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS replied BOOLEAN DEFAULT FALSE;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS ip_address TEXT;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages (status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON public.contact_messages (is_read);

-- Row Level Security (RLS)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin select contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin update contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin delete contact_messages" ON public.contact_messages;

-- 1. Public visitors can ONLY insert new messages
CREATE POLICY "Public insert contact_messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

-- 2. Authenticated Admin users have full read access
CREATE POLICY "Admin select contact_messages"
  ON public.contact_messages FOR SELECT
  USING (
    auth.role() = 'authenticated' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 3. Authenticated Admin users have update access
CREATE POLICY "Admin update contact_messages"
  ON public.contact_messages FOR UPDATE
  USING (
    auth.role() = 'authenticated' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 4. Authenticated Admin users have delete access
CREATE POLICY "Admin delete contact_messages"
  ON public.contact_messages FOR DELETE
  USING (
    auth.role() = 'authenticated' OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── Supabase Storage Bucket for Attachments ─────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('contact_attachments', 'contact_attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket Storage RLS Policies
DROP POLICY IF EXISTS "Public insert contact_attachments" ON storage.objects;
DROP POLICY IF EXISTS "Public select contact_attachments" ON storage.objects;

CREATE POLICY "Public insert contact_attachments"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'contact_attachments');

CREATE POLICY "Public select contact_attachments"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'contact_attachments');
