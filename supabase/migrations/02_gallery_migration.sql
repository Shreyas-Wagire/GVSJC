-- ============================================================
-- GVSJC – Gallery Items Table + RLS Policies  (SAFE to run)
-- Run this in Supabase SQL Editor → no destructive operations
-- ============================================================

-- ─── Create gallery_items table ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT,
  category      TEXT NOT NULL DEFAULT 'Campus',
  media_type    TEXT NOT NULL DEFAULT 'photo' CHECK (media_type IN ('photo', 'video')),
  url           TEXT NOT NULL,
  thumbnail_url TEXT,
  sort_order    BIGINT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ─── Enable RLS ──────────────────────────────────────────────
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- ─── RLS Policies ────────────────────────────────────────────

-- Public read (gallery page visible to everyone)
DO $$ BEGIN
  CREATE POLICY "Public read – gallery_items"
    ON public.gallery_items FOR SELECT TO anon, authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Admin anon-bypass: insert
DO $$ BEGIN
  CREATE POLICY "Anon insert – gallery_items"
    ON public.gallery_items FOR INSERT TO anon WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Admin anon-bypass: update
DO $$ BEGIN
  CREATE POLICY "Anon update – gallery_items"
    ON public.gallery_items FOR UPDATE TO anon USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Admin anon-bypass: delete
DO $$ BEGIN
  CREATE POLICY "Anon delete – gallery_items"
    ON public.gallery_items FOR DELETE TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Authenticated users have full access
DO $$ BEGIN
  CREATE POLICY "Auth full access – gallery_items"
    ON public.gallery_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── Auto-update updated_at trigger ──────────────────────────
-- Creates the helper function only if it doesn't exist yet
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END $$;

-- Create trigger only if it doesn't already exist
DO $$ BEGIN
  CREATE TRIGGER gallery_items_updated_at
    BEFORE UPDATE ON public.gallery_items
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
