-- Migration: 20260917090000_reload_pgrst_schema.sql
-- Description: Re-assert public.admin_edit_listing RPC function and issue NOTIFY pgrst, 'reload schema' to force PostgREST to refresh its function cache.

CREATE OR REPLACE FUNCTION public.admin_edit_listing(
  p_listing_id uuid,
  p_title text,
  p_short_summary text default null,
  p_description text default null,
  p_price numeric default null,
  p_pricing_period text default null,
  p_category_id uuid default null,
  p_province_id uuid default null,
  p_exact_address text default null,
  p_status text default null,
  p_module_data jsonb default null,
  p_reason text default null
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_actor public.profiles%ROWTYPE;
  v_listing public.listings%ROWTYPE;
  v_reason text := nullif(btrim(coalesce(p_reason, '')), '');
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION USING errcode = '42501', message = 'Authentication required';
  END IF;

  SELECT * INTO v_actor FROM public.profiles WHERE id = auth.uid();
  IF NOT FOUND OR v_actor.account_status <> 'active'
     OR v_actor.role NOT IN ('admin', 'super_admin', 'moderator') THEN
    RAISE EXCEPTION USING errcode = '42501', message = 'Staff authorization required';
  END IF;

  IF p_title IS NULL OR btrim(p_title) = '' THEN
    RAISE EXCEPTION USING errcode = '22023', message = 'Title is required';
  END IF;

  IF p_status IS NOT NULL AND p_status NOT IN ('draft', 'pending', 'changes_requested', 'active', 'rejected', 'paused', 'expired') THEN
    RAISE EXCEPTION USING errcode = '22023', message = 'Invalid listing status';
  END IF;

  SELECT * INTO v_listing FROM public.listings WHERE id = p_listing_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING errcode = 'P0002', message = 'Listing not found';
  END IF;

  UPDATE public.listings
  SET title = btrim(p_title),
      short_summary = nullif(btrim(p_short_summary), ''),
      description = nullif(btrim(p_description), ''),
      price = p_price,
      pricing_period = nullif(btrim(p_pricing_period), ''),
      category_id = coalesce(p_category_id, category_id),
      province_id = coalesce(p_province_id, province_id),
      exact_address = nullif(btrim(p_exact_address), ''),
      status = coalesce(p_status, status),
      module_data = case when p_module_data is not null then coalesce(module_data, '{}'::jsonb) || p_module_data else module_data end,
      updated_at = now()
  WHERE id = p_listing_id
  RETURNING * INTO v_listing;

  INSERT INTO public.audit_logs (
    actor_id, actor_name, actor_role, action, target_type, target_id,
    target_title, details, metadata
  ) VALUES (
    v_actor.id,
    coalesce(nullif(v_actor.full_name, ''), v_actor.email, 'Staff member'),
    v_actor.role,
    'LISTING_ADMIN_EDIT',
    'listing',
    v_listing.id::text,
    v_listing.title,
    v_reason,
    jsonb_build_object(
      'title', v_listing.title,
      'price', v_listing.price,
      'status', v_listing.status,
      'edited_by_role', v_actor.role
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'listing_id', v_listing.id,
    'title', v_listing.title,
    'status', v_listing.status
  );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_edit_listing(uuid, text, text, text, numeric, text, uuid, uuid, text, text, jsonb, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.admin_edit_listing(uuid, text, text, text, numeric, text, uuid, uuid, text, text, jsonb, text) TO authenticated;

NOTIFY pgrst, 'reload schema';
