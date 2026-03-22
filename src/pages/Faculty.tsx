import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const Faculty = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollReveal();

  const faculty = [
    { name: 'Dr. Kavita Joshi', role: 'Principal', qual: 'M.Ed., Ph.D. (Education)', exp: '22 years', initials: 'KJ' },
    { name: 'Shri Anil Deshmukh', role: 'Vice Principal & Mathematics', qual: 'M.Sc., B.Ed.', exp: '18 years', initials: 'AD' },
    { name: 'Smt. Meena Sharma', role: 'Head of Science Dept.', qual: 'M.Sc. Physics, B.Ed.', exp: '15 years', initials: 'MS' },
    { name: 'Smt. Rekha Patil', role: 'English Department', qual: 'M.A. English, B.Ed.', exp: '12 years', initials: 'RP' },
    { name: 'Shri Vikas Kulkarni', role: 'Hindi & Sanskrit', qual: 'M.A. Hindi, B.Ed.', exp: '14 years', initials: 'VK' },
    { name: 'Smt. Anjali Bhosale', role: 'Social Studies', qual: 'M.A. History, B.Ed.', exp: '10 years', initials: 'AB' },
    { name: 'Shri Prasad Rao', role: 'Physical Education', qual: 'M.P.Ed.', exp: '16 years', initials: 'PR' },
    { name: 'Smt. Sneha Nair', role: 'Computer Science', qual: 'M.Tech. (CS), B.Ed.', exp: '8 years', initials: 'SN' },
  ];

  return (
    <Layout>
      <section className="bg-primary py-16">
        <div className="container-school text-center">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground">{t('faculty.title')}</h1>
        </div>
      </section>

      <section className="py-20 bg-background" ref={ref}>
        <div className="container-school">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {faculty.map((f, i) => (
              <div key={f.name} className={`bg-card rounded-xl p-6 shadow-sm border border-border text-center hover:shadow-lg transition-shadow ${isVisible ? `animate-reveal-up delay-${(i % 4 + 1) * 100}` : 'opacity-0'}`}>
                <div className="w-20 h-20 rounded-full bg-primary mx-auto mb-4 flex items-center justify-center text-primary-foreground font-display font-bold text-xl">
                  {f.initials}
                </div>
                <h3 className="font-display font-semibold text-foreground">{f.name}</h3>
                <p className="text-secondary text-sm font-medium mt-1">{f.role}</p>
                <p className="text-muted-foreground text-xs mt-2">{f.qual}</p>
                <p className="text-muted-foreground text-xs">{f.exp} experience</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Faculty;
