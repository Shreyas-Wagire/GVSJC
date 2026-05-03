import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Printer, Search, ArrowUpDown } from 'lucide-react';

const DEFAULT_TEMPLATE = `<h2 style="text-align:center;">Bonafide Certificate</h2>
<p>This is to certify that <strong>{{studentName}}</strong>, 
son/daughter of <strong>{{fatherName}}</strong> &amp; <strong>{{motherName}}</strong>, 
is a bonafide student of our school studying in class <strong>{{class}}</strong> 
(Roll No: {{rollNo}}).</p>
<p>Date of Birth: {{dob}}</p>
<p>This certificate is issued for the purpose of: <strong>{{purpose}}</strong></p>
<p>He/She bears a good moral character.</p>
<p style="text-align:right;">Principal</p>`;

const CLASSES = ['LKG', 'UKG', ...Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`)];

const PURPOSES = [
  'Bank Account Opening',
  'Scholarship Application',
  'Passport Application',
  'Railway Concession',
  'Sports Participation',
  'College Admission',
  'Government Scheme',
  'Other',
];

interface Student {
  id: string; name: string; class: string; roll_no: string;
  dob: string; father_name: string; mother_name: string;
}

export default function Bonafide() {
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [purpose, setPurpose] = useState('');
  const [customPurpose, setCustomPurpose] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    supabase.from('students')
      .select('id, name, class, roll_no, dob, father_name, mother_name')
      .order('name')
      .then(({ data }) => setStudents(data ?? []));

    supabase.from('clerk_templates').select('content').eq('type', 'bonafide').maybeSingle()
      .then(({ data }) => { if (data?.content) setTemplate(data.content); });
  }, []);

  const saveTemplate = async () => {
    const { error } = await supabase.from('clerk_templates')
      .upsert([{ type: 'bonafide', content: template }], { onConflict: 'type' });
    if (error) toast.error('Failed to save template');
    else { setSavedMsg(true); setTimeout(() => setSavedMsg(false), 2000); }
  };

  const filtered = students
    .filter((s) => {
      const q = search.toLowerCase();
      const matchSearch = !search || s.name.toLowerCase().includes(q) || s.roll_no?.toLowerCase().includes(q);
      const matchClass = classFilter === 'all' || s.class === classFilter;
      return matchSearch && matchClass;
    })
    .sort((a, b) => sortDir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

  const handleSelect = (id: string) => {
    setSelectedStudentId(id);
    setStudentData(students.find((s) => s.id === id) ?? null);
    setPreviewHtml('');
  };

  const generatePreview = () => {
    if (!studentData) { toast.error('Please select a student first'); return; }
    const finalPurpose = purpose === 'Other' ? customPurpose : purpose;
    if (!finalPurpose) { toast.error('Please select a purpose for the certificate'); return; }
    let html = template;
    const map: Record<string, string> = {
      '{{studentName}}': studentData.name ?? '',
      '{{fatherName}}': studentData.father_name ?? '',
      '{{motherName}}': studentData.mother_name ?? '',
      '{{class}}': studentData.class ?? '',
      '{{rollNo}}': studentData.roll_no ?? '',
      '{{dob}}': studentData.dob ?? '',
      '{{purpose}}': finalPurpose,
    };
    for (const [k, v] of Object.entries(map)) html = html.split(k).join(v);
    setPreviewHtml(html);
  };

  const printCertificate = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<html><head><title>Bonafide Certificate</title><style>
      @page { size: A5 landscape; margin: 15mm; }
      * { box-sizing: border-box; }
      body { font-family: serif; margin: 0; padding: 0; font-size: 13px; }
    </style></head><body>${previewHtml}</body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-display text-gray-900">Bonafide Certificate</h1>
        <p className="text-gray-500 mt-1">Generate certificates with purpose of need.</p>
      </div>

      {/* Template Editor */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Edit Template</h2>
        <p className="text-xs text-gray-500">
          Placeholders:{' '}
          {['{{studentName}}','{{fatherName}}','{{motherName}}','{{class}}','{{rollNo}}','{{dob}}','{{purpose}}'].map((p) => (
            <code key={p} className="bg-gray-100 px-1 rounded mr-1">{p}</code>
          ))}
        </p>
        <textarea
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          rows={8}
          className="w-full font-mono text-sm rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <Button onClick={saveTemplate} className="bg-emerald-600 hover:bg-emerald-700">
          {savedMsg ? '✓ Saved!' : 'Save Template'}
        </Button>
      </div>

      {/* Generate Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Generate Certificate</h2>

        {/* Search + Filter + Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name or roll no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Classes</option>
            {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button
            onClick={() => setSortDir((d) => d === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 whitespace-nowrap"
          >
            <ArrowUpDown className="w-4 h-4" />
            Name {sortDir === 'asc' ? 'A→Z' : 'Z→A'}
          </button>
        </div>

        {/* Student list */}
        <div className="max-h-52 overflow-y-auto rounded-lg border border-gray-200 divide-y">
          {filtered.length === 0 ? (
            <p className="text-center py-6 text-gray-400 text-sm">No students found</p>
          ) : filtered.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSelect(s.id)}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-left ${
                selectedStudentId === s.id ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700'
              }`}
            >
              <span>{s.name}</span>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{s.class}</span>
            </button>
          ))}
        </div>

        {/* Purpose selection — shown after student picked */}
        {studentData && (
          <div className="space-y-3 pt-3 border-t">
            <Label className="text-sm font-semibold text-gray-700 block">
              Purpose of Certificate <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {PURPOSES.map((p) => (
                <button
                  key={p}
                  onClick={() => setPurpose(p)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    purpose === p
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:border-emerald-400 hover:text-emerald-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            {purpose === 'Other' && (
              <Input
                placeholder="Specify the exact purpose..."
                value={customPurpose}
                onChange={(e) => setCustomPurpose(e.target.value)}
                className="max-w-sm"
              />
            )}
            <Button onClick={generatePreview} className="bg-emerald-600 hover:bg-emerald-700">
              Generate Preview
            </Button>
          </div>
        )}

        {/* Preview */}
        {previewHtml && (
          <div className="space-y-3 pt-3 border-t">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Preview</h3>
              <Button onClick={printCertificate} variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" /> Print Certificate
              </Button>
            </div>
            <div
              className="border border-gray-200 rounded-lg p-8 bg-gray-50 font-serif"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
