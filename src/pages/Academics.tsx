import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { BookOpen, Lightbulb, Users, Brain, GraduationCap, CheckCircle2 } from 'lucide-react';

const Academics = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollReveal();
  const { ref: ref2, isVisible: vis2 } = useScrollReveal();

  const syllabusDetails = [
    {
      grade: 'Pre-Primary',
      ages: '3-5 years',
      sections: 'Nursery, LKG, UKG',
      focus: 'Foundational Learning & Motor Skills',
      subjects: ['Alphabets & Phonics', 'Numbers & Basic Counting', 'Rhymes & Storytelling', 'Art, Craft & Sensory Play', 'Basic Marathi & English Vocabulary'],
      desc: 'Our play-way method ensures early learners build a strong foundation in a stress-free, joyful environment. Emphasis is placed on developing cognitive, social, and fine motor skills.'
    },
    {
      grade: 'Primary',
      ages: '6-10 years',
      sections: 'Class I - V',
      focus: 'Concept Building & Value Education',
      subjects: ['English & Marathi', 'Mathematics', 'Environmental Studies (EVS)', 'Computer Basics', 'Physical Education & Arts'],
      desc: 'Following the state board syllabus, we introduce students to core academic subjects while keeping learning interactive. We integrate local history and basic sanskars to foster moral growth.'
    },
    {
      grade: 'Junior College',
      ages: '16-17 years',
      sections: 'Class XI - XII (Science, Commerce, Arts)',
      focus: 'Board Preparation & Career Readiness',
      subjects: ['Science: Physics, Chemistry, Biology, Math', 'Commerce: Accounts, Economics, OCM', 'Arts: History, Geography, Sociology', 'Languages: English, Marathi/IT'],
      desc: 'A rigorous academic environment preparing students for HSC Board exams and future competitive entrance tests. Focus is heavily on practicals, analytical skills, and career counseling.'
    }
  ];

  const methods = [
    { icon: Lightbulb, title: 'Experiential Learning', desc: 'Hands-on activities, projects, and real-world problem solving' },
    { icon: Users, title: 'Collaborative Learning', desc: 'Group Activities, peer teaching, and team projects' },
    { icon: Brain, title: 'Conceptual Approach', desc: 'Focus on understanding concepts rather than rote memorization' },
    { icon: BookOpen, title: 'Continuous Assessment', desc: 'Regular formative assessments with personalized feedback' },
  ];

  return (
    <Layout>
      <section className="bg-primary py-16">
        <div className="container-school text-center">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground">{t('academics.title')}</h1>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-20 bg-background" ref={ref}>
        <div className={`container-school max-w-4xl ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-6">{t('academics.curriculum')}</h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">Our school proudly follows the Maharashtra State Board of Secondary and Higher Secondary Education curriculum. Rooted deeply in the rich cultural ethos of Maharashtra, we blend modern teaching pedagogies with traditional values (Sanskar). Along with academic rigor in Math and Science, special emphasis is placed on Marathi language proficiency, local history (Shivcharitra), and cultural arts. This ensures our students remain connected to their roots while preparing for global challenges. Our holistic approach fosters character building, physical development, and creative expression through celebration of local festivals, traditional sports, and literature.</p>

          <h3 className="font-display font-semibold text-2xl text-foreground mb-8 mt-12">Syllabus & Academic Flow</h3>
          <div className="space-y-6">
            {syllabusDetails.map((c) => (
              <div key={c.grade} className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 mb-4 gap-2">
                  <div>
                    <h4 className="text-xl font-bold flex items-center gap-2 text-primary">
                      <GraduationCap className="w-6 h-6" />
                      {c.grade}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">{c.sections} <span className="opacity-75 relative top-[-1px] mx-1">•</span> <span className="opacity-75">{c.ages}</span></p>
                  </div>
                  <div className="bg-secondary/10 text-secondary px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap self-start sm:self-auto">
                    {c.focus}
                  </div>
                </div>
                
                <p className="text-foreground/80 text-sm leading-relaxed mb-5">
                  {c.desc}
                </p>

                <div>
                  <h5 className="text-sm font-semibold mb-3 text-foreground">Key Subjects & Focus Areas:</h5>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {c.subjects.map((sub, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section id="methods" className="py-20 bg-muted" ref={ref2}>
        <div className={`container-school ${vis2 ? 'animate-reveal-up' : 'opacity-0'}`}>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground text-center mb-10">Teaching Methodology</h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {methods.map((m, i) => (
              <div key={m.title} className={`bg-card rounded-xl p-6 shadow-sm ${vis2 ? `animate-reveal-up delay-${(i + 1) * 100}` : 'opacity-0'}`}>
                <m.icon className="w-10 h-10 text-secondary mb-3" />
                <h3 className="font-display font-semibold text-foreground text-lg mb-2">{m.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Academics;
