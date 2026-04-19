import { useState } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock, MessageSquare, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const contactInfo = [
  {
    icon: MapPin,
    label: 'Address',
    value: 'Chokak, Tal. Hatkanangale, Dis. Kolhapur – 416118, Maharashtra',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 70832 37878 / 97871 84476',
    color: 'bg-green-50 text-green-600',
    href: 'tel:+917083237878',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'gurukulvidyalay2425858@gmail.com',
    color: 'bg-purple-50 text-purple-600',
    href: 'mailto:gurukulvidyalay2425858@gmail.com',
  },
  {
    icon: Clock,
    label: 'Office Hours',
    value: 'Mon–Fri: 9:00 AM – 4:00 PM · Sat: 8:00 AM – 1:00 PM',
    color: 'bg-amber-50 text-amber-600',
  },
];

const Contact = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollReveal();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await supabase.from('contacts').insert([
      {
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message
      }
    ]);

    setIsSubmitting(false);

    if (error) {
      console.error(error);
      toast.error(`Error: ${error.message || 'Database connection failed'}`);
    } else {
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setForm({ name: '', email: '', phone: '', message: '' });
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    }
  };

  return (
    <Layout>
      <SEOHead
        title="Contact Us"
        description="Get in touch with Gurukul Vidyalay & Jr. College, Chokak, Kolhapur. Contact us for admission queries, facilities, and more at +91 70832 37878."
        keywords="contact GVSJC, school in Chokak, Kolhapur school contact, education Hatkanangale"
        canonical="/contact"
      />
      {/* Hero */}
      <section className="bg-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 right-10 w-72 h-72 rounded-full bg-secondary/15 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-secondary/10 blur-3xl" />
        </div>
        <div className="container-school text-center relative">
          <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <MessageSquare className="w-4 h-4" /> We're Here to Help
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-primary-foreground mb-4">{t('contact.title')}</h1>
          <p className="text-primary-foreground/70 max-w-xl mx-auto">Reach out to us for admissions, queries, or any assistance</p>
        </div>
      </section>

      <section className="py-20 bg-background" ref={ref}>
        <div className="container-school max-w-6xl">
          <div className={`grid lg:grid-cols-2 gap-12 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>

            {/* Left — Contact Info */}
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">Get in Touch</h2>
              <p className="text-muted-foreground mb-8 text-sm">We're happy to answer your questions. Choose the most convenient way to connect with us.</p>

              <div className="space-y-4 mb-8">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-start gap-4 p-4 bg-muted rounded-2xl hover:shadow-sm transition-shadow">
                    <div className={`w-11 h-11 rounded-xl ${info.color} flex items-center justify-center shrink-0`}>
                      <info.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">{info.label}</p>
                      {info.href ? (
                        <a href={info.href} className="text-sm text-foreground hover:text-primary transition-colors font-medium">{info.value}</a>
                      ) : (
                        <p className="text-sm text-foreground font-medium">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-border shadow-sm h-56">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.2!2d73.807!3d18.508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMwJzI5LjAiTiA3M8KwNDgnMjUuMiJF!5e0!3m2!1sen!2sin!4v1"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                  title="School Location"
                />
              </div>
            </div>

            {/* Right — Form */}
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">Send us a Message</h2>
              <p className="text-muted-foreground mb-8 text-sm">Fill in the form and we'll respond within one business day.</p>

              {sent ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
                  <h3 className="text-xl font-display font-bold text-foreground mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">{t('contact.form.name')} *</label>
                      <input
                        type="text" required value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">{t('contact.form.phone')}</label>
                      <input
                        type="tel" value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">{t('contact.form.email')} *</label>
                    <input
                      type="email" required value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">{t('contact.form.message')} *</label>
                    <textarea
                      rows={5} required value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="How can we help you? Ask about admissions, facilities, fees, or anything else..."
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <MessageSquare className="w-4 h-4 mr-2" />}
                    {isSubmitting ? 'Sending...' : t('contact.form.send')}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">We respect your privacy. Your details will not be shared.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
