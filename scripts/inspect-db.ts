import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || 'https://mqezjpajegxmllwclrce.supabase.co';
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = createClient(url, key);

async function testTable(name: string) {
  const { data, error, count } = await supabase.from(name).select('*', { count: 'exact' }).limit(10);
  if (error) {
    console.log(`[${name}] Error:`, error.code, error.message);
  } else {
    console.log(`[${name}] Success! Total count: ${count}, Fetched rows: ${data?.length}`);
    if (data && data.length > 0) {
      console.log(`[${name}] Columns:`, Object.keys(data[0]));
      console.log(`[${name}] Sample data:`, JSON.stringify(data.slice(0, 3), null, 2));
    }
  }
}

async function main() {
  console.log('Testing connection to Supabase...');
  await testTable('categories');
  await testTable('profiles');
}

main().catch(err => console.error('Fatal error:', err));
