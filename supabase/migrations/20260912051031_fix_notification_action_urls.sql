-- Trigger function to create a notification when a listing status changes or is submitted
-- Fixes action_url routing logic to use the correct canonical URL pattern (e.g. /rentals/123 instead of /rentals-detail?id=123)
CREATE OR REPLACE FUNCTION public.notify_listing_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.notifications (user_id, type, category, title, body, entity_type, entity_id, action_url, priority)
    VALUES (
      NEW.owner_id,
      'LISTING_PENDING',
      'listings',
      'Listing Submitted for Review',
      'Your listing "' || COALESCE(NEW.title, 'Untitled') || '" has been submitted and is currently pending review by our moderation team.',
      NEW.module,
      NEW.id::text,
      '/' || CASE WHEN NEW.module = 'rental' THEN 'rentals' WHEN NEW.module = 'job' THEN 'jobs' WHEN NEW.module = 'service' THEN 'services' ELSE NEW.module END || '/' || NEW.id,
      'normal'
    );
  ELSIF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    IF (NEW.status = 'active') THEN
      INSERT INTO public.notifications (user_id, type, category, title, body, entity_type, entity_id, action_url, priority)
      VALUES (
        NEW.owner_id,
        'LISTING_APPROVED',
        'listings',
        'Listing Approved & Published! 🎉',
        'Congratulations! Your listing "' || COALESCE(NEW.title, 'Untitled') || '" is now active on Rentoura.lk.',
        NEW.module,
        NEW.id::text,
        '/' || CASE WHEN NEW.module = 'rental' THEN 'rentals' WHEN NEW.module = 'job' THEN 'jobs' WHEN NEW.module = 'service' THEN 'services' ELSE NEW.module END || '/' || NEW.id,
        'high'
      );
    ELSIF (NEW.status = 'changes_requested') THEN
      INSERT INTO public.notifications (user_id, type, category, title, body, entity_type, entity_id, action_url, priority)
      VALUES (
        NEW.owner_id,
        'LISTING_CHANGES_REQUESTED',
        'listings',
        'Action Required: Listing Changes Requested',
        'Moderators have requested updates for your listing "' || COALESCE(NEW.title, 'Untitled') || '". Please review and update.',
        NEW.module,
        NEW.id::text,
        '/' || CASE WHEN NEW.module = 'rental' THEN 'rentals' WHEN NEW.module = 'job' THEN 'jobs' WHEN NEW.module = 'service' THEN 'services' ELSE NEW.module END || '/' || NEW.id,
        'high'
      );
    ELSIF (NEW.status = 'rejected') THEN
      INSERT INTO public.notifications (user_id, type, category, title, body, entity_type, entity_id, action_url, priority)
      VALUES (
        NEW.owner_id,
        'LISTING_REJECTED',
        'listings',
        'Listing Declined',
        'Your listing "' || COALESCE(NEW.title, 'Untitled') || '" did not meet our platform posting guidelines.',
        NEW.module,
        NEW.id::text,
        '/' || NEW.module || '/' || NEW.id,
        'high'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
