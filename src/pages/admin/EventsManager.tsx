import { useState } from 'react';
import { useEvents, Event } from '@/hooks/useEvents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, CalendarDays } from 'lucide-react';

const EVENT_TYPES = ['Sports', 'Cultural', 'Academic', 'Holiday', 'Meeting', 'Other'];

export default function EventsManager() {
  const { events, isLoading, addEvent, updateEvent, deleteEvent } = useEvents();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Event, 'id' | 'created_at'>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Cultural',
    description: '',
  });

  const handleEdit = (event: Event) => {
    setFormData({
      title: event.title,
      date: event.date,
      type: event.type,
      description: event.description || '',
    });
    setEditingId(event.id);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      type: 'Cultural',
      description: '',
    });
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const onSubmit = () => {
    if (editingId) {
      updateEvent.mutate({ id: editingId, ...formData }, {
        onSuccess: () => setIsDialogOpen(false)
      });
    } else {
      addEvent.mutate(formData, {
        onSuccess: () => setIsDialogOpen(false)
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Events Manager</h1>
          <p className="text-gray-500">Manage upcoming and past school events.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" /> Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] text-left">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Event' : 'Create New Event'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 mt-2">

              <div className="space-y-2">
                <Label>Event Title</Label>
                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Annual Sports Meet" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <Select value={formData.type} onValueChange={v => setFormData({ ...formData, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} placeholder="Details about the event..." />
              </div>

            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={onSubmit} disabled={!formData.title || !formData.date}>{editingId ? 'Save Changes' : 'Create Event'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading events...</div>
      ) : events?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed">
          <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No events created yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {events?.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardContent className="p-0 sm:flex items-center">
                <div className="p-4 sm:p-6 flex-1 flex gap-4">
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex flex-col items-center justify-center shrink-0 border border-primary/20">
                    <span className="text-xs font-bold text-primary uppercase">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                    <span className="text-xl font-black text-gray-900 leading-none mt-0.5">{new Date(event.date).getDate()}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">{event.type}</span>
                    </div>
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    {event.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{event.description}</p>}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 sm:p-6 sm:w-48 flex sm:flex-col justify-end sm:justify-center gap-2 border-t sm:border-t-0 sm:border-l">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleEdit(event)}>
                    <Pencil className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => deleteEvent.mutate(event.id)}>
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
