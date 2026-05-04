import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Printer, Search } from 'lucide-react';

const CLASSES = ['LKG', 'UKG', ...Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`)];

interface Student { id: string; name: string; class: string; }
interface FeeInfo {
  student: Student;
  total_fee: number;
  paid: number;
  balance: number;
}

export default function FeeCollection() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [feeInfo, setFeeInfo] = useState<FeeInfo | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    mode: 'cash',
  });
  const [receipt, setReceipt] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const fetchStudents = useCallback(async () => {
    const { data } = await supabase.from('students').select('id, name, class').order('name');
    setStudents(data ?? []);
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const loadFeeInfo = useCallback(async (sid: string) => {
    if (!sid) return;
    setLoading(true);
    try {
      const student = students.find((s) => s.id === sid)!;
      const { data: payments } = await supabase
        .from('fee_payments')
        .select('amount')
        .eq('student_id', sid);
      const paid = (payments ?? []).reduce((sum, p) => sum + (p.amount ?? 0), 0);
      const { data: feeStructure } = await supabase
        .from('fee_structure')
        .select('total_fee')
        .eq('class', student.class)
        .maybeSingle();
      const totalFee = feeStructure?.total_fee ?? 0;
      setFeeInfo({ student, total_fee: totalFee, paid, balance: totalFee - paid });
    } catch {
      toast.error('Failed to load fee details');
    } finally {
      setLoading(false);
    }
  }, [students]);

  const handleStudentPick = (sid: string) => {
    setSelectedStudentId(sid);
    setFeeInfo(null);
    setReceipt(null);
    loadFeeInfo(sid);
  };

  const filteredStudents = students.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !search || s.name.toLowerCase().includes(q);
    const matchClass = classFilter === 'all' || s.class === classFilter;
    return matchSearch && matchClass;
  });

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(paymentForm.amount);
    if (!amt || amt <= 0) { toast.error('Enter a valid amount'); return; }
    setLoading(true);
    try {
      const receiptNo = `RCP-${Date.now()}`;
      const { error } = await supabase.from('fee_payments').insert([{
        student_id: selectedStudentId,
        amount: amt,
        date: paymentForm.date,
        mode: paymentForm.mode,
        receipt_no: receiptNo,
      }]);
      if (error) throw error;
      toast.success('Payment recorded!');
      setReceipt({
        receiptNo,
        date: paymentForm.date,
        amount: amt,
        mode: paymentForm.mode,
        studentName: feeInfo?.student.name,
        studentClass: feeInfo?.student.class,
      });
      // Refresh fee info
      setPaymentForm({ amount: '', date: new Date().toISOString().slice(0, 10), mode: 'cash' });
      await loadFeeInfo(selectedStudentId);
    } catch (err: any) {
      toast.error(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const printReceipt = () => {
    if (!receiptRef.current) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<html><head><title>Fee Receipt</title><style>body{font-family:monospace;padding:20px} table{width:100%;border-collapse:collapse} td{padding:6px 4px}</style></head><body>${receiptRef.current.outerHTML}</body></html>`);
    win.document.close();
    win.print();
  };

  const labelClass = "text-sm font-medium text-gray-700";
  const selectClass = "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-display text-gray-900">Fee Collection</h1>
        <p className="text-gray-500 mt-1">Select a student to view fee status and record payments.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">

        {/* Search + Class filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search student by name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={classFilter}
            onChange={(e) => { setClassFilter(e.target.value); setSelectedStudentId(''); setFeeInfo(null); setReceipt(null); }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Classes</option>
            {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Scrollable student list */}
        <div>
          <Label className={labelClass}>
            Select Student
            {selectedStudentId && feeInfo && (
              <span className="ml-2 text-emerald-600 font-semibold text-xs">✓ {feeInfo.student.name}</span>
            )}
          </Label>
          <div className="mt-1 max-h-52 overflow-y-auto rounded-lg border border-gray-200 divide-y">
            {filteredStudents.length === 0 ? (
              <p className="text-center py-6 text-gray-400 text-sm">No students found</p>
            ) : filteredStudents.map((s) => (
              <button
                key={s.id}
                onClick={() => handleStudentPick(s.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-left ${
                  selectedStudentId === s.id
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-gray-700'
                }`}
              >
                <span>{s.name}</span>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full shrink-0">{s.class}</span>
              </button>
            ))}
          </div>
        </div>

        {loading && <div className="flex justify-center py-6"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" /></div>}

        {feeInfo && !loading && (
          <div className="space-y-6">
            {/* Fee Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {feeInfo.student.name} – {feeInfo.student.class}
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Annual Fee', value: `₹${feeInfo.total_fee.toLocaleString('en-IN')}`, color: 'text-gray-800' },
                  { label: 'Paid', value: `₹${feeInfo.paid.toLocaleString('en-IN')}`, color: 'text-green-600' },
                  { label: 'Balance', value: `₹${feeInfo.balance.toLocaleString('en-IN')}`, color: feeInfo.balance > 0 ? 'text-red-600' : 'text-green-600' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-gray-50 rounded-lg p-4 text-center border">
                    <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Form */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Record Payment</h4>
              <form onSubmit={handlePaySubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className={labelClass}>Amount (₹) *</Label>
                  <Input type="number" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} min="1" step="any" required className="mt-1" />
                </div>
                <div>
                  <Label className={labelClass}>Date *</Label>
                  <Input type="date" value={paymentForm.date} onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })} required className="mt-1" />
                </div>
                <div>
                  <Label className={labelClass}>Mode</Label>
                  <select value={paymentForm.mode} onChange={(e) => setPaymentForm({ ...paymentForm, mode: e.target.value })} className={selectClass}>
                    <option value="cash">Cash</option>
                    <option value="online">Online</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                    {loading ? 'Processing...' : 'Submit Payment'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Receipt */}
      {receipt && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Payment Receipt</h3>
            <Button onClick={printReceipt} variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" /> Print Receipt
            </Button>
          </div>
          <div ref={receiptRef} className="border border-dashed border-gray-300 rounded-lg p-6 max-w-sm">
            <div className="text-center border-b pb-4 mb-4">
              <h2 className="font-bold text-lg">Gurukul Vidyalay S. J. C.</h2>
              <p className="text-sm text-gray-600">Fee Payment Receipt</p>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {[
                  ['Receipt No', receipt.receiptNo],
                  ['Date', receipt.date],
                  ['Student', `${receipt.studentName} (${receipt.studentClass})`],
                  ['Amount Paid', `₹${receipt.amount.toLocaleString('en-IN')}`],
                  ['Payment Mode', receipt.mode],
                ].map(([label, value]) => (
                  <tr key={label} className="border-b last:border-0">
                    <td className="py-2 font-medium text-gray-600 w-40">{label}</td>
                    <td className="py-2">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right mt-6 text-xs text-gray-400">Clerk Signature ___________</div>
          </div>
        </div>
      )}
    </div>
  );
}
