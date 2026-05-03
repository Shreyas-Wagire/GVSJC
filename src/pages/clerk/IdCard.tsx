import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Printer } from 'lucide-react';

// Card dimensions: CR80 standard (85.6mm × 54mm) – matches a typical student ID card
const CARD_W = 320; // px for screen preview
const CARD_H = 480; // px for screen preview

const DEFAULT_TEMPLATE = `<div style="text-align:center;padding:20px;">
  <img src="/icon.png" style="width:80px;border-radius:50%;display:block;margin:0 auto;" />
  <h3 style="margin:8px 0;">Gurukul Vidyalay S. J. C.</h3>
  <div style="width:80px;height:3px;background:#333;margin:8px auto;"></div>
  <div style="margin:15px auto;text-align:center;">
    <img src="{{photoUrl}}" style="width:100px;height:100px;border-radius:10px;object-fit:cover;border:2px solid #ccc;display:inline-block;" />
  </div>
  <p style="font-weight:bold;font-size:18px;text-align:center;">{{studentName}}</p>
  <p style="font-size:14px;text-align:center;">Class: {{class}} | Roll No: {{rollNo}}</p>
  <p style="font-size:13px;margin-top:10px;text-align:center;">Valid Upto: {{validUpto}}</p>
  <p style="margin-top:25px;font-size:12px;text-align:center;">Principal</p>
  <p style="font-size:10px;color:#666;text-align:center;">{{academicYear}}</p>
</div>`;

interface Student { id: string; name: string; class: string; roll_no: string; }

export default function IdCard() {
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [savedMsg, setSavedMsg] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [previewHtml, setPreviewHtml] = useState('');
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data: studs } = await supabase.from('students').select('id, name, class, roll_no').order('name');
      setStudents(studs ?? []);
      const { data: tmpl } = await supabase.from('clerk_templates').select('content, meta').eq('type', 'idcard').maybeSingle();
      if (tmpl?.content) setTemplate(tmpl.content);
      if (tmpl?.meta?.bgColor) setBgColor(tmpl.meta.bgColor);
      if (tmpl?.meta?.textColor) setTextColor(tmpl.meta.textColor);
    };
    load();
  }, []);

  const saveTemplate = async () => {
    const { error } = await supabase.from('clerk_templates').upsert([{
      type: 'idcard', content: template, meta: { bgColor, textColor }
    }], { onConflict: 'type' });
    if (error) toast.error('Failed to save template');
    else { setSavedMsg(true); setTimeout(() => setSavedMsg(false), 2000); }
  };

  const handleStudentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sid = e.target.value;
    setSelectedStudent(sid);
    const s = students.find((st) => st.id === sid) ?? null;
    setStudentData(s);
    setPreviewHtml('');
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
      setPhotoPreviewUrl(URL.createObjectURL(file));
    }
  };

  const generatePreview = () => {
    if (!studentData) { toast.error('Select a student first'); return; }
    let html = template;
    const photoSrc = photoPreviewUrl || '/default-photo.png';
    const map: Record<string, string> = {
      '{{studentName}}': studentData.name ?? '',
      '{{class}}': studentData.class ?? '',
      '{{rollNo}}': studentData.roll_no ?? '',
      '{{validUpto}}': '2025-2026',
      '{{academicYear}}': '2025-26',
      '{{logoUrl}}': '/icon.png',
      '{{photoUrl}}': photoSrc,
    };
    for (const [k, v] of Object.entries(map)) html = html.split(k).join(v);
    setPreviewHtml(html);
  };

  const printIdCard = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<html><head><title>ID Card</title><style>
      @page { size: 85.6mm 54mm; margin: 0; }
      * { box-sizing: border-box; }
      body { margin: 0; display: flex; justify-content: center; align-items: center; width: 85.6mm; height: 54mm; overflow: hidden; }
      .id-card { width: 85.6mm; height: 54mm; background: ${bgColor}; color: ${textColor}; overflow: hidden; }
      .id-card * { color: ${textColor} !important; }
      .id-card img[src*="photoUrl"], .id-card img:not([src*="icon"]) { display: block; margin: 0 auto; }
    </style></head><body><div class="id-card">${previewHtml}</div></body></html>`);
    w.document.close();
    w.print();
  };

  const labelClass = "text-sm font-medium text-gray-700";
  const selectClass = "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-display text-gray-900">ID Card Designer</h1>
        <p className="text-gray-500 mt-1">Design and print student ID cards.</p>
      </div>

      {/* Customization + Template */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-wrap gap-6 items-center border-b pb-4">
          <div className="flex items-center gap-2">
            <Label className={labelClass}>Background</Label>
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-9 w-16 cursor-pointer rounded border border-gray-300" />
          </div>
          <div className="flex items-center gap-2">
            <Label className={labelClass}>Text Color</Label>
            <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-9 w-16 cursor-pointer rounded border border-gray-300" />
          </div>
          <Button onClick={saveTemplate} className="bg-emerald-600 hover:bg-emerald-700">
            {savedMsg ? '✓ Saved!' : 'Save Template'}
          </Button>
        </div>

        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-2">Edit Template</h2>
          <p className="text-xs text-gray-500 mb-2">
            Placeholders: <code className="bg-gray-100 px-1 rounded">{'{{studentName}}'}</code>{' '}
            <code className="bg-gray-100 px-1 rounded">{'{{class}}'}</code>{' '}
            <code className="bg-gray-100 px-1 rounded">{'{{rollNo}}'}</code>{' '}
            <code className="bg-gray-100 px-1 rounded">{'{{photoUrl}}'}</code>
          </p>
          <textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            rows={12}
            className="w-full font-mono text-xs rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Generate Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Generate ID Card</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className={labelClass}>Select Student</Label>
            <select value={selectedStudent} onChange={handleStudentSelect} className={selectClass}>
              <option value="">-- Choose Student --</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.class})</option>)}
            </select>
          </div>
          <div>
            <Label className={labelClass}>Student Photo (optional)</Label>
            <Input type="file" accept="image/*" onChange={handlePhotoChange} className="mt-1" />
            {photoPreviewUrl && (
              <div className="mt-2 flex items-center gap-2">
                <img src={photoPreviewUrl} alt="Preview" className="w-16 h-16 object-cover rounded-lg border" />
                <button onClick={() => { URL.revokeObjectURL(photoPreviewUrl); setPhotoPreviewUrl(''); }} className="text-xs text-red-500 hover:underline">Remove</button>
              </div>
            )}
          </div>
        </div>
        <Button onClick={generatePreview} className="bg-emerald-600 hover:bg-emerald-700">Generate Preview</Button>

        {previewHtml && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">ID Card Preview</h3>
              <Button onClick={printIdCard} variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" /> Print ID Card
              </Button>
            </div>
            <div className="flex justify-center">
              <div
                className="rounded-2xl overflow-hidden shadow-xl"
                style={{ width: 320, minHeight: 480, background: bgColor, color: textColor }}
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
