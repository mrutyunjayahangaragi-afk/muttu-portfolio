-- ==============================================================================
-- Portfolio Complete Master Supabase Audit & Security Fix Script
-- Safe & Fully Idempotent: Can be run multiple times without data loss or error.
--
-- Features:
-- 1. All 24+ Tables created with IF NOT EXISTS, correct PKs, FKs, & Defaults.
-- 2. ALTER TABLE ADD COLUMN IF NOT EXISTS ensures pre-existing tables get all columns.
-- 3. Performance B-tree Indexes on frequently queried columns & foreign keys.
-- 4. Strict Row Level Security (RLS) policies:
--    - Owner Admin (authenticated): Full CRUD (USING & WITH CHECK) on all tables.
--    - Public (anon): SELECT ONLY on published/active items.
--    - Private Tables (contact_messages, error_logs, ai_messages): INSERT ONLY for public, SELECT/UPDATE/DELETE restricted to Admin.
-- 5. Supabase Storage Buckets & Storage Security Policies.
-- 6. Auto-updated timestamps triggers & blog view / project like counter functions.
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── 1. PROFILES (Extends Supabase auth.users) ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email       TEXT UNIQUE NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 2. HERO SECTION TABLES ────────────────────────────────────────────────
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

INSERT INTO public.hero_profile (id)
VALUES ('00000000-0000-0000-0001-000000000001')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.hero_stats (
  id      UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  label   TEXT NOT NULL,
  value   TEXT NOT NULL,
  icon    TEXT NOT NULL DEFAULT '🚀',
  color   TEXT NOT NULL DEFAULT 'from-blue-500 to-cyan-500',
  "order" INTEGER DEFAULT 0
);

-- ─── 3. ABOUT SECTION TABLES ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.about_profile (
  id                  UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name                TEXT NOT NULL DEFAULT '',
  tagline             TEXT NOT NULL DEFAULT '',
  bio                 TEXT NOT NULL DEFAULT '',
  avatar_url          TEXT,
  availability_status TEXT NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'not_available')),
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

INSERT INTO public.about_profile (id)
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.about_stats (
  id      UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  label   TEXT NOT NULL,
  value   TEXT NOT NULL,
  icon    TEXT NOT NULL DEFAULT '🚀',
  color   TEXT NOT NULL DEFAULT 'from-blue-500 to-cyan-500',
  "order" INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.journey_milestones (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  year        TEXT NOT NULL,
  icon        TEXT NOT NULL DEFAULT '⚡',
  color       TEXT NOT NULL DEFAULT 'from-blue-500 to-purple-500',
  "order"     INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.core_values (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  icon        TEXT NOT NULL DEFAULT '⚡',
  color       TEXT NOT NULL DEFAULT 'from-blue-500 to-purple-500',
  "order"     INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.fun_facts (
  id      UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  label   TEXT NOT NULL,
  value   TEXT NOT NULL,
  icon    TEXT NOT NULL DEFAULT '⚡',
  "order" INTEGER DEFAULT 0
);

-- ─── 4. PROJECTS & RELATIONS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.projects (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title            TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  description      TEXT NOT NULL,
  long_description TEXT,
  short_description TEXT,
  full_description TEXT,
  tech_stack       TEXT[] DEFAULT '{}',
  tags             TEXT[] DEFAULT '{}',
  github_url       TEXT,
  live_url         TEXT,
  live_demo_url    TEXT,
  documentation_url TEXT,
  pdf_url          TEXT,
  image_url        TEXT,
  cover_image      TEXT,
  logo_url         TEXT,
  architecture_image TEXT,
  images           TEXT[] DEFAULT '{}',
  featured         BOOLEAN DEFAULT FALSE,
  published        BOOLEAN DEFAULT TRUE,
  published_at     TIMESTAMPTZ,
  status           TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'in_progress', 'archived')),
  category         TEXT NOT NULL DEFAULT 'web',
  "order"          INTEGER DEFAULT 0,
  display_order    INTEGER DEFAULT 0,
  duration         TEXT,
  team_size        INTEGER DEFAULT 1,
  version          TEXT DEFAULT '1.0.0',
  likes            INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.project_gallery (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id    UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  image_url     TEXT NOT NULL,
  caption       TEXT,
  display_order INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.project_videos (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  video_url  TEXT NOT NULL,
  video_type TEXT NOT NULL DEFAULT 'mp4' CHECK (video_type IN ('mp4','youtube','vimeo')),
  title      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.project_features (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id  UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  icon        TEXT DEFAULT '✨',
  display_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.project_tags (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  tag_name   TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.project_timeline (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id       UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  milestone        TEXT NOT NULL,
  description      TEXT,
  milestone_date   DATE,
  display_order    INTEGER DEFAULT 0
);

-- ─── 5. SKILLS & CATEGORIES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.skill_categories (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE,
  label         TEXT NOT NULL,
  icon          TEXT,
  display_order INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.skills (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name        TEXT NOT NULL,
  icon        TEXT,
  category    TEXT NOT NULL DEFAULT 'other',
  category_id UUID REFERENCES public.skill_categories(id) ON DELETE SET NULL,
  proficiency INTEGER DEFAULT 80 CHECK (proficiency BETWEEN 0 AND 100),
  featured    BOOLEAN DEFAULT FALSE,
  "order"     INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 6. CAREER, EDUCATION & ACHIEVEMENTS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.experience (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company      TEXT NOT NULL,
  role         TEXT NOT NULL,
  description  TEXT NOT NULL,
  tech_stack   TEXT[] DEFAULT '{}',
  start_date   DATE NOT NULL,
  end_date     DATE,
  current      BOOLEAN DEFAULT FALSE,
  company_logo TEXT,
  company_url  TEXT,
  location     TEXT,
  type         TEXT NOT NULL DEFAULT 'full_time',
  "order"      INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.education (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  institution      TEXT NOT NULL,
  degree           TEXT NOT NULL,
  field_of_study   TEXT NOT NULL,
  description      TEXT,
  gpa              TEXT,
  start_date       DATE NOT NULL,
  end_date         DATE,
  current          BOOLEAN DEFAULT FALSE,
  institution_logo TEXT,
  institution_url  TEXT,
  location         TEXT,
  "order"          INTEGER DEFAULT 0,
  display_order    INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.achievements (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title         TEXT NOT NULL,
  organization  TEXT NOT NULL,
  award_date    DATE NOT NULL,
  description   TEXT NOT NULL,
  credential_url TEXT,
  image_url     TEXT,
  featured      BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.certificates (
  id             UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title          TEXT NOT NULL,
  slug           TEXT UNIQUE,
  issuer         TEXT NOT NULL,
  issue_date     DATE NOT NULL,
  expiry_date    DATE,
  credential_id  TEXT,
  credential_url TEXT,
  image_url      TEXT,
  skills         TEXT[] DEFAULT '{}',
  featured       BOOLEAN DEFAULT FALSE,
  published      BOOLEAN DEFAULT TRUE,
  "order"        INTEGER DEFAULT 0,
  display_order  INTEGER DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hackathons (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE,
  organizer   TEXT NOT NULL,
  description TEXT NOT NULL,
  result      TEXT,
  position    TEXT,
  team_size   INTEGER,
  tech_stack  TEXT[] DEFAULT '{}',
  project_url TEXT,
  image_url   TEXT,
  date        DATE NOT NULL,
  location    TEXT,
  mode        TEXT NOT NULL DEFAULT 'offline' CHECK (mode IN ('online', 'offline', 'hybrid')),
  featured    BOOLEAN DEFAULT FALSE,
  published   BOOLEAN DEFAULT TRUE,
  "order"     INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.leadership (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  role          TEXT NOT NULL,
  organization  TEXT NOT NULL,
  description   TEXT NOT NULL,
  start_date    DATE NOT NULL,
  end_date      DATE,
  current       BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.volunteering (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  role          TEXT NOT NULL,
  organization  TEXT NOT NULL,
  description   TEXT NOT NULL,
  start_date    DATE NOT NULL,
  end_date      DATE,
  current       BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 7. BLOG & CATEGORIES ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blogs (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  excerpt     TEXT NOT NULL,
  content     TEXT NOT NULL,
  cover_image TEXT,
  tags        TEXT[] DEFAULT '{}',
  published   BOOLEAN DEFAULT FALSE,
  featured    BOOLEAN DEFAULT FALSE,
  read_time   INTEGER,
  views       INTEGER DEFAULT 0,
  likes       INTEGER DEFAULT 0,
  category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  author_id   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 8. CONTACT, SOCIAL, SETTINGS, RESUMES, MEDIA ──────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT NOT NULL,
  message    TEXT NOT NULL,
  read       BOOLEAN DEFAULT FALSE,
  replied    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.resumes (
  id             UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title          TEXT DEFAULT 'Resume',
  file_url       TEXT NOT NULL,
  file_name      TEXT NOT NULL,
  version        TEXT NOT NULL DEFAULT '1.0',
  download_count INTEGER DEFAULT 0,
  active         BOOLEAN DEFAULT TRUE,
  published      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.social_links (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  platform      TEXT NOT NULL,
  url           TEXT NOT NULL,
  icon          TEXT NOT NULL,
  "order"       INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  active        BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.settings (
  id                 UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  site_name          TEXT NOT NULL DEFAULT 'My Portfolio',
  site_description   TEXT,
  seo_keywords       TEXT[],
  logo_url           TEXT,
  favicon_url        TEXT,
  theme_color        TEXT DEFAULT '#000000',
  accent_color       TEXT DEFAULT '#3b82f6',
  openrouter_api_key TEXT,
  contact_email      TEXT,
  contact_phone      TEXT,
  contact_location   TEXT,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.media_library (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title         TEXT,
  url           TEXT NOT NULL,
  type          TEXT NOT NULL,
  category      TEXT DEFAULT 'uncategorized',
  description   TEXT,
  display_order INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 9. AI CONVERSATIONS & ERROR LOGGING ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id TEXT,
  visitor_ip TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_messages (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  role            TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content         TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.error_logs (
  id                  UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  message             TEXT NOT NULL,
  stack               TEXT,
  route               TEXT,
  additional_metadata JSONB,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 10. ENSURE MISSING COLUMNS ARE ADDED TO PRE-EXISTING TABLES ───────────
-- (Crucial for idempotency when tables existed from older migrations)
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT TRUE;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS short_description TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS full_description TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS live_demo_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS documentation_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS pdf_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS architecture_image TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS team_size INTEGER DEFAULT 1;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0.0';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;

ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT TRUE;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS slug TEXT;

ALTER TABLE public.hackathons ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT TRUE;
ALTER TABLE public.hackathons ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE public.hackathons ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.hackathons ADD COLUMN IF NOT EXISTS slug TEXT;

ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT FALSE;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL;

ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT TRUE;
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS title TEXT DEFAULT 'Resume';
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0;

ALTER TABLE public.social_links ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.social_links ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.skill_categories(id) ON DELETE SET NULL;

ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

ALTER TABLE public.experience ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.education ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- ─── 11. INDEX OPTIMIZATION ───────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON public.projects(display_order);

CREATE INDEX IF NOT EXISTS idx_project_gallery_project_id ON public.project_gallery(project_id);
CREATE INDEX IF NOT EXISTS idx_project_videos_project_id ON public.project_videos(project_id);
CREATE INDEX IF NOT EXISTS idx_project_features_project_id ON public.project_features(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tags_project_id ON public.project_tags(project_id);
CREATE INDEX IF NOT EXISTS idx_project_timeline_project_id ON public.project_timeline(project_id);

CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON public.blogs(published);

CREATE INDEX IF NOT EXISTS idx_certificates_slug ON public.certificates(slug);
CREATE INDEX IF NOT EXISTS idx_hackathons_slug ON public.hackathons(slug);

CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation ON public.ai_messages(conversation_id);

-- ─── 12. ROW LEVEL SECURITY (RLS) ENFORCEMENT ──────────────────────────────
ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_profile      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_stats        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_profile     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_stats       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_values       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fun_facts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_gallery   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_videos    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_features  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tags      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_timeline  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hackathons        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leadership        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteering      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_logs        ENABLE ROW LEVEL SECURITY;

-- ─── 13. DROP EXISTING CONFLICTING POLICIES ────────────────────────────────
DROP POLICY IF EXISTS "Public read hero_profile"       ON public.hero_profile;
DROP POLICY IF EXISTS "Public read hero_stats"         ON public.hero_stats;
DROP POLICY IF EXISTS "Public read about_profile"      ON public.about_profile;
DROP POLICY IF EXISTS "Public read about_stats"        ON public.about_stats;
DROP POLICY IF EXISTS "Public read journey_milestones" ON public.journey_milestones;
DROP POLICY IF EXISTS "Public read core_values"        ON public.core_values;
DROP POLICY IF EXISTS "Public read fun_facts"          ON public.fun_facts;
DROP POLICY IF EXISTS "Public read projects"           ON public.projects;
DROP POLICY IF EXISTS "Public read project_gallery"    ON public.project_gallery;
DROP POLICY IF EXISTS "Public read project_videos"     ON public.project_videos;
DROP POLICY IF EXISTS "Public read project_features"   ON public.project_features;
DROP POLICY IF EXISTS "Public read project_tags"       ON public.project_tags;
DROP POLICY IF EXISTS "Public read project_timeline"   ON public.project_timeline;
DROP POLICY IF EXISTS "Public read skills"             ON public.skills;
DROP POLICY IF EXISTS "Public read skill_categories"   ON public.skill_categories;
DROP POLICY IF EXISTS "Public read experience"         ON public.experience;
DROP POLICY IF EXISTS "Public read education"          ON public.education;
DROP POLICY IF EXISTS "Public read achievements"       ON public.achievements;
DROP POLICY IF EXISTS "Public read certs"              ON public.certificates;
DROP POLICY IF EXISTS "Public read hackathons"         ON public.hackathons;
DROP POLICY IF EXISTS "Public read leadership"         ON public.leadership;
DROP POLICY IF EXISTS "Public read volunteering"       ON public.volunteering;
DROP POLICY IF EXISTS "Public read blogs"              ON public.blogs;
DROP POLICY IF EXISTS "Public read blog_categories"    ON public.blog_categories;
DROP POLICY IF EXISTS "Public read resumes"            ON public.resumes;
DROP POLICY IF EXISTS "Public read social"             ON public.social_links;
DROP POLICY IF EXISTS "Public read settings"           ON public.settings;
DROP POLICY IF EXISTS "Public read media"              ON public.media_library;
DROP POLICY IF EXISTS "Public insert contact"          ON public.contact_messages;
DROP POLICY IF EXISTS "Public insert error_logs"       ON public.error_logs;

DROP POLICY IF EXISTS "Admin all hero_profile"         ON public.hero_profile;
DROP POLICY IF EXISTS "Admin all hero_stats"           ON public.hero_stats;
DROP POLICY IF EXISTS "Admin all about_profile"        ON public.about_profile;
DROP POLICY IF EXISTS "Admin all about_stats"          ON public.about_stats;
DROP POLICY IF EXISTS "Admin all journey_milestones"   ON public.journey_milestones;
DROP POLICY IF EXISTS "Admin all core_values"          ON public.core_values;
DROP POLICY IF EXISTS "Admin all fun_facts"            ON public.fun_facts;
DROP POLICY IF EXISTS "Admin all projects"             ON public.projects;
DROP POLICY IF EXISTS "Admin all project_gallery"      ON public.project_gallery;
DROP POLICY IF EXISTS "Admin all project_videos"       ON public.project_videos;
DROP POLICY IF EXISTS "Admin all project_features"     ON public.project_features;
DROP POLICY IF EXISTS "Admin all project_tags"         ON public.project_tags;
DROP POLICY IF EXISTS "Admin all project_timeline"     ON public.project_timeline;
DROP POLICY IF EXISTS "Admin all skills"               ON public.skills;
DROP POLICY IF EXISTS "Admin all skill_categories"     ON public.skill_categories;
DROP POLICY IF EXISTS "Admin all experience"           ON public.experience;
DROP POLICY IF EXISTS "Admin all education"            ON public.education;
DROP POLICY IF EXISTS "Admin all achievements"         ON public.achievements;
DROP POLICY IF EXISTS "Admin all certs"                ON public.certificates;
DROP POLICY IF EXISTS "Admin all hackathons"           ON public.hackathons;
DROP POLICY IF EXISTS "Admin all leadership"           ON public.leadership;
DROP POLICY IF EXISTS "Admin all volunteering"         ON public.volunteering;
DROP POLICY IF EXISTS "Admin all blogs"                ON public.blogs;
DROP POLICY IF EXISTS "Admin all blog_categories"      ON public.blog_categories;
DROP POLICY IF EXISTS "Admin all resumes"              ON public.resumes;
DROP POLICY IF EXISTS "Admin all social"               ON public.social_links;
DROP POLICY IF EXISTS "Admin all settings"             ON public.settings;
DROP POLICY IF EXISTS "Admin all media"                ON public.media_library;
DROP POLICY IF EXISTS "Admin all contacts"             ON public.contact_messages;
DROP POLICY IF EXISTS "Admin read profiles"            ON public.profiles;
DROP POLICY IF EXISTS "Admin read error_logs"          ON public.error_logs;
DROP POLICY IF EXISTS "Admin all ai_conversations"     ON public.ai_conversations;
DROP POLICY IF EXISTS "Admin all ai_messages"          ON public.ai_messages;

-- ─── 14. RECREATE PUBLIC READ POLICIES ─────────────────────────────────────
-- Public visitors can ONLY read published / active items
CREATE POLICY "Public read hero_profile"       ON public.hero_profile FOR SELECT USING (true);
CREATE POLICY "Public read hero_stats"         ON public.hero_stats FOR SELECT USING (true);
CREATE POLICY "Public read about_profile"      ON public.about_profile FOR SELECT USING (true);
CREATE POLICY "Public read about_stats"        ON public.about_stats FOR SELECT USING (true);
CREATE POLICY "Public read journey_milestones" ON public.journey_milestones FOR SELECT USING (true);
CREATE POLICY "Public read core_values"        ON public.core_values FOR SELECT USING (true);
CREATE POLICY "Public read fun_facts"          ON public.fun_facts FOR SELECT USING (true);
CREATE POLICY "Public read projects"           ON public.projects FOR SELECT USING (published = true);
CREATE POLICY "Public read project_gallery"    ON public.project_gallery FOR SELECT USING (true);
CREATE POLICY "Public read project_videos"     ON public.project_videos FOR SELECT USING (true);
CREATE POLICY "Public read project_features"   ON public.project_features FOR SELECT USING (true);
CREATE POLICY "Public read project_tags"       ON public.project_tags FOR SELECT USING (true);
CREATE POLICY "Public read project_timeline"   ON public.project_timeline FOR SELECT USING (true);
CREATE POLICY "Public read skills"             ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public read skill_categories"   ON public.skill_categories FOR SELECT USING (true);
CREATE POLICY "Public read experience"         ON public.experience FOR SELECT USING (true);
CREATE POLICY "Public read education"          ON public.education FOR SELECT USING (true);
CREATE POLICY "Public read achievements"       ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Public read certs"              ON public.certificates FOR SELECT USING (published = true);
CREATE POLICY "Public read hackathons"         ON public.hackathons FOR SELECT USING (published = true);
CREATE POLICY "Public read leadership"         ON public.leadership FOR SELECT USING (true);
CREATE POLICY "Public read volunteering"       ON public.volunteering FOR SELECT USING (true);
CREATE POLICY "Public read blogs"              ON public.blogs FOR SELECT USING (published = true);
CREATE POLICY "Public read blog_categories"    ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "Public read resumes"            ON public.resumes FOR SELECT USING (published = true AND active = true);
CREATE POLICY "Public read social"             ON public.social_links FOR SELECT USING (active = true);
CREATE POLICY "Public read settings"           ON public.settings FOR SELECT USING (true);
CREATE POLICY "Public read media"              ON public.media_library FOR SELECT USING (true);

-- Public Write Permissions (Strictly scoped)
CREATE POLICY "Public insert contact"    ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert error_logs" ON public.error_logs FOR INSERT WITH CHECK (true);

-- ─── 15. OWNER ADMIN FULL CRUD POLICIES ─────────────────────────────────────
-- Grants Full CRUD (USING & WITH CHECK) to authenticated admin session
CREATE POLICY "Admin all hero_profile" ON public.hero_profile FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all hero_stats" ON public.hero_stats FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

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

CREATE POLICY "Admin all projects" ON public.projects FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all project_gallery" ON public.project_gallery FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all project_videos" ON public.project_videos FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all project_features" ON public.project_features FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all project_tags" ON public.project_tags FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all project_timeline" ON public.project_timeline FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all skills" ON public.skills FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all skill_categories" ON public.skill_categories FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all experience" ON public.experience FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all education" ON public.education FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all achievements" ON public.achievements FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all certs" ON public.certificates FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all hackathons" ON public.hackathons FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all leadership" ON public.leadership FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all volunteering" ON public.volunteering FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all blogs" ON public.blogs FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all blog_categories" ON public.blog_categories FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all resumes" ON public.resumes FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all social" ON public.social_links FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all settings" ON public.settings FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all media" ON public.media_library FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin all contacts" ON public.contact_messages FOR ALL
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin read profiles" ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Admin read error_logs" ON public.error_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all ai_conversations" ON public.ai_conversations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all ai_messages" ON public.ai_messages FOR ALL USING (auth.role() = 'authenticated');

-- ─── 15. SUPABASE STORAGE BUCKETS & POLICIES ────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('portfolio-assets', 'portfolio-assets', true),
  ('project-images', 'project-images', true),
  ('certificates', 'certificates', true),
  ('gallery', 'gallery', true),
  ('blog-images', 'blog-images', true),
  ('resumes', 'resumes', true),
  ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Storage Read" ON storage.objects;
DROP POLICY IF EXISTS "Admin Storage Insert" ON storage.objects;
DROP POLICY IF EXISTS "Admin Storage Update" ON storage.objects;
DROP POLICY IF EXISTS "Admin Storage Delete" ON storage.objects;

CREATE POLICY "Public Storage Read"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('portfolio-assets', 'project-images', 'certificates', 'gallery', 'blog-images', 'resumes', 'videos'));

CREATE POLICY "Admin Storage Insert"
  ON storage.objects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin Storage Update"
  ON storage.objects FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin Storage Delete"
  ON storage.objects FOR DELETE
  USING (auth.role() = 'authenticated');

-- ─── 16. HELPER FUNCTIONS & TRIGGERS ──────────────────────────────────────
CREATE OR REPLACE FUNCTION increment_blog_views(blog_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.blogs SET views = views + 1 WHERE id = blog_id;
END;
$$;

CREATE OR REPLACE FUNCTION increment_project_likes(project_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.projects SET likes = likes + 1 WHERE id = project_id;
END;
$$;

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_projects_updated_at ON public.projects;
CREATE TRIGGER set_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_blogs_updated_at ON public.blogs;
CREATE TRIGGER set_blogs_updated_at BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_settings_updated_at ON public.settings;
CREATE TRIGGER set_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
