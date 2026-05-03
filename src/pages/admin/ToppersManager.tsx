import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Trophy, X, Check } from 'lucide-react';

interface Topper {
  id: string;
  name: string;
  class_label: string;
  rank: number;
  percentage: string | null;
  photo_url: string | null;
  academic_year: string;
}

const CLASSES = ['1st Std','2nd Std','3rd Std','4th Std','5th Std','6th Std','7th Std','8th Std','9th Std','10th Std','11th (HSC)','12th (HSC)'];
const EMPTY = { name: '', class_label: '1st Std', rank: 1, percentage: '', photo_url: '', academic_year: '2025-26' };

export default function ToppersManager() {
  const [toppers, setToppers] = useState<Topper[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchToppers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('toppers').select('*').order('class_label').order('rank');
    if (error) toast.error('Failed to load toppers');
    else setToppers(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchToppers(); }, [fetchToppers]);

  const openAdd = () => { setEditId(null); setForm({ ...EMPTY }); setShowForm(true); };
  const openEdit = (t: Topper) => {
    setEditId(t.id);
    setForm({ name: t.name, class_label: t.class_label, rank: t.rank, percentage: t.percentage ?? '', photo_url: t.photo_url ?? '', academic_year: t.academic_year });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    const payload = { ...form, percentage: form.percentage || null, photo_url: form.photo_url || null, updated_at: new Date().toISOString() };
    const { error } = editId
      ? await supabase.from('toppers').update(payload).eq('id', editId)
      : await supabase.from('toppers').insert([payload]);
    if (error) toast.error(error.message);
    else { toast.success(editId ? 'Updated!' : 'Added!'); setShowForm(false); fetchToppers(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('toppers').delete().eq('id', id);
    if (error) toast.error('Delete failed'); else { toast.success('Removed'); fetchToppers(); }
    setDeleteId(null);
  };

  const years = [...new Set(toppers.map((t) => t.academic_year))].sort().reverse();
  const filtered = toppers.filter((t) =>
    (!search || t.name.toLowerCase().includes(search.toLowerCase()) || t.class_label.toLowerCase().includes(search.toLowerCase())) &&
    (!yearFilter || t.academic_year === yearFilter)
  );

  const cls = 'mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500';
  const rankColor = (r: number) => r === 1 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Toppers Manager</h1>
          <p className="text-gray-500 mt-1">Manage academic toppers shown on the public Hall of Fame page.</p>
        </div>
        <Button onClick={openAdd} className="bg-emerald-600 hover:bg-emerald-700 w-fit">
          <Plus className="w-4 h-4 mr-2" /> Add Topper
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-3">
        <Input placeholder="Search by name or class…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className={cls + ' max-w-[160px]'}>
          <option value="">All Years</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl border-2 border-emerald-200 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{editId ? 'Edit' : 'Add'} Topper</h2>
            <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <Label className="text-sm font-medium text-gray-700">Student Name *</Label>
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={cls} placeholder="Aarav Patil" />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Class</Label>
              <select value={form.class_label} onChange={(e) => setForm((p) => ({ ...p, class_label: e.target.value }))} className={cls}>
                {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Rank</Label>
              <select value={form.rank} onChange={(e) => setForm((p) => ({ ...p, rank: Number(e.target.value) }))} className={cls}>
                <option value={1}>1st (Gold)</option>
                <option value={2}>2nd (Silver)</option>
                <option value={3}>3rd (Bronze)</option>
              </select>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Percentage</Label>
              <input value={form.percentage} onChange={(e) => setForm((p) => ({ ...p, percentage: e.target.value }))} className={cls} placeholder="97%" />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Academic Year</Label>
              <input value={form.academic_year} onChange={(e) => setForm((p) => ({ ...p, academic_year: e.target.value }))} className={cls} placeholder="2025-26" />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-sm font-medium text-gray-700">Photo Path (optional)</Label>
              <input value={form.photo_url} onChange={(e) => setForm((p) => ({ ...p, photo_url: e.target.value }))} className={cls} placeholder="/toppers/student.png" />
              <p className="text-xs text-gray-400 mt-1">Place the image in the <code>public/toppers/</code> folder and enter the path here.</p>
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

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Toppers', value: toppers.length },
          { label: 'Classes', value: new Set(toppers.map((t) => t.class_label)).size },
          { label: 'Academic Years', value: years.length },
          { label: 'Gold Ranks', value: toppers.filter((t) => t.rank === 1).length },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-emerald-600">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400"><Trophy className="w-10 h-10 mx-auto mb-2 opacity-40" /><p>No toppers found.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Rank', 'Name', 'Class', 'Percentage', 'Year', 'Actions'].map((h) => (
                    <th key={h} className={`px-4 py-3 font-semibold text-gray-600 ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${rankColor(t.rank)}`}>
                        {t.rank === 1 ? '🥇 1st' : t.rank === 2 ? '🥈 2nd' : '🥉 3rd'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{t.name}</td>
                    <td className="px-4 py-3 text-gray-600">{t.class_label}</td>
                    <td className="px-4 py-3">
                      {t.percentage ? (
                        <span className="font-semibold text-emerald-600">{t.percentage}</span>
                      ) : <span className="text-gray-300 italic">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{t.academic_year}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(t)} className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50"><Pencil className="w-4 h-4" /></button>
                        {deleteId === t.id ? (
                          <span className="flex items-center gap-1 text-xs">
                            <button onClick={() => handleDelete(t.id)} className="text-red-600 font-semibold hover:underline">Confirm</button>
                            <button onClick={() => setDeleteId(null)} className="text-gray-400 hover:underline">Cancel</button>
                          </span>
                        ) : (
                          <button onClick={() => setDeleteId(t.id)} className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
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
    </div>
  );
}
