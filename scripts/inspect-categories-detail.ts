import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || 'https://mqezjpajegxmllwclrce.supabase.co';
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = createClient(url, key);

async function inspectCategories() {
  console.log('Fetching rows from public.categories...');
  const { data, error, count } = await supabase
    .from('categories')
    .select('*', { count: 'exact' })
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return;
  }

  console.log(`Total category rows in DB: ${count}`);
  if (!data || data.length === 0) {
    console.log('No rows found in categories table.');
    return;
  }

  console.log('\nColumns in categories table:');
  console.log(Object.keys(data[0]));

  console.log('\nAll rows summary:');
  const summary = data.map(c => ({
    id: c.id,
    module: c.module,
    name: c.name,
    slug: c.slug,
    parent_id: c.parent_id,
    level: c.level,
    status: c.status,
    sort_order: c.sort_order,
    icon_key: c.icon_key
  }));
  console.table(summary);
}

inspectCategories();
