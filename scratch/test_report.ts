import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testReport() {
  console.log('Inserting test report...');
  
  const { data, error } = await supabase.from('reports').insert({
    target_type: 'listing',
    target_id: 'test-listing-id',
    target_module: 'rentals',
    target_title: 'Test Listing',
    reason_code: 'spam',
    reason_label: 'Spam or Misleading',
    details: 'This is a test report created to verify the admin reports view.',
    status: 'submitted',
    reporter_id: 'test-reporter-id',
    allow_contact: false,
    source: 'script'
  }).select();

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success! Report created:', data);
  }
}

testReport();
