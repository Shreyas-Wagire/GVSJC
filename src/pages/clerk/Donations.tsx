import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Printer, Plus, X } from 'lucide-react';

interface Donation {
  id: string;
  receipt_no: string;
  date: string;
  donor_name: string;
  amount: number;
  mode: string;
  purpose: string;
}

export default function Donations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    donor_name: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    mode: 'cash',
    purpose: '',
  });

  const fetchDonations = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('date', { ascending: false });
    if (error) toast.error('Failed to load donations');
    else setDonations(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchDonations(); }, [fetchDonations]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const receiptNo = `DON-${Date.now()}`;
    const { error } = await supabase.from('donations').insert([{
      ...formData,
      amount: parseFloat(formData.amount),
      receipt_no: receiptNo,
    }]);
    if (error) toast.error('Failed to record donation: ' + error.message);
    else {
      toast.success('Donation recorded!');
      setShowForm(false);
      setFormData({ donor_name: '', amount: '', date: new Date().toISOString().slice(0, 10), mode: 'cash', purpose: '' });
      fetchDonations();
    }
  };

  const printReceipt = (d: Donation) => {
    const html = `<html><head><title>Donation Receipt</title><style>body{font-family:monospace;display:flex;justify-content:center;padding:20px} .card{width:300px;border:1px dashed #000;padding:20px} h2,p{margin:4px 0;text-align:center}</style></head><body><div class="card"><h2>Gurukul Vidyalay S. J. C.</h2><p>Donation Receipt</p><hr/><p><b>Receipt No:</b> ${d.receipt_no}</p><p><b>Date:</b> ${d.date}</p><p><b>Donor:</b> ${d.donor_name}</p><p><b>Amount:</b> ₹${d.amount}</p><p><b>Mode:</b> ${d.mode}</p><p><b>Purpose:</b> ${d.purpose || 'Not specified'}</p><hr/><p style="text-align:right">Authorised Signatory</p></div></body></html>`;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.print();
  };

  const labelClass = "text-sm font-medium text-gray-700";
  const selectClass = "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Donations</h1>
          <p className="text-gray-500 mt-1">Record and manage school donations.</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" /> Record Donation
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" /></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Receipt No', 'Date', 'Donor', 'Amount', 'Mode', 'Purpose', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-gray-600 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{d.receipt_no}</td>
                    <td className="px-4 py-3">{d.date}</td>
                    <td className="px-4 py-3 font-medium">{d.donor_name}</td>
                    <td className="px-4 py-3 text-green-700 font-semibold">₹{d.amount?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 capitalize">{d.mode}</td>
                    <td className="px-4 py-3 text-gray-500">{d.purpose || '—'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => printReceipt(d)} title="Print Receipt" className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {donations.length === 0 && <div className="text-center py-12 text-gray-500">No donations recorded yet.</div>}
          </div>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Record Donation</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><Label className={labelClass}>Donor Name *</Label><Input value={formData.donor_name} onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })} required className="mt-1" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className={labelClass}>Amount (₹) *</Label><Input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} min="1" required className="mt-1" /></div>
                <div><Label className={labelClass}>Date *</Label><Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required className="mt-1" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={labelClass}>Mode</Label>
                  <select value={formData.mode} onChange={(e) => setFormData({ ...formData, mode: e.target.value })} className={selectClass}>
                    <option value="cash">Cash</option>
                    <option value="cheque">Cheque</option>
                    <option value="online">Online Transfer</option>
                    <option value="dd">Demand Draft</option>
                  </select>
                </div>
                <div><Label className={labelClass}>Purpose</Label><Input value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} placeholder="e.g. Infrastructure Fund" className="mt-1" /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Save Donation</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
