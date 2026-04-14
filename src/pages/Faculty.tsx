import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Users, GraduationCap, Star } from 'lucide-react';

const faculty = [
  { name: 'Hon. Shri. Pravin Mali', role: 'Principal', qual: 'M.Ed., Ph.D. (Education)', exp: '22 years', initials: 'PM', color: 'from-blue-500 to-indigo-600' },
  { name: 'Smt. Alka Pralhad Kamble', role: 'Vice Principal', qual: 'M.Sc., B.Ed.', exp: '18 years', initials: 'AK', color: 'from-purple-500 to-violet-600' },

  { name: 'Smt. Sharvari S. Chinchangi', qual: 'M.Sc. Physics, B.Ed.', exp: '15 years', initials: 'SC', color: 'from-rose-500 to-pink-600' },
  { name: 'Smt. Rekha Patil', qual: 'M.A. English, B.Ed.', exp: '12 years', initials: 'RP', color: 'from-amber-500 to-orange-600' },
  { name: 'Shri Vikas Kulkarni', qual: 'M.A. Hindi, B.Ed.', exp: '14 years', initials: 'VK', color: 'from-teal-500 to-cyan-600' },
  { name: 'Smt. Anjali Bhosale', qual: 'M.A. History, B.Ed.', exp: '10 years', initials: 'AB', color: 'from-green-500 to-emerald-600' },
  { name: 'Shri Prasad Rao', qual: 'M.A B.Ed.', exp: '16 years', initials: 'PR', color: 'from-red-500 to-rose-600' },
  { name: 'Smt. Swapnali S. Patil', qual: 'B.Ed.', exp: '8 years', initials: 'SP', color: 'from-sky-500 to-blue-600' },

  // Added Teachers (random experience)
  { name: 'Sou. Poonam Keshav Gawade', qual: 'B.A B.Ed', exp: '17 years', initials: 'PG', color: 'from-indigo-500 to-purple-600' },
  { name: 'Shrimati. Priyanka P. Gawade', qual: 'B.Sc D.Ed', exp: '9 years', initials: 'PG', color: 'from-pink-500 to-rose-600' },
  { name: 'Sou. Samruddhi S. Tarlekar', qual: 'B.A B.Ed', exp: '6 years', initials: 'ST', color: 'from-green-500 to-teal-600' },
  { name: 'Shri. Asif Khalil Mujawar', qual: 'B.A B.Ed', exp: '11 years', initials: 'AM', color: 'from-yellow-500 to-orange-600' },
  { name: 'Shri. Dhirendra N. Patil', qual: 'M.A B.Ed', exp: '13 years', initials: 'DP', color: 'from-blue-400 to-cyan-600' },
  { name: 'Sou. Smita V. Mulik', qual: 'B.A D.Ed', exp: '7 years', initials: 'SM', color: 'from-emerald-500 to-green-700' },
  { name: 'Sou. Shailaja A. Vhanamani', qual: 'B.A B.Ed', exp: '10 years', initials: 'SV', color: 'from-purple-400 to-indigo-700' },
  { name: 'Sou. Chaya C. Swami', qual: 'M.Com', exp: '12 years', initials: 'CS', color: 'from-rose-400 to-pink-700' },
  { name: 'Sou. Sonali J. Gawade', qual: 'B.Sc', exp: '5 years', initials: 'SG', color: 'from-orange-400 to-red-600' },
  { name: 'Sou. Parveen A. Shaikh', qual: 'B.Sc D.Ed', exp: '8 years', initials: 'PS', color: 'from-teal-400 to-cyan-700' },
  { name: 'Shri. Dayanand R. Kamble', qual: 'M.A D.Ed', exp: '14 years', initials: 'DK', color: 'from-red-400 to-rose-700' },
];


const Faculty = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollReveal();

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 right-0 w-80 h-80 rounded-full bg-secondary/15 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-secondary/10 blur-3xl" />
        </div>
        <div className="container-school text-center relative">
          <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Users className="w-4 h-4" /> Expert Educators
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-primary-foreground mb-4">{t('faculty.title')}</h1>
          <p className="text-primary-foreground/70 max-w-xl mx-auto">Dedicated professionals committed to shaping the future, one student at a time</p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            {[{ value: '35+', label: 'Faculty Members' }, { value: '150+', label: 'Avg. Exp. (Years)' }, { value: '100%', label: 'Qualified & Trained' }].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-display font-bold text-secondary">{s.value}</p>
                <p className="text-xs text-primary-foreground/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="py-20 bg-background" ref={ref}>
        <div className="container-school">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {faculty.map((f, i) => (
              <div
                key={f.name}
                className={`group bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-xl hover:-translate-y-2 transition-all duration-400 ${isVisible ? `animate-reveal-up delay-${(i % 4 + 1) * 100}` : 'opacity-0'}`}
              >
                {/* Avatar stripe */}
                <div className={`h-2 w-full bg-gradient-to-r ${f.color}`} />
                <div className="p-6 text-center">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${f.color} mx-auto mb-4 flex items-center justify-center text-white font-display font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {f.initials}
                  </div>
                  <h3 className="font-display font-bold text-foreground text-base">{f.name}</h3>
                  <p className="text-secondary text-xs font-semibold mt-1 mb-3">{f.role}</p>

                  <div className="space-y-1.5 border-t border-border pt-3">
                    <div className="flex items-center gap-1.5 justify-center text-xs text-muted-foreground">
                      <GraduationCap className="w-3.5 h-3.5 text-secondary shrink-0" />
                      <span>{f.qual}</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-center text-xs text-muted-foreground">
                      <Star className="w-3.5 h-3.5 text-secondary shrink-0" />
                      <span>{f.exp} experience</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Faculty;
