import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

/**
 * Fetches feedback submissions from the `feedback` table.
 * Table columns: id, name, email, rating, comment, category, created_at
 */
export const useFeedback = () => {
  return useQuery({
    queryKey: ['feedback'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
