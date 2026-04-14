import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { UserCheck, CreditCard, MessageSquare, BarChart3, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { toast } from 'sonner';

const ParentPortal = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollReveal();

  const features = [
    { icon: BarChart3, title: 'Attendance Tracking', desc: 'View your child\'s daily and monthly attendance records in real-time.' },
    { icon: CreditCard, title: 'Fee Information', desc: 'Check fee dues, payment history, and make online payments securely.' },
    { icon: MessageSquare, title: 'Communication', desc: 'Direct messaging with teachers, receive circulars, and important updates.' },
    { icon: UserCheck, title: 'Academic Progress', desc: 'Track grades, report cards, and teacher remarks throughout the year.' },
  ];

  const { user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please enter email and password');
    setIsLoggingIn(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoggingIn(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged in successfully!');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out');
  };

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
            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : user ? (
              <div className="space-y-6">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-foreground text-xl">Welcome, Parent!</h3>
                <p className="text-muted-foreground text-sm">You are logged in as <span className="font-medium text-foreground">{user.email}</span></p>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-medium mb-4 text-foreground/70">Please check your email or SMS for circulars, as the portal dashboard is actively being updated for the new session.</p>
                  <Button variant="outline" onClick={handleLogout} className="w-full">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="font-display font-bold text-foreground text-xl mb-3">Login to Parent Portal</h3>
                <p className="text-muted-foreground text-sm mb-6">Access your dashboard with your registered credentials.</p>
                <form onSubmit={handleLogin} className="space-y-4 max-w-xs mx-auto">
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <Button type="submit" className="w-full" disabled={isLoggingIn}>
                    {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {isLoggingIn ? 'Logging in...' : 'Login'}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4 block">Forgot password? Contact the school office.</p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ParentPortal;
