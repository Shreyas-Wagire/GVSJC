import { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import {
  X, ChevronLeft, ChevronRight, ZoomIn, Camera, Film,
  Play, ImageIcon, LayoutGrid, Sparkles,
} from 'lucide-react';

/* ─── Types ─────────────────────────────────────────────────── */
interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  media_type: 'photo' | 'video';
  url: string;
  thumbnail_url: string | null;
  created_at: string;
  sort_order: number;
}
type MediaTab = 'all' | 'photo' | 'video';

/* ─── Lightbox ───────────────────────────────────────────────── */
const Lightbox = ({
  items,
  index,
  onClose,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
}) => {
  const [current, setCurrent] = useState(index);
  const item = items[current];

  const prev = () => setCurrent((c) => (c - 1 + items.length) % items.length);
  const next = () => setCurrent((c) => (c + 1) % items.length);

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

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.97)' }}
      onClick={onClose}
    >
      {/* Blurred bg image */}
      {item.media_type === 'photo' && (
        <div
          className="absolute inset-0 opacity-20 blur-2xl scale-110"
          style={{ backgroundImage: `url(${item.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
      )}

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-10"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)' }}>
        <div className="flex items-center gap-3">
          <span className="text-white/40 text-sm tabular-nums">{current + 1} / {items.length}</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide ${
            item.media_type === 'video'
              ? 'bg-purple-500/30 text-purple-300 border border-purple-500/40'
              : 'bg-sky-500/30 text-sky-300 border border-sky-500/40'
          }`}>
            {item.media_type === 'video' ? '▶ VIDEO' : '◉ PHOTO'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav: Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-4 z-10 w-11 h-11 rounded-full bg-white/8 hover:bg-white/18 border border-white/10 flex items-center justify-center text-white transition-all hover:scale-105"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Nav: Next */}
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-4 z-10 w-11 h-11 rounded-full bg-white/8 hover:bg-white/18 border border-white/10 flex items-center justify-center text-white transition-all hover:scale-105"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Media */}
      <div className="relative z-10 max-w-5xl w-full mx-16" onClick={(e) => e.stopPropagation()}>
        {item.media_type === 'photo' ? (
          <img
            key={item.id}
            src={item.url}
            alt={item.title}
            className="w-full max-h-[72vh] object-contain rounded-2xl"
            style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.8)' }}
          />
        ) : (
          <video
            key={item.id}
            src={item.url}
            controls
            autoPlay
            className="w-full max-h-[72vh] rounded-2xl"
            style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.8)' }}
          />
        )}

        {/* Caption */}
        <div className="text-center mt-4 px-4">
          <span className="inline-block text-xs text-white/40 uppercase tracking-widest mb-1">{item.category}</span>
          <p className="text-white font-semibold text-lg leading-snug">{item.title}</p>
          {item.description && <p className="text-white/45 text-sm mt-1">{item.description}</p>}
        </div>
      </div>

      {/* Thumbnail strip */}
      <div
        className="absolute bottom-0 left-0 right-0 flex justify-center px-4 pb-4 pt-10 z-10"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-2 overflow-x-auto max-w-lg">
          {items.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setCurrent(i)}
              className={`w-11 h-11 rounded-lg overflow-hidden shrink-0 transition-all duration-200 ring-2 ${
                i === current
                  ? 'ring-white scale-110'
                  : 'ring-transparent opacity-40 hover:opacity-80 hover:scale-105'
              }`}
            >
              {p.media_type === 'photo' ? (
                <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-purple-900/80 flex items-center justify-center">
                  <Play className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Empty State ────────────────────────────────────────────── */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-28 px-6 text-center">
    <div className="relative mb-6">
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
        <Camera className="w-10 h-10 text-primary/50" />
      </div>
      <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center">
        <Sparkles className="w-3.5 h-3.5 text-secondary/60" />
      </div>
    </div>
    <h3 className="text-xl font-bold text-foreground mb-2">Gallery Coming Soon</h3>
    <p className="text-muted-foreground max-w-xs leading-relaxed">
      Photos and videos from school events will appear here once uploaded by the admin.
    </p>
  </div>
);

/* ─── Skeleton Loader ────────────────────────────────────────── */
const SkeletonGrid = () => (
  <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
    {[180, 240, 160, 220, 200, 260, 150, 190].map((h, i) => (
      <div
        key={i}
        className="w-full rounded-2xl bg-muted animate-pulse break-inside-avoid mb-4"
        style={{ height: h }}
      />
    ))}
  </div>
);

/* ─── Gallery Card ───────────────────────────────────────────── */
const GalleryCard = ({
  item,
  onClick,
}: {
  item: GalleryItem;
  onClick: () => void;
}) => (
  <div
    className="group relative rounded-2xl overflow-hidden cursor-pointer break-inside-avoid mb-4"
    style={{
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      transition: 'transform 0.35s ease, box-shadow 0.35s ease',
    }}
    onClick={onClick}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 48px rgba(0,0,0,0.18)';
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    }}
  >
    {/* Image / Video */}
    {item.media_type === 'photo' ? (
      <img
        src={item.url}
        alt={item.title}
        className="w-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
        loading="lazy"
      />
    ) : (
      <div
        className="w-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #0f0a3c 100%)',
          minHeight: 160,
        }}
      >
        {item.thumbnail_url ? (
          <img src={item.thumbnail_url} alt={item.title} className="w-full object-cover absolute inset-0" />
        ) : null}
        <div className="relative z-10 flex items-center justify-center py-10">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-white/30 group-hover:scale-110 transition-transform duration-300"
            style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(4px)' }}
          >
            <Play className="w-7 h-7 text-white ml-1" />
          </div>
        </div>
      </div>
    )}

    {/* Video badge */}
    {item.media_type === 'video' && (
      <span
        className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white rounded-full"
        style={{ background: 'rgba(147,51,234,0.85)', backdropFilter: 'blur(8px)' }}
      >
        <Film className="w-3 h-3" /> VIDEO
      </span>
    )}

    {/* Hover overlay */}
    <div
      className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }}
    >
      <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
        <span
          className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-1.5"
          style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)' }}
        >
          {item.category}
        </span>
        <p className="text-white font-semibold text-sm leading-snug line-clamp-2">{item.title}</p>
        {item.description && (
          <p className="text-white/55 text-xs mt-0.5 line-clamp-1">{item.description}</p>
        )}
      </div>
    </div>

    {/* Corner icon */}
    <div
      className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"
      style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(4px)' }}
    >
      {item.media_type === 'video'
        ? <Play className="w-3.5 h-3.5 text-white ml-0.5" />
        : <ZoomIn className="w-3.5 h-3.5 text-white" />
      }
    </div>
  </div>
);

/* ─── Main Gallery Page ──────────────────────────────────────── */
const Gallery = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState('All');
  const [activeTab, setActiveTab] = useState<MediaTab>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const fetchItems = useCallback(async () => {
    const { data } = await supabase
      .from('gallery_items')
      .select('*')
      .order('sort_order', { ascending: false })
      .order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const allCategories = ['All', ...Array.from(new Set(items.map((i) => i.category))).sort()];

  const filtered = items.filter(
    (item) =>
      (activeTab === 'all' || item.media_type === activeTab) &&
      (activeCat === 'All' || item.category === activeCat)
  );

  const photoCount = items.filter((i) => i.media_type === 'photo').length;
  const videoCount = items.filter((i) => i.media_type === 'video').length;

  return (
    <Layout>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative py-28 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.85) 60%, hsl(var(--secondary)/0.5) 100%)',
        }}
      >
        {/* Animated rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          {[400, 600, 800].map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white/5"
              style={{ width: s, height: s, animationDuration: `${8 + i * 4}s` }}
            />
          ))}
        </div>

        {/* Glows */}
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-20 blur-[100px]"
          style={{ background: 'hsl(var(--secondary))' }} />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-15 blur-[80px]"
          style={{ background: 'hsl(var(--secondary))' }} />

        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="container-school text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-white/20 text-sm font-semibold text-white/80"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
            <Sparkles className="w-3.5 h-3.5" />
            School Gallery
          </div>

          <h1 className="text-5xl sm:text-7xl font-display font-bold text-white mb-5 leading-[1.1]">
            {t('gallery.title')}
          </h1>
          <p className="text-white/55 max-w-lg mx-auto text-lg leading-relaxed">
            Moments of joy, learning, and achievement — captured from our vibrant school life.
          </p>

          {/* Stats pills */}
          {!loading && items.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
              {[
                { icon: ImageIcon, label: 'Photos', count: photoCount, color: 'sky' },
                { icon: Film, label: 'Videos', count: videoCount, color: 'purple' },
                { icon: LayoutGrid, label: 'Total', count: items.length, color: 'emerald' },
              ].map(({ icon: Icon, label, count, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-sm"
                  style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}
                >
                  <Icon className="w-4 h-4 text-white/60" />
                  <span className="font-bold text-white">{count}</span>
                  <span className="text-white/45">{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Gallery Body ─────────────────────────────────────── */}
      <section className="py-14 bg-background">
        <div className="container-school">

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            {/* Media type tabs */}
            <div
              className="flex p-1 rounded-xl gap-0.5"
              style={{ background: 'hsl(var(--muted))' }}
            >
              {([
                { key: 'all' as MediaTab, label: 'All', icon: LayoutGrid },
                { key: 'photo' as MediaTab, label: `Photos`, icon: Camera },
                { key: 'video' as MediaTab, label: `Videos`, icon: Film },
              ]).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                  style={
                    activeTab === key
                      ? {
                          background: 'hsl(var(--background))',
                          color: 'hsl(var(--primary))',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }
                      : { color: 'hsl(var(--muted-foreground))' }
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Category chips */}
            {allCategories.length > 1 && (
              <div className="flex flex-wrap justify-center sm:justify-end gap-1.5">
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCat(cat)}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                    style={
                      activeCat === cat
                        ? {
                            background: 'hsl(var(--primary))',
                            color: 'hsl(var(--primary-foreground))',
                            boxShadow: '0 4px 12px hsl(var(--primary)/0.35)',
                            transform: 'scale(1.05)',
                          }
                        : {
                            background: 'hsl(var(--muted))',
                            color: 'hsl(var(--muted-foreground))',
                          }
                    }
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Result count */}
          {!loading && filtered.length > 0 && (
            <p className="text-muted-foreground text-xs text-center mb-8 tracking-wide uppercase">
              Showing{' '}
              <span className="font-bold text-foreground">{filtered.length}</span>{' '}
              {filtered.length === 1 ? 'item' : 'items'}
              {activeCat !== 'All' && (
                <> in <span className="text-primary font-bold">{activeCat}</span></>
              )}
            </p>
          )}

          {/* Content */}
          {loading ? (
            <SkeletonGrid />
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            /* Masonry columns layout */
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-4">
              {filtered.map((item, i) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  onClick={() => setLightboxIndex(i)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={filtered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </Layout>
  );
};

export default Gallery;
