import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://mqezjpajegxmllwclrce.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const anonClient = createClient(supabaseUrl, supabaseKey);

async function checkAnonLocations() {
  const { data, error } = await anonClient
    .from('locations')
    .select('id, name, type, code')
    .eq('type', 'province');

  console.log('Anon locations query error:', error);
  console.log('Anon locations query count:', data?.length);
  if (data) {
    console.log('Provinces:', data.map(p => p.name));
  }
}

checkAnonLocations();
