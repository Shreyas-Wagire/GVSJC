-- ============================================================
-- GVSJC – Insert Dummy Exams and Marks matching real students
-- Run this in Supabase SQL Editor
-- ============================================================

DO $$
DECLARE
  class_record RECORD;
  exam_uuid UUID;
  student_record RECORD;
  english_marks INT;
  math_marks INT;
  science_marks INT;
  marathi_marks INT;
  total_max INT := 400;
  obtained INT;
  remark TEXT;
BEGIN
  -- Loop through up to 4 distinct classes that actually have students in your database
  FOR class_record IN (SELECT DISTINCT class FROM public.students WHERE class IS NOT NULL LIMIT 4)
  LOOP
    -- 1. Create a "Mid Term Examination" exam for this class
    exam_uuid := gen_random_uuid();
    INSERT INTO public.exams (id, title, academic_year, class, subjects)
    VALUES (
      exam_uuid,
      'Mid Term Examination',
      '2024-2025',
      class_record.class,
      '[
        {"name": "English", "max_marks": 100},
        {"name": "Mathematics", "max_marks": 100},
        {"name": "Science", "max_marks": 100},
        {"name": "Marathi", "max_marks": 100}
      ]'::jsonb
    );

    -- 2. Loop through all students in this specific class
    FOR student_record IN (SELECT id, name FROM public.students WHERE class = class_record.class)
    LOOP
      -- Generate random marks between 40 and 100
      english_marks := floor(random() * 60 + 40)::int;
      math_marks := floor(random() * 60 + 40)::int;
      science_marks := floor(random() * 60 + 40)::int;
      marathi_marks := floor(random() * 60 + 40)::int;
      obtained := english_marks + math_marks + science_marks + marathi_marks;

      -- Determine remark based on performance
      IF obtained >= 350 THEN
        remark := 'Outstanding performance! Keep it up.';
      ELSIF obtained >= 280 THEN
        remark := 'Good work, but can improve further.';
      ELSIF obtained >= 200 THEN
        remark := 'Needs to focus more on studies.';
      ELSE
        remark := 'Requires special attention and hard work.';
      END IF;

      -- 3. Insert marks for this student
      INSERT INTO public.exam_marks (exam_id, student_id, marks, remarks)
      VALUES (
        exam_uuid,
        student_record.id,
        jsonb_build_object(
          'English', english_marks,
          'Mathematics', math_marks,
          'Science', science_marks,
          'Marathi', marathi_marks
        ),
        remark
      );
    END LOOP;
  END LOOP;
END $$;
