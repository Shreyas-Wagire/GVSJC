import { useState } from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Button } from '@/components/ui/button';
import { CheckCircle, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';

const Admissions = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollReveal();
  const { ref: ref2, isVisible: vis2 } = useScrollReveal();
  const { ref: ref3, isVisible: vis3 } = useScrollReveal();

  const steps = [
    { step: '01', title: 'Online Registration', desc: 'Fill in the online application form with student and parent details.' },
    { step: '02', title: 'Document Submission', desc: 'Submit required documents: birth certificate, previous report cards, photographs.' },
    { step: '03', title: 'Entrance Assessment', desc: 'Age-appropriate assessment for the child. Interaction with parents.' },
    { step: '04', title: 'Admission Confirmation', desc: 'Selection list published. Fee payment and enrollment completion.' },
  ];

  const fees = [
    { grade: 'Pre-Primary (Nursery–UKG)', admission: '₹15,000', tuition: '₹3,500/month' },
    { grade: 'Primary (I–V)', admission: '₹18,000', tuition: '₹4,000/month' },
    // { grade: 'Middle (VI–VIII)', admission: '₹20,000', tuition: '₹4,500/month' },
    // { grade: 'Secondary (IX–X)', admission: '₹22,000', tuition: '₹5,000/month' },
    { grade: 'Sr. Secondary (XI–XII)', admission: '₹25,000', tuition: '₹5,500/month' },
  ];

  const [form, setForm] = useState({ studentName: '', parentName: '', email: '', phone: '', grade: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Application submitted successfully! We will contact you shortly.');
    setForm({ studentName: '', parentName: '', email: '', phone: '', grade: '', message: '' });
  };

  return (
    <Layout>
      <section className="bg-primary py-16">
        <div className="container-school text-center">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground">{t('admissions.title')}</h1>
          <p className="text-primary-foreground/80 mt-3">Applications are now open for the 2025-26 academic session</p>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-background" ref={ref}>
        <div className={`container-school max-w-4xl ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-8 text-center">Admission Process</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {steps.map((s, i) => (
              <div key={s.step} className={`flex gap-4 p-5 bg-card rounded-xl border border-border ${isVisible ? `animate-reveal-up delay-${(i + 1) * 100}` : 'opacity-0'}`}>
                <div className="text-3xl font-display font-bold text-secondary/30">{s.step}</div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{s.title}</h3>
                  <p className="text-muted-foreground text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fee Structure */}
      <section className="py-20 bg-muted" ref={ref2}>
        <div className={`container-school max-w-4xl ${vis2 ? 'animate-reveal-up' : 'opacity-0'}`}>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-8 text-center">Fee Structure</h2>
          <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="text-left p-4 font-semibold">Grade</th>
                  <th className="text-left p-4 font-semibold">Admission Fee</th>
                  <th className="text-left p-4 font-semibold">Tuition</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((f, i) => (
                  <tr key={f.grade} className={i % 2 === 0 ? 'bg-card' : 'bg-muted/50'}>
                    <td className="p-4 text-foreground font-medium">{f.grade}</td>
                    <td className="p-4 text-muted-foreground tabular-nums">{f.admission}</td>
                    <td className="p-4 text-muted-foreground tabular-nums">{f.tuition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" /> Download Fee Details (PDF)
            </Button>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-background" ref={ref3}>
        <div className={`container-school max-w-2xl ${vis3 ? 'animate-reveal-up' : 'opacity-0'}`}>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-8 text-center">Online Application</h2>
          <form onSubmit={handleSubmit} className="bg-card rounded-xl p-8 shadow-sm border border-border space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Student's Name</label>
                <input type="text" required value={form.studentName} onChange={e => setForm({ ...form, studentName: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Parent's Name</label>
                <input type="text" required value={form.parentName} onChange={e => setForm({ ...form, parentName: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Applying for Grade</label>
              <select required value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="">Select Grade</option>
                <option>Nursery</option><option>LKG</option><option>UKG</option>
                <option>Class I</option><option>Class II</option><option>Class III</option>
                <option>Class IV</option><option>Class V</option><option>Class VI</option>
                <option>Class VII</option><option>Class VIII</option><option>Class IX</option>
                <option>Class X</option><option>Class XI - Science</option><option>Class XI - Commerce</option><option>Class XI - Arts</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Additional Message</label>
              <textarea rows={3} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
            <Button type="submit" size="lg" className="w-full">Submit Application</Button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Admissions;
