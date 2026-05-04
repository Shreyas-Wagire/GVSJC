import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Plus, Trash2, X, Image, Film, Upload, Search,
  Filter, Eye, RefreshCw, Grid, List, AlertTriangle,
} from 'lucide-react';

const CATEGORIES = ['Campus', 'Events', 'Sports', 'Classroom', 'Cultural', 'Other'];
const BUCKET = 'gallery';

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

const cls =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60';

export default function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<'' | 'photo' | 'video'>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteUrl, setDeleteUrl] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Campus',
    media_type: 'photo' as 'photo' | 'video',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('sort_order', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) toast.error('Failed to load gallery');
    else setItems(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    if (!isVideo && !isImage) {
      toast.error('Only images and videos are supported');
      return;
    }
    setSelectedFile(file);
    setForm((f) => ({
      ...f,
      media_type: isVideo ? 'video' : 'photo',
      title: f.title || file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
    }));
  };

  const handleUpload = async () => {
    if (!selectedFile) { toast.error('Please select a file'); return; }
    if (!form.title.trim()) { toast.error('Title is required'); return; }

    setUploading(true);
    try {
      const ext = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = `${form.category.toLowerCase()}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, selectedFile, { upsert: false });

      if (uploadError) {
        // If bucket doesn't exist or storage issue, fall back to placeholder URL
        if (uploadError.message.includes('Bucket not found') || uploadError.message.includes('not found')) {
          toast.error('Storage bucket "gallery" not found. Please create it in Supabase Dashboard → Storage.');
          setUploading(false);
          return;
        }
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;

      // Save to DB
      const { error: dbError } = await supabase.from('gallery_items').insert([{
        title: form.title.trim(),
        description: form.description.trim() || null,
        category: form.category,
        media_type: form.media_type,
        url: publicUrl,
        thumbnail_url: null,
        sort_order: Date.now(),
      }]);

      if (dbError) throw dbError;

      toast.success('Media uploaded successfully!');
      setSelectedFile(null);
      setForm({ title: '', description: '', category: 'Campus', media_type: 'photo' });
      setShowForm(false);
      fetch();
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    }
    setUploading(false);
  };

  const handleDelete = async (id: string, url: string) => {
    // Extract storage path from URL
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split(`/object/public/${BUCKET}/`);
      if (pathParts.length > 1) {
        await supabase.storage.from(BUCKET).remove([pathParts[1]]);
      }
    } catch (_) { /* ignore storage deletion errors */ }

    const { error } = await supabase.from('gallery_items').delete().eq('id', id);
    if (error) toast.error('Delete failed');
    else { toast.success('Removed from gallery'); fetch(); }
    setDeleteId(null);
    setDeleteUrl(null);
  };

  const filtered = items.filter((item) =>
    (!search || item.title.toLowerCase().includes(search.toLowerCase()) || (item.description ?? '').toLowerCase().includes(search.toLowerCase())) &&
    (!catFilter || item.category === catFilter) &&
    (!typeFilter || item.media_type === typeFilter)
  );

  const photos = items.filter((i) => i.media_type === 'photo').length;
  const videos = items.filter((i) => i.media_type === 'video').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Gallery Manager</h1>
          <p className="text-gray-500 mt-1">Upload and manage photos & videos shown on the public gallery page.</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-primary hover:bg-primary/90 w-fit gap-2"
        >
          <Plus className="w-4 h-4" /> Upload Media
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Items', value: items.length, icon: Grid, color: 'text-primary' },
          { label: 'Photos', value: photos, icon: Image, color: 'text-blue-500' },
          { label: 'Videos', value: videos, icon: Film, color: 'text-purple-500' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
            <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Upload Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => !uploading && setShowForm(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" /> Upload Media
              </h2>
              {!uploading && (
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="p-5 space-y-4">
              {/* Drop Zone */}
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                  dragOver ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFileChange(e.dataTransfer.files[0] ?? null);
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                />
                {selectedFile ? (
                  <div>
                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-primary/10 flex items-center justify-center">
                      {selectedFile.type.startsWith('video/') ? <Film className="w-6 h-6 text-purple-600" /> : <Image className="w-6 h-6 text-blue-600" />}
                    </div>
                    <p className="font-medium text-gray-800 text-sm">{selectedFile.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button
                      className="mt-2 text-xs text-red-500 hover:underline"
                      onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                    >Remove</button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Drag & drop or <span className="text-primary font-semibold">click to browse</span></p>
                    <p className="text-xs text-gray-400 mt-1">Photos (JPG, PNG, WEBP) · Videos (MP4, MOV, WEBM)</p>
                  </>
                )}
              </div>

              {/* Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label className="text-sm font-medium text-gray-700">Title *</Label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className={cls + ' mt-1'}
                    placeholder="e.g. Annual Sports Day 2025"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium text-gray-700">Description</Label>
                  <input
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className={cls + ' mt-1'}
                    placeholder="Short caption..."
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Category</Label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className={cls + ' mt-1'}
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Type</Label>
                  <select
                    value={form.media_type}
                    onChange={(e) => setForm((f) => ({ ...f, media_type: e.target.value as 'photo' | 'video' }))}
                    className={cls + ' mt-1'}
                  >
                    <option value="photo">📷 Photo</option>
                    <option value="video">🎬 Video</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2 p-5 border-t">
              <Button
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                className="bg-primary hover:bg-primary/90 flex-1 gap-2"
              >
                {uploading ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Uploading…</>
                ) : (
                  <><Upload className="w-4 h-4" /> Upload</>
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)} disabled={uploading}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Filters & View Toggle */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search media…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className={cls + ' max-w-[140px]'}>
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} className={cls + ' max-w-[120px]'}>
            <option value="">All Types</option>
            <option value="photo">Photos</option>
            <option value="video">Videos</option>
          </select>
        </div>
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
        <span className="text-sm text-gray-400">{filtered.length} items</span>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 text-center text-gray-400">
          <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin opacity-40" />
          <p>Loading gallery…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-xl border border-gray-200">
          <Image className="w-12 h-12 mx-auto mb-3 text-gray-200" />
          <p className="text-gray-400 font-medium">No media found</p>
          <p className="text-gray-300 text-sm mt-1">Upload your first photo or video to get started</p>
          <Button onClick={() => setShowForm(true)} className="mt-4 bg-primary hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" /> Upload Media
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all">
              {/* Thumbnail */}
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                {item.media_type === 'photo' ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext y="50%" x="50%" text-anchor="middle" fill="%239ca3af" dy=".35em" font-size="14"%3E📷%3C/text%3E%3C/svg%3E';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100">
                    <Film className="w-10 h-10 text-purple-400" />
                  </div>
                )}
                {/* Type badge */}
                <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  item.media_type === 'video' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {item.media_type === 'video' ? '🎬' : '📷'}
                </span>
                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {deleteId === item.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(item.id, item.url)}
                        className="px-2 py-1 bg-red-600 text-white text-xs rounded-lg font-semibold hover:bg-red-700"
                      >Confirm</button>
                      <button
                        onClick={() => setDeleteId(null)}
                        className="px-2 py-1 bg-white/20 text-white text-xs rounded-lg hover:bg-white/40"
                      >No</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="w-9 h-9 bg-red-500/80 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              {/* Info */}
              <div className="p-2.5">
                <p className="font-medium text-gray-900 text-xs line-clamp-1">{item.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Preview', 'Title', 'Category', 'Type', 'Uploaded', 'Actions'].map((h) => (
                  <th key={h} className={`px-4 py-3 font-semibold text-gray-600 ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2">
                    <div className="w-14 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      {item.media_type === 'photo' ? (
                        <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <Film className="w-5 h-5 text-purple-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <p className="font-medium text-gray-900 line-clamp-1">{item.title}</p>
                    {item.description && <p className="text-xs text-gray-400 line-clamp-1">{item.description}</p>}
                  </td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">{item.category}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      item.media_type === 'video' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {item.media_type === 'video' ? '🎬 Video' : '📷 Photo'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-400 text-xs">
                    {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setPreviewItem(item)}
                        className="text-gray-400 hover:text-primary p-1 rounded hover:bg-primary/5"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {deleteId === item.id ? (
                        <span className="flex items-center gap-1 text-xs">
                          <button onClick={() => handleDelete(item.id, item.url)} className="text-red-600 font-semibold hover:underline flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Confirm
                          </button>
                          <button onClick={() => setDeleteId(null)} className="text-gray-400 hover:underline">Cancel</button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setDeleteId(item.id)}
                          className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Preview Lightbox */}
      {previewItem && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setPreviewItem(null)}
        >
          <button
            onClick={() => setPreviewItem(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {previewItem.media_type === 'photo' ? (
              <img
                src={previewItem.url}
                alt={previewItem.title}
                className="w-full max-h-[80vh] object-contain rounded-xl"
              />
            ) : (
              <video
                src={previewItem.url}
                controls
                autoPlay
                className="w-full max-h-[80vh] rounded-xl"
              />
            )}
            <div className="text-center mt-4">
              <p className="text-white font-semibold text-lg">{previewItem.title}</p>
              {previewItem.description && (
                <p className="text-white/60 text-sm mt-1">{previewItem.description}</p>
              )}
              <span className="inline-block mt-2 px-3 py-0.5 bg-white/10 text-white/70 rounded-full text-xs">
                {previewItem.category}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
