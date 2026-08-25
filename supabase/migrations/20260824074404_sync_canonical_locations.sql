-- RENTOURA.LK — MIGRATION 007: SYNC CANONICAL SRI LANKA LOCATIONS
-- Inserts missing Provinces, Districts, Cities/Towns, and Areas/Villages from the canonical frontend dataset into public.locations.
-- Repeat-safe via ON CONFLICT (code) DO UPDATE / DO NOTHING.

DO $$
DECLARE
  p_id uuid;
  d_id uuid;
  c_id uuid;
BEGIN

  -- 0. STANDARDIZE FOUNDATION LOCATION CODES TO CANONICAL FORMAT
  UPDATE public.locations SET code = 'prov-western' WHERE code = 'western';
  UPDATE public.locations SET code = 'prov-central' WHERE code = 'central';
  UPDATE public.locations SET code = 'prov-southern' WHERE code = 'southern';
  UPDATE public.locations SET code = 'prov-northern' WHERE code = 'northern';
  UPDATE public.locations SET code = 'prov-eastern' WHERE code = 'eastern';
  UPDATE public.locations SET code = 'prov-north-western' WHERE code = 'north_western';
  UPDATE public.locations SET code = 'prov-north-central' WHERE code = 'north_central';
  UPDATE public.locations SET code = 'prov-uva' WHERE code = 'uva';
  UPDATE public.locations SET code = 'prov-sabaragamuwa' WHERE code = 'sabaragamuwa';

  UPDATE public.locations SET code = 'dist-colombo' WHERE code = 'colombo';
  UPDATE public.locations SET code = 'dist-gampaha' WHERE code = 'gampaha';
  UPDATE public.locations SET code = 'dist-kalutara' WHERE code = 'kalutara';
  UPDATE public.locations SET code = 'dist-kandy' WHERE code = 'kandy';
  UPDATE public.locations SET code = 'dist-matale' WHERE code = 'matale';
  UPDATE public.locations SET code = 'dist-nuwara-eliya' WHERE code = 'nuwara_eliya';
  UPDATE public.locations SET code = 'dist-galle' WHERE code = 'galle';
  UPDATE public.locations SET code = 'dist-matara' WHERE code = 'matara';
  UPDATE public.locations SET code = 'dist-hambantota' WHERE code = 'hambantota';
  UPDATE public.locations SET code = 'dist-jaffna' WHERE code = 'jaffna';
  UPDATE public.locations SET code = 'dist-kilinochchi' WHERE code = 'kilinochchi';
  UPDATE public.locations SET code = 'dist-mannar' WHERE code = 'mannar';
  UPDATE public.locations SET code = 'dist-vavuniya' WHERE code = 'vavuniya';
  UPDATE public.locations SET code = 'dist-mullaitivu' WHERE code = 'mullaitivu';
  UPDATE public.locations SET code = 'dist-trincomalee' WHERE code = 'trincomalee';
  UPDATE public.locations SET code = 'dist-batticaloa' WHERE code = 'batticaloa';
  UPDATE public.locations SET code = 'dist-ampara' WHERE code = 'ampara';
  UPDATE public.locations SET code = 'dist-kurunegala' WHERE code = 'kurunegala';
  UPDATE public.locations SET code = 'dist-puttalam' WHERE code = 'puttalam';
  UPDATE public.locations SET code = 'dist-anuradhapura' WHERE code = 'anuradhapura';
  UPDATE public.locations SET code = 'dist-polonnaruwa' WHERE code = 'polonnaruwa';
  UPDATE public.locations SET code = 'dist-badulla' WHERE code = 'badulla';
  UPDATE public.locations SET code = 'dist-monaragala' WHERE code = 'monaragala';
  UPDATE public.locations SET code = 'dist-ratnapura' WHERE code = 'ratnapura';
  UPDATE public.locations SET code = 'dist-kegalle' WHERE code = 'kegalle';

-- 1. PROVINCES & DISTRICTS

  INSERT INTO public.locations (code, name, type, sort_order, status)
  VALUES ('prov-western', 'Western Province', 'province', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

  SELECT id INTO p_id FROM public.locations WHERE code = 'prov-western';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order, status)
  VALUES ('dist-colombo', 'Colombo', 'district', p_id, p_id, 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, name = EXCLUDED.name;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order, status)
  VALUES ('dist-gampaha', 'Gampaha', 'district', p_id, p_id, 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, name = EXCLUDED.name;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order, status)
  VALUES ('dist-kalutara', 'Kalutara', 'district', p_id, p_id, 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, name = EXCLUDED.name;

  INSERT INTO public.locations (code, name, type, sort_order, status)
  VALUES ('prov-central', 'Central Province', 'province', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

  SELECT id INTO p_id FROM public.locations WHERE code = 'prov-central';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order, status)
  VALUES ('dist-kandy', 'Kandy', 'district', p_id, p_id, 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, name = EXCLUDED.name;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order, status)
  VALUES ('dist-matale', 'Matale', 'district', p_id, p_id, 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, name = EXCLUDED.name;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order, status)
  VALUES ('dist-nuwara-eliya', 'Nuwara Eliya', 'district', p_id, p_id, 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, name = EXCLUDED.name;

  INSERT INTO public.locations (code, name, type, sort_order, status)
  VALUES ('prov-southern', 'Southern Province', 'province', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

  SELECT id INTO p_id FROM public.locations WHERE code = 'prov-southern';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order, status)
  VALUES ('dist-galle', 'Galle', 'district', p_id, p_id, 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, name = EXCLUDED.name;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order, status)
  VALUES ('dist-matara', 'Matara', 'district', p_id, p_id, 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, name = EXCLUDED.name;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order, status)
  VALUES ('dist-hambantota', 'Hambantota', 'district', p_id, p_id, 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, name = EXCLUDED.name;

  INSERT INTO public.locations (code, name, type, sort_order, status)
  VALUES ('prov-northern', 'Northern Province', 'province', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

  SELECT id INTO p_id FROM public.locations WHERE code = 'prov-northern';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order, status)
  VALUES ('dist-jaffna', 'Jaffna', 'district', p_id, p_id, 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, name = EXCLUDED.name;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order, status)
  VALUES ('dist-kilinochchi', 'Kilinochchi', 'district', p_id, p_id, 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, name = EXCLUDED.name;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order, status)
  VALUES ('dist-mannar', 'Mannar', 'district', p_id, p_id, 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, name = EXCLUDED.name;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order, status)
  VALUES ('dist-vavuniya', 'Vavuniya', 'district', p_id, p_id, 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, name = EXCLUDED.name;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order, status)
  VALUES ('dist-mullaitivu', 'Mullaitivu', 'district', p_id, p_id, 5, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, name = EXCLUDED.name;

  INSERT INTO public.locations (code, name, type, sort_order, status)
  VALUES ('prov-eastern', 'Eastern Province', 'province', 5, 'active')
  ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

  SELECT id INTO p_id FROM public.locations WHERE code = 'prov-eastern';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order, status)
  VALUES ('dist-batticaloa', 'Batticaloa', 'district', p_id, p_id, 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, name = EXCLUDED.name;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order, status)
  VALUES ('dist-ampara', 'Ampara', 'district', p_id, p_id, 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, name = EXCLUDED.name;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order, status)
  VALUES ('dist-trincomalee', 'Trincomalee', 'district', p_id, p_id, 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, name = EXCLUDED.name;

  INSERT INTO public.locations (code, name, type, sort_order, status)
  VALUES ('prov-north-western', 'North Western Province', 'province', 6, 'active')
  ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

  SELECT id INTO p_id FROM public.locations WHERE code = 'prov-north-western';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order, status)
  VALUES ('dist-kurunegala', 'Kurunegala', 'district', p_id, p_id, 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, name = EXCLUDED.name;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order, status)
  VALUES ('dist-puttalam', 'Puttalam', 'district', p_id, p_id, 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, name = EXCLUDED.name;

  INSERT INTO public.locations (code, name, type, sort_order, status)
  VALUES ('prov-north-central', 'North Central Province', 'province', 7, 'active')
  ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

  SELECT id INTO p_id FROM public.locations WHERE code = 'prov-north-central';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order, status)
  VALUES ('dist-anuradhapura', 'Anuradhapura', 'district', p_id, p_id, 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, name = EXCLUDED.name;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order, status)
  VALUES ('dist-polonnaruwa', 'Polonnaruwa', 'district', p_id, p_id, 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, name = EXCLUDED.name;

  INSERT INTO public.locations (code, name, type, sort_order, status)
  VALUES ('prov-uva', 'Uva Province', 'province', 8, 'active')
  ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

  SELECT id INTO p_id FROM public.locations WHERE code = 'prov-uva';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order, status)
  VALUES ('dist-badulla', 'Badulla', 'district', p_id, p_id, 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, name = EXCLUDED.name;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order, status)
  VALUES ('dist-monaragala', 'Monaragala', 'district', p_id, p_id, 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, name = EXCLUDED.name;

  INSERT INTO public.locations (code, name, type, sort_order, status)
  VALUES ('prov-sabaragamuwa', 'Sabaragamuwa Province', 'province', 9, 'active')
  ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

  SELECT id INTO p_id FROM public.locations WHERE code = 'prov-sabaragamuwa';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order, status)
  VALUES ('dist-ratnapura', 'Ratnapura', 'district', p_id, p_id, 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, name = EXCLUDED.name;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, sort_order, status)
  VALUES ('dist-kegalle', 'Kegalle', 'district', p_id, p_id, 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, name = EXCLUDED.name;

-- 2. CITIES & TOWNS AND AREAS

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-kandy';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-kandy';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-kandy-city', 'Kandy City', 'city', d_id, p_id, d_id, '20000', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-kandy-city';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kandy-town', 'Kandy Town Center', 'area', c_id, p_id, d_id, c_id, '20000', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-peradeniya-road', 'Peradeniya Road', 'area', c_id, p_id, d_id, c_id, '20000', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-katugastota-road', 'Katugastota Road', 'area', c_id, p_id, d_id, c_id, '20000', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-ampitiya', 'Ampitiya', 'area', c_id, p_id, d_id, c_id, '20000', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-tennekumbura', 'Tennekumbura', 'area', c_id, p_id, d_id, c_id, '20000', 5, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-aruppola', 'Aruppola', 'area', c_id, p_id, d_id, c_id, '20000', 6, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-asgiriya', 'Asgiriya', 'area', c_id, p_id, d_id, c_id, '20000', 7, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-mulgampola', 'Mulgampola', 'area', c_id, p_id, d_id, c_id, '20000', 8, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-hanthana', 'Hanthana', 'area', c_id, p_id, d_id, c_id, '20000', 9, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-suduhumpola', 'Suduhumpola', 'area', c_id, p_id, d_id, c_id, '20000', 10, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-watapuluwa', 'Watapuluwa', 'area', c_id, p_id, d_id, c_id, '20000', 11, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-kandy';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-kandy';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-peradeniya', 'Peradeniya', 'city', d_id, p_id, d_id, '20400', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-peradeniya';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-university-campus', 'University Campus Area', 'area', c_id, p_id, d_id, c_id, '20400', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-hindagala', 'Hindagala', 'area', c_id, p_id, d_id, c_id, '20400', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-sarasaviya', 'Sarasaviya Gardens', 'area', c_id, p_id, d_id, c_id, '20400', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-gelioya', 'Gelioya Junction', 'area', c_id, p_id, d_id, c_id, '20400', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kiribathkumbura', 'Kiribathkumbura', 'area', c_id, p_id, d_id, c_id, '20400', 5, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-kandy';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-kandy';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-katugastota', 'Katugastota', 'city', d_id, p_id, d_id, '20110', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-katugastota';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-mahaiyawa', 'Mahaiyawa', 'area', c_id, p_id, d_id, c_id, '20110', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-gohagoda', 'Gohagoda', 'area', c_id, p_id, d_id, c_id, '20110', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kondadeniya', 'Kondadeniya', 'area', c_id, p_id, d_id, c_id, '20110', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-yatiwawala', 'Yatiwawala', 'area', c_id, p_id, d_id, c_id, '20110', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-kandy';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-kandy';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-gampola', 'Gampola', 'city', d_id, p_id, d_id, '20500', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-gampola';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-gampola-town', 'Gampola Town', 'area', c_id, p_id, d_id, c_id, '20500', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-ethgala', 'Ethgala', 'area', c_id, p_id, d_id, c_id, '20500', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kahatapitiya', 'Kahatapitiya', 'area', c_id, p_id, d_id, c_id, '20500', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-ulapane', 'Ulapane', 'area', c_id, p_id, d_id, c_id, '20500', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-kandy';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-kandy';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-nawalapitiya', 'Nawalapitiya', 'city', d_id, p_id, d_id, '20600', 5, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-nawalapitiya';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-nawalapitiya-town', 'Nawalapitiya Town', 'area', c_id, p_id, d_id, c_id, '20600', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kadiyanlena', 'Kadiyanlena', 'area', c_id, p_id, d_id, c_id, '20600', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-rosella', 'Rosella', 'area', c_id, p_id, d_id, c_id, '20600', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-kandy';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-kandy';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-kundasale', 'Kundasale', 'city', d_id, p_id, d_id, '20070', 6, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-kundasale';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-pallekele', 'Pallekele', 'area', c_id, p_id, d_id, c_id, '20070', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-digana', 'Digana', 'area', c_id, p_id, d_id, c_id, '20070', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-balagolla', 'Balagolla', 'area', c_id, p_id, d_id, c_id, '20070', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-nattarampotha', 'Nattarampotha', 'area', c_id, p_id, d_id, c_id, '20070', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-kandy';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-kandy';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-teldeniya', 'Teldeniya', 'city', d_id, p_id, d_id, '20900', 7, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-teldeniya';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-teldeniya-town', 'Teldeniya Town', 'area', c_id, p_id, d_id, c_id, '20900', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-karalliyadda', 'Karalliyadda', 'area', c_id, p_id, d_id, c_id, '20900', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-rangala', 'Rangala', 'area', c_id, p_id, d_id, c_id, '20900', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-kandy';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-kandy';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-kadugannawa', 'Kadugannawa', 'city', d_id, p_id, d_id, '20300', 8, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-kadugannawa';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kadugannawa-town', 'Kadugannawa Town', 'area', c_id, p_id, d_id, c_id, '20300', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-pilimathalawa', 'Pilimathalawa', 'area', c_id, p_id, d_id, c_id, '20300', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-henawala', 'Henawala', 'area', c_id, p_id, d_id, c_id, '20300', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-danture', 'Danture', 'area', c_id, p_id, d_id, c_id, '20300', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-kandy';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-kandy';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-akurana', 'Akurana', 'city', d_id, p_id, d_id, '20850', 9, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-akurana';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-akurana-town', 'Akurana Town', 'area', c_id, p_id, d_id, c_id, '20850', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-bulugohatenna', 'Bulugohatenna', 'area', c_id, p_id, d_id, c_id, '20850', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-neerawella', 'Neerawella', 'area', c_id, p_id, d_id, c_id, '20850', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-kandy';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-kandy';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-wattegama', 'Wattegama', 'city', d_id, p_id, d_id, '20810', 10, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-wattegama';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-wattegama-town', 'Wattegama Town', 'area', c_id, p_id, d_id, c_id, '20810', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-panwila', 'Panwila', 'area', c_id, p_id, d_id, c_id, '20810', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-yatawara', 'Yatawara', 'area', c_id, p_id, d_id, c_id, '20810', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-matale';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-matale';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-matale-city', 'Matale City', 'city', d_id, p_id, d_id, '21000', 11, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-matale-city';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-matale-town', 'Matale Town', 'area', c_id, p_id, d_id, c_id, '21000', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-mandandawela', 'Mandandawela', 'area', c_id, p_id, d_id, c_id, '21000', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-gongawela', 'Gongawela', 'area', c_id, p_id, d_id, c_id, '21000', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kaludewala', 'Kaludewala', 'area', c_id, p_id, d_id, c_id, '21000', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kawdawela', 'Kawdawela', 'area', c_id, p_id, d_id, c_id, '21000', 5, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-matale';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-matale';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-dambulla', 'Dambulla', 'city', d_id, p_id, d_id, '21100', 12, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-dambulla';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-dambulla-town', 'Dambulla Town', 'area', c_id, p_id, d_id, c_id, '21100', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kandalama', 'Kandalama', 'area', c_id, p_id, d_id, c_id, '21100', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-pelwehera', 'Pelwehera', 'area', c_id, p_id, d_id, c_id, '21100', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-inamaluwa', 'Inamaluwa', 'area', c_id, p_id, d_id, c_id, '21100', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-matale';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-matale';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-sigiriya', 'Sigiriya', 'city', d_id, p_id, d_id, '21120', 13, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-sigiriya';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-sigiriya-village', 'Sigiriya Village', 'area', c_id, p_id, d_id, c_id, '21120', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-pidurangala', 'Pidurangala', 'area', c_id, p_id, d_id, c_id, '21120', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-habarana-road', 'Habarana Road', 'area', c_id, p_id, d_id, c_id, '21120', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-matale';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-matale';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-galewela', 'Galewela', 'city', d_id, p_id, d_id, '21200', 14, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-galewela';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-galewela-town', 'Galewela Town', 'area', c_id, p_id, d_id, c_id, '21200', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-dewahuwa', 'Dewahuwa', 'area', c_id, p_id, d_id, c_id, '21200', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-makulagaswewa', 'Makulagaswewa', 'area', c_id, p_id, d_id, c_id, '21200', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-matale';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-matale';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-rattota', 'Rattota', 'city', d_id, p_id, d_id, '21400', 15, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-rattota';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-rattota-town', 'Rattota Town', 'area', c_id, p_id, d_id, c_id, '21400', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-riverston', 'Riverston', 'area', c_id, p_id, d_id, c_id, '21400', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kaikawala', 'Kaikawala', 'area', c_id, p_id, d_id, c_id, '21400', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-nuwara-eliya';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-nuwara-eliya';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-nuwara-eliya-town', 'Nuwara Eliya Town', 'city', d_id, p_id, d_id, '22200', 16, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-nuwara-eliya-town';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-city-centre-ne', 'City Centre', 'area', c_id, p_id, d_id, c_id, '22200', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-hawa-eliya', 'Hawa Eliya', 'area', c_id, p_id, d_id, c_id, '22200', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-pedro', 'Pedro Estate Area', 'area', c_id, p_id, d_id, c_id, '22200', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-gregory-lake', 'Gregory Lake Front', 'area', c_id, p_id, d_id, c_id, '22200', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-single-tree', 'Single Tree Hill', 'area', c_id, p_id, d_id, c_id, '22200', 5, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-moon-plains', 'Moon Plains', 'area', c_id, p_id, d_id, c_id, '22200', 6, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-nuwara-eliya';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-nuwara-eliya';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-hatton', 'Hatton', 'city', d_id, p_id, d_id, '22000', 17, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-hatton';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-hatton-town', 'Hatton Town', 'area', c_id, p_id, d_id, c_id, '22000', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-dickoya', 'Dickoya', 'area', c_id, p_id, d_id, c_id, '22000', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-norwood', 'Norwood', 'area', c_id, p_id, d_id, c_id, '22000', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-maskeliya', 'Maskeliya', 'area', c_id, p_id, d_id, c_id, '22000', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-nallathanniya', 'Nallathanniya (Sri Pada)', 'area', c_id, p_id, d_id, c_id, '22000', 5, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-nuwara-eliya';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-nuwara-eliya';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-kotagala', 'Kotagala', 'city', d_id, p_id, d_id, '22080', 18, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-kotagala';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kotagala-town', 'Kotagala Town', 'area', c_id, p_id, d_id, c_id, '22080', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-bogawantalawa', 'Bogawantalawa', 'area', c_id, p_id, d_id, c_id, '22080', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-nuwara-eliya';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-nuwara-eliya';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-talawakele', 'Talawakele', 'city', d_id, p_id, d_id, '22100', 19, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-talawakele';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-talawakele-town', 'Talawakele Town', 'area', c_id, p_id, d_id, c_id, '22100', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-lindula', 'Lindula', 'area', c_id, p_id, d_id, c_id, '22100', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-nanu-oya', 'Nanu Oya Junction', 'area', c_id, p_id, d_id, c_id, '22100', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-nuwara-eliya';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-nuwara-eliya';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-ginigathena', 'Ginigathena', 'city', d_id, p_id, d_id, '20640', 20, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-ginigathena';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-ginigathena-town', 'Ginigathena Town', 'area', c_id, p_id, d_id, c_id, '20640', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kitulgala', 'Kitulgala', 'area', c_id, p_id, d_id, c_id, '20640', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-norton-bridge', 'Norton Bridge', 'area', c_id, p_id, d_id, c_id, '20640', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-colombo';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-colombo';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-colombo-01', 'Colombo Fort (Colombo 01)', 'city', d_id, p_id, d_id, '00100', 21, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-colombo-01';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-echelon-square', 'Echelon Square', 'area', c_id, p_id, d_id, c_id, '00100', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-bank-of-ceylon-mawatha', 'BOC Mawatha', 'area', c_id, p_id, d_id, c_id, '00100', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-chatham-street', 'Chatham Street', 'area', c_id, p_id, d_id, c_id, '00100', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-colombo';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-colombo';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-colombo-pettah', 'Pettah (Colombo 11)', 'city', d_id, p_id, d_id, '01100', 22, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-colombo-pettah';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-main-street-pettah', 'Main Street Bazaar', 'area', c_id, p_id, d_id, c_id, '01100', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-sea-street', 'Sea Street', 'area', c_id, p_id, d_id, c_id, '01100', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-cross-streets', 'Cross Streets Zone', 'area', c_id, p_id, d_id, c_id, '01100', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-colombo';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-colombo';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-colombo-03', 'Kollupitiya (Colombo 03)', 'city', d_id, p_id, d_id, '00300', 23, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-colombo-03';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-galle-road-col-3', 'Galle Road Kollupitiya', 'area', c_id, p_id, d_id, c_id, '00300', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-liberty-plaza-area', 'Liberty Plaza Area', 'area', c_id, p_id, d_id, c_id, '00300', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-duplication-road-col-3', 'Duplication Road North', 'area', c_id, p_id, d_id, c_id, '00300', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-colombo';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-colombo';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-colombo-04', 'Bambalapitiya (Colombo 04)', 'city', d_id, p_id, d_id, '00400', 24, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-colombo-04';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-marine-drive-col-4', 'Marine Drive Bambalapitiya', 'area', c_id, p_id, d_id, c_id, '00400', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-majestic-city-area', 'Majestic City Area', 'area', c_id, p_id, d_id, c_id, '00400', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-lauries-road', 'Laurie''s Road', 'area', c_id, p_id, d_id, c_id, '00400', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-colombo';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-colombo';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-colombo-wellawatte', 'Wellawatte (Colombo 06)', 'city', d_id, p_id, d_id, '00600', 25, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-colombo-wellawatte';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-ramakrishna-road', 'Ramakrishna Road', 'area', c_id, p_id, d_id, c_id, '00600', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-savoy-area', 'Savoy Area', 'area', c_id, p_id, d_id, c_id, '00600', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-pamankada', 'Pamankada', 'area', c_id, p_id, d_id, c_id, '00600', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-colombo';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-colombo';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-colombo-07', 'Cinnamon Gardens (Colombo 07)', 'city', d_id, p_id, d_id, '00700', 26, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-colombo-07';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-ward-place', 'Ward Place', 'area', c_id, p_id, d_id, c_id, '00700', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-horton-place', 'Horton Place', 'area', c_id, p_id, d_id, c_id, '00700', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-torrington', 'Torrington Square', 'area', c_id, p_id, d_id, c_id, '00700', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-gregorys-road', 'Gregory''s Road', 'area', c_id, p_id, d_id, c_id, '00700', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-colombo';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-colombo';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-dehiwala', 'Dehiwala', 'city', d_id, p_id, d_id, '10350', 27, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-dehiwala';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-dehiwala-junction', 'Dehiwala Junction', 'area', c_id, p_id, d_id, c_id, '10350', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-zoo-road', 'National Zoo Road Area', 'area', c_id, p_id, d_id, c_id, '10350', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kalubowila', 'Kalubowila', 'area', c_id, p_id, d_id, c_id, '10350', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-nedimala', 'Nedimala', 'area', c_id, p_id, d_id, c_id, '10350', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-colombo';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-colombo';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-mount-lavinia', 'Mount Lavinia', 'city', d_id, p_id, d_id, '10370', 28, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-mount-lavinia';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-hotel-road', 'Hotel Road Beach Zone', 'area', c_id, p_id, d_id, c_id, '10370', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-templers-road', 'Templers Road', 'area', c_id, p_id, d_id, c_id, '10370', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-attidiya', 'Attidiya', 'area', c_id, p_id, d_id, c_id, '10370', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-colombo';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-colombo';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-nugegoda', 'Nugegoda', 'city', d_id, p_id, d_id, '10250', 29, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-nugegoda';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-nugegoda-flyover', 'Nugegoda Junction', 'area', c_id, p_id, d_id, c_id, '10250', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-gangodawila', 'Gangodawila', 'area', c_id, p_id, d_id, c_id, '10250', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-jubilee-post', 'Jubilee Post', 'area', c_id, p_id, d_id, c_id, '10250', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kohuwala', 'Kohuwala', 'area', c_id, p_id, d_id, c_id, '10250', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-colombo';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-colombo';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-maharagama', 'Maharagama', 'city', d_id, p_id, d_id, '10280', 30, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-maharagama';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-pamunuwa', 'Pamunuwa Shopping Street', 'area', c_id, p_id, d_id, c_id, '10280', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-navinna', 'Navinna', 'area', c_id, p_id, d_id, c_id, '10280', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-high-level-maharagama', 'High Level Road Maharagama', 'area', c_id, p_id, d_id, c_id, '10280', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-colombo';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-colombo';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-rajagiriya', 'Rajagiriya', 'city', d_id, p_id, d_id, '10107', 31, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-rajagiriya';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-welikada', 'Welikada Junction', 'area', c_id, p_id, d_id, c_id, '10107', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kalapaluwawa', 'Kalapaluwawa', 'area', c_id, p_id, d_id, c_id, '10107', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-obeysokarapura', 'Obeysekarapura', 'area', c_id, p_id, d_id, c_id, '10107', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-colombo';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-colombo';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-battaramulla', 'Battaramulla', 'city', d_id, p_id, d_id, '10120', 32, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-battaramulla';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-pelawatte', 'Pelawatte', 'area', c_id, p_id, d_id, c_id, '10120', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-koswatta', 'Koswatta', 'area', c_id, p_id, d_id, c_id, '10120', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-thalangama', 'Thalangama', 'area', c_id, p_id, d_id, c_id, '10120', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-hokandara', 'Hokandara', 'area', c_id, p_id, d_id, c_id, '10120', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-colombo';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-colombo';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-malabe', 'Malabe', 'city', d_id, p_id, d_id, '10115', 33, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-malabe';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-sliit-campus-area', 'SLIIT Campus Area', 'area', c_id, p_id, d_id, c_id, '10115', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-pittugala', 'Pittugala', 'area', c_id, p_id, d_id, c_id, '10115', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-thalahena', 'Thalahena', 'area', c_id, p_id, d_id, c_id, '10115', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-colombo';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-colombo';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-homagama', 'Homagama', 'city', d_id, p_id, d_id, '10200', 34, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-homagama';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-homagama-town', 'Homagama Town', 'area', c_id, p_id, d_id, c_id, '10200', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-pitipana', 'Pitipana Tech City', 'area', c_id, p_id, d_id, c_id, '10200', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-meegoda', 'Meegoda', 'area', c_id, p_id, d_id, c_id, '10200', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-godagama', 'Godagama Junction', 'area', c_id, p_id, d_id, c_id, '10200', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-colombo';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-colombo';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-piliyandala', 'Piliyandala', 'city', d_id, p_id, d_id, '10300', 35, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-piliyandala';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-piliyandala-bypass', 'Piliyandala Town', 'area', c_id, p_id, d_id, c_id, '10300', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kesbewa', 'Kesbewa', 'area', c_id, p_id, d_id, c_id, '10300', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-suwarapola', 'Suwarapola', 'area', c_id, p_id, d_id, c_id, '10300', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-madapatha', 'Madapatha', 'area', c_id, p_id, d_id, c_id, '10300', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-colombo';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-colombo';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-moratuwa', 'Moratuwa', 'city', d_id, p_id, d_id, '10400', 36, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-moratuwa';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-katubedda', 'Katubedda (University Zone)', 'area', c_id, p_id, d_id, c_id, '10400', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-rawatawatte', 'Rawatawatte', 'area', c_id, p_id, d_id, c_id, '10400', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-egoda-uyana', 'Egoda Uyana', 'area', c_id, p_id, d_id, c_id, '10400', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-lunawa', 'Lunawa', 'area', c_id, p_id, d_id, c_id, '10400', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-gampaha';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-gampaha';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-gampaha-town', 'Gampaha Town', 'city', d_id, p_id, d_id, '11000', 37, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-gampaha-town';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-gampaha-central', 'Gampaha Central', 'area', c_id, p_id, d_id, c_id, '11000', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-asgiriya-gampaha', 'Asgiriya Gampaha', 'area', c_id, p_id, d_id, c_id, '11000', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-yakkala', 'Yakkala', 'area', c_id, p_id, d_id, c_id, '11000', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-miriswatta', 'Miriswatta Junction', 'area', c_id, p_id, d_id, c_id, '11000', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-gampaha';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-gampaha';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-negombo', 'Negombo', 'city', d_id, p_id, d_id, '11500', 38, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-negombo';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-negombo-town', 'Negombo Town', 'area', c_id, p_id, d_id, c_id, '11500', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kudapaduwa', 'Kudapaduwa Beach Zone', 'area', c_id, p_id, d_id, c_id, '11500', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kochchikade', 'Kochchikade', 'area', c_id, p_id, d_id, c_id, '11500', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-periyamulla', 'Periyamulla', 'area', c_id, p_id, d_id, c_id, '11500', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-gampaha';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-gampaha';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-katunayake', 'Katunayake', 'city', d_id, p_id, d_id, '11450', 39, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-katunayake';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-ftz-katunayake', 'Free Trade Zone Area', 'area', c_id, p_id, d_id, c_id, '11450', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-airport-road-katunayake', 'Airport Access Road', 'area', c_id, p_id, d_id, c_id, '11450', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-seeduwa', 'Seeduwa', 'area', c_id, p_id, d_id, c_id, '11450', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-gampaha';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-gampaha';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-ja-ela', 'Ja-Ela', 'city', d_id, p_id, d_id, '11350', 40, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-ja-ela';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-ja-ela-town', 'Ja-Ela Town', 'area', c_id, p_id, d_id, c_id, '11350', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-ekala', 'Ekala Industrial Area', 'area', c_id, p_id, d_id, c_id, '11350', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-tudella', 'Tudella', 'area', c_id, p_id, d_id, c_id, '11350', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-gampaha';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-gampaha';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-wattala', 'Wattala', 'city', d_id, p_id, d_id, '11300', 41, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-wattala';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-wattala-junction', 'Wattala Junction', 'area', c_id, p_id, d_id, c_id, '11300', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-mabole', 'Mabole', 'area', c_id, p_id, d_id, c_id, '11300', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-hendala', 'Hendala', 'area', c_id, p_id, d_id, c_id, '11300', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-elakanda', 'Elakanda', 'area', c_id, p_id, d_id, c_id, '11300', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-gampaha';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-gampaha';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-kiribathgoda', 'Kiribathgoda', 'city', d_id, p_id, d_id, '11600', 42, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-kiribathgoda';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kiribathgoda-junction', 'Kiribathgoda Junction', 'area', c_id, p_id, d_id, c_id, '11600', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-makola', 'Makola', 'area', c_id, p_id, d_id, c_id, '11600', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-dalugama', 'Dalugama (University Area)', 'area', c_id, p_id, d_id, c_id, '11600', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-gampaha';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-gampaha';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-kadawatha', 'Kadawatha', 'city', d_id, p_id, d_id, '11850', 43, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-kadawatha';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-highway-interchange', 'Highway Interchange Area', 'area', c_id, p_id, d_id, c_id, '11850', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-mahara', 'Mahara', 'area', c_id, p_id, d_id, c_id, '11850', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-eldeniya', 'Eldeniya', 'area', c_id, p_id, d_id, c_id, '11850', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-kalutara';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-kalutara';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-kalutara-town', 'Kalutara Town', 'city', d_id, p_id, d_id, '12000', 44, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-kalutara-town';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kalutara-north', 'Kalutara North', 'area', c_id, p_id, d_id, c_id, '12000', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kalutara-south', 'Kalutara South', 'area', c_id, p_id, d_id, c_id, '12000', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-nagoda-kalutara', 'Nagoda Hospital Area', 'area', c_id, p_id, d_id, c_id, '12000', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-katukurunda', 'Katukurunda', 'area', c_id, p_id, d_id, c_id, '12000', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-kalutara';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-kalutara';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-panadura', 'Panadura', 'city', d_id, p_id, d_id, '12500', 45, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-panadura';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-panadura-town', 'Panadura Town', 'area', c_id, p_id, d_id, c_id, '12500', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-gorakana', 'Gorakana', 'area', c_id, p_id, d_id, c_id, '12500', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-walana', 'Walana', 'area', c_id, p_id, d_id, c_id, '12500', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-hirana', 'Hirana', 'area', c_id, p_id, d_id, c_id, '12500', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-kalutara';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-kalutara';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-horana', 'Horana', 'city', d_id, p_id, d_id, '12400', 46, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-horana';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-horana-town', 'Horana Town', 'area', c_id, p_id, d_id, c_id, '12400', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-pokunuwita', 'Pokunuwita', 'area', c_id, p_id, d_id, c_id, '12400', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-poruwadanda', 'Poruwadanda', 'area', c_id, p_id, d_id, c_id, '12400', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-kalutara';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-kalutara';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-beruwala', 'Beruwala', 'city', d_id, p_id, d_id, '12070', 47, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-beruwala';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-beruwala-town', 'Beruwala Town', 'area', c_id, p_id, d_id, c_id, '12070', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-china-fort', 'China Fort Gem Market', 'area', c_id, p_id, d_id, c_id, '12070', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-aluthgama', 'Aluthgama', 'area', c_id, p_id, d_id, c_id, '12070', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-galle';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-galle';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-galle-city', 'Galle City', 'city', d_id, p_id, d_id, '80000', 48, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-galle-city';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-galle-fort', 'Galle Fort Historic Zone', 'area', c_id, p_id, d_id, c_id, '80000', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-pettigalawatte', 'Pettigalawatte', 'area', c_id, p_id, d_id, c_id, '80000', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-karapitiya', 'Karapitiya Hospital Zone', 'area', c_id, p_id, d_id, c_id, '80000', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-richmond-hill', 'Richmond Hill Area', 'area', c_id, p_id, d_id, c_id, '80000', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-dadalla', 'Dadalla', 'area', c_id, p_id, d_id, c_id, '80000', 5, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-galle';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-galle';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-unawatuna', 'Unawatuna', 'city', d_id, p_id, d_id, '80600', 49, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-unawatuna';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-yaddehimulla', 'Yaddehimulla Beach Road', 'area', c_id, p_id, d_id, c_id, '80600', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-rumassala', 'Rumassala Sanctuary Area', 'area', c_id, p_id, d_id, c_id, '80600', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-thalpe', 'Thalpe Coastal Zone', 'area', c_id, p_id, d_id, c_id, '80600', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-galle';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-galle';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-hikkaduwa', 'Hikkaduwa', 'city', d_id, p_id, d_id, '80240', 50, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-hikkaduwa';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-coral-gardens', 'Coral Gardens Zone', 'area', c_id, p_id, d_id, c_id, '80240', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-narigama', 'Narigama Beach Area', 'area', c_id, p_id, d_id, c_id, '80240', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-thiranagama', 'Thiranagama', 'area', c_id, p_id, d_id, c_id, '80240', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-galle';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-galle';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-ambalangoda', 'Ambalangoda', 'city', d_id, p_id, d_id, '80300', 51, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-ambalangoda';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-ambalangoda-town', 'Ambalangoda Town', 'area', c_id, p_id, d_id, c_id, '80300', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-randombe', 'Randombe', 'area', c_id, p_id, d_id, c_id, '80300', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-batapola', 'Batapola', 'area', c_id, p_id, d_id, c_id, '80300', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-galle';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-galle';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-ahangama', 'Ahangama', 'city', d_id, p_id, d_id, '80650', 52, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-ahangama';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-ahangama-town', 'Ahangama Town', 'area', c_id, p_id, d_id, c_id, '80650', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-midigama-galle', 'Midigama Surf Point', 'area', c_id, p_id, d_id, c_id, '80650', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kabalana', 'Kabalana Beach', 'area', c_id, p_id, d_id, c_id, '80650', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-matara';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-matara';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-matara-city', 'Matara City', 'city', d_id, p_id, d_id, '81000', 53, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-matara-city';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-matara-town', 'Matara Fort & Town', 'area', c_id, p_id, d_id, c_id, '81000', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-nupe', 'Nupe Junction', 'area', c_id, p_id, d_id, c_id, '81000', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kotuwegoda', 'Kotuwegoda', 'area', c_id, p_id, d_id, c_id, '81000', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-rahula-road', 'Rahula Road Area', 'area', c_id, p_id, d_id, c_id, '81000', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-walgama', 'Walgama', 'area', c_id, p_id, d_id, c_id, '81000', 5, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-matara';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-matara';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-mirissa', 'Mirissa', 'city', d_id, p_id, d_id, '81740', 54, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-mirissa';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-mirissa-beach', 'Mirissa Beach Point', 'area', c_id, p_id, d_id, c_id, '81740', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-mirissa-harbour', 'Mirissa Harbour Area', 'area', c_id, p_id, d_id, c_id, '81740', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-thalaramba', 'Thalaramba', 'area', c_id, p_id, d_id, c_id, '81740', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-matara';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-matara';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-weligama', 'Weligama', 'city', d_id, p_id, d_id, '81700', 55, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-weligama';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-weligama-town', 'Weligama Town', 'area', c_id, p_id, d_id, c_id, '81700', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kapparatota', 'Kapparatota', 'area', c_id, p_id, d_id, c_id, '81700', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-gurubebila', 'Gurubebila', 'area', c_id, p_id, d_id, c_id, '81700', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-matara';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-matara';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-dikwella', 'Dikwella', 'city', d_id, p_id, d_id, '81200', 56, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-dikwella';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-hiriketiya-beach', 'Hiriketiya Beach Bay', 'area', c_id, p_id, d_id, c_id, '81200', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-dikwella-town', 'Dikwella Town', 'area', c_id, p_id, d_id, c_id, '81200', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-nilwella', 'Nilwella Cove', 'area', c_id, p_id, d_id, c_id, '81200', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-hambantota';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-hambantota';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-hambantota-town', 'Hambantota Town', 'city', d_id, p_id, d_id, '82000', 57, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-hambantota-town';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-siribopura', 'Siribopura Administrative Complex', 'area', c_id, p_id, d_id, c_id, '82000', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-mirijjawila', 'Mirijjawila Industrial Zone', 'area', c_id, p_id, d_id, c_id, '82000', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-port-city-hambantota', 'Port City Hambantota', 'area', c_id, p_id, d_id, c_id, '82000', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-hambantota';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-hambantota';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-tangalle', 'Tangalle', 'city', d_id, p_id, d_id, '82200', 58, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-tangalle';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-medaketiya', 'Medaketiya Beach Road', 'area', c_id, p_id, d_id, c_id, '82200', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-goyambokka', 'Goyambokka Cove', 'area', c_id, p_id, d_id, c_id, '82200', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-mawella', 'Mawella Beach', 'area', c_id, p_id, d_id, c_id, '82200', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-hambantota';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-hambantota';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-tissamaharama', 'Tissamaharama', 'city', d_id, p_id, d_id, '82600', 59, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-tissamaharama';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-tissa-town', 'Tissa Town & Tank Area', 'area', c_id, p_id, d_id, c_id, '82600', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-debarawewa', 'Debarawewa', 'area', c_id, p_id, d_id, c_id, '82600', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kirinda', 'Kirinda Coastal Village', 'area', c_id, p_id, d_id, c_id, '82600', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-jaffna';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-jaffna';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-jaffna-city', 'Jaffna City', 'city', d_id, p_id, d_id, '40000', 60, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-jaffna-city';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-nallur-temple-area', 'Nallur Temple Zone', 'area', c_id, p_id, d_id, c_id, '40000', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-chundikuli', 'Chundikuli', 'area', c_id, p_id, d_id, c_id, '40000', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kokuvil', 'Kokuvil', 'area', c_id, p_id, d_id, c_id, '40000', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-thirunelvely', 'Thirunelvely (University Area)', 'area', c_id, p_id, d_id, c_id, '40000', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-gurunagar', 'Gurunagar Coastal Area', 'area', c_id, p_id, d_id, c_id, '40000', 5, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-jaffna';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-jaffna';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-chavakachcheri', 'Chavakachcheri', 'city', d_id, p_id, d_id, '40500', 61, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-chavakachcheri';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-chavakachcheri-town', 'Chavakachcheri Town', 'area', c_id, p_id, d_id, c_id, '40500', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kodikamam', 'Kodikamam', 'area', c_id, p_id, d_id, c_id, '40500', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-meesalai', 'Meesalai', 'area', c_id, p_id, d_id, c_id, '40500', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-jaffna';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-jaffna';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-point-pedro', 'Point Pedro', 'city', d_id, p_id, d_id, '40800', 62, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-point-pedro';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-point-pedro-town', 'Point Pedro Town', 'area', c_id, p_id, d_id, c_id, '40800', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-valvettithurai', 'Valvettithurai', 'area', c_id, p_id, d_id, c_id, '40800', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-karaveddy', 'Karaveddy', 'area', c_id, p_id, d_id, c_id, '40800', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-kilinochchi';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-kilinochchi';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-kilinochchi-town', 'Kilinochchi Town', 'city', d_id, p_id, d_id, '44000', 63, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-kilinochchi-town';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kilinochchi-center', 'Kilinochchi A9 Center', 'area', c_id, p_id, d_id, c_id, '44000', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-paranthan', 'Paranthan Junction', 'area', c_id, p_id, d_id, c_id, '44000', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kanakapuram', 'Kanakapuram', 'area', c_id, p_id, d_id, c_id, '44000', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-mannar';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-mannar';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-mannar-town', 'Mannar Town', 'city', d_id, p_id, d_id, '41000', 64, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-mannar-town';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-mannar-bazaar', 'Mannar Island Bazaar', 'area', c_id, p_id, d_id, c_id, '41000', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-pesalai', 'Pesalai Coastal Village', 'area', c_id, p_id, d_id, c_id, '41000', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-talaimannar', 'Talaimannar Pier Area', 'area', c_id, p_id, d_id, c_id, '41000', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-mullaitivu';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-mullaitivu';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-mullaitivu-town', 'Mullaitivu Town', 'city', d_id, p_id, d_id, '42000', 65, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-mullaitivu-town';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-mullaitivu-front', 'Mullaitivu Coastal Zone', 'area', c_id, p_id, d_id, c_id, '42000', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-puthukkudiyiruppu', 'Puthukkudiyiruppu', 'area', c_id, p_id, d_id, c_id, '42000', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-oddusuddan', 'Oddusuddan', 'area', c_id, p_id, d_id, c_id, '42000', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-vavuniya';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-vavuniya';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-vavuniya-town', 'Vavuniya Town', 'city', d_id, p_id, d_id, '43000', 66, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-vavuniya-town';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-vavuniya-station-road', 'Station Road Area', 'area', c_id, p_id, d_id, c_id, '43000', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-omanthai', 'Omanthai A9 Gate', 'area', c_id, p_id, d_id, c_id, '43000', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-rambaikulam', 'Rambaikulam', 'area', c_id, p_id, d_id, c_id, '43000', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-trincomalee';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-trincomalee';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-trincomalee-town', 'Trincomalee Town', 'city', d_id, p_id, d_id, '31000', 67, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-trincomalee-town';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-uppuveli', 'Uppuveli Beach Front', 'area', c_id, p_id, d_id, c_id, '31000', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-fort-frederick-area', 'Fort Frederick Zone', 'area', c_id, p_id, d_id, c_id, '31000', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-china-bay', 'China Bay Airport Area', 'area', c_id, p_id, d_id, c_id, '31000', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kanniya', 'Kanniya Hot Springs Area', 'area', c_id, p_id, d_id, c_id, '31000', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-trincomalee';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-trincomalee';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-nilaveli', 'Nilaveli', 'city', d_id, p_id, d_id, '31010', 68, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-nilaveli';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-nilaveli-beach-zone', 'Nilaveli Resort Beach', 'area', c_id, p_id, d_id, c_id, '31010', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-pigeon-island-access', 'Pigeon Island Access Point', 'area', c_id, p_id, d_id, c_id, '31010', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-trincomalee';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-trincomalee';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-kinniya', 'Kinniya', 'city', d_id, p_id, d_id, '31200', 69, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-kinniya';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kinniya-bridge-area', 'Kinniya Bridge Area', 'area', c_id, p_id, d_id, c_id, '31200', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kurinchakerny', 'Kurinchakerny', 'area', c_id, p_id, d_id, c_id, '31200', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-batticaloa';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-batticaloa';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-batticaloa-town', 'Batticaloa Town', 'city', d_id, p_id, d_id, '30000', 70, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-batticaloa-town';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kallady-beach', 'Kallady Beach Road', 'area', c_id, p_id, d_id, c_id, '30000', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-puliyanthivu', 'Puliyanthivu Island Zone', 'area', c_id, p_id, d_id, c_id, '30000', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-koddaimunai', 'Koddaimunai', 'area', c_id, p_id, d_id, c_id, '30000', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-urani', 'Urani', 'area', c_id, p_id, d_id, c_id, '30000', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-batticaloa';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-batticaloa';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-kattankudy', 'Kattankudy', 'city', d_id, p_id, d_id, '30100', 71, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-kattankudy';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-central-bazaar-kattankudy', 'Central Bazaar Kattankudy', 'area', c_id, p_id, d_id, c_id, '30100', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-beach-road-kattankudy', 'Beach Road Kattankudy', 'area', c_id, p_id, d_id, c_id, '30100', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-batticaloa';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-batticaloa';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-pasikudah', 'Pasikudah', 'city', d_id, p_id, d_id, '30410', 72, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-pasikudah';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-pasikudah-bay-resorts', 'Pasikudah Bay Resort Zone', 'area', c_id, p_id, d_id, c_id, '30410', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kalkudah-beach', 'Kalkudah Beach', 'area', c_id, p_id, d_id, c_id, '30410', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-valaichchenai-town', 'Valaichchenai Town', 'area', c_id, p_id, d_id, c_id, '30410', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-ampara';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-ampara';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-ampara-town', 'Ampara Town', 'city', d_id, p_id, d_id, '32000', 73, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-ampara-town';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-ampara-central', 'Ampara Central Bazaar', 'area', c_id, p_id, d_id, c_id, '32000', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-inginiyagala', 'Inginiyagala Tank Area', 'area', c_id, p_id, d_id, c_id, '32000', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-uhana', 'Uhana', 'area', c_id, p_id, d_id, c_id, '32000', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-ampara';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-ampara';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-kalmunai', 'Kalmunai', 'city', d_id, p_id, d_id, '32300', 74, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-kalmunai';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kalmunai-town', 'Kalmunai Town', 'area', c_id, p_id, d_id, c_id, '32300', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-sainthamaruthu', 'Sainthamaruthu', 'area', c_id, p_id, d_id, c_id, '32300', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-pandiruppu', 'Pandiruppu', 'area', c_id, p_id, d_id, c_id, '32300', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-ampara';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-ampara';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-arugam-bay', 'Arugam Bay / Pottuvil', 'city', d_id, p_id, d_id, '32500', 75, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-arugam-bay';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-arugam-bay-main-point', 'Arugam Bay Main Surf Point', 'area', c_id, p_id, d_id, c_id, '32500', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-pottuvil-town', 'Pottuvil Town', 'area', c_id, p_id, d_id, c_id, '32500', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-panama-ampara', 'Panama Coastal Village', 'area', c_id, p_id, d_id, c_id, '32500', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-kurunegala';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-kurunegala';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-kurunegala-city', 'Kurunegala City', 'city', d_id, p_id, d_id, '60000', 76, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-kurunegala-city';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-lake-round-kurunegala', 'Lake Round Promenade', 'area', c_id, p_id, d_id, c_id, '60000', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-clock-tower-kurunegala', 'Clock Tower Town Center', 'area', c_id, p_id, d_id, c_id, '60000', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-malkaduwawa', 'Malkaduwawa', 'area', c_id, p_id, d_id, c_id, '60000', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-gettuwana', 'Gettuwana', 'area', c_id, p_id, d_id, c_id, '60000', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-kurunegala';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-kurunegala';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-kuliyapitiya', 'Kuliyapitiya', 'city', d_id, p_id, d_id, '60200', 77, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-kuliyapitiya';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kuliyapitiya-town', 'Kuliyapitiya Town', 'area', c_id, p_id, d_id, c_id, '60200', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-university-area-kuliyapitiya', 'Wayamba University Area', 'area', c_id, p_id, d_id, c_id, '60200', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-pannala-road', 'Pannala Road', 'area', c_id, p_id, d_id, c_id, '60200', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-kurunegala';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-kurunegala';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-narammala', 'Narammala', 'city', d_id, p_id, d_id, '60100', 78, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-narammala';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-narammala-town', 'Narammala Town', 'area', c_id, p_id, d_id, c_id, '60100', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-alawwa', 'Alawwa', 'area', c_id, p_id, d_id, c_id, '60100', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-puttalam';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-puttalam';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-puttalam-town', 'Puttalam Town', 'city', d_id, p_id, d_id, '61300', 79, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-puttalam-town';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-puttalam-lagoon-front', 'Puttalam Lagoon Front', 'area', c_id, p_id, d_id, c_id, '61300', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-salt-pans-zone', 'Salt Pans Zone', 'area', c_id, p_id, d_id, c_id, '61300', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-palavi', 'Palavi Junction', 'area', c_id, p_id, d_id, c_id, '61300', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-puttalam';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-puttalam';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-chilaw', 'Chilaw', 'city', d_id, p_id, d_id, '61000', 80, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-chilaw';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-chilaw-town', 'Chilaw Town', 'area', c_id, p_id, d_id, c_id, '61000', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-munneswaram', 'Munneswaram Temple Zone', 'area', c_id, p_id, d_id, c_id, '61000', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-bangadeniya', 'Bangadeniya', 'area', c_id, p_id, d_id, c_id, '61000', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-puttalam';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-puttalam';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-kalpitiya', 'Kalpitiya', 'city', d_id, p_id, d_id, '61360', 81, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-kalpitiya';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kudawa-kite-beach', 'Kudawa Kite Lagoon Beach', 'area', c_id, p_id, d_id, c_id, '61360', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kalpitiya-fort-area', 'Kalpitiya Dutch Fort Zone', 'area', c_id, p_id, d_id, c_id, '61360', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-talawila', 'Talawila Church Area', 'area', c_id, p_id, d_id, c_id, '61360', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-anuradhapura';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-anuradhapura';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-anuradhapura-city', 'Anuradhapura City', 'city', d_id, p_id, d_id, '50000', 82, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-anuradhapura-city';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-new-town-anuradhapura', 'New Town Commercial Hub', 'area', c_id, p_id, d_id, c_id, '50000', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-sacred-city-zone', 'Sacred City Temple Zone', 'area', c_id, p_id, d_id, c_id, '50000', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-stage-1-anuradhapura', 'Stage 1', 'area', c_id, p_id, d_id, c_id, '50000', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-stage-2-anuradhapura', 'Stage 2', 'area', c_id, p_id, d_id, c_id, '50000', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-anuradhapura';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-anuradhapura';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-kekirawa', 'Kekirawa', 'city', d_id, p_id, d_id, '50100', 83, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-kekirawa';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kekirawa-town', 'Kekirawa Town', 'area', c_id, p_id, d_id, c_id, '50100', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-maradankadawala', 'Maradankadawala', 'area', c_id, p_id, d_id, c_id, '50100', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kalawewa', 'Kalawewa Reservoir Area', 'area', c_id, p_id, d_id, c_id, '50100', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-polonnaruwa';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-polonnaruwa';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-polonnaruwa-city', 'Polonnaruwa City', 'city', d_id, p_id, d_id, '51000', 84, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-polonnaruwa-city';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kaduruwela-bazaar', 'Kaduruwela Commercial Bazaar', 'area', c_id, p_id, d_id, c_id, '51000', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-new-town-polonnaruwa', 'New Town Administration Zone', 'area', c_id, p_id, d_id, c_id, '51000', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-ancient-city-zone', 'Ancient Ruins Ruins Zone', 'area', c_id, p_id, d_id, c_id, '51000', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-polonnaruwa';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-polonnaruwa';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-hingurakgoda', 'Hingurakgoda', 'city', d_id, p_id, d_id, '51400', 85, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-hingurakgoda';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-hingurakgoda-town', 'Hingurakgoda Town', 'area', c_id, p_id, d_id, c_id, '51400', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-minneriya', 'Minneriya Park Entrance', 'area', c_id, p_id, d_id, c_id, '51400', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-badulla';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-badulla';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-badulla-city', 'Badulla City', 'city', d_id, p_id, d_id, '90000', 86, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-badulla-city';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-badulla-town', 'Badulla Town Bazaar', 'area', c_id, p_id, d_id, c_id, '90000', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kailagoda', 'Kailagoda', 'area', c_id, p_id, d_id, c_id, '90000', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-hindagoda-badulla', 'Hindagoda', 'area', c_id, p_id, d_id, c_id, '90000', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-hali-ela', 'Hali-Ela', 'area', c_id, p_id, d_id, c_id, '90000', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-badulla';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-badulla';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-ella', 'Ella', 'city', d_id, p_id, d_id, '90090', 87, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-ella';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-ella-town-center', 'Ella Town Center', 'area', c_id, p_id, d_id, c_id, '90090', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-nine-arches-area', 'Nine Arches Bridge Zone', 'area', c_id, p_id, d_id, c_id, '90090', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kithalella', 'Kithalella', 'area', c_id, p_id, d_id, c_id, '90090', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-demodara', 'Demodara Loop Area', 'area', c_id, p_id, d_id, c_id, '90090', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-badulla';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-badulla';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-bandarawela', 'Bandarawela', 'city', d_id, p_id, d_id, '90100', 88, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-bandarawela';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-bandarawela-town', 'Bandarawela Town', 'area', c_id, p_id, d_id, c_id, '90100', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-diyatalawa-junction', 'Diyatalawa Station Junction', 'area', c_id, p_id, d_id, c_id, '90100', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-bindunuwewa', 'Bindunuwewa', 'area', c_id, p_id, d_id, c_id, '90100', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-badulla';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-badulla';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-haputale', 'Haputale', 'city', d_id, p_id, d_id, '90160', 89, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-haputale';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-haputale-town', 'Haputale Town', 'area', c_id, p_id, d_id, c_id, '90160', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-liptons-seat-road', 'Lipton''s Seat Road', 'area', c_id, p_id, d_id, c_id, '90160', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-beragala', 'Beragala Gap', 'area', c_id, p_id, d_id, c_id, '90160', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-monaragala';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-monaragala';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-monaragala-town', 'Monaragala Town', 'city', d_id, p_id, d_id, '91000', 90, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-monaragala-town';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-monaragala-central', 'Monaragala Central', 'area', c_id, p_id, d_id, c_id, '91000', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kumbukkana', 'Kumbukkana', 'area', c_id, p_id, d_id, c_id, '91000', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-monaragala';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-monaragala';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-kataragama', 'Kataragama', 'city', d_id, p_id, d_id, '91400', 91, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-kataragama';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-sacred-city-kataragama', 'Sacred City Temple Zone', 'area', c_id, p_id, d_id, c_id, '91400', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-sella-kataragama', 'Sella Kataragama', 'area', c_id, p_id, d_id, c_id, '91400', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-detagamuwa', 'Detagamuwa', 'area', c_id, p_id, d_id, c_id, '91400', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-ratnapura';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-ratnapura';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-ratnapura-city', 'Ratnapura City', 'city', d_id, p_id, d_id, '70000', 92, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-ratnapura-city';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-gem-bazaar-ratnapura', 'Gem Market Bazaar', 'area', c_id, p_id, d_id, c_id, '70000', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-new-town-ratnapura', 'New Town Administrative Zone', 'area', c_id, p_id, d_id, c_id, '70000', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-mudduwa', 'Mudduwa', 'area', c_id, p_id, d_id, c_id, '70000', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-weralupa', 'Weralupa Junction', 'area', c_id, p_id, d_id, c_id, '70000', 4, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-ratnapura';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-ratnapura';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-embilipitiya', 'Embilipitiya', 'city', d_id, p_id, d_id, '70200', 93, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-embilipitiya';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-embilipitiya-town', 'Embilipitiya Town', 'area', c_id, p_id, d_id, c_id, '70200', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-udawalawe-gate', 'Udawalawe Park Entrance', 'area', c_id, p_id, d_id, c_id, '70200', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-chandrika-wewa', 'Chandrika Wewa Area', 'area', c_id, p_id, d_id, c_id, '70200', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-kegalle';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-kegalle';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-kegalle-city', 'Kegalle City', 'city', d_id, p_id, d_id, '71000', 94, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-kegalle-city';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-kegalle-town', 'Kegalle Town Bazaar', 'area', c_id, p_id, d_id, c_id, '71000', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-ranwala', 'Ranwala', 'area', c_id, p_id, d_id, c_id, '71000', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-meepitiya', 'Meepitiya', 'area', c_id, p_id, d_id, c_id, '71000', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-kegalle';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-kegalle';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-mawanella', 'Mawanella', 'city', d_id, p_id, d_id, '71500', 95, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-mawanella';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-mawanella-town', 'Mawanella Town', 'area', c_id, p_id, d_id, c_id, '71500', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-utuwankanda', 'Utuwankanda (Saradiel Rock Area)', 'area', c_id, p_id, d_id, c_id, '71500', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-hingula', 'Hingula', 'area', c_id, p_id, d_id, c_id, '71500', 3, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO d_id FROM public.locations WHERE code = 'dist-kegalle';
  SELECT province_id INTO p_id FROM public.locations WHERE code = 'dist-kegalle';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, postal_code, sort_order, status)
  VALUES ('city-pinnawala', 'Pinnawala / Rambukkana', 'city', d_id, p_id, d_id, '71100', 96, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  SELECT id INTO c_id FROM public.locations WHERE code = 'city-pinnawala';

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-elephant-orphanage-zone', 'Elephant Orphanage Zone', 'area', c_id, p_id, d_id, c_id, '71100', 1, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

  INSERT INTO public.locations (code, name, type, parent_id, province_id, district_id, city_id, postal_code, sort_order, status)
  VALUES ('area-rambukkana-town', 'Rambukkana Station Area', 'area', c_id, p_id, d_id, c_id, '71100', 2, 'active')
  ON CONFLICT (code) DO UPDATE SET parent_id = EXCLUDED.parent_id, province_id = EXCLUDED.province_id, district_id = EXCLUDED.district_id, city_id = EXCLUDED.city_id, name = EXCLUDED.name, postal_code = EXCLUDED.postal_code;

END $$;
