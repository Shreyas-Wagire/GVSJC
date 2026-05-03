/**
 * Shared Admissions Manager — used by BOTH Admin (/admin/admissions)
 * and Clerk (/clerk/admissions-review).
 * Reads & writes to the same `admissions` table in Supabase.
 */
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Search, RefreshCw, ArrowUpDown } from 'lucide-react';

type Status = 'pending' | 'reviewed' | 'accepted' | 'rejected';

interface Admission {
  id: string;
  student_name: string;
  parent_name: string;
  email: string;
  phone: string;
  grade: string;
  message: string | null;
  status: Status;
  created_at: string;
}

const STATUS_COLORS: Record<Status, string> = {
  pending:  'bg-amber-100 text-amber-700',
  reviewed: 'bg-blue-100 text-blue-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

type SortKey = 'created_at' | 'student_name' | 'grade';

interface Props {
  /** 'admin' shows full panel title; 'clerk' shows a note that these are website inquiries */
  role?: 'admin' | 'clerk';
}

export default function SharedAdmissionsManager({ role = 'admin' }: Props) {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const fetchAdmissions = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('admissions')
      .select('*')
      .order(sortKey, { ascending: sortDir === 'asc' });
    if (error) toast.error('Failed to load admissions');
    else setAdmissions(data ?? []);
    setLoading(false);
  }, [sortKey, sortDir]);

  useEffect(() => { fetchAdmissions(); }, [fetchAdmissions]);

  const updateStatus = async (id: string, status: Status) => {
    const { error } = await supabase.from('admissions').update({ status }).eq('id', id);
    if (error) toast.error('Failed to update status');
    else {
      toast.success(`Status → "${status}"`);
      setAdmissions((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    }
  };

  const deleteAdmission = async (id: string, name: string) => {
    if (!confirm(`Delete admission for "${name}"?`)) return;
    const { error } = await supabase.from('admissions').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else { toast.success('Deleted'); fetchAdmissions(); }
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filtered = admissions.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      a.student_name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      (a.parent_name ?? '').toLowerCase().includes(q) ||
      a.grade.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const pending   = admissions.filter((a) => a.status === 'pending').length;
  const accepted  = admissions.filter((a) => a.status === 'accepted').length;
  const rejected  = admissions.filter((a) => a.status === 'rejected').length;

  const SortBtn = ({ label, col }: { label: string; col: SortKey }) => (
    <button
      onClick={() => toggleSort(col)}
      className="flex items-center gap-1 text-left text-gray-600 font-medium whitespace-nowrap hover:text-primary"
    >
      {label}
      <ArrowUpDown className={`w-3 h-3 ${sortKey === col ? 'text-primary' : 'text-gray-300'}`} />
    </button>
  );

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Admission Applications</h1>
          <p className="text-gray-500 mt-1">
            {admissions.length} total · {pending} pending · {accepted} accepted · {rejected} rejected
            {role === 'clerk' && (
              <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                Website enquiries — shared with Admin
              </span>
            )}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAdmissions}>
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['pending', 'reviewed', 'accepted', 'rejected'] as Status[]).map((s) => {
          const count = admissions.filter((a) => a.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}
              className={`bg-white rounded-xl border p-4 text-center transition-all hover:shadow-md ${
                filterStatus === s ? 'border-primary ring-1 ring-primary' : 'border-gray-200'
              }`}
            >
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className={`text-xs font-semibold mt-0.5 px-2 py-0.5 rounded-full inline-block ${STATUS_COLORS[s]}`}>
                {s}
              </p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, parent or grade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No admissions found.</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3"><SortBtn label="Date" col="created_at" /></th>
                  <th className="text-left px-4 py-3"><SortBtn label="Student" col="student_name" /></th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium whitespace-nowrap">Parent</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Contact</th>
                  <th className="text-left px-4 py-3"><SortBtn label="Grade" col="grade" /></th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Message</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">
                      {new Date(a.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3 font-medium">{a.student_name}</td>
                    <td className="px-4 py-3 text-gray-600">{a.parent_name}</td>
                    <td className="px-4 py-3">
                      <div>{a.phone}</div>
                      <div className="text-xs text-gray-400">{a.email}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                        {a.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={a.status}
                        onChange={(e) => updateStatus(a.id, e.target.value as Status)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLORS[a.status]}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-gray-500 text-xs line-clamp-2">{a.message || '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteAdmission(a.id, a.student_name)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t bg-gray-50 text-xs text-gray-400">
            Showing {filtered.length} of {admissions.length} applications
          </div>
        </div>
      )}
    </div>
  );
}
