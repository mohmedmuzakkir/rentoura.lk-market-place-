-- RENTOURA.LK — MIGRATION 20260826080000: ADMIN DASHBOARD SCHEMA
-- Creates audit_logs, announcements tables, site-assets storage bucket, and extends home_slides.

-- 1. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NULL,
  target_id TEXT NULL,
  target_title TEXT NULL,
  details TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can SELECT audit logs" ON public.audit_logs;
CREATE POLICY "Staff can SELECT audit logs" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('super_admin', 'admin', 'moderator')
        AND profiles.account_status = 'active'
    )
  );

DROP POLICY IF EXISTS "Staff can INSERT audit logs" ON public.audit_logs;
CREATE POLICY "Staff can INSERT audit logs" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('super_admin', 'admin', 'moderator')
        AND profiles.account_status = 'active'
    )
  );

-- 2. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  target_module TEXT NOT NULL DEFAULT 'all',
  priority TEXT NOT NULL DEFAULT 'normal',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active announcements" ON public.announcements;
CREATE POLICY "Public can view active announcements" ON public.announcements
  FOR SELECT TO public
  USING (is_active = true);

DROP POLICY IF EXISTS "Staff can view all announcements" ON public.announcements;
CREATE POLICY "Staff can view all announcements" ON public.announcements
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('super_admin', 'admin', 'moderator')
        AND profiles.account_status = 'active'
    )
  );

DROP POLICY IF EXISTS "Staff can manage announcements" ON public.announcements;
CREATE POLICY "Staff can manage announcements" ON public.announcements
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('super_admin', 'admin', 'moderator')
        AND profiles.account_status = 'active'
    )
  );

-- 3. EXTEND HOME SLIDES
ALTER TABLE public.home_slides ADD COLUMN IF NOT EXISTS placement TEXT DEFAULT 'home';

-- 4. SITE-ASSETS BUCKET FOR SLIDES & LOGOS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-assets',
  'site-assets',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- Storage RLS policies
DROP POLICY IF EXISTS "Public view site assets" ON storage.objects;
CREATE POLICY "Public view site assets" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "Staff upload site assets" ON storage.objects;
CREATE POLICY "Staff upload site assets" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'site-assets' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('super_admin', 'admin', 'moderator')
        AND profiles.account_status = 'active'
    )
  );

DROP POLICY IF EXISTS "Staff update/delete site assets" ON storage.objects;
CREATE POLICY "Staff update/delete site assets" ON storage.objects
  FOR ALL TO authenticated
  USING (
    bucket_id = 'site-assets' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('super_admin', 'admin', 'moderator')
        AND profiles.account_status = 'active'
    )
  );
