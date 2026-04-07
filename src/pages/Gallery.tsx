import { useState } from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const Gallery = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollReveal();
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');

  const categories = ['All', 'Campus', 'Events', 'Sports', 'Classroom', 'Cultural'];
  const [activeCat, setActiveCat] = useState('All');

  const photos = [
    { src: './smartclassroom.jpeg', category: 'Classroom', title: 'Smart Classroom' },
    { src: './library.jpg', category: 'Campus', title: 'School Library' },
    { src: './Annual-day.jpg', category: 'Events', title: 'Annual Day' },
    { src: './sports.jpg', category: 'Sports', title: 'Sports Day' },
    { src: './middle_school_building.jpg', category: 'Campus', title: 'School Building' },
    { src: './group-activities.jpg', category: 'Classroom', title: 'Group Study' },
    { src: './culture-program.jpg', category: 'Cultural', title: 'Cultural Program' },
    { src: './science-exhibition.jpg', category: 'Events', title: 'Science Exhibition' },
  ];

  const filtered = activeCat === 'All' ? photos : photos.filter(p => p.category === activeCat);

  return (
    <Layout>
      <section className="bg-primary py-16">
        <div className="container-school text-center">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground">{t('gallery.title')}</h1>
        </div>
      </section>

      <section className="py-20 bg-background" ref={ref}>
        <div className={`container-school ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            {(['photos', 'videos'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                {tab === 'photos' ? 'Photos' : 'Videos'}
              </button>
            ))}
          </div>

          {activeTab === 'photos' && (
            <>
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActiveCat(cat)} className={`px-4 py-1.5 rounded-full text-sm transition-colors ${activeCat === cat ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                    {cat}
                  </button>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filtered.map((photo, i) => (
                  <div key={i} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    <img src={photo.src} alt={photo.title} className="w-full h-42 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors flex items-end">
                      <p className="text-primary-foreground font-medium text-sm p-3 translate-y-full group-hover:translate-y-0 transition-transform">{photo.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'videos' && (
            <div className="max-w-2xl mx-auto text-center text-muted-foreground py-12">
              <p>Video content coming soon. Stay tuned for campus tours, event highlights, and more!</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Gallery;
