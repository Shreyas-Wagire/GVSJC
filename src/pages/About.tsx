import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Building2, Eye, Target, UserCheck, BookOpen, Beaker, Monitor, Trees, CheckCircle } from 'lucide-react';

const milestones = [
  { year: '2016', title: 'School Founded', desc: 'Established by Shri Ramesh Chandra Mali with 47 students and 3 classrooms.' },
  { year: '2018', title: 'Primary Wing Expanded', desc: 'New classrooms added for Classes I–V. Student strength crossed 200.' },
  { year: '2020', title: 'Jr. College Launched', desc: 'Introduced HSC streams (Science, Commerce, Arts) under Shivaji University.' },
  { year: '2022', title: 'Smart Classrooms', desc: 'Installed interactive digital boards in all classrooms for modern learning.' },
  { year: '2024', title: '97% Board Results', desc: 'Achieved 97% HSC pass rate, highest in the taluka for the third year.' },
  { year: '2026', title: 'Growing Strong', desc: 'Over 700 students, 35+ faculty, and counting. Admissions open for 2026-27.' },
];

const infrastructure = [
  { icon: BookOpen, title: 'Library', desc: 'Over 1500 books, journals, and digital resources', color: 'bg-blue-50 text-blue-600' },
  { icon: Beaker, title: 'Science Labs', desc: 'Physics, Chemistry, Biology labs with modern equipment', color: 'bg-purple-50 text-purple-600' },
  { icon: Monitor, title: 'Computer Lab', desc: '20 computers with high-speed internet and latest software', color: 'bg-green-50 text-green-600' },
  { icon: Trees, title: 'Sports Grounds', desc: 'Cricket, football and athletics track with ample open space', color: 'bg-amber-50 text-amber-600' },
];

const values = [
  'Academic Excellence', 'Indian Values & Culture', 'Inclusive Education',
  'Holistic Development', 'Community Engagement', 'Digital Literacy',
];

const About = () => {
  const { t } = useLanguage();
  const { ref: histRef, isVisible: histVis } = useScrollReveal();
  const { ref: visRef, isVisible: visVis } = useScrollReveal();
  const { ref: princRef, isVisible: princVis } = useScrollReveal();
  const { ref: infraRef, isVisible: infraVis } = useScrollReveal();
  const { ref: valRef, isVisible: valVis } = useScrollReveal();

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 right-0 w-96 h-96 rounded-full bg-secondary/15 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-secondary/10 blur-3xl" />
        </div>
        <div className="container-school text-center relative">
          <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Building2 className="w-4 h-4" /> Est. 2016
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-primary-foreground mb-4">{t('about.page.title')}</h1>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">A decade of nurturing young minds with values, knowledge, and purpose</p>
        </div>
      </section>

      {/* History + Timeline */}
      <section className="py-20 bg-background" ref={histRef}>
        <div className="container-school">
          <div className={`text-center mb-12 ${histVis ? 'animate-reveal-up' : 'opacity-0'}`}>
            <p className="text-secondary font-semibold text-sm tracking-widest uppercase mb-2">Our Journey</p>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">{t('about.history.title')}</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              Founded in 2016 by Shri Ramesh Chandra Mali, Gurukul Vidyalay & Jr. College began with a vision of quality education rooted in Indian values. A decade later, we stand as one of the most respected institutions in Kolhapur district.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary via-secondary/50 to-transparent -translate-x-1/2" />

            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div
                  key={m.year}
                  className={`flex gap-6 items-start ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'} ${histVis ? `animate-reveal-up delay-${(i + 1) * 100}` : 'opacity-0'}`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? 'sm:text-right' : 'sm:text-left'} pl-14 sm:pl-0`}>
                    <div className={`bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow ${i % 2 === 0 ? 'sm:mr-8' : 'sm:ml-8'}`}>
                      <span className="inline-block text-xs font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full mb-2">{m.year}</span>
                      <h3 className="font-display font-semibold text-foreground">{m.title}</h3>
                      <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{m.desc}</p>
                    </div>
                  </div>

                  {/* Dot */}
                  <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-secondary border-4 border-background shadow mt-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-muted" ref={visRef}>
        <div className="container-school max-w-5xl">
          <div className={`text-center mb-10 ${visVis ? 'animate-reveal-up' : 'opacity-0'}`}>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">{t('about.vision.title')}</h2>
          </div>
          <div className={`grid md:grid-cols-2 gap-6 ${visVis ? 'animate-reveal-up delay-100' : 'opacity-0'}`}>
            <div className="bg-card rounded-2xl p-8 shadow-sm border border-border hover:shadow-lg transition-shadow group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-xl text-foreground mb-3">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">To be a centre of excellence that nurtures responsible, creative, and compassionate citizens who contribute positively to society and the nation.</p>
            </div>
            <div className="bg-card rounded-2xl p-8 shadow-sm border border-border hover:shadow-lg transition-shadow group">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-5 group-hover:bg-secondary/20 transition-colors">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-display font-bold text-xl text-foreground mb-3">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">To provide a stimulating environment that fosters academic excellence, moral values, physical fitness, and cultural awareness — preparing students for lifelong success.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-background" ref={valRef}>
        <div className="container-school max-w-4xl">
          <div className={`text-center mb-8 ${valVis ? 'animate-reveal-up' : 'opacity-0'}`}>
            <h2 className="text-2xl font-display font-bold text-foreground">What We Stand For</h2>
          </div>
          <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 ${valVis ? 'animate-reveal-up delay-100' : 'opacity-0'}`}>
            {values.map((v) => (
              <div key={v} className="flex items-center gap-2 bg-muted rounded-xl px-4 py-3">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0" />
                <span className="text-sm font-medium text-foreground">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="py-20 bg-muted" ref={princRef}>
        <div className="container-school max-w-4xl">
          <div className={`${princVis ? 'animate-reveal-up' : 'opacity-0'}`}>
            <p className="text-secondary font-semibold text-sm tracking-widest uppercase mb-2 text-center">{t('about.principal.title')}</p>
            <div className="bg-card rounded-3xl p-8 sm:p-10 shadow-sm border border-border mt-6 relative">
              <div className="text-6xl text-secondary/20 font-display absolute top-6 left-8 leading-none select-none">"</div>
              <div className="flex flex-col sm:flex-row gap-6 items-start relative">
                <div className="shrink-0 mx-auto sm:mx-0">
                  <div className="w-40 h-40 sm:w-48 sm:h-56 rounded-2xl overflow-hidden shadow-lg border-2 border-primary/20">
                    <img src="/principle.png" alt="Principal" className="w-full h-full object-cover object-top" />
                  </div>
                </div>
                <div>
                  <p className="text-foreground/80 leading-relaxed text-base italic mb-6">
                    "At Gurukul Vidyalay & Jr. College, we believe that every child is unique and capable of achieving greatness. Our role as educators is to ignite the spark of curiosity, nurture their talents, and guide them towards becoming responsible citizens. We are committed to providing an environment where learning is joyful, values are lived, and dreams take flight."
                  </p>
                  <div>
                    <p className="font-display font-bold text-foreground text-lg">Mr. Pravin Mali</p>
                    <p className="text-sm text-secondary font-medium">Principal, Gurukul Vidyalay & Jr. College</p>
                    <p className="text-xs text-muted-foreground mt-0.5">B.A, B.S (Education)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="py-20 bg-background" ref={infraRef}>
        <div className="container-school">
          <div className={`text-center mb-10 ${infraVis ? 'animate-reveal-up' : 'opacity-0'}`}>
            <p className="text-secondary font-semibold text-sm tracking-widest uppercase mb-2">Top-Class Facilities</p>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">{t('about.infrastructure.title')}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {infrastructure.map((item, i) => (
              <div
                key={item.title}
                className={`bg-card rounded-2xl p-6 shadow-sm border border-border text-center group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${infraVis ? `animate-reveal-up delay-${(i + 1) * 100}` : 'opacity-0'}`}
              >
                <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
