import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://mqezjpajegxmllwclrce.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

async function testRLS() {
  console.log('--- TEST 1: Anonymous Read ---');
  const anonClient = createClient(supabaseUrl, supabaseKey);
  const { data: anonData, error: anonErr } = await anonClient
    .from('locations')
    .select('id, name, type')
    .eq('type', 'province');

  console.log('Anon read status:', anonErr ? `ERROR: ${anonErr.message}` : `SUCCESS (${anonData?.length} provinces)`);

  console.log('\n--- TEST 2: Authenticated Read ---');
  const authClient = createClient(supabaseUrl, supabaseKey);
  await authClient.auth.signInWithPassword({
    email: 'guest_reader@rentoura.lk',
    password: 'RentouraGuest123!',
  });
  const { data: authData, error: authErr } = await authClient
    .from('locations')
    .select('id, name, type')
    .eq('type', 'province');

  console.log('Auth read status:', authErr ? `ERROR: ${authErr.message}` : `SUCCESS (${authData?.length} provinces)`);

  console.log('\n--- TEST 3: Normal User Insert Attempt ---');
  const { data: insData, error: insErr } = await authClient
    .from('locations')
    .insert({
      name: 'Test Fake Province',
      type: 'province',
      code: 'test_fake',
      status: 'active'
    });

  console.log('Normal insert blocked correctly?:', insErr ? `YES (Blocked with error: ${insErr.message})` : 'NO (Insert succeeded - warning!)');

  console.log('\n--- TEST 4: Normal User Update Attempt ---');
  if (authData && authData.length > 0) {
    const targetId = authData[0].id;
    const { error: updErr } = await authClient
      .from('locations')
      .update({ name: 'Hacked Province Name' })
      .eq('id', targetId);

    console.log('Normal update blocked correctly?:', updErr ? `YES (Blocked with error: ${updErr.message})` : 'NO (Update succeeded - warning!)');
  }

  console.log('\n--- TEST 5: Normal User Delete Attempt ---');
  if (authData && authData.length > 0) {
    const targetId = authData[0].id;
    const { error: delErr } = await authClient
      .from('locations')
      .delete()
      .eq('id', targetId);

    console.log('Normal delete blocked correctly?:', delErr ? `YES (Blocked with error: ${delErr.message})` : 'NO (Delete succeeded - warning!)');
  }
}

testRLS();
