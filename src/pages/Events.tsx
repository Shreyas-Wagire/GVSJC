import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Calendar, Bell, Newspaper } from 'lucide-react';

const Events = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollReveal();
  const { ref: ref2, isVisible: vis2 } = useScrollReveal();

  const events = [
    { date: 'Mar 15, 2025', title: 'Annual Sports Day', desc: 'Inter-house athletics, cricket, and kho-kho competitions.', tag: 'Sports' },
    { date: 'Mar 22, 2025', title: 'Science Exhibition', desc: 'Student projects and working models on display for parents.', tag: 'Academic' },
    { date: 'Apr 5, 2025', title: 'Parent-Teacher Meeting', desc: 'Term 2 progress discussion and report card distribution.', tag: 'Meeting' },
    { date: 'Apr 14, 2025', title: 'Dr. Ambedkar Jayanti', desc: 'Special assembly and essay competition.', tag: 'Cultural' },
    { date: 'May 1, 2025', title: 'Summer Camp Registration', desc: 'Art, robotics, swimming, and cricket summer camps.', tag: 'Activity' },
  ];

  const announcements = [
    { title: 'Admission Open for 2025-26', date: 'Feb 2025', urgent: true },
    { title: 'Board Exam Timetable Released', date: 'Feb 2025', urgent: true },
    { title: 'Republic Day Celebration Photos', date: 'Jan 2025', urgent: false },
    { title: 'Winter Vacation: Dec 24 - Jan 5', date: 'Dec 2024', urgent: false },
  ];

  return (
    <Layout>
      <section className="bg-primary py-16">
        <div className="container-school text-center">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground">{t('events.title')}</h1>
        </div>
      </section>

      <section className="py-20 bg-background" ref={ref}>
        <div className={`container-school ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Events */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-6 h-6 text-secondary" />
                <h2 className="text-2xl font-display font-bold text-foreground">Upcoming Events</h2>
              </div>
              <div className="space-y-4">
                {events.map((e, i) => (
                  <div key={e.title} className={`bg-card rounded-xl p-5 border border-border hover:shadow-md transition-shadow ${isVisible ? `animate-reveal-up delay-${(i+1)*100}` : 'opacity-0'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-xs font-medium text-secondary">{e.date}</span>
                        <h3 className="font-semibold text-foreground mt-1">{e.title}</h3>
                        <p className="text-muted-foreground text-sm mt-1">{e.desc}</p>
                      </div>
                      <span className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground shrink-0">{e.tag}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Announcements */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Bell className="w-6 h-6 text-secondary" />
                <h2 className="text-2xl font-display font-bold text-foreground">Notices</h2>
              </div>
              <div className="bg-card rounded-xl border border-border p-5 space-y-4">
                {announcements.map((a) => (
                  <div key={a.title} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                    {a.urgent && <span className="w-2 h-2 rounded-full bg-destructive mt-2 shrink-0" />}
                    <div>
                      <p className="text-sm font-medium text-foreground">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Events;
