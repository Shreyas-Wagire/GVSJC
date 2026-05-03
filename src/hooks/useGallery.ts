import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type GalleryImage = {
  id: string;
  image_url: string;
  category: string;
  title?: string;
  created_at?: string;
};

export const useGallery = () => {
  const queryClient = useQueryClient();

  const { data: images, isLoading, error } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as GalleryImage[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const addImage = useMutation({
    mutationFn: async (newImage: Omit<GalleryImage, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('gallery')
        .insert([newImage])
        .select()
        .single();
      
      if (error) throw error;
      return data as GalleryImage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast.success('Image added successfully');
    },
    onError: (error) => {
      console.error('Error adding image:', error);
      toast.error('Failed to add image');
    }
  });

  const updateImage = useMutation({
    mutationFn: async (update: Partial<GalleryImage> & { id: string }) => {
      const { id, ...updates } = update;
      const { data, error } = await supabase
        .from('gallery')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as GalleryImage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast.success('Image updated successfully');
    },
    onError: (error) => {
      console.error('Error updating image:', error);
      toast.error('Failed to update image');
    }
  });

  const deleteImage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast.success('Image deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  });

  return {
    images,
    isLoading,
    error,
    addImage,
    updateImage,
    deleteImage
  };
};
