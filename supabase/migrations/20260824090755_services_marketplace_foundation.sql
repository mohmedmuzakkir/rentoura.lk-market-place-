-- RENTOURA.LK — MIGRATION 20260824090755: SERVICES MARKETPLACE FOUNDATION
-- Adds profile location columns, service_marketplace_view with security_invoker = true, and service indexes.

-- 1. Profile Location Columns & Indexes
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS province_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS district_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS city_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS area_id UUID REFERENCES public.locations(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_province_id ON public.profiles (province_id);
CREATE INDEX IF NOT EXISTS idx_profiles_district_id ON public.profiles (district_id);
CREATE INDEX IF NOT EXISTS idx_profiles_city_id ON public.profiles (city_id);
CREATE INDEX IF NOT EXISTS idx_profiles_area_id ON public.profiles (area_id);

-- 2. SERVICE MARKETPLACE VIEW (security_invoker = true)
CREATE OR REPLACE VIEW public.service_marketplace_view WITH (security_invoker = true) AS
SELECT 
  l.id,
  l.owner_id,
  l.module,
  l.category_id,
  c.name AS category_name,
  c.slug AS category_slug,
  l.subcategory_id,
  l.third_level_category_id,
  l.title,
  l.short_summary,
  l.description,
  l.province_id,
  l.district_id,
  l.city_id,
  l.area_id,
  l.exact_address,
  l.latitude,
  l.longitude,
  l.price,
  l.minimum_price,
  l.maximum_price,
  l.pricing_period,
  l.currency,
  l.status,
  l.is_featured,
  l.module_data,
  COALESCE(l.module_data->>'provider_name', l.module_data->>'business_name') AS provider_name,
  (l.module_data->>'provider_avatar_url') AS provider_avatar_url,
  (l.module_data->>'service_type') AS service_type,
  (l.module_data->>'pricing_type') AS pricing_type,
  (l.module_data->>'experience_years') AS experience_years,
  (l.module_data->>'skills_text') AS skills_text,
  COALESCE((l.module_data->>'is_emergency')::boolean, false) AS is_emergency,
  COALESCE((l.module_data->>'is_available')::boolean, true) AS is_available,
  COALESCE((l.module_data->>'rating')::numeric, 0) AS rating,
  COALESCE((l.module_data->>'reviews_count')::int, 0) AS reviews_count,
  LOWER(
    COALESCE(l.title, '') || ' ' || 
    COALESCE(l.description, '') || ' ' || 
    COALESCE(c.name, '') || ' ' || 
    COALESCE(l.module_data->>'provider_name', '') || ' ' || 
    COALESCE(l.module_data->>'business_name', '') || ' ' || 
    COALESCE(l.module_data->>'skills_text', '') || ' ' || 
    COALESCE(l.module_data->>'service_type', '')
  ) AS service_search_text,
  l.published_at,
  l.created_at,
  l.updated_at
FROM public.listings l
LEFT JOIN public.categories c ON c.id = l.category_id
WHERE l.module IN ('service', 'services');

-- Grants
GRANT SELECT ON public.service_marketplace_view TO anon, authenticated, service_role;

-- 3. INDEXES FOR SERVICES
CREATE INDEX IF NOT EXISTS idx_listings_service_module ON public.listings (module, status, published_at DESC) WHERE module IN ('service', 'services');
CREATE INDEX IF NOT EXISTS idx_listings_service_is_emergency ON public.listings (((module_data->>'is_emergency'))) WHERE module IN ('service', 'services');
CREATE INDEX IF NOT EXISTS idx_listings_service_type ON public.listings (((module_data->>'service_type'))) WHERE module IN ('service', 'services');
CREATE INDEX IF NOT EXISTS idx_listings_service_pricing_type ON public.listings (((module_data->>'pricing_type'))) WHERE module IN ('service', 'services');
