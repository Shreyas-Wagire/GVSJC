/**
 * Shared Donations Manager — same `donations` table.
 * Admin: read-only overview. Clerk: full CRUD (own Donations.tsx kept for data entry).
 */
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, RefreshCw, HeartHandshake, ArrowUpDown, Trash2 } from 'lucide-react';

interface Donation {
  id: string;
  receipt_no: string;
  date: string;
  donor_name: string;
  amount: number;
  mode: string;
  purpose: string;
}

type SortKey = 'date' | 'amount' | 'donor_name';

export default function SharedDonationsManager({ role = 'admin' }: { role?: 'admin' | 'clerk' }) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const fetchDonations = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order(sortKey, { ascending: sortDir === 'asc' });
    if (error) toast.error('Failed to load donations');
    else setDonations(data ?? []);
    setLoading(false);
  }, [sortKey, sortDir]);

  useEffect(() => { fetchDonations(); }, [fetchDonations]);

  const deleteDonation = async (id: string, name: string) => {
    if (!confirm(`Delete donation from "${name}"?`)) return;
    const { error } = await supabase.from('donations').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else { toast.success('Donation record deleted'); fetchDonations(); }
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filtered = donations.filter((d) => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      d.donor_name.toLowerCase().includes(q) ||
      d.receipt_no.toLowerCase().includes(q) ||
      (d.purpose ?? '').toLowerCase().includes(q);
    const matchMode = modeFilter === 'all' || d.mode === modeFilter;
    return matchSearch && matchMode;
  });

  const total = filtered.reduce((s, d) => s + (d.amount ?? 0), 0);

  const SortBtn = ({ label, col }: { label: string; col: SortKey }) => (
    <button onClick={() => toggleSort(col)} className="flex items-center gap-1 text-gray-600 font-medium whitespace-nowrap hover:text-primary">
      {label}
      <ArrowUpDown className={`w-3 h-3 ${sortKey === col ? 'text-primary' : 'text-gray-300'}`} />
    </button>
  );

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900 flex items-center gap-2">
            <HeartHandshake className="w-7 h-7 text-rose-500" /> Donations
          </h1>
          <p className="text-gray-500 mt-1">
            {donations.length} records · Total: ₹{donations.reduce((s, d) => s + d.amount, 0).toLocaleString('en-IN')}
            {role === 'admin' && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                Recorded by Clerk
              </span>
            )}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchDonations}>
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Summary cards — mode breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {['cash', 'upi', 'cheque', 'online'].map((mode) => {
          const modeTotal = donations.filter((d) => d.mode === mode).reduce((s, d) => s + d.amount, 0);
          const count = donations.filter((d) => d.mode === mode).length;
          return (
            <button key={mode} onClick={() => setModeFilter(modeFilter === mode ? 'all' : mode)}
              className={`bg-white rounded-xl border p-4 text-center transition-all hover:shadow-md ${modeFilter === mode ? 'border-rose-400 ring-1 ring-rose-400' : 'border-gray-200'}`}>
              <p className="text-lg font-bold text-gray-900">₹{modeTotal.toLocaleString('en-IN')}</p>
              <p className="text-xs text-gray-500 capitalize">{mode} ({count})</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search by donor, receipt or purpose..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={modeFilter} onValueChange={setModeFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Mode" /></SelectTrigger>
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
        <div className="text-center py-16 text-gray-400">No donations found.</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3"><SortBtn label="Date" col="date" /></th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Receipt</th>
                  <th className="text-left px-4 py-3"><SortBtn label="Donor" col="donor_name" /></th>
                  <th className="text-left px-4 py-3">Purpose</th>
                  <th className="text-left px-4 py-3"><SortBtn label="Amount" col="amount" /></th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Mode</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{new Date(d.date).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{d.receipt_no}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{d.donor_name}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs max-w-xs">{d.purpose || '—'}</td>
                    <td className="px-4 py-3 font-semibold text-rose-600">₹{d.amount?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full capitalize">{d.mode}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteDonation(d.id, d.donor_name)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t bg-gray-50 text-xs text-gray-400 flex justify-between">
            <span>Showing {filtered.length} of {donations.length}</span>
            <span className="font-semibold text-gray-600">Total: ₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
