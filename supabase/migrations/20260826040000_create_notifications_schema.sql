-- Migration: 20260826040000_create_notifications_schema.sql
-- Description: Create notifications and notification_preferences tables with RLS and DB triggers for listing status changes

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'system',
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  action_url TEXT,
  thumbnail_url TEXT,
  priority TEXT NOT NULL DEFAULT 'normal',
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  dedupe_key TEXT
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Notification preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  messages BOOLEAN NOT NULL DEFAULT true,
  listing_updates BOOLEAN NOT NULL DEFAULT true,
  job_updates BOOLEAN NOT NULL DEFAULT true,
  service_updates BOOLEAN NOT NULL DEFAULT true,
  reviews BOOLEAN NOT NULL DEFAULT true,
  system_announcements BOOLEAN NOT NULL DEFAULT true,
  promotions BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notification preferences"
  ON public.notification_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification preferences"
  ON public.notification_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notification preferences"
  ON public.notification_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Trigger function to create a notification when a listing status changes or is submitted
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
      '/' || NEW.module || '-detail?id=' || NEW.id,
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
        '/' || NEW.module || '-detail?id=' || NEW.id,
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
        '/' || NEW.module || '-detail?id=' || NEW.id,
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
        '/' || NEW.module || '-detail?id=' || NEW.id,
        'high'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_notify_listing_status ON public.listings;
CREATE TRIGGER trg_notify_listing_status
  AFTER INSERT OR UPDATE OF status ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_listing_status_change();
