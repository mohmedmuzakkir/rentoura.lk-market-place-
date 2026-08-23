import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

const url = 'https://mqezjpajegxmllwclrce.supabase.co';
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = createClient(url, key);

async function main() {
  console.log('Testing anon client...');
  const { data: anonCats, error: anonErr } = await supabase.from('categories').select('*');
  console.log('Anon categories:', { count: anonCats?.length, error: anonErr });

  console.log('Signing up auth user...');
  const email = `testuser_${Date.now()}@example.com`;
  const password = 'TestPassword123!';
  const { data: auth, error: authErr } = await supabase.auth.signUp({ email, password });
  console.log('Auth result:', { user: auth.user?.id, session: !!auth.session, error: authErr });

  if (auth.session) {
    const { data: authCats, error: authCatErr } = await supabase.from('categories').select('*');
    console.log('Auth categories query:', { count: authCats?.length, error: authCatErr });
  }
}

main().catch(console.error);
