-- ==============================================================================
-- Prompt 7: Global Settings, Media, AI, Social Links, Resumes, Blogs, Contacts
-- ==============================================================================

-- ─── SETTINGS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name text NOT NULL DEFAULT 'My Portfolio',
  site_description text,
  seo_keywords text[],
  logo_url text,
  favicon_url text,
  theme_color text DEFAULT '#000000',
  accent_color text DEFAULT '#3b82f6',
  openrouter_api_key text,
  contact_email text,
  contact_phone text,
  contact_location text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ─── SOCIAL LINKS ─────────────────────────────────────────────────────────────
-- The table might already exist from a previous schema (database.sql)
ALTER TABLE public.social_links ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;
ALTER TABLE public.social_links ADD COLUMN IF NOT EXISTS active boolean DEFAULT true;
ALTER TABLE public.social_links ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- ─── RESUMES ──────────────────────────────────────────────────────────────────
-- The table might already exist from a previous schema
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS title text DEFAULT 'Resume';
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS download_count integer DEFAULT 0;
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS published boolean DEFAULT false;
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- ─── MEDIA LIBRARY (GALLERY) ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.media_library (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text,
  url text NOT NULL,
  type text NOT NULL,
  category text DEFAULT 'uncategorized',
  description text,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ─── AI CONVERSATIONS & MESSAGES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text,
  visitor_ip text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- ─── CONTACT MESSAGES ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  replied boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- ─── BLOGS ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blogs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  cover_image text,
  tags text[],
  published boolean DEFAULT false,
  featured boolean DEFAULT false,
  read_time integer,
  views integer DEFAULT 0,
  likes integer DEFAULT 0,
  author_id uuid REFERENCES public.profiles(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ─── RLS POLICIES ─────────────────────────────────────────────────────────────

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Public READ Access
DROP POLICY IF EXISTS "Public read settings" ON public.settings;
CREATE POLICY "Public read settings" ON public.settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read social_links" ON public.social_links;
CREATE POLICY "Public read social_links" ON public.social_links FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Public read resumes" ON public.resumes;
CREATE POLICY "Public read resumes" ON public.resumes FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Public read media_library" ON public.media_library;
CREATE POLICY "Public read media_library" ON public.media_library FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert ai_conversations" ON public.ai_conversations;
CREATE POLICY "Public insert ai_conversations" ON public.ai_conversations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read ai_conversations" ON public.ai_conversations;
CREATE POLICY "Public read ai_conversations" ON public.ai_conversations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert ai_messages" ON public.ai_messages;
CREATE POLICY "Public insert ai_messages" ON public.ai_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read ai_messages" ON public.ai_messages;
CREATE POLICY "Public read ai_messages" ON public.ai_messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert contact_messages" ON public.contact_messages;
CREATE POLICY "Public insert contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read blogs" ON public.blogs;
CREATE POLICY "Public read blogs" ON public.blogs FOR SELECT USING (published = true);

-- Admin ALL Access
DROP POLICY IF EXISTS "Admin all settings" ON public.settings;
CREATE POLICY "Admin all settings" ON public.settings FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admin all social_links" ON public.social_links;
CREATE POLICY "Admin all social_links" ON public.social_links FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admin all resumes" ON public.resumes;
CREATE POLICY "Admin all resumes" ON public.resumes FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admin all media_library" ON public.media_library;
CREATE POLICY "Admin all media_library" ON public.media_library FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admin all ai_conversations" ON public.ai_conversations;
CREATE POLICY "Admin all ai_conversations" ON public.ai_conversations FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admin all ai_messages" ON public.ai_messages;
CREATE POLICY "Admin all ai_messages" ON public.ai_messages FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admin all contact_messages" ON public.contact_messages;
CREATE POLICY "Admin all contact_messages" ON public.contact_messages FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admin all blogs" ON public.blogs;
CREATE POLICY "Admin all blogs" ON public.blogs FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ─── UPDATE TRIGGERS ──────────────────────────────────────────────────────────

DROP TRIGGER IF EXISTS set_settings_updated_at ON public.settings;
CREATE TRIGGER set_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_social_links_updated_at ON public.social_links;
CREATE TRIGGER set_social_links_updated_at BEFORE UPDATE ON public.social_links FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_resumes_updated_at ON public.resumes;
CREATE TRIGGER set_resumes_updated_at BEFORE UPDATE ON public.resumes FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_media_library_updated_at ON public.media_library;
CREATE TRIGGER set_media_library_updated_at BEFORE UPDATE ON public.media_library FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_ai_conversations_updated_at ON public.ai_conversations;
CREATE TRIGGER set_ai_conversations_updated_at BEFORE UPDATE ON public.ai_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_blogs_updated_at ON public.blogs;
CREATE TRIGGER set_blogs_updated_at BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Insert default settings row if none exists
INSERT INTO public.settings (site_name, site_description) 
SELECT 'My Portfolio', 'A premium personal portfolio' 
WHERE NOT EXISTS (SELECT 1 FROM public.settings);
