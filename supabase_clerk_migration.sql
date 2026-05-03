-- ============================================================
-- GVSJC Clerk Portal – Supabase Tables Migration
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Students table
CREATE TABLE IF NOT EXISTS public.students (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id        TEXT UNIQUE,
  name              TEXT NOT NULL,
  class             TEXT,
  roll_no           TEXT,
  admission_class   TEXT,
  date_of_admission DATE,
  dob               DATE,
  dob_words         TEXT,
  nationality       TEXT DEFAULT 'Indian',
  mother_tongue     TEXT,
  religion          TEXT,
  caste             TEXT,
  sub_caste         TEXT,
  place_of_birth    TEXT,
  taluka            TEXT,
  district          TEXT,
  city              TEXT,
  state             TEXT,
  previous_school   TEXT,
  father_name       TEXT,
  mother_name       TEXT,
  parent_name       TEXT,
  parent_phone      TEXT,
  email             TEXT,
  aadhar            TEXT,
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- 2. Fee Structure (per class)
CREATE TABLE IF NOT EXISTS public.fee_structure (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class      TEXT UNIQUE NOT NULL,
  total_fee  NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default fee structure
INSERT INTO public.fee_structure (class, total_fee) VALUES
  ('LKG', 15000), ('UKG', 15000),
  ('Class 1', 18000), ('Class 2', 18000), ('Class 3', 18000),
  ('Class 4', 20000), ('Class 5', 20000), ('Class 6', 20000),
  ('Class 7', 22000), ('Class 8', 22000), ('Class 9', 25000),
  ('Class 10', 25000)
ON CONFLICT (class) DO NOTHING;

-- 3. Fee Payments
CREATE TABLE IF NOT EXISTS public.fee_payments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID REFERENCES public.students(id) ON DELETE CASCADE,
  amount      NUMERIC NOT NULL,
  date        DATE NOT NULL,
  mode        TEXT DEFAULT 'cash',  -- cash | online | cheque
  receipt_no  TEXT UNIQUE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 4. Donations
CREATE TABLE IF NOT EXISTS public.donations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_no  TEXT UNIQUE,
  donor_name  TEXT NOT NULL,
  amount      NUMERIC NOT NULL,
  date        DATE NOT NULL,
  mode        TEXT DEFAULT 'cash',  -- cash | cheque | online | dd
  purpose     TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 5. Clerk Templates (bonafide, idcard, etc.)
CREATE TABLE IF NOT EXISTS public.clerk_templates (
  type       TEXT PRIMARY KEY,   -- 'bonafide' | 'idcard'
  content    TEXT,
  meta       JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Row Level Security (RLS) – Enable & create policies
-- ============================================================

ALTER TABLE public.students      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_structure ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_payments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clerk_templates ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access (admin + clerk)
CREATE POLICY "Authenticated full access – students"
  ON public.students FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated read – fee_structure"
  ON public.fee_structure FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated full access – fee_payments"
  ON public.fee_payments FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated full access – donations"
  ON public.donations FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated full access – clerk_templates"
  ON public.clerk_templates FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- For the dev clerk login (no session), allow anon read on students/fee_structure
CREATE POLICY "Anon read – students"
  ON public.students FOR SELECT TO anon USING (true);

CREATE POLICY "Anon read – fee_structure"
  ON public.fee_structure FOR SELECT TO anon USING (true);

CREATE POLICY "Anon read – clerk_templates"
  ON public.clerk_templates FOR SELECT TO anon USING (true);
