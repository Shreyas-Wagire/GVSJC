/**
 * Shared Feedback Manager — same `feedback` table.
 * Used by Admin (/admin/feedback) and Clerk (/clerk/feedback).
 */
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Search, RefreshCw, Star } from 'lucide-react';

type Category = 'general' | 'academics' | 'facilities' | 'staff';

interface Feedback {
  id: string;
  name: string | null;
  email: string | null;
  rating: number | null;
  comment: string;
  category: Category;
  created_at: string;
}

const CATEGORY_COLORS: Record<Category, string> = {
  general:    'bg-gray-100 text-gray-700',
  academics:  'bg-blue-100 text-blue-700',
  facilities: 'bg-purple-100 text-purple-700',
  staff:      'bg-green-100 text-green-700',
};

function StarRating({ rating }: { rating: number | null }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} className={`w-3.5 h-3.5 ${s <= (rating ?? 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
      ))}
    </div>
  );
}

export default function SharedFeedbackManager({ role = 'admin' }: { role?: 'admin' | 'clerk' }) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterRating, setFilterRating] = useState<string>('all');

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('feedback').select('*').order('created_at', { ascending: false });
    if (error) toast.error('Failed to load feedback');
    else setFeedbacks(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchFeedback(); }, [fetchFeedback]);

  const deleteFeedback = async (id: string) => {
    if (!confirm('Delete this feedback?')) return;
    const { error } = await supabase.from('feedback').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else { toast.success('Feedback deleted'); fetchFeedback(); }
  };

  const filtered = feedbacks.filter((f) => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      (f.name ?? '').toLowerCase().includes(q) ||
      f.comment.toLowerCase().includes(q) ||
      (f.email ?? '').toLowerCase().includes(q);
    const matchCategory = filterCategory === 'all' || f.category === filterCategory;
    const matchRating = filterRating === 'all' || String(f.rating) === filterRating;
    return matchSearch && matchCategory && matchRating;
  });

  const avgRating = feedbacks.filter((f) => f.rating != null).length > 0
    ? (feedbacks.reduce((s, f) => s + (f.rating ?? 0), 0) / feedbacks.filter((f) => f.rating != null).length).toFixed(1)
    : 'N/A';

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Feedback</h1>
          <p className="text-gray-500 mt-1">
            {feedbacks.length} total · Avg rating: <strong>{avgRating}</strong> / 5
            {role === 'clerk' && (
              <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                From public form — shared with Admin
              </span>
            )}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchFeedback}>
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Category summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['general', 'academics', 'facilities', 'staff'] as Category[]).map((cat) => {
          const count = feedbacks.filter((f) => f.category === cat).length;
          return (
            <button key={cat} onClick={() => setFilterCategory(filterCategory === cat ? 'all' : cat)}
              className={`bg-white rounded-xl border p-4 text-center transition-all hover:shadow-md ${filterCategory === cat ? 'border-primary ring-1 ring-primary' : 'border-gray-200'}`}>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className={`text-xs font-semibold mt-0.5 px-2 py-0.5 rounded-full inline-block ${CATEGORY_COLORS[cat]}`}>{cat}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search by name, email or comment..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="academics">Academics</SelectItem>
            <SelectItem value="facilities">Facilities</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterRating} onValueChange={setFilterRating}>
          <SelectTrigger className="w-32"><SelectValue placeholder="Rating" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">⭐⭐⭐⭐⭐ 5</SelectItem>
            <SelectItem value="4">⭐⭐⭐⭐ 4</SelectItem>
            <SelectItem value="3">⭐⭐⭐ 3</SelectItem>
            <SelectItem value="2">⭐⭐ 2</SelectItem>
            <SelectItem value="1">⭐ 1</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No feedback found.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((f) => (
            <div key={f.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3 relative group">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-900">{f.name ?? 'Anonymous'}</p>
                  {f.email && <p className="text-xs text-gray-400">{f.email}</p>}
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${CATEGORY_COLORS[f.category]}`}>{f.category}</span>
              </div>
              <StarRating rating={f.rating} />
              <p className="text-sm text-gray-700 leading-relaxed">"{f.comment}"</p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-gray-400">{new Date(f.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                <button onClick={() => deleteFeedback(f.id)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
