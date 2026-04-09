import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { BookOpen, Lightbulb, Users, Brain } from 'lucide-react';

const Academics = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollReveal();
  const { ref: ref2, isVisible: vis2 } = useScrollReveal();

  const classes = [
    { grade: 'Pre-Primary', ages: '3-5 years', sections: 'Nursery, LKG, UKG' },
    { grade: 'Primary', ages: '6-10 years', sections: 'Class I - V' },
    // { grade: 'Middle School', ages: '11-13 years', sections: 'Class VI - VIII' },
    // { grade: 'Secondary', ages: '14-15 years', sections: 'Class IX - X' },
    { grade: 'Senior Secondary', ages: '16-17 years', sections: 'Class XI - XII (Science, Commerce, Arts)' },
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
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">Our school follows the Maharashtra State Board of Secondary and Higher Secondary Education curriculum, supplemented with additional enrichment programs. The curriculum emphasizes a balanced approach to academic rigor, creative expression, and physical development.</p>

          <h3 className="font-display font-semibold text-xl text-foreground mb-4">Classes Offered</h3>
          <div className="space-y-3">
            {classes.map((c) => (
              <div key={c.grade} className="bg-card rounded-lg p-4 border border-border flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <span className="font-semibold text-foreground min-w-[140px]">{c.grade}</span>
                <span className="text-muted-foreground text-sm">{c.ages}</span>
                <span className="text-muted-foreground text-sm">— {c.sections}</span>
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
