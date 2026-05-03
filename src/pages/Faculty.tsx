import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Users, GraduationCap, Star } from 'lucide-react';

interface FacultyMember {
  id: string;
  name: string;
  role: string | null;
  qual: string | null;
  exp: string | null;
  initials: string | null;
  color: string | null;
  display_order: number;
}

const FALLBACK_COLORS = [
  'from-blue-500 to-indigo-600', 'from-purple-500 to-violet-600',
  'from-rose-500 to-pink-600', 'from-amber-500 to-orange-600',
  'from-teal-500 to-cyan-600', 'from-green-500 to-emerald-600',
];

const Faculty = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollReveal();
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('faculty').select('*').order('display_order').then(({ data }) => {
      setFaculty(data ?? []);
      setLoading(false);
    });
  }, []);

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
            {[
              { value: faculty.length > 0 ? `${faculty.length}+` : '35+', label: 'Faculty Members' },
              { value: '150+', label: 'Avg. Exp. (Years)' },
              { value: '100%', label: 'Qualified & Trained' },
            ].map((s) => (
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
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border animate-pulse">
                  <div className="h-2 bg-gray-200" />
                  <div className="p-6 text-center space-y-3">
                    <div className="w-20 h-20 rounded-2xl bg-gray-200 mx-auto" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                    <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {faculty.map((f, i) => {
                const color = f.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length];
                const initials = f.initials ?? f.name.slice(0, 2).toUpperCase();
                return (
                  <div
                    key={f.id}
                    className={`group bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-xl hover:-translate-y-2 transition-all duration-400 ${isVisible ? `animate-reveal-up delay-${(i % 4 + 1) * 100}` : 'opacity-0'}`}
                  >
                    <div className={`h-2 w-full bg-gradient-to-r ${color}`} />
                    <div className="p-6 text-center">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${color} mx-auto mb-4 flex items-center justify-center text-white font-display font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {initials}
                      </div>
                      <h3 className="font-display font-bold text-foreground text-base">{f.name}</h3>
                      <p className="text-secondary text-xs font-semibold mt-1 mb-3">{f.role ?? ''}</p>
                      <div className="space-y-1.5 border-t border-border pt-3">
                        {f.qual && (
                          <div className="flex items-center gap-1.5 justify-center text-xs text-muted-foreground">
                            <GraduationCap className="w-3.5 h-3.5 text-secondary shrink-0" />
                            <span>{f.qual}</span>
                          </div>
                        )}
                        {f.exp && (
                          <div className="flex items-center gap-1.5 justify-center text-xs text-muted-foreground">
                            <Star className="w-3.5 h-3.5 text-secondary shrink-0" />
                            <span>{f.exp} experience</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Faculty;
