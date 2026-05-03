import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Users, X, Check } from 'lucide-react';

interface Faculty {
  id: string;
  name: string;
  role: string | null;
  qual: string | null;
  exp: string | null;
  initials: string | null;
  color: string | null;
  display_order: number;
}

const COLORS = [
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-violet-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-teal-500 to-cyan-600',
  'from-green-500 to-emerald-600',
  'from-red-500 to-rose-600',
  'from-sky-500 to-blue-600',
];

const EMPTY = { name: '', role: '', qual: '', exp: '', initials: '', color: COLORS[0], display_order: 99 };

export default function FacultyManager() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchFaculty = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('faculty').select('*').order('display_order');
    if (error) toast.error('Failed to load faculty');
    else setFaculty(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchFaculty(); }, [fetchFaculty]);

  const openAdd = () => { setEditId(null); setForm({ ...EMPTY }); setShowForm(true); };
  const openEdit = (f: Faculty) => {
    setEditId(f.id);
    setForm({ name: f.name, role: f.role ?? '', qual: f.qual ?? '', exp: f.exp ?? '', initials: f.initials ?? '', color: f.color ?? COLORS[0], display_order: f.display_order });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    const payload = { ...form, initials: form.initials || form.name.slice(0, 2).toUpperCase(), updated_at: new Date().toISOString() };
    const { error } = editId
      ? await supabase.from('faculty').update(payload).eq('id', editId)
      : await supabase.from('faculty').insert([payload]);
    if (error) toast.error(error.message);
    else { toast.success(editId ? 'Updated!' : 'Added!'); setShowForm(false); fetchFaculty(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('faculty').delete().eq('id', id);
    if (error) toast.error('Delete failed'); else { toast.success('Removed'); fetchFaculty(); }
    setDeleteId(null);
  };

  const filtered = faculty.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    (f.role ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const cls = 'mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Faculty Manager</h1>
          <p className="text-gray-500 mt-1">Manage faculty members shown on the public website.</p>
        </div>
        <Button onClick={openAdd} className="bg-emerald-600 hover:bg-emerald-700 w-fit">
          <Plus className="w-4 h-4 mr-2" /> Add Faculty
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <Input placeholder="Search by name or role…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border-2 border-emerald-200 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{editId ? 'Edit' : 'Add'} Faculty</h2>
            <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <Label className="text-sm font-medium text-gray-700">Full Name *</Label>
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={cls} placeholder="Hon. Shri. Pravin Mali" />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Initials</Label>
              <input value={form.initials} onChange={(e) => setForm((p) => ({ ...p, initials: e.target.value.slice(0, 2).toUpperCase() }))} className={cls} placeholder="PM" maxLength={2} />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Role / Designation</Label>
              <input value={form.role ?? ''} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} className={cls} placeholder="Principal" />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Qualifications</Label>
              <input value={form.qual ?? ''} onChange={(e) => setForm((p) => ({ ...p, qual: e.target.value }))} className={cls} placeholder="M.Ed., B.Ed." />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Experience</Label>
              <input value={form.exp ?? ''} onChange={(e) => setForm((p) => ({ ...p, exp: e.target.value }))} className={cls} placeholder="12 years" />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Display Order</Label>
              <input type="number" value={form.display_order} onChange={(e) => setForm((p) => ({ ...p, display_order: Number(e.target.value) }))} className={cls} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-sm font-medium text-gray-700">Card Color</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => setForm((p) => ({ ...p, color: c }))}
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c} border-2 transition-all ${form.color === c ? 'border-gray-900 scale-110 shadow-md' : 'border-transparent'}`} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
              <Check className="w-4 h-4 mr-2" /> {saving ? 'Saving…' : 'Save'}
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400"><Users className="w-10 h-10 mx-auto mb-2 opacity-40" /><p>No faculty found.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['#', 'Name', 'Role', 'Qualification', 'Experience', 'Color', 'Actions'].map((h) => (
                    <th key={h} className={`px-4 py-3 font-semibold text-gray-600 ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((f, i) => (
                  <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-xs">{f.display_order}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${f.color ?? COLORS[i % COLORS.length]} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                          {f.initials ?? f.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{f.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{f.role ?? <span className="italic text-gray-300">—</span>}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate">{f.qual ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{f.exp ?? '—'}</td>
                    <td className="px-4 py-3"><div className={`w-8 h-5 rounded bg-gradient-to-r ${f.color ?? COLORS[0]}`} /></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(f)} className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50"><Pencil className="w-4 h-4" /></button>
                        {deleteId === f.id ? (
                          <span className="flex items-center gap-1 text-xs">
                            <button onClick={() => handleDelete(f.id)} className="text-red-600 font-semibold hover:underline">Confirm</button>
                            <button onClick={() => setDeleteId(null)} className="text-gray-400 hover:underline">Cancel</button>
                          </span>
                        ) : (
                          <button onClick={() => setDeleteId(f.id)} className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-400">Total: {faculty.length} members</p>
    </div>
  );
}
