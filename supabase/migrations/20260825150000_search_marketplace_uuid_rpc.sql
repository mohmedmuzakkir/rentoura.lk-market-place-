-- Migration: 20260825150000_search_marketplace_uuid_rpc.sql
-- Description: RPC function search_marketplace with UUID location & category parameter support, tokenized text search, and multi-module tab counting

CREATE OR REPLACE FUNCTION public.search_marketplace(
  p_query text DEFAULT NULL,
  p_module text DEFAULT NULL,
  p_category_id text DEFAULT NULL,
  p_province_id text DEFAULT NULL,
  p_district_id text DEFAULT NULL,
  p_city_id text DEFAULT NULL,
  p_area_id text DEFAULT NULL,
  p_min_price numeric DEFAULT NULL,
  p_max_price numeric DEFAULT NULL,
  p_sort text DEFAULT 'relevant',
  p_limit integer DEFAULT 12,
  p_offset integer DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_results jsonb;
  v_count_all bigint;
  v_count_rentals bigint;
  v_count_jobs bigint;
  v_count_services bigint;
  v_selected_total bigint;
  v_has_more boolean;
  v_tokens text[];
  v_token text;
BEGIN
  -- Normalize query tokens if provided
  IF p_query IS NOT NULL AND trim(p_query) <> '' THEN
    v_tokens := string_to_array(lower(trim(p_query)), ' ');
  END IF;

  -- Count for 'all' module under current filters
  SELECT COUNT(*) INTO v_count_all
  FROM public.listing_search_view v
  WHERE v.status = 'active'
    AND (p_category_id IS NULL OR v.category_id::text = p_category_id)
    AND (p_province_id IS NULL OR v.province_id::text = p_province_id)
    AND (p_district_id IS NULL OR v.district_id::text = p_district_id)
    AND (p_city_id IS NULL OR v.city_id::text = p_city_id)
    AND (p_area_id IS NULL OR v.area_id::text = p_area_id)
    AND (p_min_price IS NULL OR coalesce(v.price, v.minimum_price, 0) >= p_min_price)
    AND (p_max_price IS NULL OR coalesce(v.price, v.maximum_price, 0) <= p_max_price)
    AND (
      v_tokens IS NULL OR NOT EXISTS (
        SELECT 1 FROM unnest(v_tokens) t
        WHERE lower(coalesce(v.title, '') || ' ' || coalesce(v.description, '') || ' ' || coalesce(v.search_text, '') || ' ' || coalesce(v.category_name, '') || ' ' || coalesce(v.location_name, '')) NOT LIKE '%' || t || '%'
      )
    );

  -- Count for 'rental' module
  SELECT COUNT(*) INTO v_count_rentals
  FROM public.listing_search_view v
  WHERE v.status = 'active'
    AND v.module = 'rental'
    AND (p_category_id IS NULL OR v.category_id::text = p_category_id)
    AND (p_province_id IS NULL OR v.province_id::text = p_province_id)
    AND (p_district_id IS NULL OR v.district_id::text = p_district_id)
    AND (p_city_id IS NULL OR v.city_id::text = p_city_id)
    AND (p_area_id IS NULL OR v.area_id::text = p_area_id)
    AND (p_min_price IS NULL OR coalesce(v.price, v.minimum_price, 0) >= p_min_price)
    AND (p_max_price IS NULL OR coalesce(v.price, v.maximum_price, 0) <= p_max_price)
    AND (
      v_tokens IS NULL OR NOT EXISTS (
        SELECT 1 FROM unnest(v_tokens) t
        WHERE lower(coalesce(v.title, '') || ' ' || coalesce(v.description, '') || ' ' || coalesce(v.search_text, '') || ' ' || coalesce(v.category_name, '') || ' ' || coalesce(v.location_name, '')) NOT LIKE '%' || t || '%'
      )
    );

  -- Count for 'job' module
  SELECT COUNT(*) INTO v_count_jobs
  FROM public.listing_search_view v
  WHERE v.status = 'active'
    AND v.module = 'job'
    AND (p_category_id IS NULL OR v.category_id::text = p_category_id)
    AND (p_province_id IS NULL OR v.province_id::text = p_province_id)
    AND (p_district_id IS NULL OR v.district_id::text = p_district_id)
    AND (p_city_id IS NULL OR v.city_id::text = p_city_id)
    AND (p_area_id IS NULL OR v.area_id::text = p_area_id)
    AND (p_min_price IS NULL OR coalesce(v.price, v.minimum_price, 0) >= p_min_price)
    AND (p_max_price IS NULL OR coalesce(v.price, v.maximum_price, 0) <= p_max_price)
    AND (
      v_tokens IS NULL OR NOT EXISTS (
        SELECT 1 FROM unnest(v_tokens) t
        WHERE lower(coalesce(v.title, '') || ' ' || coalesce(v.description, '') || ' ' || coalesce(v.search_text, '') || ' ' || coalesce(v.category_name, '') || ' ' || coalesce(v.location_name, '')) NOT LIKE '%' || t || '%'
      )
    );

  -- Count for 'service' module
  SELECT COUNT(*) INTO v_count_services
  FROM public.listing_search_view v
  WHERE v.status = 'active'
    AND v.module = 'service'
    AND (p_category_id IS NULL OR v.category_id::text = p_category_id)
    AND (p_province_id IS NULL OR v.province_id::text = p_province_id)
    AND (p_district_id IS NULL OR v.district_id::text = p_district_id)
    AND (p_city_id IS NULL OR v.city_id::text = p_city_id)
    AND (p_area_id IS NULL OR v.area_id::text = p_area_id)
    AND (p_min_price IS NULL OR coalesce(v.price, v.minimum_price, 0) >= p_min_price)
    AND (p_max_price IS NULL OR coalesce(v.price, v.maximum_price, 0) <= p_max_price)
    AND (
      v_tokens IS NULL OR NOT EXISTS (
        SELECT 1 FROM unnest(v_tokens) t
        WHERE lower(coalesce(v.title, '') || ' ' || coalesce(v.description, '') || ' ' || coalesce(v.search_text, '') || ' ' || coalesce(v.category_name, '') || ' ' || coalesce(v.location_name, '')) NOT LIKE '%' || t || '%'
      )
    );

  -- Determine total for active selection
  IF p_module = 'rental' THEN
    v_selected_total := v_count_rentals;
  ELSIF p_module = 'job' THEN
    v_selected_total := v_count_jobs;
  ELSIF p_module = 'service' THEN
    v_selected_total := v_count_services;
  ELSE
    v_selected_total := v_count_all;
  END IF;

  v_has_more := (p_offset + p_limit) < v_selected_total;

  -- Fetch paginated results
  SELECT coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) INTO v_results
  FROM (
    SELECT 
      v.id,
      v.module,
      v.title,
      v.description,
      v.category_id,
      v.category_name,
      v.category_path,
      v.location_name,
      v.province_id,
      v.district_id,
      v.city_id,
      v.area_id,
      v.price,
      v.minimum_price,
      v.maximum_price,
      v.price_period,
      v.company_name,
      v.business_name,
      v.job_type,
      v.work_mode,
      v.pricing_type,
      v.service_type,
      v.cover_storage_path,
      v.media_urls,
      v.created_at,
      v.status
    FROM public.listing_search_view v
    WHERE v.status = 'active'
      AND (p_module IS NULL OR p_module = 'all' OR v.module = p_module)
      AND (p_category_id IS NULL OR v.category_id::text = p_category_id)
      AND (p_province_id IS NULL OR v.province_id::text = p_province_id)
      AND (p_district_id IS NULL OR v.district_id::text = p_district_id)
      AND (p_city_id IS NULL OR v.city_id::text = p_city_id)
      AND (p_area_id IS NULL OR v.area_id::text = p_area_id)
      AND (p_min_price IS NULL OR coalesce(v.price, v.minimum_price, 0) >= p_min_price)
      AND (p_max_price IS NULL OR coalesce(v.price, v.maximum_price, 0) <= p_max_price)
      AND (
        v_tokens IS NULL OR NOT EXISTS (
          SELECT 1 FROM unnest(v_tokens) t
          WHERE lower(coalesce(v.title, '') || ' ' || coalesce(v.description, '') || ' ' || coalesce(v.search_text, '') || ' ' || coalesce(v.category_name, '') || ' ' || coalesce(v.location_name, '')) NOT LIKE '%' || t || '%'
        )
      )
    ORDER BY 
      CASE WHEN p_sort = 'price_low' THEN coalesce(v.price, v.minimum_price, 0) END ASC,
      CASE WHEN p_sort = 'price_high' THEN coalesce(v.price, v.maximum_price, 0) END DESC,
      v.created_at DESC
    LIMIT p_limit
    OFFSET p_offset
  ) r;

  RETURN jsonb_build_object(
    'counts', jsonb_build_object(
      'all', v_count_all,
      'rentals', v_count_rentals,
      'jobs', v_count_jobs,
      'services', v_count_services
    ),
    'selected_total', v_selected_total,
    'limit', p_limit,
    'offset', p_offset,
    'has_more', v_has_more,
    'results', v_results
  );
END;
$$;
