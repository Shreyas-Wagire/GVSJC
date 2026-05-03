import { useState, useRef } from 'react';
import { useToppers, Topper } from '@/hooks/useToppers';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Trophy, Loader2, Upload } from 'lucide-react';

const CLASSES = ['1st Std', '2nd Std', '3rd Std', '4th Std', '5th Std', '6th Std', '7th Std', '8th Std', '9th Std', '10th Std'];
const YEARS = ['2023-24', '2024-25', '2025-26', '2026-27'];
const RANKS = [1, 2, 3];

export default function ToppersManager() {
  const { toppers, isLoading, addTopper, updateTopper, deleteTopper } = useToppers();
  const { uploadImage, isUploading } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Topper, 'id' | 'created_at'>>({
    name: '',
    marks: '',
    rank: 1,
    class: '1st Std',
    academic_year: '2025-26',
    photo_url: '',
  });

  const handleEdit = (topper: Topper) => {
    setFormData({
      name: topper.name,
      marks: topper.marks,
      rank: topper.rank,
      class: topper.class || '1st Std',
      academic_year: topper.academic_year || '2025-26',
      photo_url: topper.photo_url || '',
    });
    setEditingId(topper.id);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      marks: '',
      rank: 1,
      class: '1st Std',
      academic_year: '2025-26',
      photo_url: '',
    });
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const url = await uploadImage(e.target.files[0]);
        setFormData(prev => ({ ...prev, photo_url: url }));
      } catch (err) {
        // Handled in hook
      }
    }
  };

  const onSubmit = () => {
    if (editingId) {
      updateTopper.mutate({ id: editingId, ...formData }, {
        onSuccess: () => setIsDialogOpen(false)
      });
    } else {
      addTopper.mutate(formData, {
        onSuccess: () => setIsDialogOpen(false)
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Toppers Manager</h1>
          <p className="text-gray-500">Manage student achievers and their rankings.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" /> Add Topper
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] text-left">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Topper' : 'Add New Topper'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 mt-2">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Student Name</Label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Jane Doe" />
                </div>
                <div className="space-y-2">
                  <Label>Marks / Percentage</Label>
                  <Input value={formData.marks} onChange={e => setFormData({...formData, marks: e.target.value})} placeholder="98.5%" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Rank (1-3)</Label>
                  <Select value={formData.rank.toString()} onValueChange={v => setFormData({...formData, rank: parseInt(v)})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {RANKS.map(r => <SelectItem key={r} value={r.toString()}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Class</Label>
                  <Select value={formData.class} onValueChange={v => setFormData({...formData, class: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Academic Year</Label>
                  <Select value={formData.academic_year} onValueChange={v => setFormData({...formData, academic_year: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Student Photo</Label>
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
                    {isUploading ? 'Uploading...' : 'Upload Photo'}
                  </Button>
                </div>
                <div className="text-xs text-center text-gray-500 mt-2">OR provide an image URL directly</div>
                <Input value={formData.photo_url} onChange={e => setFormData({...formData, photo_url: e.target.value})} placeholder="https://..." />
                {formData.photo_url && (
                  <div className="mt-2 relative h-24 w-24 rounded-lg overflow-hidden bg-gray-100 border mx-auto">
                    <img src={formData.photo_url} alt="Preview" className="object-cover w-full h-full" />
                  </div>
                )}
              </div>

            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={onSubmit} disabled={isUploading || !formData.name || !formData.marks}>{editingId ? 'Save Changes' : 'Add Topper'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading toppers...</div>
      ) : toppers?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed">
          <Trophy className="w-12 h-12 text-yellow-300 mx-auto mb-3" />
          <p className="text-gray-500">No toppers added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {toppers?.map((topper) => (
            <Card key={topper.id} className="relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 font-bold px-3 py-1 rounded-bl-lg z-10">
                Rank #{topper.rank}
              </div>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full border-4 border-yellow-100 overflow-hidden mb-4 relative">
                    {topper.photo_url ? (
                      <img src={topper.photo_url} alt={topper.name} className="w-full h-full object-cover" />
                    ) : (
                      <Trophy className="w-12 h-12 text-gray-300 m-5" />
                    )}
                  </div>
                  <div className="text-xs font-semibold text-secondary mb-1">
                    {topper.academic_year} • {topper.class}
                  </div>
                  <h3 className="font-bold text-lg">{topper.name}</h3>
                  <div className="text-3xl font-black text-primary mt-1">{topper.marks}</div>
                </div>
                
                <div className="mt-6 flex gap-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleEdit(topper)}>
                    <Pencil className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => deleteTopper.mutate(topper.id)}>
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
