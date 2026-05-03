import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/Layout';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Medal, Trophy, Star, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface Topper {
  id: string;
  name: string;
  class_label: string;
  rank: number;
  percentage: string | null;
  photo_url: string | null;
  academic_year: string;
}

// ─── Avatar ─────────────────────────────────────────────────
const TopperAvatar = ({ photo, name, rank }: { photo?: string | null; name: string; rank: number }) => {
  const [imgError, setImgError] = useState(false);
  const isGold = rank === 1;

  if (photo && !imgError) {
    return (
      <div className="relative shrink-0">
        <img
          src={photo}
          alt={name}
          onError={() => setImgError(true)}
          className={`w-16 h-16 rounded-2xl object-cover shadow-md border-2 ${isGold ? 'border-amber-400' : 'border-slate-300'}`}
        />
        <span className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 border-white shadow ${isGold ? 'bg-amber-400 text-amber-900' : 'bg-slate-300 text-slate-700'}`}>
          {isGold ? '①' : '②'}
        </span>
      </div>
    );
  }

  return (
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-inner ${isGold ? 'bg-gradient-to-br from-amber-300 to-yellow-500' : 'bg-gradient-to-br from-slate-200 to-gray-300'}`}>
      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
    </div>
  );
};

// ─── Card ────────────────────────────────────────────────────
const TopperCard = ({ topper, delay }: { topper: Topper; delay: string }) => {
  const isGold = topper.rank === 1;
  return (
    <div className={`relative rounded-2xl p-5 border-2 flex items-center gap-4 group hover:scale-[1.02] transition-all duration-300 animate-reveal-up ${delay} ${isGold ? 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-amber-300 shadow-amber-100 shadow-lg' : 'bg-gradient-to-br from-slate-50 to-gray-100 border-slate-200 shadow-sm hover:shadow-md'}`}>
      <TopperAvatar photo={topper.photo_url} name={topper.name} rank={topper.rank} />
      <div className="min-w-0 flex-1">
        <p className="font-display font-bold text-foreground text-base truncate">{topper.name}</p>
        <div className="flex items-center gap-2 mt-1">
          {topper.percentage && (
            <>
              <div className={`h-1.5 rounded-full flex-1 max-w-[80px] ${isGold ? 'bg-amber-200' : 'bg-slate-200'}`}>
                <div className={`h-full rounded-full ${isGold ? 'bg-amber-500' : 'bg-slate-400'}`} style={{ width: topper.percentage }} />
              </div>
              <span className={`text-sm font-bold ${isGold ? 'text-amber-600' : 'text-slate-500'}`}>{topper.percentage}</span>
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">Rank #{topper.rank}</p>
      </div>
      {isGold && <Star className="w-4 h-4 text-amber-400 absolute top-3 right-3 animate-pulse" />}
    </div>
  );
};

// ─── Page ────────────────────────────────────────────────────
const Toppers = () => {
  const { ref: heroRef, isVisible: heroVis } = useScrollReveal();
  const { ref: gridRef, isVisible: gridVis } = useScrollReveal();
  const [toppers, setToppers] = useState<Topper[]>([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState('');

  useEffect(() => {
    supabase.from('toppers').select('*').order('class_label').order('rank').then(({ data }) => {
      setToppers(data ?? []);
      setLoading(false);
    });
  }, []);

  const years = [...new Set(toppers.map((t) => t.academic_year))].sort().reverse();

  const filtered = yearFilter ? toppers.filter((t) => t.academic_year === yearFilter) : toppers;

  // Group by class_label
  const groups = filtered.reduce<Record<string, Topper[]>>((acc, t) => {
    if (!acc[t.class_label]) acc[t.class_label] = [];
    acc[t.class_label].push(t);
    return acc;
  }, {});

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-primary py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-secondary/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
        </div>
        <div className="container-school text-center relative" ref={heroRef}>
          <div className={`${heroVis ? 'animate-reveal-up' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <Trophy className="w-4 h-4" /> Hall of Fame {yearFilter || years[0] || '2025-26'}
            </div>
            <h1 className="text-4xl sm:text-6xl font-display font-bold text-primary-foreground mb-4">🏆 Our Toppers</h1>
            <p className="text-primary-foreground/75 max-w-2xl mx-auto text-lg">
              Celebrating academic stars from Class 1st to Junior College — every rank tells a story of hard work and dedication.
            </p>
          </div>

          {/* Stats row */}
          <div className={`mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto ${heroVis ? 'animate-reveal-up delay-200' : 'opacity-0'}`}>
            {[
              { icon: Award,      value: `${Object.keys(groups).length}`,  label: 'Classes'   },
              { icon: Medal,      value: `${filtered.length}`,             label: 'Toppers'   },
              { icon: TrendingUp, value: '97%',                            label: 'Avg Score' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mx-auto mb-2">
                  <s.icon className="w-6 h-6 text-secondary" />
                </div>
                <p className="text-2xl font-display font-bold text-secondary">{s.value}</p>
                <p className="text-xs text-primary-foreground/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Toppers Grid */}
      <section className="py-20 bg-background" ref={gridRef}>
        <div className="container-school max-w-5xl">

          {/* Year Filter */}
          {years.length > 1 && (
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              <button
                onClick={() => setYearFilter('')}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${!yearFilter ? 'bg-primary text-primary-foreground border-primary' : 'border-gray-300 hover:border-primary'}`}
              >
                All Years
              </button>
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setYearFilter(y)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${yearFilter === y ? 'bg-primary text-primary-foreground border-primary' : 'border-gray-300 hover:border-primary'}`}
                >
                  {y}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="space-y-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-4 animate-pulse">
                  <div className="h-8 bg-gray-100 rounded-full w-40 mx-auto" />
                  <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <div className="h-24 bg-gray-100 rounded-2xl" />
                    <div className="h-24 bg-gray-100 rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groups).map(([label, groupToppers], gi) => (
                <div key={label} className={`${gridVis ? `animate-reveal-up delay-${Math.min((gi + 1) * 100, 600)}` : 'opacity-0'}`}>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                    <div className="flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-1.5">
                      <Medal className="w-4 h-4 text-secondary" />
                      <span className="font-display font-semibold text-primary text-sm">{label}</span>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {groupToppers.map((t) => (
                      <TopperCard key={t.id} topper={t} delay={`delay-${t.rank * 100}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-20 py-12 rounded-3xl bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 border border-primary/10">
            <Trophy className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="text-2xl font-display font-bold text-foreground mb-2">Could your child be next?</h3>
            <p className="text-muted-foreground mb-6">Join Gurukul Vidyalay and be part of a legacy of excellence.</p>
            <Button asChild size="lg">
              <Link to="/admissions">Apply for Admission →</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Toppers;
