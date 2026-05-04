-- ============================================================
-- GVSJC – Examinations & Marks Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create exams table
CREATE TABLE IF NOT EXISTS public.exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  class TEXT NOT NULL,
  subjects JSONB NOT NULL DEFAULT '[]'::jsonb, -- e.g. [{"name": "Math", "max_marks": 100}]
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create exam_marks table
CREATE TABLE IF NOT EXISTS public.exam_marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  marks JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g. {"Math": 85, "Science": 90}
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(exam_id, student_id) -- A student can only have one set of marks per exam
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_marks ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies (Anon access for ease of development, mirroring other tables)
DO $$ BEGIN
  CREATE POLICY "Anon all - exams" ON public.exams FOR ALL TO anon USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anon all - exam_marks" ON public.exam_marks FOR ALL TO anon USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Enable for authenticated users as well
DO $$ BEGIN
  CREATE POLICY "Auth all - exams" ON public.exams FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Auth all - exam_marks" ON public.exam_marks FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
