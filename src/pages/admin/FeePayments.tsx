// Admin Fee Payments overview — same fee_payments table as Clerk
import SharedFeePayments from '@/pages/shared/FeePayments';
export default function AdminFeePayments() {
  return <SharedFeePayments role="admin" />;
}
