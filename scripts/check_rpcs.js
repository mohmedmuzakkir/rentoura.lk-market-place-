import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://mqezjpajegxmllwclrce.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRPCs() {
  await supabase.auth.signInWithPassword({
    email: 'guest_reader@rentoura.lk',
    password: 'RentouraGuest123!',
  });

  const { data, error } = await supabase.rpc('is_staff', { p_user_id: 'e02a0f21-509d-42fb-a341-02db99f0b9b4' });
  console.log('rpc is_staff(p_user_id) result:', data, 'error:', error);
}

checkRPCs();
