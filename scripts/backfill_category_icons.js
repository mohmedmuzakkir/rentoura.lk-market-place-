import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://mqezjpajegxmllwclrce.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('Missing VITE_SUPABASE_PUBLISHABLE_KEY in environment');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const GUEST_READER_EMAIL = 'guest_reader@rentoura.lk';
const GUEST_READER_PASS = 'RentouraGuest123!';

function resolveIconKey(cat, parentMap) {
  const slug = (cat.slug || '').toLowerCase();
  const name = (cat.name || '').toLowerCase();
  const module = cat.module;

  // 1. Property / Homes
  if (slug.includes('property') || slug.includes('home-services') || slug.includes('house') || slug.includes('annex') || slug.includes('apartment') || slug.includes('flat') || slug.includes('villa') || slug.includes('bungalow') || slug.includes('holiday-home')) {
    return 'Home';
  }
  // 2. Rooms / Bed
  if (slug.includes('room') || slug.includes('boarding') || slug.includes('hostel') || slug.includes('guest-house')) {
    return 'Bed';
  }
  // 3. Commercial / Building
  if (slug.includes('commercial') || slug.includes('office') || slug.includes('shop') || slug.includes('warehouse') || slug.includes('restaurant') || slug.includes('building') || slug.includes('industrial')) {
    return 'Building';
  }
  // 4. Land
  if (slug.includes('land')) {
    return 'MapPin';
  }
  // 5. Vehicles / Cars
  if (slug.includes('vehicle') || slug.includes('car') || slug.includes('van') || slug.includes('bus') || slug.includes('three-wheeler') || slug.includes('motorcycle') || slug.includes('bicycle') || slug.includes('water-transport')) {
    return 'Car';
  }
  // 6. Events
  if (slug.includes('event') || slug.includes('wedding') || slug.includes('party') || slug.includes('conference') || slug.includes('ground') || slug.includes('stage') || slug.includes('sound-dj') || slug.includes('lighting') || slug.includes('led-screen')) {
    return 'Calendar';
  }
  // 7. Tools / Equipment
  if (slug.includes('equipment') || slug.includes('tool') || slug.includes('appliance-repair') || slug.includes('wrench')) {
    return 'Wrench';
  }
  // 8. Electronics / Mobile
  if (slug.includes('electronic') || slug.includes('computer-mobile') || slug.includes('smartphone') || slug.includes('laptop') || slug.includes('tv')) {
    return 'Smartphone';
  }
  // 9. Fashion / Clothes
  if (slug.includes('fashion') || slug.includes('cloth') || slug.includes('shirt')) {
    return 'Shirt';
  }
  // 10. Furniture
  if (slug.includes('furniture') || slug.includes('sofa') || slug.includes('armchair')) {
    return 'Sofa';
  }
  // 11. Outdoor
  if (slug.includes('outdoor') || slug.includes('camp') || slug.includes('tent')) {
    return 'Tent';
  }
  // 12. Baby / Medical
  if (slug.includes('baby') || slug.includes('medical') || slug.includes('health') || slug.includes('wellness')) {
    return 'Heart';
  }
  // 13. Pets
  if (slug.includes('pet') || slug.includes('paw')) {
    return 'Paw';
  }
  // 14. Office / Jobs
  if (slug.includes('office-admin') || slug.includes('clerk') || slug.includes('secretary') || slug.includes('receptionist') || slug.includes('data-entry') || slug.includes('customer-service') || slug.includes('business-services')) {
    return 'Briefcase';
  }
  // 15. IT / Tech
  if (slug.includes('it-') || slug.includes('developer') || slug.includes('cyber') || slug.includes('network') || slug.includes('digital')) {
    return 'Laptop';
  }
  // 16. Sales / Marketing
  if (slug.includes('sales') || slug.includes('marketing')) {
    return 'Megaphone';
  }
  // 17. Accounting / Finance
  if (slug.includes('accounting') || slug.includes('finance')) {
    return 'Calculator';
  }
  // 18. Tourism / Hospitality
  if (slug.includes('hospitality') || slug.includes('tourism') || slug.includes('hotel')) {
    return 'Hotel';
  }
  // 19. Transport / Driving / Moving
  if (slug.includes('driving') || slug.includes('transport') || slug.includes('truck') || slug.includes('delivery')) {
    return 'Truck';
  }
  // 20. Construction
  if (slug.includes('construction')) {
    return 'HardHat';
  }
  // 21. Factory / Manufacturing
  if (slug.includes('factory') || slug.includes('manufacturing')) {
    return 'Factory';
  }
  // 22. Education
  if (slug.includes('education')) {
    return 'GraduationCap';
  }
  // 23. Beauty
  if (slug.includes('beauty')) {
    return 'Scissors';
  }
  // 24. Security
  if (slug.includes('security')) {
    return 'Shield';
  }
  // 25. Freelance / Remote
  if (slug.includes('freelance') || slug.includes('remote')) {
    return 'Globe';
  }
  // 26. Creative / Art
  if (slug.includes('creative') || slug.includes('art') || slug.includes('design')) {
    return 'Palette';
  }
  // 27. Legal
  if (slug.includes('legal')) {
    return 'Scale';
  }

  // Fallback to parent category icon if parent exists
  if (cat.parent_id && parentMap[cat.parent_id]) {
    const parentIcon = parentMap[cat.parent_id].icon_key;
    if (parentIcon) return parentIcon;
  }

  // Module defaults
  if (module === 'rental') return 'Home';
  if (module === 'job') return 'Briefcase';
  if (module === 'service') return 'Wrench';

  return 'Folder';
}

async function runBackfill() {
  console.log('Authenticating guest reader account with Supabase...');
  const { error: authErr } = await supabase.auth.signInWithPassword({
    email: GUEST_READER_EMAIL,
    password: GUEST_READER_PASS,
  });

  if (authErr) {
    console.log('Sign in failed, attempting sign up...', authErr.message);
    const { error: signUpErr } = await supabase.auth.signUp({
      email: GUEST_READER_EMAIL,
      password: GUEST_READER_PASS,
    });
    if (signUpErr) {
      console.error('Auth failed completely:', signUpErr.message);
      process.exit(1);
    }
  }

  console.log('Authentication successful. Fetching all categories from Supabase...');
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*');

  if (error) {
    console.error('Error fetching categories:', error);
    process.exit(1);
  }

  console.log(`Total categories fetched: ${categories.length}`);

  const activeCategories = categories.filter(c => !c.status || c.status === 'active');
  console.log(`Active categories: ${activeCategories.length}`);

  const parentMap = {};
  categories.forEach(cat => {
    parentMap[cat.id] = cat;
  });

  const emptyCategories = activeCategories.filter(c => !c.icon_key || c.icon_key.trim() === '');
  console.log(`Active categories missing icon_key: ${emptyCategories.length}`);

  let updatedCount = 0;
  let failedCount = 0;

  for (const cat of emptyCategories) {
    const newIconKey = resolveIconKey(cat, parentMap);
    console.log(`Updating category ID ${cat.id} (${cat.module} > ${cat.name}) with icon_key="${newIconKey}"`);

    const { error: updateError } = await supabase
      .from('categories')
      .update({ icon_key: newIconKey })
      .eq('id', cat.id);

    if (updateError) {
      console.error(`  -> Failed to update category ${cat.id}:`, updateError.message);
      failedCount++;
    } else {
      updatedCount++;
    }
  }

  console.log('\n--- BACKFILL COMPLETE ---');
  console.log(`Successfully updated: ${updatedCount}`);
  console.log(`Failed updates: ${failedCount}`);

  // Re-verify
  const { data: recheck } = await supabase
    .from('categories')
    .select('id, name, module, icon_key, status');

  const remainingEmptyActive = recheck
    ? recheck.filter(c => (!c.status || c.status === 'active') && (!c.icon_key || c.icon_key.trim() === ''))
    : [];

  console.log(`Remaining active categories with missing icon_key: ${remainingEmptyActive.length}`);
}

runBackfill();
