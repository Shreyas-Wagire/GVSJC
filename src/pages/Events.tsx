import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Calendar, Bell, Loader2 } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { useNotices } from '@/hooks/useNotices';

const Events = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollReveal();

  // Fallback events if DB is empty
  const fallbackEvents = [
    { date: 'Apr 20, 2026', title: 'Annual Sports Day', desc: 'Inter-house athletics, cricket, and kho-kho competitions. Parents are cordially invited at 9:00 AM.', tag: 'Sports' },
    { date: 'Apr 28, 2026', title: 'Science Exhibition', desc: 'Student projects and working models on display for parents and judges.', tag: 'Academic' },
    { date: 'May 5, 2026', title: 'Parent-Teacher Meeting', desc: 'Term 2 progress discussion and report card distribution for all classes.', tag: 'Meeting' },
    { date: 'Apr 14, 2026', title: 'Dr. Ambedkar Jayanti', desc: 'Special assembly, essay competition, and cultural programme.', tag: 'Cultural' },
    { date: 'Jun 1, 2026', title: 'Summer Camp Registration Opens', desc: 'Art, robotics, and cricket summer camps for Classes I–V. Limited seats.', tag: 'Activity' },
  ];

  // Fallback announcements if DB is empty
  const fallbackAnnouncements = [
    { title: 'Admissions Open for 2026-27 Academic Year', date: 'Apr 2026', is_new: true },
    { title: 'Annual Exam Schedule Released (Apr 15 onwards)', date: 'Apr 2026', is_new: true },
    { title: 'Fee Payment Due — Last Date: 20 Apr 2026', date: 'Apr 2026', is_new: true },
    { title: 'Annual Sports Day — 20th April 2026', date: 'Apr 2026', is_new: false },
  ];

  const { events: dbEvents, isLoading: loadingEvents } = useEvents();
  const { notices: dbNotices, isLoading: loadingNotices } = useNotices();

  const displayEvents = dbEvents && dbEvents.length > 0 ? dbEvents : fallbackEvents;
  const displayNotices = dbNotices && dbNotices.length > 0 ? dbNotices : fallbackAnnouncements;

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
                {loadingEvents ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                ) : (
                  displayEvents.map((e, i) => {
                    const dateStr = 'date' in e ? (e as any).date : '';
                    const displayDate = new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const isInvalidDate = displayDate === 'Invalid Date';

                    return (
                      <div key={e.title + i} className={`bg-card rounded-xl p-5 border border-border hover:shadow-md transition-shadow ${isVisible ? `animate-reveal-up delay-${(i+1)*100}` : 'opacity-0'}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="text-xs font-medium text-secondary">{isInvalidDate ? dateStr : displayDate}</span>
                            <h3 className="font-semibold text-foreground mt-1">{e.title}</h3>
                            <p className="text-muted-foreground text-sm mt-1">{('description' in e ? e.description : (e as any).desc) || ''}</p>
                          </div>
                          <span className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground shrink-0">{('type' in e ? e.type : (e as any).tag) || 'Event'}</span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Announcements */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Bell className="w-6 h-6 text-secondary" />
                <h2 className="text-2xl font-display font-bold text-foreground">Notices</h2>
              </div>
              <div className="bg-card rounded-xl border border-border p-5 space-y-4">
                {loadingNotices ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                ) : (
                  displayNotices.map((a, i) => (
                    <div key={a.title + i} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                      {(('is_new' in a ? a.is_new : (a as any).urgent)) && <span className="w-2 h-2 rounded-full bg-destructive mt-2 shrink-0 animate-pulse" />}
                      <div>
                        <p className="text-sm font-medium text-foreground">{a.title}</p>
                        <p className="text-xs text-muted-foreground">{a.date}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Events;
