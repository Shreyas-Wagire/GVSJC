/**
 * Shared Fee Payments Overview — Admin read-only, Clerk full CRUD.
 * Both read from the same `fee_payments` + `students` tables.
 */
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, RefreshCw, ArrowUpDown, IndianRupee } from 'lucide-react';

interface Payment {
  id: string;
  receipt_no: string;
  date: string;
  amount: number;
  mode: string;
  student_id: string;
  students?: { name: string; class: string } | null;
}

type SortKey = 'date' | 'amount' | 'mode';

interface Props {
  role?: 'admin' | 'clerk';
}

export default function SharedFeePayments({ role = 'admin' }: Props) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('fee_payments')
      .select('*, students(name, class)')
      .order(sortKey, { ascending: sortDir === 'asc' });
    if (error) toast.error('Failed to load payments');
    else setPayments(data ?? []);
    setLoading(false);
  }, [sortKey, sortDir]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filtered = payments.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      (p.students?.name ?? '').toLowerCase().includes(q) ||
      p.receipt_no.toLowerCase().includes(q) ||
      (p.students?.class ?? '').toLowerCase().includes(q);
    const matchMode = modeFilter === 'all' || p.mode === modeFilter;
    return matchSearch && matchMode;
  });

  const totalCollected = filtered.reduce((s, p) => s + (p.amount ?? 0), 0);

  const SortBtn = ({ label, col }: { label: string; col: SortKey }) => (
    <button
      onClick={() => toggleSort(col)}
      className="flex items-center gap-1 text-gray-600 font-medium whitespace-nowrap hover:text-primary"
    >
      {label}
      <ArrowUpDown className={`w-3 h-3 ${sortKey === col ? 'text-primary' : 'text-gray-300'}`} />
    </button>
  );

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900 flex items-center gap-2">
            <IndianRupee className="w-7 h-7 text-primary" /> Fee Payments
          </h1>
          <p className="text-gray-500 mt-1">
            {payments.length} records · Total: ₹{totalCollected.toLocaleString('en-IN')}
            {role === 'admin' && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                Managed by Clerk
              </span>
            )}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchPayments}>
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {['cash', 'upi', 'cheque', 'online'].map((mode) => {
          const total = payments.filter((p) => p.mode === mode).reduce((s, p) => s + p.amount, 0);
          return (
            <button
              key={mode}
              onClick={() => setModeFilter(modeFilter === mode ? 'all' : mode)}
              className={`bg-white rounded-xl border p-4 text-center transition-all hover:shadow-md ${
                modeFilter === mode ? 'border-primary ring-1 ring-primary' : 'border-gray-200'
              }`}
            >
              <p className="text-lg font-bold text-gray-900">₹{total.toLocaleString('en-IN')}</p>
              <p className="text-xs text-gray-500 capitalize mt-0.5">{mode}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search by student, class or receipt..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={modeFilter} onValueChange={setModeFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Payment Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modes</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="upi">UPI</SelectItem>
            <SelectItem value="cheque">Cheque</SelectItem>
            <SelectItem value="online">Online</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No payments found.</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3"><SortBtn label="Date" col="date" /></th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Receipt No.</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Student</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Class</th>
                  <th className="text-left px-4 py-3"><SortBtn label="Amount" col="amount" /></th>
                  <th className="text-left px-4 py-3"><SortBtn label="Mode" col="mode" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(p.date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.receipt_no}</td>
                    <td className="px-4 py-3 font-medium">{p.students?.name ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                        {p.students?.class ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-green-700">₹{p.amount?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 capitalize">
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{p.mode}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t bg-gray-50 text-xs text-gray-400 flex justify-between">
            <span>Showing {filtered.length} of {payments.length} payments</span>
            <span className="font-semibold text-gray-600">Total: ₹{totalCollected.toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
