-- ============================================================
-- GVSJC – Gallery Storage Policies  (run AFTER creating bucket)
-- Step 1: Go to Supabase Dashboard → Storage → New bucket
--         Name: gallery   |   Public access: ON ✅
-- Step 2: Then run THIS file in SQL Editor
-- ============================================================

-- Allow anyone to read files from the gallery bucket
DO $$ BEGIN
  CREATE POLICY "Gallery public read"
    ON storage.objects FOR SELECT TO anon, authenticated
    USING (bucket_id = 'gallery');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Allow admin (anon bypass) to upload files
DO $$ BEGIN
  CREATE POLICY "Gallery anon upload"
    ON storage.objects FOR INSERT TO anon
    WITH CHECK (bucket_id = 'gallery');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Allow admin (anon bypass) to delete files
DO $$ BEGIN
  CREATE POLICY "Gallery anon delete"
    ON storage.objects FOR DELETE TO anon
    USING (bucket_id = 'gallery');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Allow authenticated users full access
DO $$ BEGIN
  CREATE POLICY "Gallery auth full"
    ON storage.objects FOR ALL TO authenticated
    USING (bucket_id = 'gallery')
    WITH CHECK (bucket_id = 'gallery');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
