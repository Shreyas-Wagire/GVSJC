import Layout from '@/components/Layout';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Medal, Trophy, Star, TrendingUp, Award, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToppers } from '@/hooks/useToppers';
import { Loader2 } from 'lucide-react';

// ─────────────────────────────────────────────
//  DATA — Add a `photo` path to show a real image.
//  Drop the photo file inside public/toppers/ and
//  set photo: '/toppers/filename.jpg'
//  If photo is omitted, the card shows emoji instead.
// ─────────────────────────────────────────────
const classGroups = [
  {
    label: '1st Std',
    toppers: [
      { rank: 1, name: 'Aarav Patil',     percentage: '98%', photo: '/toppers/aarav-patil.png'     },
      { rank: 2, name: 'Sneha Kulkarni',   percentage: '97%', photo: '/toppers/sneha-kulkarni.png'  },
    ],
  },
  {
    label: '2nd Std',
    toppers: [
      { rank: 1, name: 'Ananya More',     percentage: '98%', photo: '/toppers/ananya-more.png'     },
      { rank: 2, name: 'Rohan Deshmukh',   percentage: '97%', photo: '/toppers/rohan-deshmukh.png'   },
    ],
  },
  {
    label: '3rd Std',
    toppers: [
      { rank: 1, name: 'Priya Gaikwad ',  percentage: '99%', photo: '/toppers/priya-gaikwad.png'  },
      { rank: 2, name: 'Yash Shinde',     percentage: '96%', photo: '/toppers/yash-shinde.png'     },
    ],
  },
  {
    label: '4th Std',
    toppers: [
      { rank: 1, name: 'Arjun Jadhav',    percentage: '99%', photo: '/toppers/arjun-jadhav.png'    },
      { rank: 2, name: 'Isha Pawar',      percentage: '97%', photo: '/toppers/isha-pawar.png'      },
    ],
  },
  {
    label: '5th Std',
    toppers: [
      { rank: 1, name: 'Vedant Bhosale',  percentage: '98%', photo: '/toppers/vedant-bhosale.png'  },
      { rank: 2, name: 'Mahi Salunke',    percentage: '97%', photo: '/toppers/mahi-salunke.png'    },
    ],
  },
  {
    label: '11th (HSC)',
    toppers: [
      { rank: 1, name: 'Shreya Wagh',     percentage: '94%', photo: '/toppers/shreya-wagh.png'     },
      { rank: 2, name: 'Siddhi Mane',     percentage: '92%', photo: '/toppers/siddhi-mane.png'     },
    ],
  },
  {
    label: '12th (HSC)',
    toppers: [
      { rank: 1, name: 'Omkar Kale',      percentage: '96%', photo: '/toppers/omkar-kale.png'      },
      { rank: 2, name: 'Rutuja Deshpande',percentage: '95%', photo: '/toppers/rutuja-deshpande.png'},
    ],
  },
];

// ─────────────────────────────────────────────
//  Avatar — shows photo if available, emoji fallback
// ─────────────────────────────────────────────
const TopperAvatar = ({
  photo,
  name,
  rank,
}: {
  photo?: string;
  name: string;
  rank: number;
}) => {
  const [imgError, setImgError] = useState(false);
  const isGold = rank === 1;

  if (photo && !imgError) {
    return (
      <div className={`relative shrink-0`}>
        <img
          src={photo}
          alt={name}
          onError={() => setImgError(true)}
          className={`w-16 h-16 rounded-2xl object-cover shadow-md border-2 ${
            isGold ? 'border-amber-400' : 'border-slate-300'
          }`}
        />
        {/* Rank badge on photo */}
        <span
          className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 border-white shadow ${
            isGold ? 'bg-amber-400 text-amber-900' : 'bg-slate-300 text-slate-700'
          }`}
        >
          {isGold ? '①' : '②'}
        </span>
      </div>
    );
  }

  // Fallback — emoji in gradient circle
  return (
    <div
      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-inner ${
        isGold
          ? 'bg-gradient-to-br from-amber-300 to-yellow-500'
          : 'bg-gradient-to-br from-slate-200 to-gray-300'
      }`}
    >
      {isGold ? '🥇' : '🥈'}
    </div>
  );
};

// ─────────────────────────────────────────────
//  Card
// ─────────────────────────────────────────────
const TopperCard = ({
  topper,
  delay,
}: {
  topper: { rank: number; name: string; percentage: string; photo?: string };
  delay: string;
}) => {
  const isGold = topper.rank === 1;
  return (
    <div
      className={`relative rounded-2xl p-5 border-2 flex items-center gap-4 group hover:scale-[1.02] transition-all duration-300 animate-reveal-up ${delay} ${
        isGold
          ? 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-amber-300 shadow-amber-100 shadow-lg'
          : 'bg-gradient-to-br from-slate-50 to-gray-100 border-slate-200 shadow-sm hover:shadow-md'
      }`}
    >
      <TopperAvatar photo={topper.photo} name={topper.name} rank={topper.rank} />

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="font-display font-bold text-foreground text-base truncate">{topper.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className={`h-1.5 rounded-full flex-1 max-w-[80px] ${isGold ? 'bg-amber-200' : 'bg-slate-200'}`}>
            <div
              className={`h-full rounded-full ${isGold ? 'bg-amber-500' : 'bg-slate-400'}`}
              style={{ width: topper.percentage }}
            />
          </div>
          <span className={`text-sm font-bold ${isGold ? 'text-amber-600' : 'text-slate-500'}`}>
            {topper.percentage}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">Rank #{topper.rank}</p>
      </div>

      {isGold && <Star className="w-4 h-4 text-amber-400 absolute top-3 right-3 animate-pulse" />}
    </div>
  );
};

// ─────────────────────────────────────────────
//  Page
// ─────────────────────────────────────────────
const Toppers = () => {
  const { ref: heroRef, isVisible: heroVis } = useScrollReveal();
  const { ref: gridRef, isVisible: gridVis } = useScrollReveal();
  const { toppers: dbToppers, isLoading } = useToppers();

  let dynamicGroups: any[] = [];
  if (dbToppers && dbToppers.length > 0) {
    const years = [...new Set(dbToppers.map(t => t.academic_year))];
    dynamicGroups = years.map(year => {
      const yearToppers = dbToppers.filter(t => t.academic_year === year);
      const classes = [...new Set(yearToppers.map(t => t.class))];
      
      return {
        year,
        classes: classes.map(c => ({
          label: c,
          toppers: yearToppers.filter(t => t.class === c).map(t => ({
            rank: t.rank,
            name: t.name,
            percentage: t.marks,
            photo: t.photo_url
          }))
        }))
      };
    });
  } else {
    // Wrap fallback data in a default year structure so render logic is the same
    dynamicGroups = [{
      year: '2025-26',
      classes: classGroups
    }];
  }

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
              <Trophy className="w-4 h-4" /> Hall of Fame 2025-26
            </div>
            <h1 className="text-4xl sm:text-6xl font-display font-bold text-primary-foreground mb-4">
              🏆 Our Toppers
            </h1>
            <p className="text-primary-foreground/75 max-w-2xl mx-auto text-lg">
              Celebrating academic stars from Class 1st to Junior College — every rank tells a story of hard work and dedication.
            </p>
          </div>

          {/* Stats row */}
          <div className={`mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto ${heroVis ? 'animate-reveal-up delay-200' : 'opacity-0'}`}>
            {[
              { icon: Award,     value: '7',   label: 'Classes'   },
              { icon: Medal,     value: '14',  label: 'Toppers'   },
              { icon: TrendingUp,value: '97%', label: 'Avg Score' },
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


          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <div className="space-y-16">
              {dynamicGroups.map((yearGroup, yi) => (
                <div key={yearGroup.year} className={`${gridVis ? `animate-reveal-up delay-${Math.min((yi + 1) * 100, 600)}` : 'opacity-0'}`}>
                  
                  {/* Academic Year Heading */}
                  <div className="text-center mb-10">
                    <span className="inline-block bg-primary text-primary-foreground font-display font-bold px-6 py-2 rounded-full text-xl shadow-md">
                      Academic Year {yearGroup.year}
                    </span>
                  </div>

                  <div className="space-y-12">
                    {yearGroup.classes.map((group: any, gi: number) => (
                      <div key={group.label}>
                        {/* Divider heading */}
                        <div className="flex items-center gap-4 mb-5">
                          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                          <div className="flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-1.5">
                            <Medal className="w-4 h-4 text-secondary" />
                            <span className="font-display font-semibold text-primary text-sm">{group.label}</span>
                          </div>
                          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                        </div>

                        {/* Cards */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto justify-center">
                          {group.toppers.map((topper: any, i: number) => (
                            <TopperCard
                              key={topper.name + i}
                              topper={topper}
                              delay={`delay-${(i + 1) * 100}`}
                            />
                          ))}
                        </div>
                      </div>
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
