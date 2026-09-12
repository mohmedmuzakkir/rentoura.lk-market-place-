-- Add featured popular and image support to locations
ALTER TABLE public.locations 
  ADD COLUMN IF NOT EXISTS is_featured_popular BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create location-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'location-images',
  'location-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Anyone can read location images
DROP POLICY IF EXISTS "Anyone can read location images" ON storage.objects;
CREATE POLICY "Anyone can read location images"
ON storage.objects FOR SELECT
USING (bucket_id = 'location-images');

-- Only staff can upload location images
DROP POLICY IF EXISTS "Staff can upload location images" ON storage.objects;
CREATE POLICY "Staff can upload location images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'location-images'
  AND public.is_staff((SELECT auth.uid()))
);

-- Only staff can update location images
DROP POLICY IF EXISTS "Staff can update location images" ON storage.objects;
CREATE POLICY "Staff can update location images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'location-images'
  AND public.is_staff((SELECT auth.uid()))
)
WITH CHECK (
  bucket_id = 'location-images'
  AND public.is_staff((SELECT auth.uid()))
);

-- Only staff can delete location images
DROP POLICY IF EXISTS "Staff can delete location images" ON storage.objects;
CREATE POLICY "Staff can delete location images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'location-images'
  AND public.is_staff((SELECT auth.uid()))
);