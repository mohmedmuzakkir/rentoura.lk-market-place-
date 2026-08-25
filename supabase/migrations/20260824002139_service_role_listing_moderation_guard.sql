-- Migration: 20260824002139_service_role_listing_moderation_guard.sql
-- Description: Allow service_role to bypass non-staff self-approval checks in listing moderation guard

CREATE OR REPLACE FUNCTION public.prevent_listing_self_approval()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow service_role or system processes to update listing moderation fields
  IF (auth.jwt() ->> 'role') = 'service_role' OR auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  IF NOT public.is_staff(auth.uid()) THEN
    -- Non-staff cannot set status to 'active' directly
    IF NEW.status = 'active' AND OLD.status != 'active' THEN
      NEW.status := 'pending';
    END IF;
    -- Non-staff cannot feature listings
    NEW.is_featured := OLD.is_featured;
    NEW.approved_at := OLD.approved_at;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS protect_listing_moderation_fields ON public.listings;
CREATE TRIGGER protect_listing_moderation_fields
  BEFORE UPDATE ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_listing_self_approval();
