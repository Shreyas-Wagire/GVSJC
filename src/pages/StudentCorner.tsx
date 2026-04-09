import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { BookOpen, Download, ClipboardList, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StudentCorner = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollReveal();

  const downloads = [
    { title: 'Class V Syllabus 2025-26 (Maharashtra Board)', type: 'PDF', size: '2.3 MB' },
    { title: 'Class XI Physics Notes - Ch 1 (HSC)', type: 'PDF', size: '1.8 MB' },
    { title: 'Holiday Homework (Summer 2026)', type: 'PDF', size: '450 KB' },
    { title: 'Lab Manual - Chemistry (Class XI–XII)', type: 'PDF', size: '3.1 MB' },
    { title: 'Mathematics Formula Sheet (Primary)', type: 'PDF', size: '680 KB' },
  ];

  const results = [
    { exam: 'HSC Board (Class XII) 2024', toppers: 'Omkar Kale (96%)', passRate: '98.5%' },
    { exam: 'Class V Annual Exam 2024', toppers: 'Vedant Bhosale (98%)', passRate: '100%' },
    { exam: 'Term 1 (2025-26)', toppers: 'Available on portal', passRate: '97%' },
  ];

  return (
    <Layout>
      <section className="bg-primary py-16">
        <div className="container-school text-center">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground">{t('students.title')}</h1>
        </div>
      </section>

      <section className="py-20 bg-background" ref={ref}>
        <div className={`container-school ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Downloads */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Download className="w-6 h-6 text-secondary" />
                <h2 className="text-2xl font-display font-bold text-foreground">Downloads</h2>
              </div>
              <div className="space-y-3">
                {downloads.map((d) => (
                  <div key={d.title} className="bg-card rounded-lg p-4 border border-border flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground text-sm">{d.title}</p>
                      <p className="text-xs text-muted-foreground">{d.type} • {d.size}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-3 h-3 mr-1" /> Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Results */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-6 h-6 text-secondary" />
                <h2 className="text-2xl font-display font-bold text-foreground">Results</h2>
              </div>
              <div className="space-y-4">
                {results.map((r) => (
                  <div key={r.exam} className="bg-card rounded-lg p-5 border border-border">
                    <h3 className="font-semibold text-foreground">{r.exam}</h3>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Topper: </span>
                        <span className="text-foreground">{r.toppers}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pass Rate: </span>
                        <span className="text-secondary font-semibold">{r.passRate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardList className="w-6 h-6 text-secondary" />
                  <h2 className="text-2xl font-display font-bold text-foreground">Homework</h2>
                </div>
                <div className="bg-card rounded-lg p-5 border border-border text-center">
                  <p className="text-muted-foreground text-sm">Login to the student portal to view daily homework and assignments.</p>
                  <Button className="mt-4" size="sm">Student Login</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default StudentCorner;
