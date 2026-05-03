-- ============================================================
-- GVSJC – Anon Write Policies for Dev Clerk Bypass
-- Run this in Supabase SQL Editor.
-- This allows the clerk portal (dev localStorage bypass) to
-- insert/update/delete data without a real Supabase session.
-- ============================================================

-- students: allow anon INSERT (clerk admission form)
DO $$ BEGIN
  CREATE POLICY "Anon insert – students"
    ON public.students FOR INSERT TO anon WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- students: allow anon UPDATE (clerk enrollment edit)
DO $$ BEGIN
  CREATE POLICY "Anon update – students"
    ON public.students FOR UPDATE TO anon USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- students: allow anon DELETE (clerk enrollment delete)
DO $$ BEGIN
  CREATE POLICY "Anon delete – students"
    ON public.students FOR DELETE TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- fee_payments: allow anon INSERT/UPDATE/DELETE (clerk fee collection)
DO $$ BEGIN
  CREATE POLICY "Anon insert – fee_payments"
    ON public.fee_payments FOR INSERT TO anon WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anon read – fee_payments"
    ON public.fee_payments FOR SELECT TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- donations: allow anon INSERT (clerk donations form)
DO $$ BEGIN
  CREATE POLICY "Anon insert – donations"
    ON public.donations FOR INSERT TO anon WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anon read – donations"
    ON public.donations FOR SELECT TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- clerk_templates: allow anon INSERT/UPDATE (clerk ID card / bonafide save template)
DO $$ BEGIN
  CREATE POLICY "Anon insert – clerk_templates"
    ON public.clerk_templates FOR INSERT TO anon WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anon update – clerk_templates"
    ON public.clerk_templates FOR UPDATE TO anon USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
