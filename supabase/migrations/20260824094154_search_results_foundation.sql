-- Migration: 20260824094154_search_results_foundation.sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS listings_active_global_feed_idx 
ON public.listings (status, created_at DESC) 
WHERE status = 'active';

CREATE INDEX IF NOT EXISTS listings_active_global_price_idx 
ON public.listings (status, price) 
WHERE status = 'active';

CREATE INDEX IF NOT EXISTS listings_active_title_trgm_idx 
ON public.listings USING gin (title gin_trgm_ops) 
WHERE status = 'active';

CREATE INDEX IF NOT EXISTS listings_active_description_trgm_idx 
ON public.listings USING gin (description gin_trgm_ops) 
WHERE status = 'active';

CREATE OR REPLACE FUNCTION public.search_marketplace(
  p_query text DEFAULT NULL,
  p_module text DEFAULT NULL,
  p_category_id uuid DEFAULT NULL,
  p_province_id integer DEFAULT NULL,
  p_district_id integer DEFAULT NULL,
  p_city_id integer DEFAULT NULL,
  p_area_id integer DEFAULT NULL,
  p_min_price numeric DEFAULT NULL,
  p_max_price numeric DEFAULT NULL,
  p_sort text DEFAULT 'relevant',
  p_limit integer DEFAULT 12,
  p_offset integer DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_q text := NULLIF(trim(p_query), '');
  v_mod text := NULLIF(lower(trim(p_module)), 'all');
  v_all_count bigint := 0;
  v_rentals_count bigint := 0;
  v_jobs_count bigint := 0;
  v_services_count bigint := 0;
  v_selected_total bigint := 0;
  v_results jsonb := '[]'::jsonb;
  v_has_more boolean := false;
BEGIN
  -- Compute counts per module for active listings matching query & filters (except p_module)
  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE module = 'rental'),
    COUNT(*) FILTER (WHERE module = 'job'),
    COUNT(*) FILTER (WHERE module = 'service')
  INTO
    v_all_count,
    v_rentals_count,
    v_jobs_count,
    v_services_count
  FROM public.listing_search_view
  WHERE status = 'active'
    AND (v_q IS NULL OR service_search_text ILIKE '%' || v_q || '%')
    AND (p_category_id IS NULL OR category_id = p_category_id)
    AND (p_province_id IS NULL OR province_id = p_province_id)
    AND (p_district_id IS NULL OR district_id = p_district_id)
    AND (p_city_id IS NULL OR city_id = p_city_id)
    AND (p_area_id IS NULL OR area_id = p_area_id)
    AND (p_min_price IS NULL OR price >= p_min_price OR minimum_price >= p_min_price)
    AND (p_max_price IS NULL OR price <= p_max_price OR maximum_price <= p_max_price);

  -- Selected module count
  IF v_mod IS NULL THEN
    v_selected_total := v_all_count;
  ELSIF v_mod IN ('rental', 'rentals') THEN
    v_selected_total := v_rentals_count;
  ELSIF v_mod IN ('job', 'jobs') THEN
    v_selected_total := v_jobs_count;
  ELSIF v_mod IN ('service', 'services') THEN
    v_selected_total := v_services_count;
  END IF;

  -- Fetch matching results
  WITH filtered AS (
    SELECT *
    FROM public.listing_search_view
    WHERE status = 'active'
      AND (v_mod IS NULL OR module = CASE WHEN v_mod IN ('rentals','rental') THEN 'rental' WHEN v_mod IN ('jobs','job') THEN 'job' WHEN v_mod IN ('services','service') THEN 'service' ELSE v_mod END)
      AND (v_q IS NULL OR service_search_text ILIKE '%' || v_q || '%')
      AND (p_category_id IS NULL OR category_id = p_category_id)
      AND (p_province_id IS NULL OR province_id = p_province_id)
      AND (p_district_id IS NULL OR district_id = p_district_id)
      AND (p_city_id IS NULL OR city_id = p_city_id)
      AND (p_area_id IS NULL OR area_id = p_area_id)
      AND (p_min_price IS NULL OR price >= p_min_price OR minimum_price >= p_min_price)
      AND (p_max_price IS NULL OR price <= p_max_price OR maximum_price <= p_max_price)
  ),
  ordered AS (
    SELECT *
    FROM filtered
    ORDER BY
      CASE WHEN p_sort = 'newest' THEN created_at END DESC,
      CASE WHEN p_sort = 'price_low' THEN COALESCE(price, minimum_price, 0) END ASC,
      CASE WHEN p_sort = 'price_high' THEN COALESCE(price, maximum_price, 0) END DESC,
      created_at DESC
    LIMIT p_limit
    OFFSET p_offset
  )
  SELECT COALESCE(jsonb_agg(to_jsonb(ordered.*)), '[]'::jsonb)
  INTO v_results
  FROM ordered;

  v_has_more := (p_offset + COALESCE(jsonb_array_length(v_results), 0)) < v_selected_total;

  RETURN jsonb_build_object(
    'counts', jsonb_build_object(
      'all', v_all_count,
      'rentals', v_rentals_count,
      'jobs', v_jobs_count,
      'services', v_services_count
    ),
    'selected_total', v_selected_total,
    'limit', p_limit,
    'offset', p_offset,
    'has_more', v_has_more,
    'results', v_results
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.search_marketplace TO anon, authenticated, service_role;
