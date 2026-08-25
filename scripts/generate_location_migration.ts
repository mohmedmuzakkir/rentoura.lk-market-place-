import fs from 'fs';
import path from 'path';
import { SRI_LANKA_PROVINCES, CANONICAL_CITIES_AND_AREAS } from '../src/data/sriLankaLocations';

let sql = `-- RENTOURA.LK — MIGRATION 007: SYNC CANONICAL SRI LANKA LOCATIONS
-- Inserts missing Provinces, Districts, Cities/Towns, and Areas/Villages from the canonical frontend dataset into public.locations.
-- Repeat-safe via ON CONFLICT (code) DO UPDATE / DO NOTHING.

DO $$
DECLARE
  p_id uuid;
  d_id uuid;
  c_id uuid;
BEGIN

-- 1. PROVINCES & DISTRICTS
`;

let provCount = 0;
let distCount = 0;
let cityCount = 0;
let areaCount = 0;

for (let pIdx = 0; pIdx < SRI_LANKA_PROVINCES.length; pIdx++) {
  const prov = SRI_LANKA_PROVINCES[pIdx];
  provCount++;
  const provCode = `prov-${prov.id.replace(/_/g, '-')}`;
  sql += `
  INSERT INTO public.locations (code, name, type, sort_order, status)
  VALUES ('${provCode}', '${prov.name.replace(/'/g, "''")}', 'province', ${pIdx + 1}, 'active')
  ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

  SELECT id INTO p_id FROM public.locations WHERE code = '${provCode}';
`;

  for (let dIdx = 0; dIdx < prov.districts.length; dIdx++) {
    const dist = prov.districts[dIdx];
    distCount++;
    const distCode = `dist-${dist.id.replace(/_/g, '-')}`;
    sql += `
  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order, status)
  VALUES ('${distCode}', '${dist.name.replace(/'/g, "''")}', 'district', p_id, p_id, ${dIdx + 1}, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, name = EXCLUDED.name;
`;
  }
}

sql += `\n-- 2. CITIES & TOWNS AND AREAS\n`;

for (let cIdx = 0; cIdx < CANONICAL_CITIES_AND_AREAS.length; cIdx++) {
  const city = CANONICAL_CITIES_AND_AREAS[cIdx];
  cityCount++;
  
  // Find district code
  const distCode = `dist-${city.districtCode.replace(/_/g, '-')}`;
  const cityCode = city.code.startsWith('city-') ? city.code : `city-${city.code}`;

  sql += `
  SELECT id INTO d_id FROM public.locations WHERE code = '${distCode}';
  SELECT province_id INTO p_id FROM public.locations WHERE code = '${distCode}';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('${cityCode}', '${city.name.replace(/'/g, "''")}', 'city', d_id, p_id, d_id, ${city.postalCode ? `'${city.postalCode}'` : 'NULL'}, ${cIdx + 1}, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = '${cityCode}';
`;

  if (city.areas && city.areas.length > 0) {
    for (let aIdx = 0; aIdx < city.areas.length; aIdx++) {
      const area = city.areas[aIdx];
      areaCount++;
      const areaCode = area.code.startsWith('area-') ? area.code : `area-${area.code}`;
      sql += `
  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('${areaCode}', '${area.name.replace(/'/g, "''")}', 'area', c_id, p_id, d_id, c_id, ${area.postalCode ? `'${area.postalCode}'` : 'NULL'}, ${aIdx + 1}, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;
`;
    }
  }
}

sql += `
END $$;
`;

const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20260824120000_007_sync_canonical_locations.sql');
fs.writeFileSync(migrationPath, sql, 'utf8');

console.log(`Generated migration with ${provCount} Provinces, ${distCount} Districts, ${cityCount} Cities, and ${areaCount} Areas.`);
