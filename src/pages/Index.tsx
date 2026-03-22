import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import heroImg from '@/assets/school-hero.jpg';
import { GraduationCap, Users, Award, TrendingUp, BookOpen, FlaskConical, Music, Laptop, Quote } from 'lucide-react';

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
      <img src={heroImg} alt="Saraswati Vidya Mandir campus" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-primary/70" />
      <div className="relative container-school py-24">
        <div className="max-w-2xl">
          <p className="text-secondary font-semibold text-sm tracking-widest uppercase mb-4 animate-reveal-up">CBSE Affiliated | Est. 1985</p>
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
        <StatCard value="2,847" label={t('stats.students')} delay="delay-200" />
        <StatCard value="128" label={t('stats.teachers')} delay="delay-300" />
        <StatCard value="98.5%" label={t('stats.pass')} delay="delay-400" />
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
    { icon: BookOpen, title: 'Strong Academics', desc: 'CBSE curriculum with focus on conceptual learning and critical thinking.' },
    { icon: FlaskConical, title: 'Modern Labs', desc: 'State-of-the-art science, computer, and language laboratories.' },
    { icon: Music, title: 'Co-curricular Activities', desc: 'Music, dance, art, sports, and clubs for holistic development.' },
    { icon: Laptop, title: 'Digital Learning', desc: 'Smart classrooms with interactive boards and online resources.' },
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
              className={`bg-card rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow ${
                isVisible ? `animate-reveal-up delay-${(i + 1) * 100}` : 'opacity-0'
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

const TestimonialsSection = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollReveal();

  const testimonials = [
    { name: 'Priya Deshpande', role: 'Parent of Class X Student', text: 'The teachers genuinely care about each student. My daughter has flourished both academically and personally since joining SVM.' },
    { name: 'Rahul Patil', role: 'Alumni, Batch 2020', text: 'The values and discipline I learned at Saraswati Vidya Mandir helped me excel at IIT. Forever grateful to my teachers.' },
    { name: 'Sunita Kulkarni', role: 'Parent of Class V Student', text: "The school's balanced approach to academics and extra-curricular activities is exactly what we wanted for our child." },
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
              className={`bg-card rounded-xl p-6 shadow-sm border border-border ${
                isVisible ? `animate-reveal-up delay-${(i + 1) * 100}` : 'opacity-0'
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
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
