import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type SiteContent = {
  id: string;
  section: string;
  key: string;
  value: any;
  type: 'text' | 'image' | 'html';
};

export const useSiteContent = () => {
  const queryClient = useQueryClient();

  const { data: siteContent, isLoading, error } = useQuery({
    queryKey: ['site_content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*');

      if (error) {
        console.error('Error fetching site content:', error);
        throw error;
      }
      
      // Transform into a key-value map for easier consumption in components
      const contentMap: Record<string, any> = {};
      data.forEach(item => {
        contentMap[item.key] = item.value;
      });

      return { items: data as SiteContent[], map: contentMap };
    },
    staleTime: 5 * 60 * 1000,
  });

  const updateContent = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { data, error } = await supabase
        .from('site_content')
        .update({ value })
        .eq('key', key)
        .select()
        .single();
      
      if (error) {
        // If it doesn't exist, we might want to insert it in a real scenario,
        // but for now we expect it to exist via seed script.
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_content'] });
      toast.success('Content updated successfully');
    },
    onError: (error) => {
      console.error('Error updating site content:', error);
      toast.error('Failed to update content. Ensure the key exists in DB.');
    }
  });

  return {
    contentData: siteContent?.items || [],
    getContentValue: (key: string, fallback: any = '') => {
      if (!siteContent?.map) return fallback;
      return siteContent.map[key] !== undefined ? siteContent.map[key] : fallback;
    },
    isLoading,
    error,
    updateContent
  };
};
