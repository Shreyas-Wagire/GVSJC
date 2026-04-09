import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { X, ChevronLeft, ChevronRight, ZoomIn, Camera } from 'lucide-react';

const photos = [
  { src: '/smartclassroom.jpeg', category: 'Classroom', title: 'Smart Classroom', desc: 'Interactive digital boards for modern learning' },
  { src: '/library.jpg', category: 'Campus', title: 'School Library', desc: 'Over 1500 books and digital resources' },
  { src: '/Annual-day.jpg', category: 'Events', title: 'Annual Day', desc: 'Grand celebration of talent and achievement' },
  { src: '/sports.jpg', category: 'Sports', title: 'Sports Day', desc: 'Inter-house athletics competitions' },
  { src: '/middle_school_building.jpg', category: 'Campus', title: 'School Building', desc: 'Our modern campus facility' },
  { src: '/group-activities.jpg', category: 'Classroom', title: 'Group Activities', desc: 'Collaborative learning in action' },
  { src: '/culture-program.jpg', category: 'Cultural', title: 'Cultural Program', desc: 'Celebrating arts and heritage' },
  { src: '/science-exhibition.jpg', category: 'Events', title: 'Science Exhibition', desc: 'Students showcase innovative projects' },
];

const categories = ['All', 'Campus', 'Events', 'Sports', 'Classroom', 'Cultural'];

interface LightboxProps {
  photos: typeof photos;
  index: number;
  onClose: () => void;
}

const Lightbox = ({ photos, index, onClose }: LightboxProps) => {
  const [current, setCurrent] = useState(index);

  const prev = () => setCurrent((c) => (c - 1 + photos.length) % photos.length);
  const next = () => setCurrent((c) => (c + 1) % photos.length);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, []);

  const photo = photos[current];

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-4 text-white/60 text-sm font-medium">
        {current + 1} / {photos.length}
      </div>

      {/* Prev / Next */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Image */}
      <div className="max-w-4xl w-full mx-16" onClick={(e) => e.stopPropagation()}>
        <img
          src={photo.src}
          alt={photo.title}
          className="w-full max-h-[75vh] object-contain rounded-xl"
        />
        <div className="text-center mt-4">
          <p className="text-white font-semibold text-lg">{photo.title}</p>
          <p className="text-white/60 text-sm mt-1">{photo.desc}</p>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-sm px-2">
        {photos.map((p, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
            className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${i === current ? 'border-secondary scale-110' : 'border-white/20 opacity-60 hover:opacity-100'}`}
          >
            <img src={p.src} alt={p.title} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

const Gallery = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollReveal();
  const [activeCat, setActiveCat] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = activeCat === 'All' ? photos : photos.filter((p) => p.category === activeCat);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-secondary blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-secondary blur-3xl" />
        </div>
        <div className="container-school text-center relative">
          <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Camera className="w-4 h-4" /> Photo Gallery
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-primary-foreground mb-4">{t('gallery.title')}</h1>
          <p className="text-primary-foreground/70 max-w-xl mx-auto">Moments of joy, learning, and achievement captured from our school life</p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-background" ref={ref}>
        <div className="container-school">
          {/* Category Filter */}
          <div className={`flex flex-wrap justify-center gap-2 mb-10 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCat === cat
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Photo Count */}
          <p className={`text-center text-muted-foreground text-sm mb-8 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> photos
            {activeCat !== 'All' && <> in <span className="font-semibold text-secondary">{activeCat}</span></>}
          </p>

          {/* Masonry-style Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((photo, i) => {
              const globalIndex = photos.indexOf(photo);
              return (
                <div
                  key={photo.src}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ${
                    isVisible ? `animate-reveal-up delay-${Math.min((i + 1) * 100, 600)}` : 'opacity-0'
                  } ${i % 5 === 0 ? 'sm:col-span-2' : ''}`}
                  onClick={() => setLightboxIndex(globalIndex)}
                >
                  <div className={`w-full overflow-hidden ${i % 5 === 0 ? 'h-56' : 'h-48'}`}>
                    <img
                      src={photo.src}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-xs font-semibold text-secondary bg-secondary/20 px-2 py-0.5 rounded-full mb-2 inline-block">{photo.category}</span>
                      <p className="text-white font-semibold text-sm">{photo.title}</p>
                      <p className="text-white/70 text-xs mt-0.5">{photo.desc}</p>
                    </div>
                  </div>

                  {/* Zoom icon */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ZoomIn className="w-4 h-4 text-white" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox photos={photos} index={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </Layout>
  );
};

export default Gallery;
