import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type Faculty = {
  id: string;
  name: string;
  subject: string;
  qualification: string;
  experience: string;
  photo_url?: string;
  created_at?: string;
};

export const useFaculty = () => {
  const queryClient = useQueryClient();

  const { data: facultyMembers, isLoading, error } = useQuery({
    queryKey: ['faculty'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faculty')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Faculty[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const addFaculty = useMutation({
    mutationFn: async (newFaculty: Omit<Faculty, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('faculty')
        .insert([newFaculty])
        .select()
        .single();
      
      if (error) throw error;
      return data as Faculty;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
      toast.success('Faculty added successfully');
    },
    onError: (error) => {
      console.error('Error adding faculty:', error);
      toast.error('Failed to add faculty');
    }
  });

  const updateFaculty = useMutation({
    mutationFn: async (update: Partial<Faculty> & { id: string }) => {
      const { id, ...updates } = update;
      const { data, error } = await supabase
        .from('faculty')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Faculty;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
      toast.success('Faculty updated successfully');
    },
    onError: (error) => {
      console.error('Error updating faculty:', error);
      toast.error('Failed to update faculty');
    }
  });

  const deleteFaculty = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('faculty')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
      toast.success('Faculty deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting faculty:', error);
      toast.error('Failed to delete faculty');
    }
  });

  return {
    facultyMembers,
    isLoading,
    error,
    addFaculty,
    updateFaculty,
    deleteFaculty
  };
};
