import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://mqezjpajegxmllwclrce.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectRLSPoliciesAndRoles() {
  await supabase.auth.signInWithPassword({
    email: 'guest_reader@rentoura.lk',
    password: 'RentouraGuest123!',
  });

  const { data: user } = await supabase.auth.getUser();
  console.log('Guest reader user ID:', user?.user?.id);

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.user?.id || '')
    .single();

  console.log('Guest reader profile:', profile);

  // Check anonymous client read without auth
  const anonClient = createClient(supabaseUrl, supabaseKey);
  const { data: anonProvinces, error: anonErr } = await anonClient
    .from('locations')
    .select('*')
    .eq('type', 'province');

  console.log('Anon provinces query error:', anonErr);
  console.log('Anon provinces query count:', anonProvinces?.length);

  // Re-check update on target with a non-staff user if possible, or test anon update
  const { error: anonUpdErr } = await anonClient
    .from('locations')
    .update({ name: 'Hacked' })
    .eq('code', 'western');
  console.log('Anon update error:', anonUpdErr);
}

inspectRLSPoliciesAndRoles();
