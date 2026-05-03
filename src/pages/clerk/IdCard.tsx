import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Printer, Search, ArrowUpDown } from 'lucide-react';

const CLASSES = ['LKG', 'UKG', ...Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`)];

const GRADIENTS = [
  { label: 'Ocean Blue',   value: 'linear-gradient(135deg,#1e3a8a,#0ea5e9)' },
  { label: 'Emerald',      value: 'linear-gradient(135deg,#065f46,#10b981)' },
  { label: 'Royal Purple', value: 'linear-gradient(135deg,#4c1d95,#a855f7)' },
  { label: 'Sunset',       value: 'linear-gradient(135deg,#9a3412,#f97316)' },
  { label: 'Rose Gold',    value: 'linear-gradient(135deg,#881337,#fb7185)' },
  { label: 'Slate',        value: 'linear-gradient(135deg,#1e293b,#475569)' },
];

interface Student { id: string; name: string; class: string; roll_no: string; }

export default function IdCard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState('');
  const [gradient, setGradient] = useState(GRADIENTS[0].value);
  const [textColor, setTextColor] = useState('#ffffff');
  const [bodyBg, setBodyBg] = useState('#f8fafc');
  const [bodyText, setBodyText] = useState('#1e293b');
  const [academicYear, setAcademicYear] = useState('2025-26');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    supabase.from('students').select('id, name, class, roll_no').order('name')
      .then(({ data }) => setStudents(data ?? []));
  }, []);

  const filtered = students
    .filter((s) => {
      const q = search.toLowerCase();
      const matchSearch = !search || s.name.toLowerCase().includes(q) || (s.roll_no ?? '').toLowerCase().includes(q);
      const matchClass = classFilter === 'all' || s.class === classFilter;
      return matchSearch && matchClass;
    })
    .sort((a, b) => sortDir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

  const handleStudentSelect = (id: string) => {
    setSelectedStudent(id);
    setStudentData(students.find((s) => s.id === id) ?? null);
    setShowPreview(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
      setPhotoPreviewUrl(URL.createObjectURL(file));
    }
  };

  const printIdCard = () => {
    if (!studentData) { toast.error('Select a student first'); return; }
    const photoSrc = photoPreviewUrl || '';
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<html><head><title>ID Card – ${studentData.name}</title><style>
      @page { size: 85.6mm 54mm; margin: 0; }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { width: 85.6mm; height: 54mm; font-family: 'Segoe UI', Arial, sans-serif; }
      .card { width: 100%; height: 100%; display: flex; flex-direction: column; }
      .header { background: ${gradient}; padding: 8px 10px 6px; display: flex; align-items: center; gap: 8px; }
      .header img { width: 26px; height: 26px; border-radius: 50%; background: white; object-fit: contain; }
      .school-name { color: ${textColor}; font-size: 8.5px; font-weight: 700; }
      .school-sub  { color: ${textColor}cc; font-size: 6.5px; }
      .badge { color: ${textColor}; border: 1px solid ${textColor}55; padding: 2px 5px; border-radius: 3px; font-size: 7px; font-weight: 700; }
      .body { flex: 1; background: ${bodyBg}; display: flex; padding: 6px 10px; gap: 8px; align-items: center; }
      .photo { width: 38px; height: 44px; border-radius: 4px; object-fit: cover; border: 1.5px solid #ddd; background: #eee; }
      .student-name { font-size: 9px; font-weight: 700; color: ${bodyText}; margin-bottom: 3px; }
      .info-row { font-size: 7.5px; color: ${bodyText}99; margin-bottom: 1.5px; }
      .info-label { font-weight: 600; color: ${bodyText}; }
      .footer { background: ${gradient}; padding: 3px 10px; display: flex; justify-content: space-between; align-items: center; }
      .footer-left { color: ${textColor}bb; font-size: 6.5px; }
      .footer-right { color: ${textColor}; font-size: 7px; font-weight: 700; }
    </style></head><body>
    <div class="card">
      <div class="header">
        <img src="/icon.png" />
        <div style="flex:1"><div class="school-name">Gurukul Vidyalay S. J. C.</div><div class="school-sub">Chandgad, Kolhapur · Maharashtra</div></div>
        <span class="badge">STUDENT ID</span>
      </div>
      <div class="body">
        <div>${photoSrc ? `<img class="photo" src="${photoSrc}" />` : `<div class="photo" style="display:flex;align-items:center;justify-content:center;font-size:6px;color:#999;">Photo</div>`}</div>
        <div style="flex:1">
          <div class="student-name">${studentData.name}</div>
          <div class="info-row"><span class="info-label">Class:</span> ${studentData.class}</div>
          <div class="info-row"><span class="info-label">Roll No:</span> ${studentData.roll_no || '—'}</div>
          <div class="info-row"><span class="info-label">Year:</span> ${academicYear}</div>
        </div>
      </div>
      <div class="footer">
        <span class="footer-left">Gurukul Vidyalay Trust</span>
        <span class="footer-right">Valid: ${academicYear}</span>
      </div>
    </div></body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-display text-gray-900">ID Card Designer</h1>
        <p className="text-gray-500 mt-1">Generate modern gradient ID cards for students.</p>
      </div>

      {/* Design Controls */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
        <h2 className="text-lg font-semibold text-gray-800">Card Design</h2>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Header / Footer Gradient</Label>
          <div className="flex flex-wrap gap-3">
            {GRADIENTS.map((g) => (
              <button key={g.value} title={g.label} onClick={() => setGradient(g.value)}
                className={`w-16 h-9 rounded-lg border-2 transition-all ${gradient === g.value ? 'border-gray-900 scale-110 shadow-md' : 'border-transparent'}`}
                style={{ background: g.value }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-5 items-center">
          <div className="flex items-center gap-2"><Label className="text-sm font-medium text-gray-700">Header Text</Label><input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-8 w-12 cursor-pointer rounded border border-gray-300" /></div>
          <div className="flex items-center gap-2"><Label className="text-sm font-medium text-gray-700">Body BG</Label><input type="color" value={bodyBg} onChange={(e) => setBodyBg(e.target.value)} className="h-8 w-12 cursor-pointer rounded border border-gray-300" /></div>
          <div className="flex items-center gap-2"><Label className="text-sm font-medium text-gray-700">Body Text</Label><input type="color" value={bodyText} onChange={(e) => setBodyText(e.target.value)} className="h-8 w-12 cursor-pointer rounded border border-gray-300" /></div>
          <div className="flex items-center gap-2"><Label className="text-sm font-medium text-gray-700">Academic Year</Label><Input value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} className="w-28 h-8 text-sm" /></div>
        </div>
      </div>

      {/* Student Selector */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Generate ID Card</h2>

        {/* Search + Filter + Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search by name or roll no..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="rounded-md border border-gray-300 px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="all">All Classes</option>
            {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={() => setSortDir((d) => d === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 whitespace-nowrap">
            <ArrowUpDown className="w-4 h-4" /> Name {sortDir === 'asc' ? 'A→Z' : 'Z→A'}
          </button>
        </div>

        {/* Student list */}
        <div className="max-h-52 overflow-y-auto rounded-lg border border-gray-200 divide-y">
          {filtered.length === 0 ? (
            <p className="text-center py-6 text-gray-400 text-sm">No students found</p>
          ) : filtered.map((s) => (
            <button key={s.id} onClick={() => handleStudentSelect(s.id)}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-left ${selectedStudent === s.id ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700'}`}>
              <span>{s.name}</span>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{s.class}</span>
            </button>
          ))}
        </div>

        {/* Photo + Generate */}
        {studentData && (
          <div className="border-t pt-4 space-y-3">
            <div>
              <Label className="text-sm font-medium text-gray-700">Student Photo (optional)</Label>
              <Input type="file" accept="image/*" onChange={handlePhotoChange} className="mt-1" />
              {photoPreviewUrl && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={photoPreviewUrl} className="w-12 h-14 object-cover rounded border" />
                  <button onClick={() => { URL.revokeObjectURL(photoPreviewUrl); setPhotoPreviewUrl(''); }} className="text-xs text-red-500 hover:underline">Remove</button>
                </div>
              )}
            </div>
            <Button onClick={() => setShowPreview(true)} className="bg-emerald-600 hover:bg-emerald-700">Generate Preview</Button>
          </div>
        )}

        {/* Live card preview */}
        {showPreview && studentData && (
          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">ID Card Preview</h3>
              <Button onClick={printIdCard} variant="outline" size="sm"><Printer className="w-4 h-4 mr-2" /> Print</Button>
            </div>
            <div className="flex justify-center">
              <div className="rounded-xl overflow-hidden shadow-2xl" style={{ width: 320, fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                {/* Gradient header */}
                <div style={{ background: gradient, padding: '12px 14px 10px' }} className="flex items-center gap-3">
                  <img src="/icon.png" className="w-9 h-9 rounded-full bg-white object-contain p-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p style={{ color: textColor }} className="font-bold text-sm leading-tight">Gurukul Vidyalay S. J. C.</p>
                    <p style={{ color: textColor + 'bb' }} className="text-xs">Chandgad, Kolhapur · Maharashtra</p>
                  </div>
                  <span style={{ color: textColor, borderColor: textColor + '55' }} className="border rounded px-2 py-0.5 text-xs font-bold shrink-0">STUDENT ID</span>
                </div>
                {/* Body */}
                <div style={{ background: bodyBg }} className="flex gap-4 px-4 py-4 items-center">
                  {photoPreviewUrl
                    ? <img src={photoPreviewUrl} className="w-16 h-20 object-cover rounded-lg border-2 border-white shadow shrink-0" />
                    : <div className="w-16 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400 shrink-0">Photo</div>
                  }
                  <div className="flex flex-col gap-1.5">
                    <p style={{ color: bodyText }} className="font-bold text-base leading-snug">{studentData.name}</p>
                    <p style={{ color: bodyText + '99' }} className="text-xs"><span style={{ color: bodyText }} className="font-semibold">Class:</span> {studentData.class}</p>
                    <p style={{ color: bodyText + '99' }} className="text-xs"><span style={{ color: bodyText }} className="font-semibold">Roll No:</span> {studentData.roll_no || '—'}</p>
                    <p style={{ color: bodyText + '99' }} className="text-xs"><span style={{ color: bodyText }} className="font-semibold">Year:</span> {academicYear}</p>
                  </div>
                </div>
                {/* Gradient footer */}
                <div style={{ background: gradient }} className="flex justify-between items-center px-4 py-2">
                  <span style={{ color: textColor + 'bb' }} className="text-xs">Gurukul Vidyalay Trust</span>
                  <span style={{ color: textColor }} className="text-xs font-bold">Valid: {academicYear}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
