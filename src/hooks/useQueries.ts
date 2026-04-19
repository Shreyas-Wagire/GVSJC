import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

/**
 * Fetches contact/query submissions from the `contacts` table.
 * (Contact.tsx inserts visitor messages into the `contacts` table)
 */
export const useQueries = () => {
  return useQuery({
    queryKey: ['queries'],
    queryFn: async () => {
      const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
