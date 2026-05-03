import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Printer } from 'lucide-react';

interface Student {
  id: string; name: string; class: string; student_id: string; aadhar: string;
  mother_name: string; nationality: string; mother_tongue: string; religion: string;
  caste: string; sub_caste: string; place_of_birth: string; taluka: string;
  district: string; state: string; dob: string; previous_school: string;
  admission_class: string; date_of_admission: string;
}

interface FormState {
  date_of_leaving: string; reason_for_leaving: string; progress_in_study: string;
  conduct: string; standard_studying: string; since_when: string; remark: string;
}

export default function LeavingCertificate() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [formData, setFormData] = useState<FormState>({
    date_of_leaving: new Date().toISOString().slice(0, 10),
    reason_for_leaving: '', progress_in_study: '', conduct: '',
    standard_studying: '', since_when: '', remark: '',
  });
  const [showPreview, setShowPreview] = useState(false);
  const [isOriginal, setIsOriginal] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);

  const fetchStudents = useCallback(async () => {
    const { data } = await supabase.from('students').select('*').order('name');
    setStudents(data ?? []);
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const handleStudentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sid = e.target.value;
    setSelectedStudentId(sid);
    const s = students.find((st) => st.id === sid) ?? null;
    setStudentData(s);
    setShowPreview(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const printCertificate = () => {
    if (!previewRef.current) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<html><head><title>Leaving Certificate</title><style>
      @page { size: A4 portrait; margin: 12mm; }
      * { box-sizing: border-box; }
      body { font-family: serif; font-size: 11px; margin: 0; padding: 0; }
      table { width: 100%; border-collapse: collapse; }
      td { padding: 3px 8px; border: 1px solid #999; }
      .header { text-align: center; margin-bottom: 8px; }
      .school-info { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 8px; margin-bottom: 8px; text-align: center; }
      .signatures { display: flex; justify-content: space-between; margin-top: 16px; }
      h2 { font-size: 16px; margin: 0 0 2px; }
      h3 { font-size: 13px; margin: 4px 0 2px; }
      p { margin: 1px 0; }
    </style></head><body>${previewRef.current.outerHTML}</body></html>`);
    w.document.close();
    w.print();
  };

  const labelClass = "text-sm font-medium text-gray-700";
  const selectClass = "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-display text-gray-900">Leaving Certificate</h1>
        <p className="text-gray-500 mt-1">Generate school leaving certificates for departing students.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        {/* Student Selector */}
        <div className="max-w-sm">
          <Label className={labelClass}>Select Student *</Label>
          <select value={selectedStudentId} onChange={handleStudentSelect} className={selectClass}>
            <option value="">-- Choose Student --</option>
            {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.class})</option>)}
          </select>
        </div>

        {/* Additional Fields */}
        {studentData && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 border-b pb-2">Academic Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label className={labelClass}>Date of Leaving *</Label><Input type="date" name="date_of_leaving" value={formData.date_of_leaving} onChange={handleChange} className="mt-1" /></div>
              <div><Label className={labelClass}>Reason for Leaving *</Label><Input name="reason_for_leaving" value={formData.reason_for_leaving} onChange={handleChange} className="mt-1" /></div>
              <div><Label className={labelClass}>Progress in Study</Label><Input name="progress_in_study" value={formData.progress_in_study} onChange={handleChange} className="mt-1" /></div>
              <div><Label className={labelClass}>Conduct</Label><Input name="conduct" value={formData.conduct} onChange={handleChange} className="mt-1" /></div>
              <div><Label className={labelClass}>Standard Studying Now</Label><Input name="standard_studying" value={formData.standard_studying} onChange={handleChange} className="mt-1" /></div>
              <div><Label className={labelClass}>Since When</Label><Input name="since_when" value={formData.since_when} onChange={handleChange} className="mt-1" /></div>
              <div><Label className={labelClass}>Remark</Label><Input name="remark" value={formData.remark} onChange={handleChange} className="mt-1" /></div>
            </div>

            {/* Original / Duplicate toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Copy Type:</span>
              <button
                type="button"
                onClick={() => setIsOriginal((v) => !v)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                  isOriginal
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-orange-500 text-white border-orange-500'
                }`}
              >
                {isOriginal ? 'Original' : 'Duplicate Copy'}
              </button>
              <span className="text-xs text-gray-400">Click to toggle</span>
            </div>

            <Button onClick={() => setShowPreview(true)} className="bg-emerald-600 hover:bg-emerald-700">Generate Preview</Button>
          </div>
        )}
      </div>

      {/* Certificate Preview */}
      {showPreview && studentData && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Certificate Preview</h3>
            <Button onClick={printCertificate} variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" /> Print Certificate
            </Button>
          </div>

          <div ref={previewRef} className="border border-gray-200 rounded-lg p-6 bg-gray-50 font-serif text-sm">
            {/* Header – centered */}
            <div className="text-center space-y-0.5 border-b pb-3 mb-3">
              <h2 className="text-2xl font-bold">Gurukul Vidyalay S. J. C.</h2>
              <p className="text-gray-600">Chandgad, Kolhapur</p>
              <h3 className="text-xl font-semibold mt-1">School Leaving Certificate</h3>
              <p className="text-gray-500 text-xs">( {isOriginal ? 'Original' : 'Duplicate Copy'} )</p>
            </div>

            {/* School Info – centered */}
            <div className="grid grid-cols-2 gap-1 text-sm border-b pb-3 mb-3 text-center">
              <div><strong>Name of Management:</strong> Gurukul Vidyalay Trust</div>
              <div><strong>Name of School:</strong> GVSJC</div>
              <div><strong>Address:</strong> Chandgad, Kolhapur, Maharashtra</div>
              <div><strong>Medium:</strong> Marathi / Semi-English</div>
            </div>

            {/* Student Details Table */}
            <table className="w-full border-collapse text-sm">
              <tbody>
                {[
                  ['Student ID', studentData.student_id || '—'],
                  ['Student Full Name', studentData.name],
                  ["Mother's Name", studentData.mother_name || '—'],
                  ['Nationality', studentData.nationality || 'Indian'],
                  ['Mother Tongue', studentData.mother_tongue || '—'],
                  ['Religion', studentData.religion || '—'],
                  ['Caste', studentData.caste || '—'],
                  ['Sub-Caste', studentData.sub_caste || '—'],
                  ['Place of Birth', [studentData.place_of_birth, studentData.taluka].filter(Boolean).join(', ') || '—'],
                  ['Tq. / Dist.', [studentData.taluka, studentData.district].filter(Boolean).join(' / ') || '—'],
                  ['State', studentData.state || '—'],
                  ['Date of Birth', studentData.dob || '—'],
                  ['Previous School', studentData.previous_school || '—'],
                  ['Class of Admission', studentData.admission_class || '—'],
                  ['Date of Admission', studentData.date_of_admission || '—'],
                  ['Class at Leaving', studentData.class],
                  ['Progress in Study', formData.progress_in_study],
                  ['Conduct', formData.conduct],
                  ['Date of Leaving', formData.date_of_leaving],
                  ['Standard Studying Now', formData.standard_studying],
                  ['Since When', formData.since_when],
                  ['Reason for Leaving', formData.reason_for_leaving],
                  ['Remark', formData.remark],
                ].map(([label, value]) => (
                  <tr key={label} className="border border-gray-300">
                    <td className="px-3 py-2 font-medium bg-gray-100 w-52">{label}</td>
                    <td className="px-3 py-2">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-xs text-gray-600 italic">
              This is to certify that the above information is true according to the school general register No. 1.
            </p>

            <div className="flex justify-between pt-8 text-sm">
              <div>Date: {formData.date_of_leaving}</div>
              <div className="flex gap-16">
                <span>Class Teacher</span>
                <span>Clerk</span>
                <span>Principal</span>
              </div>
            </div>

            <p className="text-xs text-red-600 text-center mt-4">
              Note: A legal action will be taken on the concerned if made unauthorised changes in Leaving Certificate.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
