import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mfvtzqayexkmeuhcowrk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return false;
  if (url === 'https://placeholder-project.supabase.co' || url === 'https://your-project.supabase.co') return false;
  if (key === 'placeholder-anon-key' || key === 'your-supabase-anon-key-here' || key.trim() === '') return false;
  
  // Uma chave válida do Supabase é um JWT longo que começa geralmente com eyJ...
  return key.length > 20;
};

// Fallback seguro caso o cliente inicialize antes da chave ser inserida no .env.local
const effectiveKey = isSupabaseConfigured() ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy';

export const supabase = createClient(supabaseUrl, effectiveKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
