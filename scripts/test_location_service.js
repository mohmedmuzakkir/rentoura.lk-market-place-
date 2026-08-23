import { LocationService } from '../src/services/locationService';

async function testLocationService() {
  console.log('--- Testing LocationService ---');
  const provinces = await LocationService.getProvinces();
  console.log(`Loaded ${provinces.length} provinces from Supabase public.locations:`);
  provinces.forEach(p => console.log(`- ${p.name} (Code: ${p.code}, ID: ${p.id})`));

  const western = provinces.find(p => p.name.toLowerCase().includes('western'));
  if (western) {
    console.log(`\nFetching districts for Western Province (${western.id}):`);
    const districts = await LocationService.getDistricts(western.id);
    console.log(`Loaded ${districts.length} districts:`);
    districts.forEach(d => console.log(`  * ${d.name} (ID: ${d.id})`));
  }

  console.log('\nFetching cities for Colombo District:');
  const colomboDistrict = (await LocationService.getDistricts()).find(d => d.name === 'Colombo');
  if (colomboDistrict) {
    const cities = await LocationService.getCities(colomboDistrict.id);
    console.log(`Loaded ${cities.length} cities (truthful database response)`);
  }

  const stats = await LocationService.getLocationStatsAsync();
  console.log('\nDatabase Location Stats:', stats);
}

testLocationService();
