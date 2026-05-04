// ─── Class list used across Admin, Clerk, and public pages ──────────────────
export const CLASSES = [
  'LKG',
  'UKG',
  ...Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`),
] as const;

export type ClassName = typeof CLASSES[number];

// ─── Academic years ──────────────────────────────────────────────────────────
export const ACADEMIC_YEARS = [
  '2022-2023',
  '2023-2024',
  '2024-2025',
  '2025-2026',
  '2026-2027',
] as const;

export type AcademicYear = typeof ACADEMIC_YEARS[number];

// ─── Payment modes ────────────────────────────────────────────────────────────
export const PAYMENT_MODES = ['cash', 'upi', 'cheque', 'online'] as const;
export type PaymentMode = typeof PAYMENT_MODES[number];
