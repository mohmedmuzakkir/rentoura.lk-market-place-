-- RENTOURA.LK — MIGRATION 20260824085122: JOBS MARKETPLACE FOUNDATION
-- Creates job_companies table, RLS, job_marketplace_view with security_invoker = true, and job indexes.

CREATE TABLE IF NOT EXISTS public.job_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  logo_url TEXT,
  website_url TEXT,
  short_description TEXT,
  subtitle TEXT,
  brand_key TEXT DEFAULT 'custom',
  is_featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS for job_companies
ALTER TABLE public.job_companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anon active companies SELECT" ON public.job_companies;
CREATE POLICY "Anon active companies SELECT" ON public.job_companies
  FOR SELECT TO anon
  USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated active/staff companies SELECT" ON public.job_companies;
CREATE POLICY "Authenticated active/staff companies SELECT" ON public.job_companies
  FOR SELECT TO authenticated
  USING (is_active = true OR public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Staff INSERT companies" ON public.job_companies;
CREATE POLICY "Staff INSERT companies" ON public.job_companies
  FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Staff UPDATE companies" ON public.job_companies;
CREATE POLICY "Staff UPDATE companies" ON public.job_companies
  FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Staff DELETE companies" ON public.job_companies;
CREATE POLICY "Staff DELETE companies" ON public.job_companies
  FOR DELETE TO authenticated
  USING (public.is_staff(auth.uid()));

-- Trigger for updated_at
DROP TRIGGER IF EXISTS set_job_companies_updated_at ON public.job_companies;
CREATE TRIGGER set_job_companies_updated_at
  BEFORE UPDATE ON public.job_companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_job_companies_ordering ON public.job_companies (is_featured DESC, display_order ASC, name ASC);

-- 2. JOB MARKETPLACE VIEW (security_invoker = true)
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
  (l.module_data->>'company_name') AS company_name,
  (l.module_data->>'company_logo_url') AS company_logo_url,
  (l.module_data->>'employment_type') AS employment_type,
  (l.module_data->>'work_mode') AS work_mode,
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

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_listings_job_module ON public.listings (module, status, published_at DESC) WHERE module IN ('job', 'jobs');
CREATE INDEX IF NOT EXISTS idx_listings_job_employment_type ON public.listings (((module_data->>'employment_type'))) WHERE module IN ('job', 'jobs');
CREATE INDEX IF NOT EXISTS idx_listings_job_work_mode ON public.listings (((module_data->>'work_mode'))) WHERE module IN ('job', 'jobs');
CREATE INDEX IF NOT EXISTS idx_listings_job_company ON public.listings (((module_data->>'company_name'))) WHERE module IN ('job', 'jobs');
