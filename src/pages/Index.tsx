import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import heroImg from '@/assets/school-hero.jpg';
import { GraduationCap, Users, Award, TrendingUp, BookOpen, FlaskConical, Music, Laptop, Quote, Medal, Bell, AlertCircle, Info, CalendarDays, PartyPopper } from 'lucide-react';

const StatCard = ({ value, label, delay }: { value: string; label: string; delay: string }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className={`text-center p-6 ${isVisible ? `animate-reveal-up ${delay}` : 'opacity-0'}`}>
      <div className="text-3xl sm:text-4xl font-display font-bold text-secondary mb-1">{value}</div>
      <div className="text-sm text-primary-foreground/80">{label}</div>
    </div>
  );
};

const HighlightBanner = () => {
  const { t } = useLanguage();
  return (
    <div className="bg-secondary/10 border-b border-secondary/20">
      <div className="container-school py-3 flex flex-wrap justify-center gap-4 sm:gap-8 text-sm font-medium">
        <span className="animate-fade-in">{t('highlights.admissions')}</span>
        <span className="animate-fade-in delay-200">{t('highlights.results')}</span>
        <span className="animate-fade-in delay-400">{t('highlights.events')}</span>
      </div>
    </div>
  );
};

const HeroSection = () => {
  const { t } = useLanguage();
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <img src={heroImg} alt="Gurukul Vidyalay & Jr. College campus" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-primary/70" />
      <div className="relative container-school py-24">
        <div className="max-w-2xl">
          <p className="text-secondary font-semibold text-sm tracking-widest uppercase mb-4 animate-reveal-up">Maharashtra State Board | Est. 2016</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-primary-foreground leading-[1.1] mb-6 animate-reveal-up delay-100">
            {t('hero.tagline')}
          </h2>
          <p className="text-lg text-primary-foreground/85 leading-relaxed mb-8 max-w-lg animate-reveal-up delay-200">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-wrap gap-4 animate-reveal-up delay-300">
            <Button variant="hero" size="lg" asChild>
              <Link to="/admissions">{t('hero.apply')}</Link>
            </Button>
            <Button variant="hero-outline" size="lg" asChild>
              <Link to="/about">{t('hero.explore')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatsSection = () => {
  const { t } = useLanguage();
  return (
    <section className="bg-primary text-primary-foreground py-12">
      <div className="container-school grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard value="39+" label={t('stats.years')} delay="delay-100" />
        <StatCard value="700+" label={t('stats.students')} delay="delay-200" />
        <StatCard value="35+" label={t('stats.teachers')} delay="delay-300" />
        <StatCard value="97%" label={t('stats.pass')} delay="delay-400" />
      </div>
    </section>
  );
};

const AboutSection = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollReveal();
  return (
    <section className="py-20 bg-background" ref={ref}>
      <div className="container-school">
        <div className={`max-w-3xl mx-auto text-center ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <p className="text-secondary font-semibold text-sm tracking-widest uppercase mb-3">Welcome</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-6">{t('about.title')}</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">{t('about.desc')}</p>
          <Button variant="outline" className="mt-8" asChild>
            <Link to="/about">Learn More →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const features = [
    { icon: BookOpen, title: 'Strong Academics', desc: 'Maharashtra State Board curriculum with focus on conceptual learning, Marathi medium and semi-English medium.' },
    { icon: FlaskConical, title: 'Science & Computer Lab', desc: 'Well-equipped science and computer laboratories for Jr. College students.' },
    { icon: Music, title: 'Co-curricular Activities', desc: 'Music, dance, art, sports, and cultural events for holistic development.' },
    { icon: Laptop, title: 'Digital Learning', desc: 'Smart classrooms with interactive boards and digital learning resources.' },
  ];

  return (
    <section className="py-20 bg-muted" ref={ref}>
      <div className="container-school">
        <div className={`text-center mb-12 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <p className="text-secondary font-semibold text-sm tracking-widest uppercase mb-3">Why Choose Us</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">What Makes Us Special</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`bg-card rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow ${isVisible ? `animate-reveal-up delay-${(i + 1) * 100}` : 'opacity-0'
                }`}
            >
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-display font-semibold text-foreground text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const NoticeBoardSection = () => {
  const { ref, isVisible } = useScrollReveal();

  const notices = [
    {
      id: 1,
      tag: 'Exam',
      tagColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      icon: AlertCircle,
      iconColor: 'text-red-500',
      title: 'Annual Examination Schedule 2025-26',
      desc: 'Final examinations for all classes (I–V & XI–XII) will commence from 15th April 2026. Detailed timetables are available at the school office.',
      date: '09 Apr 2026',
      isNew: true,
    },
    {
      id: 2,
      tag: 'Holiday',
      tagColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      icon: CalendarDays,
      iconColor: 'text-amber-500',
      title: 'Summer Vacation Notice',
      desc: 'School will remain closed for summer vacation from 1st May to 15th June 2026. Re-opening date will be intimated shortly.',
      date: '07 Apr 2026',
      isNew: true,
    },
    {
      id: 3,
      tag: 'Event',
      tagColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      icon: PartyPopper,
      iconColor: 'text-purple-500',
      title: 'Annual Sports Day – 20th April 2026',
      desc: 'All parents are cordially invited to the Annual Sports Day on 20th April 2026 at 9:00 AM on the school grounds. Students must arrive in sports uniform.',
      date: '05 Apr 2026',
      isNew: false,
    },
    {
      id: 4,
      tag: 'General',
      tagColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      icon: Info,
      iconColor: 'text-blue-500',
      title: 'Fee Payment Reminder – Last Date 20th April',
      desc: 'Parents are requested to clear the pending Term 2 fees before 20th April 2026 to avoid late fine. Contact: 70832 37878.',
      date: '03 Apr 2026',
      isNew: false,
    },
    {
      id: 5,
      tag: 'Admissions',
      tagColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      icon: Bell,
      iconColor: 'text-green-500',
      title: 'Admissions Open for 2026-27 Academic Year',
      desc: 'Admissions for Pre-Primary (Nursery–UKG), Primary (Class I–V), and Jr. College (XI–XII) are now open. Limited seats available. Apply early.',
      date: '01 Apr 2026',
      isNew: false,
    },
  ];

  // Ticker notices
  const tickerTexts = notices.map(n => `📌 ${n.title}`);

  return (
    <section id="notices" className="py-20 bg-muted" ref={ref}>
      {/* Scrolling ticker */}
      <div className="bg-primary text-primary-foreground py-2 overflow-hidden mb-10">
        <div className="flex whitespace-nowrap animate-marquee text-sm font-medium gap-12">
          {[...tickerTexts, ...tickerTexts].map((text, i) => (
            <span key={i} className="inline-flex items-center gap-2 shrink-0">
              <Bell className="w-3.5 h-3.5 text-secondary shrink-0" />
              {text}
              <span className="text-secondary mx-6">•</span>
            </span>
          ))}
        </div>
      </div>

      <div className="container-school">
        <div className={`text-center mb-10 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <p className="text-secondary font-semibold text-sm tracking-widest uppercase mb-3">Latest Updates</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground flex items-center justify-center gap-3">
            <Bell className="w-8 h-8 text-secondary" />
            Notice Board
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm">Stay informed with the latest school announcements, exam schedules, and events.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {notices.map((notice, i) => (
            <div
              key={notice.id}
              className={`bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow p-5 flex gap-4 ${
                isVisible ? `animate-reveal-up delay-${(i + 1) * 100}` : 'opacity-0'
              }`}
            >
              {/* Icon */}
              <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5`}>
                <notice.icon className={`w-5 h-5 ${notice.iconColor}`} />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${notice.tagColor}`}>
                    {notice.tag}
                  </span>
                  {notice.isNew && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500 text-white animate-pulse">
                      NEW
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground ml-auto">{notice.date}</span>
                </div>
                <h3 className="font-semibold text-foreground text-sm leading-snug mb-1">{notice.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{notice.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ToppersSection = () => {
  const { ref, isVisible } = useScrollReveal();

  const classGroups = [
    {
      label: '1st Std',
      toppers: [
        { rank: 1, name: 'Aarav Patil', percentage: '98%' },
        { rank: 2, name: 'Sneha Kulkarni', percentage: '97%' },
      ],
    },
    {
      label: '2nd Std',
      toppers: [
        { rank: 1, name: 'Rohan Deshmukh', percentage: '99%' },
        { rank: 2, name: 'Priya Gaikwad', percentage: '97%' },
      ],
    },
    {
      label: '3rd Std',
      toppers: [
        { rank: 1, name: 'Yash Shinde', percentage: '98%' },
        { rank: 2, name: 'Ananya More', percentage: '96%' },
      ],
    },
    {
      label: '4th Std',
      toppers: [
        { rank: 1, name: 'Arjun Jadhav', percentage: '99%' },
        { rank: 2, name: 'Isha Pawar', percentage: '97%' },
      ],
    },
    {
      label: '5th Std',
      toppers: [
        { rank: 1, name: 'Vedant Bhosale', percentage: '98%' },
        { rank: 2, name: 'Mahi Salunke', percentage: '97%' },
      ],
    },
    {
      label: '11th (HSC Board)',
      toppers: [
        { rank: 1, name: 'Tanmay Wagh', percentage: '94%' },
        { rank: 2, name: 'Siddhi Mane', percentage: '92%' },
      ],
    },
    {
      label: '12th (HSC Board)',
      toppers: [
        { rank: 1, name: 'Omkar Kale', percentage: '96%' },
        { rank: 2, name: 'Rutuja Deshpande', percentage: '95%' },
      ],
    },
  ];

  return (
    <section id="toppers" className="py-20 bg-background" ref={ref}>
      <div className="container-school">
        <div className={`text-center mb-12 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <p className="text-secondary font-semibold text-sm tracking-widest uppercase mb-3">Hall of Fame</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground flex items-center justify-center gap-3">
            <Medal className="w-8 h-8 text-secondary" />
            Our Toppers
            <Medal className="w-8 h-8 text-secondary" />
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Celebrating academic excellence across all classes — from 1st Standard to Junior College (HSC Board).</p>
        </div>

        <div className="space-y-10">
          {classGroups.map((group, gi) => (
            <div key={group.label} className={`${isVisible ? `animate-reveal-up delay-${(gi + 1) * 100}` : 'opacity-0'}`}>
              <h3 className="text-center font-display font-semibold text-lg text-primary mb-4 flex items-center justify-center gap-2">
                <span className="flex-1 h-px bg-border" />
                <span className="px-4">{group.label}</span>
                <span className="flex-1 h-px bg-border" />
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
                {group.toppers.map((topper) => (
                  <div
                    key={topper.name}
                    className={`flex-1 rounded-xl p-5 border shadow-sm flex items-center gap-4 ${topper.rank === 1
                        ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-amber-200 dark:from-yellow-950/20 dark:to-amber-950/20 dark:border-amber-800'
                        : 'bg-gradient-to-br from-slate-50 to-gray-50 border-gray-200 dark:from-slate-900/30 dark:to-gray-900/30 dark:border-gray-700'
                      }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0 ${topper.rank === 1
                          ? 'bg-amber-400 text-amber-900'
                          : 'bg-slate-300 text-slate-700'
                        }`}
                    >
                      {topper.rank === 1 ? '🥇' : '🥈'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-display font-bold text-foreground truncate">{topper.name}</p>
                      <p className={`text-sm font-semibold ${topper.rank === 1 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'
                        }`}>
                        {topper.percentage}
                      </p>
                      <p className="text-xs text-muted-foreground">Rank {topper.rank}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollReveal();

  const testimonials = [
    { name: 'Priya Deshpande', role: 'Parent of Class III Student', text: 'The teachers genuinely care about each student. My daughter has flourished both academically and personally since joining Gurukul.' },
    { name: 'Rahul Patil', role: 'HSC Alumni, Batch 2024', text: 'The values and discipline I learned at Gurukul Jr. College helped me score 94% in HSC. Forever grateful to my teachers.' },
    { name: 'Sunita Kulkarni', role: 'Parent of Class V Student', text: "The school's balanced approach to Maharashtra Board academics and extra-curricular activities is exactly what we wanted for our child." },
  ];

  return (
    <section className="py-20 bg-background" ref={ref}>
      <div className="container-school">
        <div className={`text-center mb-12 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">{t('testimonials.title')}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <div
              key={item.name}
              className={`bg-card rounded-xl p-6 shadow-sm border border-border ${isVisible ? `animate-reveal-up delay-${(i + 1) * 100}` : 'opacity-0'
                }`}
            >
              <Quote className="w-8 h-8 text-secondary/40 mb-4" />
              <p className="text-foreground/80 leading-relaxed mb-6 text-sm">{item.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  {item.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{item.name}</p>
                  <p className="text-muted-foreground text-xs">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollReveal();
  return (
    <section className="py-20 bg-primary" ref={ref}>
      <div className={`container-school text-center ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground mb-4">{t('cta.title')}</h2>
        <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8 text-lg">{t('cta.subtitle')}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="hero" size="lg" asChild>
            <Link to="/admissions">{t('cta.apply')}</Link>
          </Button>
          <Button variant="hero-outline" size="lg" asChild>
            <Link to="/contact">{t('cta.contact')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  return (
    <Layout>
      <HighlightBanner />
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <FeaturesSection />
      <NoticeBoardSection />
      <ToppersSection />
      <TestimonialsSection />
      {/* <CTASection /> */}
    </Layout>
  );
};

export default Index;
