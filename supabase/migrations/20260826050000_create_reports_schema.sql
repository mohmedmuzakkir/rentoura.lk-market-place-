-- Migration: 20260826050000_create_reports_schema.sql
-- Description: Create reports table for user flagging of listings, reviews, messages, or users with RLS and DB triggers

CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  target_type TEXT NOT NULL DEFAULT 'listing', -- 'listing' | 'review' | 'user' | 'message'
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  message_id TEXT,
  review_id TEXT,
  target_module TEXT DEFAULT 'rentals',
  target_title TEXT,
  target_location TEXT,
  target_price TEXT,
  target_image_url TEXT,
  reason_code TEXT NOT NULL,
  reason_label TEXT NOT NULL,
  details TEXT,
  contact_info TEXT,
  allow_contact BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'submitted', -- 'submitted' | 'under_review' | 'resolved' | 'dismissed'
  status_note TEXT,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolution_outcome TEXT,
  user_facing_message TEXT,
  internal_notes JSONB DEFAULT '[]'::jsonb,
  history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON public.reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_listing_id ON public.reports(listing_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Reporter can view own submitted reports
CREATE POLICY "Reporters can view own reports"
  ON public.reports FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_id);

-- Authenticated users (or guests) can insert a report
CREATE POLICY "Authenticated users can submit reports"
  ON public.reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id OR reporter_id IS NULL);

-- Allow public report insertion for unauthenticated guests if needed
CREATE POLICY "Anon users can submit reports"
  ON public.reports FOR INSERT
  TO anon
  WITH CHECK (reporter_id IS NULL);

-- Staff/Admins can view and update all reports
CREATE POLICY "Staff can view all reports"
  ON public.reports FOR SELECT
  TO authenticated
  USING (public.is_staff((select auth.uid())));

CREATE POLICY "Staff can update all reports"
  ON public.reports FOR UPDATE
  TO authenticated
  USING (public.is_staff((select auth.uid())))
  WITH CHECK (public.is_staff((select auth.uid())));
