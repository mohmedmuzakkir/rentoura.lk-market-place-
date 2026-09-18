-- Migration: 20260917100000_fix_job_marketplace_view_logo.sql
-- Description: Update job_marketplace_view to extract company_logo_url from nested form_values or listing_media.

CREATE OR REPLACE VIEW public.job_marketplace_view WITH (security_invoker = true) AS
SELECT 
  l.id,
  l.owner_id,
  l.module,
  l.category_id,
  c.name AS category_name,
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
  COALESCE(l.module_data->>'company_name', l.module_data->'form_values'->>'companyName', 'Employer') AS company_name,
  COALESCE(
    l.module_data->>'company_logo_url',
    l.module_data->>'logoUrl',
    l.module_data->'form_values'->>'logoUrl',
    l.module_data->'form_values'->>'companyLogo',
    (SELECT lm.storage_path FROM public.listing_media lm WHERE lm.listing_id = l.id ORDER BY lm.position ASC LIMIT 1)
  ) AS company_logo_url,
  COALESCE(l.module_data->>'employment_type', l.module_data->'form_values'->>'employmentType', l.module_data->'form_values'->>'jobType') AS employment_type,
  COALESCE(l.module_data->>'work_mode', l.module_data->'form_values'->>'workMode', 'onsite') AS work_mode,
  (l.module_data->>'salary_type') AS salary_type,
  (l.module_data->>'experience') AS experience,
  (l.module_data->>'skills_text') AS skills_text,
  (l.module_data->>'application_deadline') AS application_deadline,
  COALESCE((l.module_data->>'is_remote')::boolean, (l.module_data->>'work_mode') = 'remote', false) AS is_remote,
  LOWER(
    COALESCE(l.title, '') || ' ' || 
    COALESCE(l.description, '') || ' ' || 
    COALESCE(c.name, '') || ' ' || 
    COALESCE(l.module_data->>'company_name', '') || ' ' || 
    COALESCE(l.module_data->>'skills_text', '') || ' ' || 
    COALESCE(l.module_data->>'employment_type', '') || ' ' || 
    COALESCE(l.module_data->>'work_mode', '')
  ) AS job_search_text,
  l.published_at,
  l.created_at,
  l.updated_at
FROM public.listings l
LEFT JOIN public.categories c ON c.id = l.category_id
WHERE l.module IN ('job', 'jobs');

NOTIFY pgrst, 'reload schema';
