import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials in .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function insertOrder(order) {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select('*')
    .single();

  return { data, error };
}
