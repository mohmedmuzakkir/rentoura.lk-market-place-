-- RENTOURA.LK — PROFILE EDIT FIELDS & AVATARS BUCKET MIGRATION
-- Add product-required profile fields and create the avatars storage bucket.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS display_name text,
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'English',
  ADD COLUMN IF NOT EXISTS email_notifications boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS push_notifications boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS province_id uuid,
  ADD COLUMN IF NOT EXISTS district_id uuid,
  ADD COLUMN IF NOT EXISTS city_id uuid,
  ADD COLUMN IF NOT EXISTS area_id uuid;

-- Storage Bucket Setup for Avatars (Public Read, 5 MB Max, JPG/PNG/WebP)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS policies for avatars bucket
DROP POLICY IF EXISTS "Public Avatar Access" ON storage.objects;
CREATE POLICY "Public Avatar Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Owner Avatar Insert" ON storage.objects;
CREATE POLICY "Owner Avatar Insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND (auth.uid() = owner OR (storage.foldername(name))[1] = auth.uid()::text)
  );

DROP POLICY IF EXISTS "Owner Avatar Update" ON storage.objects;
CREATE POLICY "Owner Avatar Update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND (auth.uid() = owner OR (storage.foldername(name))[1] = auth.uid()::text)
  );

DROP POLICY IF EXISTS "Owner Avatar Delete" ON storage.objects;
CREATE POLICY "Owner Avatar Delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND (auth.uid() = owner OR (storage.foldername(name))[1] = auth.uid()::text)
  );
