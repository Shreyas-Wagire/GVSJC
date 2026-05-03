import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Printer } from 'lucide-react';

const DEFAULT_TEMPLATE = `<h2 style="text-align:center;">Bonafide Certificate</h2>
<p>This is to certify that <strong>{{studentName}}</strong>, 
son/daughter of <strong>{{fatherName}}</strong> &amp; <strong>{{motherName}}</strong>, 
is a bonafide student of our school studying in class <strong>{{class}}</strong> 
(Roll No: {{rollNo}}).</p>
<p>Date of Birth: {{dob}}</p>
<p>He/She bears a good moral character.</p>
<p style="text-align:right;">Principal</p>`;

interface Student { id: string; name: string; class: string; roll_no: string; dob: string; father_name: string; mother_name: string; }

export default function Bonafide() {
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [previewHtml, setPreviewHtml] = useState('');
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data } = await supabase.from('students').select('id, name, class, roll_no, dob, father_name, mother_name').order('name');
      setStudents(data ?? []);
    };
    const fetchTemplate = async () => {
      const { data } = await supabase.from('clerk_templates').select('content').eq('type', 'bonafide').maybeSingle();
      if (data?.content) setTemplate(data.content);
    };
    fetchStudents();
    fetchTemplate();
  }, []);

  const saveTemplate = async () => {
    const { error } = await supabase.from('clerk_templates').upsert([{ type: 'bonafide', content: template }], { onConflict: 'type' });
    if (error) toast.error('Failed to save template');
    else { setSavedMsg(true); setTimeout(() => setSavedMsg(false), 2000); }
  };

  const handleStudentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sid = e.target.value;
    setSelectedStudentId(sid);
    const s = students.find((st) => st.id === sid) ?? null;
    setStudentData(s);
    setPreviewHtml('');
  };

  const generatePreview = () => {
    if (!studentData) { toast.error('Please select a student first'); return; }
    let html = template;
    const map: Record<string, string> = {
      '{{studentName}}': studentData.name ?? '',
      '{{fatherName}}': studentData.father_name ?? '',
      '{{motherName}}': studentData.mother_name ?? '',
      '{{class}}': studentData.class ?? '',
      '{{rollNo}}': studentData.roll_no ?? '',
      '{{dob}}': studentData.dob ?? '',
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

  const labelClass = "text-sm font-medium text-gray-700";
  const selectClass = "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-display text-gray-900">Bonafide Certificate</h1>
        <p className="text-gray-500 mt-1">Design a template and generate bonafide certificates for students.</p>
      </div>

      {/* Template Editor */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Edit Template</h2>
        <p className="text-xs text-gray-500">
          Available placeholders: <code className="bg-gray-100 px-1 rounded">{'{{studentName}}'}</code>{' '}
          <code className="bg-gray-100 px-1 rounded">{'{{fatherName}}'}</code>{' '}
          <code className="bg-gray-100 px-1 rounded">{'{{motherName}}'}</code>{' '}
          <code className="bg-gray-100 px-1 rounded">{'{{class}}'}</code>{' '}
          <code className="bg-gray-100 px-1 rounded">{'{{rollNo}}'}</code>{' '}
          <code className="bg-gray-100 px-1 rounded">{'{{dob}}'}</code>
        </p>
        <textarea
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          rows={10}
          className="w-full font-mono text-sm rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Write your certificate template here (HTML supported)..."
        />
        <Button onClick={saveTemplate} className="bg-emerald-600 hover:bg-emerald-700">
          {savedMsg ? '✓ Saved!' : 'Save Template'}
        </Button>
      </div>

      {/* Student Selector */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Generate Certificate</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label className={labelClass}>Select Student</Label>
            <select value={selectedStudentId} onChange={handleStudentSelect} className={selectClass}>
              <option value="">-- Choose Student --</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.class})</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <Button onClick={generatePreview} className="bg-emerald-600 hover:bg-emerald-700">Generate Preview</Button>
          </div>
        </div>

        {previewHtml && (
          <div className="space-y-4">
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
