-- Migration: 20260917080000_staff_messaging_support.sql
-- Description: Allow conversations without listing_id for direct staff-to-user messaging, and add staff role helper.

ALTER TABLE public.conversations ALTER COLUMN listing_id DROP NOT NULL;

CREATE OR REPLACE FUNCTION public.get_user_staff_role(p_user_id uuid)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_role text;
BEGIN
  IF p_user_id IS NULL THEN
    RETURN 'user';
  END IF;

  SELECT role INTO v_role
  FROM public.profiles
  WHERE id = p_user_id AND account_status = 'active';

  IF v_role IN ('admin', 'super_admin', 'moderator') THEN
    RETURN v_role;
  END IF;

  RETURN 'user';
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_staff_role(uuid) TO authenticated, anon;
