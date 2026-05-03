/**
 * Shared Queries/Contacts Manager — same `contacts` table.
 * Used by Admin (/admin/queries) and Clerk (/clerk/queries).
 */
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Search, RefreshCw, Mail, Phone, ArrowUpDown } from 'lucide-react';

type Status = 'unread' | 'read' | 'replied';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: Status;
  created_at: string;
}

const STATUS_COLORS: Record<Status, string> = {
  unread:  'bg-amber-100 text-amber-700',
  read:    'bg-blue-100 text-blue-700',
  replied: 'bg-green-100 text-green-700',
};

export default function SharedQueriesManager({ role = 'admin' }: { role?: 'admin' | 'clerk' }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: sortDir === 'asc' });
    if (error) toast.error('Failed to load queries');
    else setContacts(data ?? []);
    setLoading(false);
  }, [sortDir]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const updateStatus = async (id: string, status: Status) => {
    const { error } = await supabase.from('contacts').update({ status }).eq('id', id);
    if (error) toast.error('Failed to update');
    else {
      toast.success(`Marked as "${status}"`);
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    }
  };

  const deleteContact = async (id: string, name: string) => {
    if (!confirm(`Delete query from "${name}"?`)) return;
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else { toast.success('Deleted'); fetchContacts(); }
  };

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.message.toLowerCase().includes(q) ||
      (c.phone ?? '').includes(q);
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const unreadCount = contacts.filter((c) => c.status === 'unread').length;

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Site Queries</h1>
          <p className="text-gray-500 mt-1">
            {contacts.length} total · {unreadCount} unread
            {role === 'clerk' && (
              <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                From /contact form — shared with Admin
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}>
            <ArrowUpDown className="w-4 h-4 mr-2" /> {sortDir === 'desc' ? 'Newest first' : 'Oldest first'}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchContacts}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {(['unread', 'read', 'replied'] as Status[]).map((s) => {
          const count = contacts.filter((c) => c.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}
              className={`bg-white rounded-xl border p-4 text-center transition-all hover:shadow-md ${filterStatus === s ? 'border-primary ring-1 ring-primary' : 'border-gray-200'}`}
            >
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className={`text-xs font-semibold mt-0.5 px-2 py-0.5 rounded-full inline-block ${STATUS_COLORS[s]}`}>{s}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search by name, email, phone or message..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="replied">Replied</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No queries found.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div key={c.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${c.status === 'unread' ? 'border-amber-200' : 'border-gray-200'}`}>
              <div className="p-4 flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 text-sm">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{c.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[c.status]}`}>{c.status}</span>
                    <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {c.email}</span>
                    {c.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {c.phone}</span>}
                  </div>
                  <p className={`text-sm text-gray-700 ${expanded === c.id ? '' : 'line-clamp-2'} cursor-pointer`} onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                    {c.message}
                  </p>
                  {c.message.length > 120 && (
                    <button onClick={() => setExpanded(expanded === c.id ? null : c.id)} className="text-xs text-primary mt-1 hover:underline">
                      {expanded === c.id ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <select value={c.status} onChange={(e) => updateStatus(c.id, e.target.value as Status)} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 cursor-pointer bg-white">
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                  <button onClick={() => deleteContact(c.id, c.name)} className="p-1.5 text-red-500 hover:bg-red-50 rounded self-start" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
