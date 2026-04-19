import { useState } from 'react';
import { useNotices, Notice } from '@/hooks/useNotices';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertCircle, CalendarDays, PartyPopper, Info, Bell, Plus, Pencil, Trash2 } from 'lucide-react';

const iconMap = {
  AlertCircle, CalendarDays, PartyPopper, Info, Bell
};

const tagColorOptions = [
  { label: 'Red (Urgent)', value: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  { label: 'Amber (Warning/Wait)', value: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  { label: 'Purple (Event)', value: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  { label: 'Blue (Info)', value: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { label: 'Green (Success)', value: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
];

const iconColorOptions = [
  { label: 'Red', value: 'text-red-500' },
  { label: 'Amber', value: 'text-amber-500' },
  { label: 'Purple', value: 'text-purple-500' },
  { label: 'Blue', value: 'text-blue-500' },
  { label: 'Green', value: 'text-green-500' },
];

export default function NoticeManager() {
  const { notices, isLoading, addNotice, updateNotice, deleteNotice } = useNotices();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Notice, 'id'>>({
    title: '',
    description: '',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    tag: 'General',
    tag_color: tagColorOptions[3].value,
    icon: 'Info',
    icon_color: iconColorOptions[3].value,
    is_new: false,
  });

  const handleEdit = (notice: Notice) => {
    setFormData({
      title: notice.title,
      description: notice.description,
      date: notice.date,
      tag: notice.tag,
      tag_color: notice.tag_color,
      icon: notice.icon,
      icon_color: notice.icon_color,
      is_new: notice.is_new,
    });
    setEditingId(notice.id);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      title: '',
      description: '',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      tag: 'General',
      tag_color: tagColorOptions[3].value,
      icon: 'Info',
      icon_color: iconColorOptions[3].value,
      is_new: true,
    });
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const onSubmit = () => {
    if (editingId) {
      updateNotice.mutate({ id: editingId, ...formData }, {
        onSuccess: () => setIsDialogOpen(false)
      });
    } else {
      addNotice.mutate(formData, {
        onSuccess: () => setIsDialogOpen(false)
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Notice Board</h1>
          <p className="text-gray-500">Manage announcements on the main website.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" /> Add Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] text-left">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Notice' : 'Add New Notice'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 mt-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Exam Schedule..." />
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tag Text</Label>
                  <Input value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} placeholder="Ex: Exam" />
                </div>
                
                <div className="space-y-2">
                  <Label>Display Date</Label>
                  <Input value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tag Color</Label>
                  <Select value={formData.tag_color} onValueChange={v => setFormData({...formData, tag_color: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {tagColorOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Icon / Color</Label>
                  <Select value={formData.icon} onValueChange={v => setFormData({...formData, icon: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.keys(iconMap).map(icon => <SelectItem key={icon} value={icon}>{icon}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-2">
                <Checkbox id="is_new" checked={formData.is_new} onCheckedChange={(c) => setFormData({...formData, is_new: c as boolean})} />
                <Label htmlFor="is_new" className="font-normal cursor-pointer">Show "NEW" pulsing badge</Label>
              </div>

            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={onSubmit}>{editingId ? 'Save Changes' : 'Create Notice'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading notices...</div>
      ) : notices?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed">
          <PartyPopper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No notices added yet.</p>
          <Button variant="link" onClick={handleAdd}>Create your first notice</Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {notices?.map((notice) => {
            const Icon = iconMap[notice.icon as keyof typeof iconMap] || Info;
            return (
              <Card key={notice.id} className="overflow-hidden">
                <CardContent className="p-0 sm:flex items-center">
                  <div className="p-4 sm:p-6 flex-1 flex gap-4">
                    <div className="hidden sm:flex mt-1 w-10 h-10 rounded-lg bg-gray-100 items-center justify-center shrink-0">
                      <Icon className={`w-5 h-5 ${notice.icon_color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${notice.tag_color}`}>
                          {notice.tag}
                        </span>
                        {notice.is_new && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">NEW</span>}
                        <span className="text-xs text-gray-500">{notice.date}</span>
                      </div>
                      <h3 className="font-semibold">{notice.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notice.description}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 sm:p-6 sm:w-48 flex sm:flex-col justify-end sm:justify-center gap-2 border-t sm:border-t-0 sm:border-l">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => handleEdit(notice)}>
                      <Pencil className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => deleteNotice.mutate(notice.id)}>
                      <Trash2 className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
