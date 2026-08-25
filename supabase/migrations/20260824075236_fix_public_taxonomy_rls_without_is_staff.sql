-- RENTOURA.LK — MIGRATION: 20260824075236_fix_public_taxonomy_rls_without_is_staff.sql
-- Description: Public taxonomy SELECT policies without is_staff() calls

-- 1. CATEGORIES RLS POLICIES
DROP POLICY IF EXISTS "Categories readable by all" ON public.categories;
DROP POLICY IF EXISTS "Public active categories SELECT" ON public.categories;

CREATE POLICY "Public active categories SELECT"
  ON public.categories
  FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

-- 2. LOCATIONS RLS POLICIES
DROP POLICY IF EXISTS "Locations readable by all" ON public.locations;
DROP POLICY IF EXISTS "Public active locations SELECT" ON public.locations;

CREATE POLICY "Public active locations SELECT"
  ON public.locations
  FOR SELECT
  TO anon, authenticated
  USING (status = 'active');
