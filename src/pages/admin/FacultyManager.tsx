import { useState, useRef } from 'react';
import { useFaculty, Faculty } from '@/hooks/useFaculty';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Users, Loader2, Upload } from 'lucide-react';

export default function FacultyManager() {
  const { facultyMembers, isLoading, addFaculty, updateFaculty, deleteFaculty } = useFaculty();
  const { uploadImage, isUploading } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Faculty, 'id' | 'created_at'>>({
    name: '',
    subject: '',
    qualification: '',
    experience: '',
    photo_url: '',
  });

  const handleEdit = (faculty: Faculty) => {
    setFormData({
      name: faculty.name,
      subject: faculty.subject,
      qualification: faculty.qualification,
      experience: faculty.experience,
      photo_url: faculty.photo_url || '',
    });
    setEditingId(faculty.id);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      subject: '',
      qualification: '',
      experience: '',
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
      updateFaculty.mutate({ id: editingId, ...formData }, {
        onSuccess: () => setIsDialogOpen(false)
      });
    } else {
      addFaculty.mutate(formData, {
        onSuccess: () => setIsDialogOpen(false)
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Faculty Manager</h1>
          <p className="text-gray-500">Manage teaching staff details.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" /> Add Faculty
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] text-left">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Faculty Member' : 'Add New Faculty Member'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 mt-2">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="Mathematics" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Qualification</Label>
                  <Input value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} placeholder="M.Sc, B.Ed" />
                </div>
                <div className="space-y-2">
                  <Label>Experience</Label>
                  <Input value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} placeholder="5 Years" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Photo</Label>
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
                  <div className="mt-2 relative h-20 w-20 rounded-full overflow-hidden bg-gray-100 border mx-auto">
                    <img src={formData.photo_url} alt="Preview" className="object-cover w-full h-full" />
                  </div>
                )}
              </div>

            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={onSubmit} disabled={isUploading || !formData.name || !formData.subject}>{editingId ? 'Save Changes' : 'Add Faculty'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading faculty...</div>
      ) : facultyMembers?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No faculty members added yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {facultyMembers?.map((faculty) => (
            <Card key={faculty.id} className="overflow-hidden">
              <CardContent className="p-0 sm:flex items-center">
                <div className="p-4 sm:p-6 flex-1 flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0 overflow-hidden border">
                    {faculty.photo_url ? (
                      <img src={faculty.photo_url} alt={faculty.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-8 h-8 text-gray-400 m-4" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{faculty.name}</h3>
                    <p className="text-sm text-primary font-medium">{faculty.subject}</p>
                    <div className="flex gap-3 text-xs text-gray-500 mt-1">
                      <span>{faculty.qualification}</span>
                      <span>•</span>
                      <span>{faculty.experience} exp.</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 sm:p-6 sm:w-48 flex sm:flex-col justify-end sm:justify-center gap-2 border-t sm:border-t-0 sm:border-l">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleEdit(faculty)}>
                    <Pencil className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => deleteFaculty.mutate(faculty.id)}>
                    <Trash2 className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Delete</span>
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
