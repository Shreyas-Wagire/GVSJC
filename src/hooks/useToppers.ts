import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type Topper = {
  id: string;
  name: string;
  marks: string;
  rank: number;
  class: string;
  academic_year: string;
  photo_url?: string;
  created_at?: string;
};

export const useToppers = () => {
  const queryClient = useQueryClient();

  const { data: toppers, isLoading, error } = useQuery({
    queryKey: ['toppers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('toppers')
        .select('*')
        .order('academic_year', { ascending: false })
        .order('class', { ascending: true })
        .order('rank', { ascending: true });

      if (error) throw error;
      return data as Topper[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const addTopper = useMutation({
    mutationFn: async (newTopper: Omit<Topper, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('toppers')
        .insert([newTopper])
        .select()
        .single();

      if (error) throw error;
      return data as Topper;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toppers'] });
      toast.success('Topper added successfully');
    },
    onError: (error) => {
      console.error('Error adding topper:', error);
      toast.error('Failed to add topper');
    }
  });

  const updateTopper = useMutation({
    mutationFn: async (update: Partial<Topper> & { id: string }) => {
      const { id, ...updates } = update;
      const { data, error } = await supabase
        .from('toppers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Topper;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toppers'] });
      toast.success('Topper updated successfully');
    },
    onError: (error) => {
      console.error('Error updating topper:', error);
      toast.error('Failed to update topper');
    }
  });

  const deleteTopper = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('toppers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toppers'] });
      toast.success('Topper deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting topper:', error);
      toast.error('Failed to delete topper');
    }
  });

  return {
    toppers,
    isLoading,
    error,
    addTopper,
    updateTopper,
    deleteTopper
  };
};
