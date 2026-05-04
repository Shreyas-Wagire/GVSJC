-- ============================================================
-- GVSJC – Missing Tables + Dummy Data Seed
-- Run this in the Supabase SQL Editor AFTER running supabase_clerk_migration.sql
-- ============================================================

-- ============================================================
-- PART 1: Create Missing Tables (admissions, contacts, feedback)
-- ============================================================

-- 1a. Admissions table (used by Admissions.tsx public form)
CREATE TABLE IF NOT EXISTS public.admissions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  parent_name  TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT NOT NULL,
  grade        TEXT NOT NULL,
  message      TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Add columns that may be missing if table already existed
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;

-- Policies (skip if already exist)
DO $$ BEGIN
  CREATE POLICY "Anon insert – admissions"
    ON public.admissions FOR INSERT TO anon WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
 
DO $$ BEGIN
  CREATE POLICY "Authenticated read – admissions"
    ON public.admissions FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated update – admissions"
    ON public.admissions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated delete – admissions"
    ON public.admissions FOR DELETE TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- 1b. Contacts table (used by Contact.tsx public form)
CREATE TABLE IF NOT EXISTS public.contacts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add columns that may be missing if table already existed
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'unread';

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Policies (skip if already exist)
DO $$ BEGIN
  CREATE POLICY "Anon insert – contacts"
    ON public.contacts FOR INSERT TO anon WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated read – contacts"
    ON public.contacts FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated update – contacts"
    ON public.contacts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated delete – contacts"
    ON public.contacts FOR DELETE TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- 1c. Feedback table (for admin panel display)
CREATE TABLE IF NOT EXISTS public.feedback (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT,
  email      TEXT,
  rating     INT CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT NOT NULL,
  category   TEXT DEFAULT 'general', -- general | academics | facilities | staff
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Policies (skip if already exist)
DO $$ BEGIN
  CREATE POLICY "Anon insert – feedback"
    ON public.feedback FOR INSERT TO anon WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated read – feedback"
    ON public.feedback FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated delete – feedback"
    ON public.feedback FOR DELETE TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ============================================================
-- PART 2: Notices table – matches real schema used by NoticeManager.tsx
-- Columns: tag, tag_color, icon, icon_color, title, description, date (TEXT), is_new
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notices (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  date        TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Add columns that may be missing if table already existed
ALTER TABLE public.notices ADD COLUMN IF NOT EXISTS tag        TEXT NOT NULL DEFAULT 'General';
ALTER TABLE public.notices ADD COLUMN IF NOT EXISTS tag_color  TEXT DEFAULT 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
ALTER TABLE public.notices ADD COLUMN IF NOT EXISTS icon       TEXT DEFAULT 'Info';
ALTER TABLE public.notices ADD COLUMN IF NOT EXISTS icon_color TEXT DEFAULT 'text-blue-500';
ALTER TABLE public.notices ADD COLUMN IF NOT EXISTS is_new     BOOLEAN DEFAULT false;

ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Anon read – notices"
    ON public.notices FOR SELECT TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated full access – notices"
    ON public.notices FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ============================================================
-- PART 3: Seed Dummy Data
-- ============================================================

-- --- Students (for Clerk portal) ---
INSERT INTO public.students (student_id, name, class, roll_no, admission_class, date_of_admission, dob, nationality, religion, caste, father_name, mother_name, parent_name, parent_phone, email, city, state, district, taluka)
VALUES
  ('GVS-2024-001', 'Aarav Patil',       'Class 5',  '01', 'Class 1',  '2020-06-15', '2014-03-12', 'Indian', 'Hindu', 'Maratha',  'Suresh Patil',    'Sunita Patil',    'Suresh Patil',    '9876543210', 'aarav.patil@gmail.com',    'Kolhapur',   'Maharashtra', 'Kolhapur',   'Hatkanangale'),
  ('GVS-2024-002', 'Priya Jadhav',      'Class 7',  '02', 'Class 3',  '2020-06-15', '2012-07-22', 'Indian', 'Hindu', 'Kunbi',    'Ramesh Jadhav',   'Rekha Jadhav',    'Ramesh Jadhav',   '9876543211', 'priya.j@gmail.com',        'Hatkanangale','Maharashtra', 'Kolhapur',   'Hatkanangale'),
  ('GVS-2024-003', 'Rohan Deshmukh',    'Class 9',  '03', 'Class 5',  '2020-06-15', '2010-11-05', 'Indian', 'Hindu', 'Brahmin',  'Nilesh Deshmukh', 'Anita Deshmukh',  'Nilesh Deshmukh', '9876543212', 'rohan.d@gmail.com',        'Chokak',     'Maharashtra', 'Kolhapur',   'Hatkanangale'),
  ('GVS-2024-004', 'Sneha Kulkarni',    'Class 3',  '04', 'LKG',      '2021-06-14', '2016-01-30', 'Indian', 'Hindu', 'CKP',      'Ajay Kulkarni',   'Savita Kulkarni', 'Ajay Kulkarni',   '9876543213', 'sneha.k@gmail.com',        'Chokak',     'Maharashtra', 'Kolhapur',   'Hatkanangale'),
  ('GVS-2024-005', 'Arjun Shinde',      'Class 10', '05', 'Class 6',  '2020-06-15', '2010-05-18', 'Indian', 'Hindu', 'Maratha',  'Vijay Shinde',    'Priya Shinde',    'Vijay Shinde',    '9876543214', 'arjun.s@gmail.com',        'Kolhapur',   'Maharashtra', 'Kolhapur',   'Karvir'),
  ('GVS-2024-006', 'Divya Pawar',       'LKG',      '06', 'LKG',      '2024-06-17', '2019-08-25', 'Indian', 'Hindu', 'Maratha',  'Sanjay Pawar',    'Kavita Pawar',    'Sanjay Pawar',    '9876543215', 'divya.p@gmail.com',        'Hatkanangale','Maharashtra', 'Kolhapur',   'Hatkanangale'),
  ('GVS-2024-007', 'Karan Mane',        'Class 8',  '07', 'Class 4',  '2020-06-15', '2011-12-10', 'Indian', 'Hindu', 'Kunbi',    'Pramod Mane',     'Lalita Mane',     'Pramod Mane',     '9876543216', 'karan.m@gmail.com',        'Chokak',     'Maharashtra', 'Kolhapur',   'Hatkanangale'),
  ('GVS-2024-008', 'Ankita More',       'UKG',      '08', 'UKG',      '2023-06-19', '2018-04-14', 'Indian', 'Hindu', 'Maratha',  'Ganesh More',     'Sunanda More',    'Ganesh More',     '9876543217', 'ankita.m@gmail.com',       'Kolhapur',   'Maharashtra', 'Kolhapur',   'Karvir'),
  ('GVS-2024-009', 'Rahul Sawant',      'Class 6',  '09', 'Class 2',  '2021-06-14', '2013-09-03', 'Indian', 'Hindu', 'Agri',     'Balu Sawant',     'Leela Sawant',    'Balu Sawant',     '9876543218', 'rahul.s@gmail.com',        'Chokak',     'Maharashtra', 'Kolhapur',   'Hatkanangale'),
  ('GVS-2024-010', 'Ishaan Bhosale',    'Class 4',  '10', 'Class 1',  '2021-06-14', '2015-06-21', 'Indian', 'Hindu', 'Maratha',  'Dhanaji Bhosale', 'Meena Bhosale',   'Dhanaji Bhosale', '9876543219', 'ishaan.b@gmail.com',       'Hatkanangale','Maharashtra', 'Kolhapur',   'Hatkanangale')
ON CONFLICT (student_id) DO NOTHING;


-- --- Fee Payments (linked to students above) ---
INSERT INTO public.fee_payments (student_id, amount, date, mode, receipt_no)
SELECT s.id, 18000, '2024-06-20', 'online', 'RCP-2024-001'
FROM public.students s WHERE s.student_id = 'GVS-2024-001'
ON CONFLICT (receipt_no) DO NOTHING;

INSERT INTO public.fee_payments (student_id, amount, date, mode, receipt_no)
SELECT s.id, 22000, '2024-06-21', 'cash', 'RCP-2024-002'
FROM public.students s WHERE s.student_id = 'GVS-2024-002'
ON CONFLICT (receipt_no) DO NOTHING;

INSERT INTO public.fee_payments (student_id, amount, date, mode, receipt_no)
SELECT s.id, 25000, '2024-06-22', 'cheque', 'RCP-2024-003'
FROM public.students s WHERE s.student_id = 'GVS-2024-003'
ON CONFLICT (receipt_no) DO NOTHING;

INSERT INTO public.fee_payments (student_id, amount, date, mode, receipt_no)
SELECT s.id, 18000, '2024-07-01', 'online', 'RCP-2024-004'
FROM public.students s WHERE s.student_id = 'GVS-2024-004'
ON CONFLICT (receipt_no) DO NOTHING;

INSERT INTO public.fee_payments (student_id, amount, date, mode, receipt_no)
SELECT s.id, 25000, '2024-07-05', 'online', 'RCP-2024-005'
FROM public.students s WHERE s.student_id = 'GVS-2024-005'
ON CONFLICT (receipt_no) DO NOTHING;


-- --- Donations ---
INSERT INTO public.donations (receipt_no, donor_name, amount, date, mode, purpose)
VALUES
  ('DON-2024-001', 'Suresh Patil',       50000,  '2024-01-15', 'cheque', 'Library Development Fund'),
  ('DON-2024-002', 'Ramesh Jadhav',      25000,  '2024-02-20', 'online', 'Sports Equipment'),
  ('DON-2024-003', 'Anonymous Donor',    100000, '2024-03-05', 'dd',     'Building Construction'),
  ('DON-2024-004', 'Vijay Shinde',       15000,  '2024-04-10', 'cash',   'Scholarship Fund'),
  ('DON-2024-005', 'Ajay Kulkarni',      30000,  '2024-05-22', 'online', 'Computer Lab Upgrade')
ON CONFLICT (receipt_no) DO NOTHING;


-- --- Admissions (from public admission form) ---
INSERT INTO public.admissions (student_name, parent_name, email, phone, grade, message, status, created_at)
VALUES
  ('Yash Patil',       'Suresh Patil',    'suresh.patil@gmail.com',     '9823456781', 'Class I',               'Interested in science stream later', 'accepted',  now() - interval '15 days'),
  ('Nisha Desai',      'Mohan Desai',     'mohan.desai@gmail.com',      '9823456782', 'LKG',                   'First child, need extra attention',  'reviewed',  now() - interval '12 days'),
  ('Tanvi Shinde',     'Arun Shinde',     'arun.shinde@gmail.com',      '9823456783', 'Class XI - Science',    'Scored 91% in SSC board',            'pending',   now() - interval '9 days'),
  ('Mihir Kulkarni',   'Rajesh Kulkarni', 'rajesh.kulkarni@gmail.com',  '9823456784', 'UKG',                   'Please confirm seat availability',   'pending',   now() - interval '7 days'),
  ('Prachi Jadhav',    'Ganesh Jadhav',   'ganesh.jadhav@gmail.com',    '9823456785', 'Class XI - Commerce',   NULL,                                 'pending',   now() - interval '5 days'),
  ('Siddharth More',   'Pramod More',     'pramod.more@gmail.com',      '9823456786', 'Class IV',              'Transferring from another school',   'reviewed',  now() - interval '3 days'),
  ('Riya Sawant',      'Balu Sawant',     'balu.sawant@gmail.com',      '9823456787', 'Nursery',               'Twin sibling also applying',         'pending',   now() - interval '2 days'),
  ('Om Bhosale',       'Dhanaji Bhosale', 'dhanaji.bhosale@gmail.com',  '9823456788', 'Class III',             NULL,                                 'pending',   now() - interval '1 day'),
  ('Aisha Khan',       'Salim Khan',      'salim.khan@gmail.com',       '9823456789', 'Class XI - Arts',       'Interested in fine arts elective',   'accepted',  now() - interval '20 days'),
  ('Dev Pawar',        'Sanjay Pawar',    'sanjay.pawar@gmail.com',     '9823456790', 'Class XII - Science',   'Lateral entry from CBSE board',      'pending',   now() - interval '1 day')
ON CONFLICT DO NOTHING;


-- --- Contacts (from public contact/feedback form) ---
INSERT INTO public.contacts (name, email, phone, message, status, created_at)
VALUES
  ('Pradeep Patil',    'pradeep.p@gmail.com',    '9876501001', 'What are the timings for admission counselling?',                           'read',    now() - interval '20 days'),
  ('Savita Shinde',    'savita.s@gmail.com',     '9876501002', 'Is hostel facility available for girl students?',                           'replied', now() - interval '18 days'),
  ('Ramesh Kulkarni',  'ramesh.k@gmail.com',     '9876501003', 'I would like to know about the science lab infrastructure.',                'unread',  now() - interval '15 days'),
  ('Meena Jadhav',     'meena.j@gmail.com',      '9876501004', 'Are there any scholarships for economically weak students?',                'read',    now() - interval '11 days'),
  ('Santosh More',     'santosh.m@gmail.com',    '9876501005', 'Please share the school bus routes covering Chokak village.',               'unread',  now() - interval '9 days'),
  ('Anita Sawant',     'anita.s@gmail.com',      NULL,         'What extracurricular activities are offered for junior classes?',           'unread',  now() - interval '7 days'),
  ('Vijay Bhosale',    'vijay.b@gmail.com',      '9876501007', 'Is CBSE or State board curriculum followed?',                              'replied', now() - interval '5 days'),
  ('Pooja Desai',      'pooja.d@gmail.com',      '9876501008', 'My daughter is interested in joining the school choir. Is there one?',     'unread',  now() - interval '3 days'),
  ('Sunil Pawar',      'sunil.pw@gmail.com',     '9876501009', 'Can I visit the school campus for a tour before admission?',               'unread',  now() - interval '2 days'),
  ('Kiran Mane',       'kiran.mn@gmail.com',     '9876501010', 'What documents are needed for Class 11 admission?',                        'unread',  now() - interval '1 day')
ON CONFLICT DO NOTHING;


-- --- Feedback (for admin panel) ---
INSERT INTO public.feedback (name, email, rating, comment, category, created_at)
VALUES
  ('Suresh Patil',    'suresh.p@gmail.com',    5, 'Excellent teaching staff. My son improved remarkably in just 6 months.',                'academics',   now() - interval '30 days'),
  ('Rekha Jadhav',    'rekha.j@gmail.com',     4, 'Clean campus and good facilities. Cafeteria could be improved.',                        'facilities',  now() - interval '25 days'),
  ('Nilesh Deshmukh', 'nilesh.d@gmail.com',    5, 'Principal is very approachable and staff is supportive.',                               'staff',       now() - interval '22 days'),
  ('Savita Kulkarni', 'savita.k@gmail.com',    3, 'Sports facilities are limited. Need more outdoor equipment.',                           'facilities',  now() - interval '18 days'),
  ('Priya Shinde',    'priya.sh@gmail.com',    5, 'My child loves coming to school every day. The atmosphere is wonderful!',               'general',     now() - interval '15 days'),
  ('Kavita Pawar',    'kavita.p@gmail.com',    4, 'Regular parent-teacher meetings are very helpful to track progress.',                   'academics',   now() - interval '12 days'),
  ('Lalita Mane',     'lalita.m@gmail.com',    4, 'Library is well-stocked. Would love to see digital books added.',                       'facilities',  now() - interval '9 days'),
  ('Sunanda More',    'sunanda.m@gmail.com',   5, 'Science teachers are extremely knowledgeable and encouraging.',                         'academics',   now() - interval '7 days'),
  ('Leela Sawant',    'leela.s@gmail.com',     3, 'Communication from school regarding events can be more timely.',                        'general',     now() - interval '4 days'),
  ('Meena Bhosale',   'meena.bh@gmail.com',    5, 'Best school in Hatkanangale! Highly recommend to all parents.',                         'general',     now() - interval '1 day')
ON CONFLICT DO NOTHING;


-- --- Notices (columns match NoticeManager.tsx real schema) ---
-- tag_color values: bg-red-100 text-red-700 | bg-amber-100 text-amber-700 | bg-purple-100 text-purple-700 | bg-blue-100 text-blue-700 | bg-green-100 text-green-700
INSERT INTO public.notices (title, description, date, tag, tag_color, icon, icon_color, is_new)
VALUES
  ('Admission Open 2025-26',
   'Applications for new admissions are open for all classes from LKG to Class 10. Limited seats available.',
   '01 Apr 2025',
   'Admission', 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
   'Info', 'text-green-500', true),

  ('Annual Sports Day',
   'The Annual Sports Day will be held on 15th May 2025. All students must participate in at least one event.',
   '15 May 2025',
   'Event', 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
   'PartyPopper', 'text-purple-500', true),

  ('Unit Test Schedule – May 2025',
   'Unit tests for all classes from Class 3 to Class 10 are scheduled from 20th to 25th May 2025.',
   '20 May 2025',
   'Exam', 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
   'AlertCircle', 'text-red-500', false),

  ('School Holiday – Mahaveer Jayanti',
   'School will remain closed on 10th April 2025 on account of Mahaveer Jayanti.',
   '10 Apr 2025',
   'Holiday', 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
   'CalendarDays', 'text-amber-500', false),

  ('Parent-Teacher Meeting',
   'PT Meeting is scheduled for 3rd May 2025. All parents are requested to attend between 10 AM and 1 PM.',
   '03 May 2025',
   'General', 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
   'Bell', 'text-blue-500', false),

  ('Science Exhibition – Results',
   'Congratulations to all participants! Results of the Science Exhibition are out. Check the notice board.',
   '28 Apr 2025',
   'Event', 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
   'PartyPopper', 'text-purple-500', false),

  ('Fee Payment Reminder',
   'Last date to pay the Annual fee for 2025-26 is 30th June 2025. Kindly avoid late fee penalty.',
   '30 Jun 2025',
   'Urgent', 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
   'AlertCircle', 'text-red-500', true),

  ('Summer Vacation Notice',
   'School will remain closed for Summer Vacation from 1st May to 10th June 2025. Stay safe and enjoy!',
   '01 May 2025',
   'Holiday', 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
   'CalendarDays', 'text-amber-500', false)
ON CONFLICT DO NOTHING;


-- ============================================================
-- PART 4: Update useFeedback hook – activate the feedback table
-- (This is just a reminder — update src/hooks/useFeedback.ts to query the `feedback` table)
-- ============================================================
-- The feedback table now exists. Update useFeedback.ts to:
--   const { data, error } = await supabase.from('feedback').select('*').order('created_at', { ascending: false });
-- ============================================================
