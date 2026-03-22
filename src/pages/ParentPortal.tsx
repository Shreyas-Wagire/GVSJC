import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { UserCheck, CreditCard, MessageSquare, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ParentPortal = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollReveal();

  const features = [
    { icon: BarChart3, title: 'Attendance Tracking', desc: 'View your child\'s daily and monthly attendance records in real-time.' },
    { icon: CreditCard, title: 'Fee Information', desc: 'Check fee dues, payment history, and make online payments securely.' },
    { icon: MessageSquare, title: 'Communication', desc: 'Direct messaging with teachers, receive circulars, and important updates.' },
    { icon: UserCheck, title: 'Academic Progress', desc: 'Track grades, report cards, and teacher remarks throughout the year.' },
  ];

  return (
    <Layout>
      <section className="bg-primary py-16">
        <div className="container-school text-center">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground">{t('parents.title')}</h1>
          <p className="text-primary-foreground/80 mt-3">Stay connected with your child's education</p>
        </div>
      </section>

      <section className="py-20 bg-background" ref={ref}>
        <div className={`container-school ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            {features.map((f, i) => (
              <div key={f.title} className={`bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-lg transition-shadow ${isVisible ? `animate-reveal-up delay-${(i+1)*100}` : 'opacity-0'}`}>
                <f.icon className="w-10 h-10 text-secondary mb-4" />
                <h3 className="font-display font-semibold text-foreground text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center bg-card rounded-xl p-10 border border-border max-w-lg mx-auto">
            <h3 className="font-display font-bold text-foreground text-xl mb-3">Login to Parent Portal</h3>
            <p className="text-muted-foreground text-sm mb-6">Access your dashboard with your registered credentials.</p>
            <div className="space-y-4 max-w-xs mx-auto">
              <input type="text" placeholder="Parent ID / Email" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <input type="password" placeholder="Password" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <Button className="w-full">Login</Button>
              <p className="text-xs text-muted-foreground">Forgot password? Contact the school office.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ParentPortal;
