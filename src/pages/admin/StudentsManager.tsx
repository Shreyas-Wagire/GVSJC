import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, RefreshCw, Users, ArrowUpDown } from 'lucide-react';

const CLASSES = ['LKG', 'UKG', ...Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`)];

interface Student {
  id: string;
  student_id: string;
  name: string;
  class: string;
  roll_no: string;
  parent_name: string;
  parent_phone: string;
  email: string;
  dob: string;
  date_of_admission: string;
}

type SortKey = 'name' | 'class' | 'date_of_admission';
type SortDir = 'asc' | 'desc';

export default function StudentsManager() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('students')
      .select('id, student_id, name, class, roll_no, parent_name, parent_phone, email, dob, date_of_admission')
      .order(sortKey, { ascending: sortDir === 'asc' });
    if (error) toast.error('Failed to load students');
    else setStudents(data ?? []);
    setLoading(false);
  }, [sortKey, sortDir]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      s.name.toLowerCase().includes(q) ||
      s.student_id.toLowerCase().includes(q) ||
      (s.parent_name ?? '').toLowerCase().includes(q) ||
      (s.parent_phone ?? '').includes(q);
    const matchClass = classFilter === 'all' || s.class === classFilter;
    return matchSearch && matchClass;
  });

  const SortBtn = ({ label, col }: { label: string; col: SortKey }) => (
    <button
      onClick={() => toggleSort(col)}
      className="flex items-center gap-1 text-left text-gray-600 font-medium whitespace-nowrap hover:text-primary transition-colors"
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
          <h1 className="text-3xl font-bold font-display text-gray-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-primary" /> Students
          </h1>
          <p className="text-gray-500 mt-1">{students.length} enrolled · managed by Clerk</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">Read-only view</span>
          <Button variant="outline" size="sm" onClick={fetchStudents}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name, ID, parent or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {CLASSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CLASSES.slice(0, 4).map((cls) => {
          const count = students.filter((s) => s.class === cls).length;
          return (
            <div key={cls} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-xs text-gray-500 mt-0.5">{cls}</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No students found.</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3"><SortBtn label="Name" col="name" /></th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">ID</th>
                  <th className="text-left px-4 py-3"><SortBtn label="Class" col="class" /></th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Roll No</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Parent</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Phone</th>
                  <th className="text-left px-4 py-3"><SortBtn label="Admission" col="date_of_admission" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{s.student_id}</td>
                    <td className="px-4 py-3">
                      <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                        {s.class}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{s.roll_no || '—'}</td>
                    <td className="px-4 py-3">{s.parent_name || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{s.parent_phone || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {s.date_of_admission ? new Date(s.date_of_admission).toLocaleDateString('en-IN') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t bg-gray-50 text-xs text-gray-400">
            Showing {filtered.length} of {students.length} students
          </div>
        </div>
      )}
    </div>
  );
}
