import { useState, useRef } from 'react';
import { useGallery, GalleryImage } from '@/hooks/useGallery';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Image as ImageIcon, Loader2, Upload } from 'lucide-react';

const CATEGORIES = ['Sports', 'Events', 'Academics', 'Infrastructure', 'Cultural', 'Labs', 'Achievements', 'Other'];
const VIEW_CATEGORIES = ['All', ...CATEGORIES];

export default function GalleryManager() {
  const { images, isLoading, addImage, updateImage, deleteImage } = useGallery();
  const { uploadImage, isUploading } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<GalleryImage, 'id' | 'created_at'>>({
    image_url: '',
    category: 'Events',
    title: '',
    photo_date: '',
  });
  const [activeTab, setActiveTab] = useState('All');

  const handleEdit = (img: GalleryImage) => {
    setFormData({
      image_url: img.image_url,
      category: img.category,
      title: img.title || '',
      photo_date: img.photo_date || '',
    });
    setEditingId(img.id);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      image_url: '',
      category: 'Events',
      title: '',
      photo_date: '',
    });
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const url = await uploadImage(e.target.files[0]);
        setFormData(prev => ({ ...prev, image_url: url }));
      } catch (err) {
        // Error handled in hook
      }
    }
  };

  const onSubmit = () => {
    if (editingId) {
      updateImage.mutate({ id: editingId, ...formData }, {
        onSuccess: () => setIsDialogOpen(false)
      });
    } else {
      addImage.mutate(formData, {
        onSuccess: () => setIsDialogOpen(false)
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Gallery Manager</h1>
          <p className="text-gray-500">Manage photos and categories for the gallery.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" /> Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] text-left">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Image' : 'Upload New Image'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 mt-2">

              <div className="space-y-2">
                <Label>Image File</Label>
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                    {isUploading ? 'Uploading...' : 'Choose File'}
                  </Button>
                </div>
                <div className="text-xs text-center text-gray-500 mt-2">OR provide an image URL directly</div>
                <Input value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://..." />
                {formData.image_url && (
                  <div className="mt-2 relative h-32 w-full rounded-md overflow-hidden bg-gray-100 border">
                    <img src={formData.image_url} alt="Preview" className="object-cover w-full h-full" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={v => setFormData({ ...formData, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Title / Caption (Optional)</Label>
                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Annual Sports Day 2024" />
              </div>

              <div className="space-y-2">
                <Label>Photo Date (Optional)</Label>
                <Input type="date" value={formData.photo_date} onChange={e => setFormData({ ...formData, photo_date: e.target.value })} />
                <p className="text-xs text-gray-500">Leaving this blank will organize the photo by its upload time.</p>
              </div>

            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={onSubmit} disabled={isUploading || !formData.image_url}>{editingId ? 'Save Changes' : 'Add Image'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading gallery...</div>
      ) : images?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No images added yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {VIEW_CATEGORIES.map(cat => (
              <Button
                key={cat}
                variant={activeTab === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(cat)}
                className="rounded-full"
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images?.filter(img => activeTab === 'All' || img.category === activeTab).map((img) => (
              <Card key={img.id} className="overflow-hidden group relative">
                <div className="aspect-square bg-gray-100 relative">
                  <img src={img.image_url} alt={img.title || 'Gallery'} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="icon" variant="secondary" onClick={() => handleEdit(img)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="destructive" onClick={() => deleteImage.mutate(img.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-3">
                  <div className="text-xs font-semibold text-primary mb-1">{img.category}</div>
                  <p className="text-sm font-medium line-clamp-1">{img.title || 'Untitled'}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
