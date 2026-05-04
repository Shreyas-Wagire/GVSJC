/**
 * Shared Fee Payments Overview — Admin read-only, Clerk full CRUD.
 * Tab 1: Payment Records (existing)
 * Tab 2: Fee Status — every student with Paid / Partial / Unpaid badge
 */
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search, RefreshCw, ArrowUpDown, IndianRupee,
  CheckCircle2, XCircle, AlertCircle, LayoutList, Users,
} from 'lucide-react';

/* ── Types ──────────────────────────────────────────────────── */
interface Payment {
  id: string;
  receipt_no: string;
  date: string;
  amount: number;
  mode: string;
  student_id: string;
  students?: { name: string; class: string } | null;
}

interface Student {
  id: string;
  name: string;
  class: string;
}

interface FeeStructure {
  class: string;
  total_fee: number;
}

interface StudentFeeStatus {
  id: string;
  name: string;
  class: string;
  total_fee: number;
  paid: number;
  balance: number;
  status: 'paid' | 'partial' | 'unpaid';
}

type SortKey = 'date' | 'amount' | 'mode';
type Tab = 'records' | 'status';

const CLASSES = ['LKG', 'UKG', ...Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`)];

interface Props { role?: 'admin' | 'clerk'; }

/* ── Status badge ────────────────────────────────────────────── */
const StatusBadge = ({ status }: { status: StudentFeeStatus['status'] }) => {
  if (status === 'paid')
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
        <CheckCircle2 className="w-3 h-3" /> Paid
      </span>
    );
  if (status === 'partial')
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
        <AlertCircle className="w-3 h-3" /> Partial
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
      <XCircle className="w-3 h-3" /> Unpaid
    </span>
  );
};

/* ── Main component ──────────────────────────────────────────── */
export default function SharedFeePayments({ role = 'admin' }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('status');

  // --- Tab 1: Payment records ---
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // --- Tab 2: Fee status ---
  const [feeStatusList, setFeeStatusList] = useState<StudentFeeStatus[]>([]);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [statusSearch, setStatusSearch] = useState('');
  const [statusClassFilter, setStatusClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'partial' | 'unpaid'>('all');

  /* ── Fetch payment records ────────────────────────────────── */
  const fetchPayments = useCallback(async () => {
    setLoadingPayments(true);
    const { data, error } = await supabase
      .from('fee_payments')
      .select('*, students(name, class)')
      .order(sortKey, { ascending: sortDir === 'asc' });
    if (error) toast.error('Failed to load payments');
    else setPayments(data ?? []);
    setLoadingPayments(false);
  }, [sortKey, sortDir]);

  /* ── Fetch fee status (students × payments × fee_structure) ─ */
  const fetchFeeStatus = useCallback(async () => {
    setLoadingStatus(true);
    try {
      const [{ data: students }, { data: payData }, { data: feeStructures }] = await Promise.all([
        supabase.from('students').select('id, name, class').order('class').order('name'),
        supabase.from('fee_payments').select('student_id, amount'),
        supabase.from('fee_structure').select('class, total_fee'),
      ]);

      const feeMap: Record<string, number> = {};
      (feeStructures as FeeStructure[] ?? []).forEach((f) => { feeMap[f.class] = f.total_fee; });

      const paidMap: Record<string, number> = {};
      (payData ?? []).forEach((p: { student_id: string; amount: number }) => {
        paidMap[p.student_id] = (paidMap[p.student_id] ?? 0) + (p.amount ?? 0);
      });

      const list: StudentFeeStatus[] = (students as Student[] ?? []).map((s) => {
        const total_fee = feeMap[s.class] ?? 0;
        const paid = paidMap[s.id] ?? 0;
        const balance = total_fee - paid;
        const status: StudentFeeStatus['status'] =
          total_fee === 0 ? 'unpaid'
          : paid >= total_fee ? 'paid'
          : paid > 0 ? 'partial'
          : 'unpaid';
        return { id: s.id, name: s.name, class: s.class, total_fee, paid, balance, status };
      });

      setFeeStatusList(list);
    } catch {
      toast.error('Failed to load fee status');
    }
    setLoadingStatus(false);
  }, []);

  useEffect(() => { fetchPayments(); fetchFeeStatus(); }, [fetchPayments, fetchFeeStatus]);

  /* ── Payment records filters ─────────────────────────────── */
  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filteredPayments = payments.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      (p.students?.name ?? '').toLowerCase().includes(q) ||
      p.receipt_no.toLowerCase().includes(q) ||
      (p.students?.class ?? '').toLowerCase().includes(q);
    const matchMode = modeFilter === 'all' || p.mode === modeFilter;
    return matchSearch && matchMode;
  });

  const totalCollected = filteredPayments.reduce((s, p) => s + (p.amount ?? 0), 0);

  /* ── Fee status filters ──────────────────────────────────── */
  const filteredStatus = feeStatusList.filter((s) => {
    const q = statusSearch.toLowerCase();
    const matchSearch = !statusSearch || s.name.toLowerCase().includes(q);
    const matchClass = statusClassFilter === 'all' || s.class === statusClassFilter;
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchClass && matchStatus;
  });

  const paidCount = feeStatusList.filter((s) => s.status === 'paid').length;
  const partialCount = feeStatusList.filter((s) => s.status === 'partial').length;
  const unpaidCount = feeStatusList.filter((s) => s.status === 'unpaid').length;
  const totalCollectedAll = feeStatusList.reduce((s, x) => s + x.paid, 0);
  const totalPending = feeStatusList.reduce((s, x) => s + Math.max(0, x.balance), 0);

  const SortBtn = ({ label, col }: { label: string; col: SortKey }) => (
    <button
      onClick={() => toggleSort(col)}
      className="flex items-center gap-1 text-gray-600 font-medium whitespace-nowrap hover:text-primary"
    >
      {label}
      <ArrowUpDown className={`w-3 h-3 ${sortKey === col ? 'text-primary' : 'text-gray-300'}`} />
    </button>
  );

  /* ── Progress bar ────────────────────────────────────────── */
  const ProgressBar = ({ paid, total }: { paid: number; total: number }) => {
    const pct = total > 0 ? Math.min(100, (paid / total) * 100) : 0;
    const color = pct >= 100 ? 'bg-green-500' : pct > 0 ? 'bg-amber-400' : 'bg-red-300';
    return (
      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900 flex items-center gap-2">
            <IndianRupee className="w-7 h-7 text-primary" /> Fee Payments
          </h1>
          <p className="text-gray-500 mt-1">
            {feeStatusList.length} students · ₹{totalCollectedAll.toLocaleString('en-IN')} collected
            {role === 'admin' && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                Managed by Clerk
              </span>
            )}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { fetchPayments(); fetchFeeStatus(); }}>
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {([
          { key: 'status' as Tab, label: 'Fee Status', icon: Users },
          { key: 'records' as Tab, label: 'Payment Records', icon: LayoutList },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === key
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ═══════════════ TAB: FEE STATUS ═══════════════════════ */}
      {activeTab === 'status' && (
        <>
          {/* Summary stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: 'Fully Paid', value: paidCount, color: 'text-green-700',
                bg: 'bg-green-50 border-green-200', icon: CheckCircle2, iconColor: 'text-green-500',
                onClick: () => setStatusFilter(statusFilter === 'paid' ? 'all' : 'paid'),
                active: statusFilter === 'paid',
              },
              {
                label: 'Partial', value: partialCount, color: 'text-amber-700',
                bg: 'bg-amber-50 border-amber-200', icon: AlertCircle, iconColor: 'text-amber-400',
                onClick: () => setStatusFilter(statusFilter === 'partial' ? 'all' : 'partial'),
                active: statusFilter === 'partial',
              },
              {
                label: 'Unpaid', value: unpaidCount, color: 'text-red-700',
                bg: 'bg-red-50 border-red-200', icon: XCircle, iconColor: 'text-red-400',
                onClick: () => setStatusFilter(statusFilter === 'unpaid' ? 'all' : 'unpaid'),
                active: statusFilter === 'unpaid',
              },
              {
                label: 'Pending (₹)', value: `₹${totalPending.toLocaleString('en-IN')}`, color: 'text-gray-800',
                bg: 'bg-gray-50 border-gray-200', icon: IndianRupee, iconColor: 'text-gray-400',
                onClick: () => {}, active: false,
              },
            ].map((s) => (
              <button
                key={s.label}
                onClick={s.onClick}
                className={`rounded-xl border p-4 text-left transition-all hover:shadow-md ${s.bg} ${
                  s.active ? 'ring-2 ring-primary ring-offset-1' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <s.icon className={`w-4 h-4 ${s.iconColor}`} />
                  {s.active && <span className="text-xs text-primary font-bold">• filtered</span>}
                </div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </button>
            ))}
          </div>

          {/* Filters row */}
          <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-gray-200">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by student name…"
                value={statusSearch}
                onChange={(e) => setStatusSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={statusClassFilter}
              onChange={(e) => setStatusClassFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Classes</option>
              {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {(statusFilter !== 'all' || statusClassFilter !== 'all' || statusSearch) && (
              <button
                onClick={() => { setStatusFilter('all'); setStatusClassFilter('all'); setStatusSearch(''); }}
                className="px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-500 hover:bg-gray-50 whitespace-nowrap"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Status table */}
          {loadingStatus ? (
            <div className="text-center py-16 text-gray-500">Loading fee status…</div>
          ) : filteredStatus.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No students match the filters.</div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      {['Student', 'Class', 'Total Fee', 'Paid', 'Balance', 'Progress', 'Status'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-gray-600 font-medium whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredStatus.map((s) => (
                      <tr key={s.id} className={`hover:bg-gray-50 transition-colors ${
                        s.status === 'unpaid' ? 'bg-red-50/30' : s.status === 'partial' ? 'bg-amber-50/20' : ''
                      }`}>
                        <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                        <td className="px-4 py-3">
                          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                            {s.class}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {s.total_fee > 0 ? `₹${s.total_fee.toLocaleString('en-IN')}` : <span className="text-gray-300 italic text-xs">No structure</span>}
                        </td>
                        <td className="px-4 py-3 font-semibold text-green-700">
                          {s.paid > 0 ? `₹${s.paid.toLocaleString('en-IN')}` : <span className="text-gray-300">₹0</span>}
                        </td>
                        <td className={`px-4 py-3 font-semibold ${s.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {s.balance > 0
                            ? `₹${s.balance.toLocaleString('en-IN')}`
                            : s.balance < 0
                            ? <span className="text-blue-600">+₹{Math.abs(s.balance).toLocaleString('en-IN')}</span>
                            : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <ProgressBar paid={s.paid} total={s.total_fee} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={s.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t bg-gray-50 text-xs text-gray-400 flex flex-wrap justify-between gap-2">
                <span>Showing {filteredStatus.length} of {feeStatusList.length} students</span>
                <span className="font-semibold text-gray-600">
                  Collected: ₹{filteredStatus.reduce((s, x) => s + x.paid, 0).toLocaleString('en-IN')} &nbsp;|&nbsp;
                  Pending: ₹{filteredStatus.reduce((s, x) => s + Math.max(0, x.balance), 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}
        </>
      )}

      {/* ═══════════════ TAB: PAYMENT RECORDS ══════════════════ */}
      {activeTab === 'records' && (
        <>
          {/* Summary by mode */}
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
              <Input
                placeholder="Search by student, class or receipt..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
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
          {loadingPayments ? (
            <div className="text-center py-16 text-gray-500">Loading...</div>
          ) : filteredPayments.length === 0 ? (
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
                    {filteredPayments.map((p) => (
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
                <span>Showing {filteredPayments.length} of {payments.length} payments</span>
                <span className="font-semibold text-gray-600">Total: ₹{totalCollected.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
