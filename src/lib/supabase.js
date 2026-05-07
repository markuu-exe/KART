import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Example function to insert request
export const insertRequest = async (requestData) => {
  const { data, error } = await supabase
    .from('requests')
    .insert([requestData]);

  if (error) {
    throw error;
  }

  return data;
};