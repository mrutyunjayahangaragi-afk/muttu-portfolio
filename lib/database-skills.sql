-- ============================================================
-- Skills Extended Schema
-- Run AFTER database.sql — idempotent, safe to re-run.
--
-- NO seed data. All skills are added through the admin dashboard.
-- ============================================================

-- ─── skill_categories ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.skill_categories (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  icon        TEXT NOT NULL DEFAULT '💡',
  color       TEXT NOT NULL DEFAULT 'from-blue-500 to-cyan-500',
  description TEXT,
  "order"     INTEGER DEFAULT 0
);

-- Seed category definitions (these are structural labels, not content)
INSERT INTO public.skill_categories (name, slug, icon, color, "order") VALUES
  ('Frontend',  'frontend',  '🎨', 'from-blue-500 to-cyan-500',      1),
  ('Backend',   'backend',   '⚙',  'from-green-500 to-emerald-500',  2),
  ('AI / ML',   'ai_ml',     '🤖', 'from-purple-500 to-pink-500',    3),
  ('Database',  'database',  '🗄', 'from-orange-500 to-amber-500',   4),
  ('DevOps',    'devops',    '🚀', 'from-red-500 to-orange-500',     5),
  ('Cloud',     'cloud',     '☁',  'from-sky-500 to-blue-500',       6),
  ('Tools',     'tools',     '🔧', 'from-teal-500 to-cyan-500',      7),
  ('Languages', 'languages', '💻', 'from-pink-500 to-rose-500',      8)
ON CONFLICT (slug) DO NOTHING;

-- ─── Extend existing skills table with new columns ──────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='skills' AND column_name='slug') THEN
    ALTER TABLE public.skills ADD COLUMN slug TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='skills' AND column_name='icon_url') THEN
    ALTER TABLE public.skills ADD COLUMN icon_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='skills' AND column_name='description') THEN
    ALTER TABLE public.skills ADD COLUMN description TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='skills' AND column_name='skill_level') THEN
    ALTER TABLE public.skills ADD COLUMN skill_level TEXT DEFAULT 'intermediate'
      CHECK (skill_level IN ('beginner','intermediate','advanced','expert'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='skills' AND column_name='years_of_experience') THEN
    ALTER TABLE public.skills ADD COLUMN years_of_experience NUMERIC(3,1) DEFAULT 1;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='skills' AND column_name='featured') THEN
    ALTER TABLE public.skills ADD COLUMN featured BOOLEAN DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='skills' AND column_name='learning_status') THEN
    ALTER TABLE public.skills ADD COLUMN learning_status TEXT DEFAULT 'learned'
      CHECK (learning_status IN ('learning','learned','mastered'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='skills' AND column_name='updated_at') THEN
    ALTER TABLE public.skills ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END
$$;

-- ─── RLS for skill_categories ─────────────────────────────────────────────
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read skill_categories" ON public.skill_categories;
DROP POLICY IF EXISTS "Admin all skill_categories"   ON public.skill_categories;

CREATE POLICY "Public read skill_categories"
  ON public.skill_categories FOR SELECT USING (true);
CREATE POLICY "Admin all skill_categories"
  ON public.skill_categories FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ─── Auto-update trigger for skills.updated_at ────────────────────────────
DROP TRIGGER IF EXISTS set_skills_updated_at ON public.skills;
CREATE TRIGGER set_skills_updated_at
  BEFORE UPDATE ON public.skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
