import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://mqezjpajegxmllwclrce.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const GUEST_READER_EMAIL = 'guest_reader@rentoura.lk';
const GUEST_READER_PASS = 'RentouraGuest123!';

async function verify() {
  await supabase.auth.signInWithPassword({
    email: GUEST_READER_EMAIL,
    password: GUEST_READER_PASS,
  });

  const { data: categories } = await supabase.from('categories').select('id, name, module, icon_key, parent_id');
  
  const total = categories ? categories.length : 0;
  const missing = categories ? categories.filter(c => !c.icon_key || c.icon_key.trim() === '') : [];
  const populated = categories ? categories.filter(c => c.icon_key && c.icon_key.trim() !== '') : [];

  console.log(`TOTAL CATEGORIES IN DB: ${total}`);
  console.log(`POPULATED ICON_KEY: ${populated.length}`);
  console.log(`MISSING ICON_KEY: ${missing.length}`);

  if (missing.length > 0) {
    console.log('Sample missing:', missing.slice(0, 5));
  } else {
    console.log('ALL CATEGORIES HAVE REAL ICON_KEY VALUES!');
  }
}

verify();
