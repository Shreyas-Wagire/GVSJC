-- ============================================================
-- GVSJC – Admin Anon Write Policies
-- Allows the admin dev bypass (localStorage) to perform
-- full CRUD on admin-managed tables via the anon role.
-- Run this in Supabase SQL Editor.
-- ============================================================

-- ─── notices ─────────────────────────────────────────────────
DO $$ BEGIN
  CREATE POLICY "Anon insert – notices"
    ON public.notices FOR INSERT TO anon WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anon update – notices"
    ON public.notices FOR UPDATE TO anon USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anon delete – notices"
    ON public.notices FOR DELETE TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anon read – notices"
    ON public.notices FOR SELECT TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── admissions ──────────────────────────────────────────────
DO $$ BEGIN
  CREATE POLICY "Anon read – admissions"
    ON public.admissions FOR SELECT TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anon update – admissions"
    ON public.admissions FOR UPDATE TO anon USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anon delete – admissions"
    ON public.admissions FOR DELETE TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── contacts (queries) ──────────────────────────────────────
DO $$ BEGIN
  CREATE POLICY "Anon read – contacts"
    ON public.contacts FOR SELECT TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anon update – contacts"
    ON public.contacts FOR UPDATE TO anon USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anon delete – contacts"
    ON public.contacts FOR DELETE TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── feedback ────────────────────────────────────────────────
DO $$ BEGIN
  CREATE POLICY "Anon read – feedback"
    ON public.feedback FOR SELECT TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anon update – feedback"
    ON public.feedback FOR UPDATE TO anon USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anon delete – feedback"
    ON public.feedback FOR DELETE TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── site_content ────────────────────────────────────────────
DO $$ BEGIN
  CREATE POLICY "Anon read – site_content"
    ON public.site_content FOR SELECT TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anon insert – site_content"
    ON public.site_content FOR INSERT TO anon WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anon update – site_content"
    ON public.site_content FOR UPDATE TO anon USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anon delete – site_content"
    ON public.site_content FOR DELETE TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── faculty (already in supabase_faculty_toppers.sql but safe to repeat) ────
DO $$ BEGIN
  CREATE POLICY "Anon read – faculty"
    ON public.faculty FOR SELECT TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── toppers (same) ──────────────────────────────────────────
DO $$ BEGIN
  CREATE POLICY "Anon read – toppers"
    ON public.toppers FOR SELECT TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
