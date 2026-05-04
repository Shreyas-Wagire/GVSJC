import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Trash2, Save, Printer, BookOpen, PenTool, FileText } from 'lucide-react';

const CLASSES = ['LKG', 'UKG', ...Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`)];
const YEARS = ['2023-2024', '2024-2025', '2025-2026', '2026-2027'];

interface SubjectDef { name: string; max_marks: number; }
interface Exam { id: string; title: string; academic_year: string; class: string; subjects: SubjectDef[]; }
interface Student { id: string; name: string; roll_no: string; }
interface ExamMark { id?: string; student_id: string; marks: Record<string, number>; remarks: string; }

type Tab = 'setup' | 'marks' | 'reports';

export default function Exams() {
  const [activeTab, setActiveTab] = useState<Tab>('setup');
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);

  // ── Setup Tab State ──
  const [showNewExam, setShowNewExam] = useState(false);
  const [newExam, setNewExam] = useState({ title: '', academic_year: YEARS[1], class: 'Class 1' });
  const [newSubjects, setNewSubjects] = useState<SubjectDef[]>([{ name: 'English', max_marks: 100 }]);

  // ── Marks Tab State ──
  const [selectedExamId, setSelectedExamId] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [marksData, setMarksData] = useState<Record<string, ExamMark>>({});

  // ── Reports Tab State ──
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchExams(); }, []);

  const fetchExams = async () => {
    const { data } = await supabase.from('exams').select('*').order('created_at', { ascending: false });
    setExams(data || []);
  };

  /* ─────────────────────────────────────────────────────────
     SETUP TAB
     ───────────────────────────────────────────────────────── */
  const handleSaveExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExam.title.trim() || newSubjects.length === 0) return toast.error('Title and subjects required');
    if (newSubjects.some(s => !s.name.trim() || s.max_marks <= 0)) return toast.error('Invalid subject details');

    setLoading(true);
    const { error } = await supabase.from('exams').insert([{ ...newExam, subjects: newSubjects }]);
    setLoading(false);
    
    if (error) {
      toast.error('Failed to create exam');
    } else {
      toast.success('Exam created successfully');
      setShowNewExam(false);
      setNewExam({ title: '', academic_year: YEARS[1], class: 'Class 1' });
      setNewSubjects([{ name: 'English', max_marks: 100 }]);
      fetchExams();
    }
  };

  const handleDeleteExam = async (id: string, title: string) => {
    if (!confirm(`Delete exam "${title}" and all its marks?`)) return;
    const { error } = await supabase.from('exams').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else { toast.success('Deleted'); fetchExams(); if (selectedExamId === id) setSelectedExamId(''); }
  };

  /* ─────────────────────────────────────────────────────────
     MARKS TAB
     ───────────────────────────────────────────────────────── */
  useEffect(() => {
    if (activeTab === 'marks' || activeTab === 'reports') {
      if (selectedExamId) loadMarksForExam(selectedExamId);
      else { setStudents([]); setMarksData({}); setSelectedStudentId(''); }
    }
  }, [selectedExamId, activeTab]);

  const loadMarksForExam = async (examId: string) => {
    setLoading(true);
    const exam = exams.find(e => e.id === examId);
    if (!exam) return;

    const [stRes, mkRes] = await Promise.all([
      supabase.from('students').select('id, name, roll_no').eq('class', exam.class).order('name'),
      supabase.from('exam_marks').select('*').eq('exam_id', examId)
    ]);

    setStudents(stRes.data || []);
    
    const marksMap: Record<string, ExamMark> = {};
    (mkRes.data || []).forEach(m => { marksMap[m.student_id] = { id: m.id, student_id: m.student_id, marks: m.marks, remarks: m.remarks || '' }; });
    setMarksData(marksMap);
    setLoading(false);
  };

  const handleMarkChange = (studentId: string, subject: string, val: string, max: number) => {
    let num = parseFloat(val);
    if (isNaN(num)) num = 0;
    if (num > max) num = max;
    if (num < 0) num = 0;

    setMarksData(prev => {
      const existing = prev[studentId] || { student_id: studentId, marks: {}, remarks: '' };
      return { ...prev, [studentId]: { ...existing, marks: { ...existing.marks, [subject]: num } } };
    });
  };

  const handleRemarkChange = (studentId: string, remark: string) => {
    setMarksData(prev => {
      const existing = prev[studentId] || { student_id: studentId, marks: {}, remarks: '' };
      return { ...prev, [studentId]: { ...existing, remarks: remark } };
    });
  };

  const saveAllMarks = async () => {
    if (!selectedExamId) return;
    setLoading(true);
    const toUpsert = Object.values(marksData).map(m => ({
      ...(m.id ? { id: m.id } : {}), // include ID if updating
      exam_id: selectedExamId,
      student_id: m.student_id,
      marks: m.marks,
      remarks: m.remarks
    }));

    if (toUpsert.length === 0) { setLoading(false); return; }

    const { error } = await supabase.from('exam_marks').upsert(toUpsert, { onConflict: 'exam_id,student_id' });
    setLoading(false);
    
    if (error) toast.error('Failed to save marks: ' + error.message);
    else toast.success('All marks saved successfully');
  };

  /* ─────────────────────────────────────────────────────────
     REPORTS TAB
     ───────────────────────────────────────────────────────── */
  const printReport = () => {
    if (!reportRef.current) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<html><head><title>Report Card</title><style>
      @page { size: A4 portrait; margin: 15mm; }
      body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; font-size: 14px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { border: 1px solid #000; padding: 10px; text-align: left; }
      th { background-color: #f3f4f6; }
      .text-center { text-align: center; }
      .header { border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px; }
      .flex { display: flex; justify-content: space-between; }
    </style></head><body>${reportRef.current.outerHTML}</body></html>`);
    win.document.close();
    win.print();
  };

  const selExam = exams.find(e => e.id === selectedExamId);
  const selStudent = students.find(s => s.id === selectedStudentId);
  const selMarks = selStudent ? marksData[selStudent.id] : null;

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div>
        <h1 className="text-3xl font-bold font-display text-gray-900">Examinations & Reports</h1>
        <p className="text-gray-500 mt-1">Manage exams, enter marks, and generate report cards.</p>
      </div>

      {/* TABS */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {([
          { key: 'setup' as Tab, label: 'Exam Setup', icon: BookOpen },
          { key: 'marks' as Tab, label: 'Enter Marks', icon: PenTool },
          { key: 'reports' as Tab, label: 'Report Cards', icon: FileText },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === key ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* ==================== TAB 1: SETUP ==================== */}
      {activeTab === 'setup' && (
        <div className="space-y-6">
          {!showNewExam ? (
            <div className="flex justify-end">
              <Button onClick={() => setShowNewExam(true)} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" /> Create New Exam
              </Button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl border border-emerald-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Create New Examination</h2>
              <form onSubmit={handleSaveExam} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Exam Title (e.g. Mid Term)</Label>
                    <Input value={newExam.title} onChange={e => setNewExam({...newExam, title: e.target.value})} required className="mt-1" />
                  </div>
                  <div>
                    <Label>Academic Year</Label>
                    <select value={newExam.academic_year} onChange={e => setNewExam({...newExam, academic_year: e.target.value})} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-emerald-500">
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Class</Label>
                    <select value={newExam.class} onChange={e => setNewExam({...newExam, class: e.target.value})} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-emerald-500">
                      {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Subjects & Maximum Marks</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => setNewSubjects([...newSubjects, { name: '', max_marks: 100 }])}>
                      <Plus className="w-3 h-3 mr-1" /> Add Subject
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {newSubjects.map((sub, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <Input placeholder="Subject Name" value={sub.name} onChange={e => { const s = [...newSubjects]; s[idx].name = e.target.value; setNewSubjects(s); }} required />
                        <Input type="number" placeholder="Max Marks" value={sub.max_marks} onChange={e => { const s = [...newSubjects]; s[idx].max_marks = parseInt(e.target.value)||0; setNewSubjects(s); }} className="w-32" required />
                        {newSubjects.length > 1 && (
                          <button type="button" onClick={() => setNewSubjects(newSubjects.filter((_, i) => i !== idx))} className="p-2 text-red-500 hover:bg-red-50 rounded-md">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">Save Exam</Button>
                  <Button type="button" variant="outline" onClick={() => setShowNewExam(false)}>Cancel</Button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3">Exam Title</th>
                  <th className="px-4 py-3">Class</th>
                  <th className="px-4 py-3">Year</th>
                  <th className="px-4 py-3">Subjects</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {exams.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-500">No exams created yet.</td></tr>
                ) : exams.map(ex => (
                  <tr key={ex.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">{ex.title}</td>
                    <td className="px-4 py-3"><span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">{ex.class}</span></td>
                    <td className="px-4 py-3 text-gray-600">{ex.academic_year}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 truncate max-w-xs">
                      {ex.subjects.map(s => `${s.name}(${s.max_marks})`).join(', ')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDeleteExam(ex.id, ex.title)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: MARKS ==================== */}
      {activeTab === 'marks' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <Label className="whitespace-nowrap">Select Exam:</Label>
            <select value={selectedExamId} onChange={e => setSelectedExamId(e.target.value)} className="w-full max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-emerald-500">
              <option value="">-- Choose an Exam --</option>
              {exams.map(e => <option key={e.id} value={e.id}>{e.title} ({e.class})</option>)}
            </select>
            {selectedExamId && (
              <Button onClick={saveAllMarks} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 ml-auto">
                <Save className="w-4 h-4 mr-2" /> Save All Marks
              </Button>
            )}
          </div>

          {selectedExamId && selExam && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm overflow-x-auto">
              {students.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No students found in {selExam.class}.</div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 w-48 sticky left-0 bg-gray-50 shadow-[1px_0_0_0_#e5e7eb]">Student</th>
                      {selExam.subjects.map(sub => (
                        <th key={sub.name} className="px-4 py-3 text-center min-w-[100px]">
                          {sub.name} <div className="text-xs text-gray-400 font-normal">Max: {sub.max_marks}</div>
                        </th>
                      ))}
                      <th className="px-4 py-3 min-w-[200px]">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {students.map(st => {
                      const mData = marksData[st.id]?.marks || {};
                      const remark = marksData[st.id]?.remarks || '';
                      return (
                        <tr key={st.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 font-medium text-gray-800 sticky left-0 bg-white group-hover:bg-gray-50 shadow-[1px_0_0_0_#e5e7eb]">
                            {st.name} <div className="text-xs text-gray-400 font-normal">Roll: {st.roll_no||'—'}</div>
                          </td>
                          {selExam.subjects.map(sub => (
                            <td key={sub.name} className="px-2 py-2">
                              <Input 
                                type="number" 
                                min="0" max={sub.max_marks} step="any"
                                value={mData[sub.name] ?? ''}
                                onChange={e => handleMarkChange(st.id, sub.name, e.target.value, sub.max_marks)}
                                className="w-full text-center h-8" 
                              />
                            </td>
                          ))}
                          <td className="px-4 py-2">
                            <Input value={remark} onChange={e => handleRemarkChange(st.id, e.target.value)} className="h-8" placeholder="Optional remark" />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 3: REPORTS ==================== */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Select Exam</Label>
              <select value={selectedExamId} onChange={e => {setSelectedExamId(e.target.value); setSelectedStudentId('');}} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-emerald-500">
                <option value="">-- Choose Exam --</option>
                {exams.map(e => <option key={e.id} value={e.id}>{e.title} ({e.class})</option>)}
              </select>
            </div>
            <div>
              <Label>Select Student</Label>
              <select value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} disabled={!selectedExamId} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-emerald-500">
                <option value="">-- Choose Student --</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name} (Roll: {s.roll_no})</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={printReport} disabled={!selectedStudentId || !selMarks} className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Printer className="w-4 h-4 mr-2" /> Print Report Card
              </Button>
            </div>
          </div>

          {selectedStudentId && selExam && selStudent && (
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
              {!selMarks ? (
                <div className="text-center text-amber-600 font-medium py-10">No marks entered for this student in this exam yet.</div>
              ) : (
                <div ref={reportRef} className="max-w-3xl mx-auto border-2 border-gray-800 p-8 font-serif bg-white relative">
                  {/* Watermark / Logo could go here */}
                  <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
                    <h1 className="text-3xl font-bold uppercase tracking-wide">Gurukul Vidyalay S. J. C.</h1>
                    <p className="text-gray-700 mt-1">Chandgad, Kolhapur · Maharashtra</p>
                    <h2 className="text-xl font-bold mt-3 underline decoration-2 underline-offset-4">{selExam.title} Report Card</h2>
                    <p className="text-sm font-semibold mt-1">Academic Year: {selExam.academic_year}</p>
                  </div>

                  <div className="flex justify-between mb-6 text-sm font-medium">
                    <div>
                      <p className="mb-1"><span className="text-gray-600">Student Name:</span> {selStudent.name}</p>
                      <p><span className="text-gray-600">Class:</span> {selExam.class}</p>
                    </div>
                    <div className="text-right">
                      <p className="mb-1"><span className="text-gray-600">Roll No:</span> {selStudent.roll_no || '—'}</p>
                      <p><span className="text-gray-600">Date:</span> {new Date().toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>

                  <table className="w-full border-collapse border border-gray-800 mb-6">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-800 px-4 py-2 text-left w-1/2">Subjects</th>
                        <th className="border border-gray-800 px-4 py-2 text-center w-1/4">Max Marks</th>
                        <th className="border border-gray-800 px-4 py-2 text-center w-1/4">Marks Obtained</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selExam.subjects.map(sub => {
                        const m = selMarks.marks[sub.name] ?? 0;
                        return (
                          <tr key={sub.name}>
                            <td className="border border-gray-800 px-4 py-2 font-medium">{sub.name}</td>
                            <td className="border border-gray-800 px-4 py-2 text-center">{sub.max_marks}</td>
                            <td className="border border-gray-800 px-4 py-2 text-center font-bold">{m}</td>
                          </tr>
                        );
                      })}
                      <tr className="bg-gray-50">
                        <td className="border border-gray-800 px-4 py-2 font-bold text-right">TOTAL</td>
                        <td className="border border-gray-800 px-4 py-2 text-center font-bold">
                          {selExam.subjects.reduce((sum, s) => sum + s.max_marks, 0)}
                        </td>
                        <td className="border border-gray-800 px-4 py-2 text-center font-bold text-emerald-700">
                          {selExam.subjects.reduce((sum, s) => sum + (selMarks.marks[s.name] ?? 0), 0)}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="mb-16">
                    <p className="text-sm">
                      <span className="font-bold">Percentage:</span>{' '}
                      {(() => {
                        const totalMax = selExam.subjects.reduce((sum, s) => sum + s.max_marks, 0);
                        const totalObt = selExam.subjects.reduce((sum, s) => sum + (selMarks.marks[s.name] ?? 0), 0);
                        return totalMax > 0 ? ((totalObt / totalMax) * 100).toFixed(2) + '%' : '0%';
                      })()}
                    </p>
                    <p className="text-sm mt-2">
                      <span className="font-bold">Class Teacher's Remarks:</span> {selMarks.remarks || 'Keep it up!'}
                    </p>
                  </div>

                  <div className="flex justify-between mt-12 text-sm font-semibold pt-4">
                    <div className="text-center w-32 border-t border-gray-400 pt-2">Class Teacher</div>
                    <div className="text-center w-32 border-t border-gray-400 pt-2">Principal</div>
                    <div className="text-center w-32 border-t border-gray-400 pt-2">Parent's Signature</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
