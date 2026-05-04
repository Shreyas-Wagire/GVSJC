-- ============================================================
-- GVSJC – Add photo_url to faculty + fix all RLS policies
-- Run this in Supabase SQL Editor
-- ============================================================

-- Step 1: Add photo_url column (safe — skipped if already exists)
DO $$ BEGIN
  ALTER TABLE public.faculty ADD COLUMN photo_url TEXT;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- Step 2: Make sure RLS is enabled on faculty
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;

-- Step 3: Read policy (public can see faculty)
DO $$ BEGIN
  CREATE POLICY "Anon read – faculty"
    ON public.faculty FOR SELECT TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Step 4: Anon INSERT (needed for Add Faculty)
DO $$ BEGIN
  CREATE POLICY "Anon insert – faculty"
    ON public.faculty FOR INSERT TO anon WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Step 5: Anon UPDATE (needed for editing faculty + saving photo_url)
DO $$ BEGIN
  CREATE POLICY "Anon update – faculty"
    ON public.faculty FOR UPDATE TO anon USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Step 6: Anon DELETE (needed for removing faculty)
DO $$ BEGIN
  CREATE POLICY "Anon delete – faculty"
    ON public.faculty FOR DELETE TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Step 7: Authenticated full access
DO $$ BEGIN
  CREATE POLICY "Auth full access – faculty"
    ON public.faculty FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Verify: check photo_url column exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'faculty' AND column_name = 'photo_url';
-- If the above returns 1 row → column exists ✅
-- If it returns 0 rows → something went wrong, run again
