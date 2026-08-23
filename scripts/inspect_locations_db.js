import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://mqezjpajegxmllwclrce.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const GUEST_READER_EMAIL = 'guest_reader@rentoura.lk';
const GUEST_READER_PASS = 'RentouraGuest123!';

async function inspectLocations() {
  console.log('Authenticating guest reader...');
  const { error: authErr } = await supabase.auth.signInWithPassword({
    email: GUEST_READER_EMAIL,
    password: GUEST_READER_PASS,
  });

  if (authErr) {
    console.error('Auth error:', authErr.message);
  } else {
    console.log('Auth successful.');
  }

  // 1. Fetch sample row to inspect structure
  const { data: sample, error: sampleErr } = await supabase
    .from('locations')
    .select('*')
    .limit(5);

  if (sampleErr) {
    console.error('Sample fetch error:', sampleErr);
  } else {
    console.log('Sample row keys:', sample.length > 0 ? Object.keys(sample[0]) : 'No rows');
    console.log('Sample row:', sample[0]);
  }

  // 2. Fetch all locations and analyze types
  const { data: allLocations, error: allErr } = await supabase
    .from('locations')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (allErr) {
    console.error('Fetch all error:', allErr);
    return;
  }

  console.log(`Total rows in public.locations: ${allLocations.length}`);

  const typeCounts = {};
  const statusCounts = {};
  
  allLocations.forEach(loc => {
    typeCounts[loc.type] = (typeCounts[loc.type] || 0) + 1;
    statusCounts[loc.status || 'null'] = (statusCounts[loc.status || 'null'] || 0) + 1;
  });

  console.log('Type counts:', typeCounts);
  console.log('Status counts:', statusCounts);

  const provinces = allLocations.filter(l => l.type === 'province');
  const districts = allLocations.filter(l => l.type === 'district');
  const cities = allLocations.filter(l => l.type === 'city');
  const areas = allLocations.filter(l => l.type === 'area');

  console.log(`Provinces count: ${provinces.length}`);
  console.log(`Districts count: ${districts.length}`);
  console.log(`Cities count: ${cities.length}`);
  console.log(`Areas count: ${areas.length}`);

  // District to Province distribution
  const provinceMap = {};
  provinces.forEach(p => {
    provinceMap[p.id] = { name: p.name, code: p.code, districts: [] };
  });

  let orphanDistricts = 0;
  districts.forEach(d => {
    const parentId = d.parent_id || d.province_id;
    if (parentId && provinceMap[parentId]) {
      provinceMap[parentId].districts.push(d.name);
    } else {
      console.log('Orphan district found:', d);
      orphanDistricts++;
    }
  });

  console.log('Orphan districts count:', orphanDistricts);
  console.log('Provinces and their districts:');
  Object.values(provinceMap).forEach((p) => {
    console.log(`- ${p.name} (${p.districts.length} districts): ${p.districts.join(', ')}`);
  });

  // Check for duplicates
  const namesSeen = new Set();
  const duplicates = [];
  allLocations.forEach(l => {
    const key = `${l.type}:${l.name.toLowerCase()}:${l.parent_id || ''}`;
    if (namesSeen.has(key)) {
      duplicates.push(l);
    } else {
      namesSeen.add(key);
    }
  });
  console.log(`Potential duplicate location records: ${duplicates.length}`);
}

inspectLocations();
