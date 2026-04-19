import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

/**
 * There is no separate feedback table.
 * This hook is a no-op that returns an empty array to avoid 404 errors.
 * If a feedback table is added to Supabase in the future, update this hook.
 */
export const useFeedback = () => {
  return useQuery({
    queryKey: ['feedback'],
    queryFn: async () => {
      // Return empty array — no feedback table exists in Supabase yet
      return [] as any[];
    },
    staleTime: 5 * 60 * 1000,
  });
};
