import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type Notice = {
  id: string;
  tag: string;
  tag_color: string;
  icon: string;
  icon_color: string;
  title: string;
  description: string;
  date: string;
  is_new: boolean;
};

export const useNotices = () => {
  const queryClient = useQueryClient();

  const { data: notices, isLoading, error } = useQuery({
    queryKey: ['notices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notices:', error);
        throw error;
      }
      return data as Notice[];
    },
    // Adding staleTime to ensure UI doesn't flicker unnecessarily
    staleTime: 5 * 60 * 1000,
  });

  const addNotice = useMutation({
    mutationFn: async (newNotice: Omit<Notice, 'id'>) => {
      const { data, error } = await supabase
        .from('notices')
        .insert([newNotice])
        .select()
        .single();
      
      if (error) throw error;
      return data as Notice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      toast.success('Notice added successfully');
    },
    onError: (error) => {
      console.error('Error adding notice:', error);
      toast.error('Failed to add notice');
    }
  });

  const updateNotice = useMutation({
    mutationFn: async (update: Partial<Notice> & { id: string }) => {
      const { id, ...updates } = update;
      const { data, error } = await supabase
        .from('notices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Notice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      toast.success('Notice updated successfully');
    },
    onError: (error) => {
      console.error('Error updating notice:', error);
      toast.error('Failed to update notice');
    }
  });

  const deleteNotice = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notices')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      toast.success('Notice deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting notice:', error);
      toast.error('Failed to delete notice');
    }
  });

  return {
    notices,
    isLoading,
    error,
    addNotice,
    updateNotice,
    deleteNotice
  };
};
