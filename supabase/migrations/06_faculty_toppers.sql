-- ============================================================
-- GVSJC – Faculty & Toppers Tables + Seed Data
-- Run this in Supabase SQL Editor
-- ============================================================

-- ─── 1. FACULTY TABLE ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.faculty (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  role          TEXT,
  qual          TEXT,
  exp           TEXT,
  initials      TEXT,
  color         TEXT DEFAULT 'from-blue-500 to-indigo-600',
  display_order INT  DEFAULT 99,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Add missing columns if table already existed without them
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS role          TEXT;
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS qual          TEXT;
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS exp           TEXT;
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS initials      TEXT;
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS color         TEXT DEFAULT 'from-blue-500 to-indigo-600';
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS display_order INT  DEFAULT 99;
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS updated_at    TIMESTAMPTZ DEFAULT now();

-- Drop NOT NULL on any pre-existing columns that conflict with new seed data
-- Wrapped in DO blocks so they skip safely if the column doesn't exist
DO $$ BEGIN ALTER TABLE public.faculty ALTER COLUMN subject       DROP NOT NULL; EXCEPTION WHEN undefined_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE public.faculty ALTER COLUMN designation   DROP NOT NULL; EXCEPTION WHEN undefined_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE public.faculty ALTER COLUMN qualification DROP NOT NULL; EXCEPTION WHEN undefined_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE public.faculty ALTER COLUMN experience    DROP NOT NULL; EXCEPTION WHEN undefined_column THEN NULL; END $$;




-- ─── 2. TOPPERS TABLE ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.toppers (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  class_label    TEXT NOT NULL,
  rank           INT  NOT NULL DEFAULT 1,
  percentage     TEXT,
  photo_url      TEXT,
  academic_year  TEXT DEFAULT '2025-26',
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

-- Add missing columns if toppers table already existed
ALTER TABLE public.toppers ADD COLUMN IF NOT EXISTS class_label   TEXT;
ALTER TABLE public.toppers ADD COLUMN IF NOT EXISTS rank          INT  DEFAULT 1;
ALTER TABLE public.toppers ADD COLUMN IF NOT EXISTS percentage    TEXT;
ALTER TABLE public.toppers ADD COLUMN IF NOT EXISTS photo_url     TEXT;
ALTER TABLE public.toppers ADD COLUMN IF NOT EXISTS academic_year TEXT DEFAULT '2025-26';
ALTER TABLE public.toppers ADD COLUMN IF NOT EXISTS updated_at    TIMESTAMPTZ DEFAULT now();

-- Drop NOT NULL on pre-existing columns that may conflict
DO $$ BEGIN ALTER TABLE public.toppers ALTER COLUMN class_label DROP NOT NULL; EXCEPTION WHEN undefined_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE public.toppers ALTER COLUMN marks       DROP NOT NULL; EXCEPTION WHEN undefined_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE public.toppers ALTER COLUMN student_id  DROP NOT NULL; EXCEPTION WHEN undefined_column THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE public.toppers ALTER COLUMN year        DROP NOT NULL; EXCEPTION WHEN undefined_column THEN NULL; END $$;


-- Now set class_label to NOT NULL after ensuring it exists (fill any NULLs first)
UPDATE public.toppers SET class_label = 'Unknown' WHERE class_label IS NULL;
ALTER TABLE public.toppers ALTER COLUMN class_label SET NOT NULL;


-- ─── 3. RLS ─────────────────────────────────────────────────
ALTER TABLE public.faculty  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toppers  ENABLE ROW LEVEL SECURITY;

-- Public read (anyone can view faculty/toppers on the website)
DO $$ BEGIN
  CREATE POLICY "Public read – faculty"
    ON public.faculty FOR SELECT TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public read – toppers"
    ON public.toppers FOR SELECT TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Authenticated (admin) full access
DO $$ BEGIN
  CREATE POLICY "Authenticated full – faculty"
    ON public.faculty FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated full – toppers"
    ON public.toppers FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Dev admin bypass (localStorage adminLoggedIn)
DO $$ BEGIN
  CREATE POLICY "Anon insert – faculty"
    ON public.faculty FOR INSERT TO anon WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anon update – faculty"
    ON public.faculty FOR UPDATE TO anon USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anon delete – faculty"
    ON public.faculty FOR DELETE TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anon insert – toppers"
    ON public.toppers FOR INSERT TO anon WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anon update – toppers"
    ON public.toppers FOR UPDATE TO anon USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anon delete – toppers"
    ON public.toppers FOR DELETE TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── 4. SEED FACULTY ────────────────────────────────────────
INSERT INTO public.faculty (name, role, qual, exp, initials, color, display_order) VALUES
  ('Hon. Shri. Pravin Mali',        'Principal',      'M.Ed., Ph.D. (Education)', '22 years', 'PM', 'from-blue-500 to-indigo-600',   1),
  ('Smt. Alka Pralhad Kamble',      'Vice Principal', 'M.Sc., B.Ed.',             '18 years', 'AK', 'from-purple-500 to-violet-600', 2),
  ('Smt. Sharvari S. Chinchangi',   NULL,             'M.Sc. Physics, B.Ed.',     '15 years', 'SC', 'from-rose-500 to-pink-600',     3),
  ('Smt. Rekha Patil',              NULL,             'M.A. English, B.Ed.',      '12 years', 'RP', 'from-amber-500 to-orange-600',  4),
  ('Shri Vikas Kulkarni',           NULL,             'M.A. Hindi, B.Ed.',        '14 years', 'VK', 'from-teal-500 to-cyan-600',     5),
  ('Smt. Anjali Bhosale',           NULL,             'M.A. History, B.Ed.',      '10 years', 'AB', 'from-green-500 to-emerald-600', 6),
  ('Shri Prasad Rao',               NULL,             'M.A B.Ed.',                '16 years', 'PR', 'from-red-500 to-rose-600',      7),
  ('Smt. Swapnali S. Patil',        NULL,             'B.Ed.',                    '8 years',  'SP', 'from-sky-500 to-blue-600',      8),
  ('Sou. Poonam Keshav Gawade',     NULL,             'B.A B.Ed',                 '17 years', 'PG', 'from-indigo-500 to-purple-600', 9),
  ('Shrimati. Priyanka P. Gawade',  NULL,             'B.Sc D.Ed',                '9 years',  'PG', 'from-pink-500 to-rose-600',     10),
  ('Sou. Samruddhi S. Tarlekar',    NULL,             'B.A B.Ed',                 '6 years',  'ST', 'from-green-500 to-teal-600',    11),
  ('Shri. Asif Khalil Mujawar',     NULL,             'B.A B.Ed',                 '11 years', 'AM', 'from-yellow-500 to-orange-600', 12),
  ('Shri. Dhirendra N. Patil',      NULL,             'M.A B.Ed',                 '13 years', 'DP', 'from-blue-400 to-cyan-600',     13),
  ('Sou. Smita V. Mulik',           NULL,             'B.A D.Ed',                 '7 years',  'SM', 'from-emerald-500 to-green-700', 14),
  ('Sou. Shailaja A. Vhanamani',    NULL,             'B.A B.Ed',                 '10 years', 'SV', 'from-purple-400 to-indigo-700', 15),
  ('Sou. Chaya C. Swami',           NULL,             'M.Com',                    '12 years', 'CS', 'from-rose-400 to-pink-700',     16),
  ('Sou. Sonali J. Gawade',         NULL,             'B.Sc',                     '5 years',  'SG', 'from-orange-400 to-red-600',    17),
  ('Sou. Parveen A. Shaikh',        NULL,             'B.Sc D.Ed',                '8 years',  'PS', 'from-teal-400 to-cyan-700',     18),
  ('Shri. Dayanand R. Kamble',      NULL,             'M.A D.Ed',                 '14 years', 'DK', 'from-red-400 to-rose-700',      19)
ON CONFLICT DO NOTHING;

-- ─── 5. SEED TOPPERS ────────────────────────────────────────
INSERT INTO public.toppers (name, class_label, rank, percentage, academic_year) VALUES
  ('Aarav Patil',       '1st Std',    1, '98%', '2025-26'),
  ('Sneha Kulkarni',    '1st Std',    2, '97%', '2025-26'),
  ('Ananya More',       '2nd Std',    1, '98%', '2025-26'),
  ('Rohan Deshmukh',    '2nd Std',    2, '97%', '2025-26'),
  ('Priya Gaikwad',     '3rd Std',    1, '99%', '2025-26'),
  ('Yash Shinde',       '3rd Std',    2, '96%', '2025-26'),
  ('Arjun Jadhav',      '4th Std',    1, '99%', '2025-26'),
  ('Isha Pawar',        '4th Std',    2, '97%', '2025-26'),
  ('Vedant Bhosale',    '5th Std',    1, '98%', '2025-26'),
  ('Mahi Salunke',      '5th Std',    2, '97%', '2025-26'),
  ('Shreya Wagh',       '11th (HSC)', 1, '94%', '2025-26'),
  ('Siddhi Mane',       '11th (HSC)', 2, '92%', '2025-26'),
  ('Omkar Kale',        '12th (HSC)', 1, '96%', '2025-26'),
  ('Rutuja Deshpande',  '12th (HSC)', 2, '95%', '2025-26')
ON CONFLICT DO NOTHING;
