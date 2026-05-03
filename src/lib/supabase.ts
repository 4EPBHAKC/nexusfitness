import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mpurbmrrxpvhdibctmzl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_sqD_FPsiOj_u0HIIoPYyFQ_D-qgL_U7';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Supabase URL ou Anon Key não configurados nas variáveis de ambiente. Usando fallbacks de desenvolvimento.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
