-- ============================================================
-- GVSJC – Storage Policies for Faculty & Topper Photos
-- 
-- BEFORE running this:
--   1. Go to Supabase Dashboard → Storage → New bucket
--      Name: faculty-photos   |  Public: ✅ ON
--   2. Create another bucket:
--      Name: topper-photos    |  Public: ✅ ON
--   3. Then run this SQL
-- ============================================================

-- ─── faculty-photos bucket ───────────────────────────────────
DO $$ BEGIN
  CREATE POLICY "Faculty photos public read"
    ON storage.objects FOR SELECT TO anon, authenticated
    USING (bucket_id = 'faculty-photos');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Faculty photos anon upload"
    ON storage.objects FOR INSERT TO anon
    WITH CHECK (bucket_id = 'faculty-photos');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Faculty photos anon delete"
    ON storage.objects FOR DELETE TO anon
    USING (bucket_id = 'faculty-photos');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Faculty photos anon update"
    ON storage.objects FOR UPDATE TO anon
    USING (bucket_id = 'faculty-photos');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── topper-photos bucket ────────────────────────────────────
DO $$ BEGIN
  CREATE POLICY "Topper photos public read"
    ON storage.objects FOR SELECT TO anon, authenticated
    USING (bucket_id = 'topper-photos');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Topper photos anon upload"
    ON storage.objects FOR INSERT TO anon
    WITH CHECK (bucket_id = 'topper-photos');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Topper photos anon delete"
    ON storage.objects FOR DELETE TO anon
    USING (bucket_id = 'topper-photos');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Topper photos anon update"
    ON storage.objects FOR UPDATE TO anon
    USING (bucket_id = 'topper-photos');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
