import { createClient } from '@supabase/supabase-js';

// Retrieve environment variables required for Supabase.
// These variables must be defined in your .env or .env.local file.
// If missing, we provide empty strings to prevent build crashes, but network requests will fail.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Please check your .env file.');
}

// Create and export the Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
