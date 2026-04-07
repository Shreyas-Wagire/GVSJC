import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Building2, Eye, Target, UserCheck, BookOpen, Beaker, Monitor, Trees } from 'lucide-react';

const PageHeader = ({ title }: { title: string }) => (
  <section className="bg-primary py-16">
    <div className="container-school text-center">
      <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground">{title}</h1>
    </div>
  </section>
);

const About = () => {
  const { t } = useLanguage();
  const { ref: histRef, isVisible: histVis } = useScrollReveal();
  const { ref: visRef, isVisible: visVis } = useScrollReveal();
  const { ref: princRef, isVisible: princVis } = useScrollReveal();
  const { ref: infraRef, isVisible: infraVis } = useScrollReveal();

  const infrastructure = [
    { icon: BookOpen, title: 'Library', desc: 'Over 1500 books, journals, and digital resources' },
    { icon: Beaker, title: 'Science Labs', desc: 'Physics, Chemistry, Biology labs with modern equipment' },
    { icon: Monitor, title: 'Computer Lab', desc: '20 computers with high-speed internet and latest software' },
    { icon: Trees, title: 'Sports Grounds', desc: 'Cricket, football and athletics track' },
  ];

  return (
    <Layout>
      <PageHeader title={t('about.page.title')} />

      {/* History */}
      <section className="py-20 bg-background" ref={histRef}>
        <div className={`container-school max-w-4xl ${histVis ? 'animate-reveal-up' : 'opacity-0'}`}>
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-8 h-8 text-secondary" />
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">{t('about.history.title')}</h2>
          </div>
          <div className="prose prose-lg text-muted-foreground space-y-4">
            <p>Founded in 2016 by Shri Ramesh Chandra Mali, Gurukul Vidyalay & Jr. College began as a modest school with just 3 classrooms and 47 students in Kolhapur's Chokak area. Driven by the vision of providing quality education rooted in Indian values, the school has grown into one of the most respected educational institutions in Maharashtra.</p>
            <p>Over the decades, we have expanded our campus to include modern facilities while maintaining our commitment to the holistic development of every child. Today, with over 1,200 students and 42 dedicated teachers, we continue to uphold the traditions of excellence that our founders envisioned.</p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-muted" ref={visRef}>
        <div className={`container-school max-w-4xl ${visVis ? 'animate-reveal-up' : 'opacity-0'}`}>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-xl p-8 shadow-sm">
              <Eye className="w-8 h-8 text-secondary mb-4" />
              <h3 className="font-display font-bold text-xl text-foreground mb-3">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">To be a centre of excellence in education that nurtures responsible, creative, and compassionate citizens who contribute positively to society and the nation.</p>
            </div>
            <div className="bg-card rounded-xl p-8 shadow-sm">
              <Target className="w-8 h-8 text-secondary mb-4" />
              <h3 className="font-display font-bold text-xl text-foreground mb-3">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">To provide a stimulating learning environment that fosters academic excellence, moral values, physical fitness, and cultural awareness, preparing students for lifelong learning and global citizenship.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="py-20 bg-background" ref={princRef}>
        <div className={`container-school max-w-4xl ${princVis ? 'animate-reveal-up' : 'opacity-0'}`}>
          <div className="flex items-center gap-3 mb-6">
            <UserCheck className="w-8 h-8 text-secondary" />
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">{t('about.principal.title')}</h2>
          </div>
          <div className="bg-card rounded-xl p-8 shadow-sm border border-border">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-2xl shrink-0 mx-auto sm:mx-0">
                DK
              </div>
              <div>
                <p className="text-muted-foreground leading-relaxed mb-4">"At Gurukul Vidyalay & Jr. College, we believe that every child is unique and capable of achieving greatness. Our role as educators is to ignite the spark of curiosity, nurture their talents, and guide them towards becoming responsible citizens. We are committed to providing an environment where learning is joyful, values are lived, and dreams take flight."</p>
                <p className="font-semibold text-foreground">Mr. Pravin Mali</p>
                <p className="text-sm text-muted-foreground">B.A,B.S (Education)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="py-20 bg-muted" ref={infraRef}>
        <div className={`container-school ${infraVis ? 'animate-reveal-up' : 'opacity-0'}`}>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground text-center mb-10">{t('about.infrastructure.title')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {infrastructure.map((item, i) => (
              <div key={item.title} className={`bg-card rounded-xl p-6 shadow-sm text-center ${infraVis ? `animate-reveal-up delay-${(i + 1) * 100}` : 'opacity-0'}`}>
                <item.icon className="w-10 h-10 text-secondary mx-auto mb-3" />
                <h3 className="font-display font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
