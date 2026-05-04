// ─── Student ─────────────────────────────────────────────────────────────────
export interface Student {
  id: string;
  name: string;
  class: string;
  roll_no?: string;
  dob?: string;
  gender?: string;
  address?: string;
  parent_name?: string;
  contact?: string;
  email?: string;
  created_at?: string;
}

// ─── Exam & Marks ─────────────────────────────────────────────────────────────
export interface SubjectDef {
  name: string;
  max_marks: number;
}

export interface Exam {
  id: string;
  title: string;
  academic_year: string;
  class: string;
  subjects: SubjectDef[];
  created_at?: string;
}

export interface ExamMark {
  id?: string;
  exam_id: string;
  student_id: string;
  marks: Record<string, number>;
  remarks?: string;
}

// ─── Fee ─────────────────────────────────────────────────────────────────────
export interface FeePayment {
  id: string;
  student_id: string;
  amount: number;
  date: string;
  mode: string;
  receipt_no: string;
  students?: { name: string; class: string } | null;
}

export interface FeeStructure {
  class: string;
  total_fee: number;
}

export interface StudentFeeStatus {
  id: string;
  name: string;
  class: string;
  total_fee: number;
  paid: number;
  balance: number;
  status: 'paid' | 'partial' | 'unpaid';
}

// ─── Gallery ─────────────────────────────────────────────────────────────────
export interface GalleryItem {
  id: string;
  title?: string;
  url: string;
  type: 'image' | 'video';
  category?: string;
  created_at?: string;
}

// ─── Faculty ─────────────────────────────────────────────────────────────────
export interface Faculty {
  id: string;
  name: string;
  designation: string;
  subject?: string;
  qualification?: string;
  experience?: string;
  photo_url?: string;
}

// ─── Topper ──────────────────────────────────────────────────────────────────
export interface Topper {
  id: string;
  name: string;
  class: string;
  percentage: number;
  year: string;
  photo_url?: string;
  board?: string;
}
