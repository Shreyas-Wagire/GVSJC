import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

/**
 * Fetches admission applications from the `admissions` table.
 */
export const useAdmissions = () => {
  return useQuery({
    queryKey: ['admissions'],
    queryFn: async () => {
      const { data, error } = await supabase.from('admissions').select('*');
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
