-- Create job-applications bucket for resumes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'job-applications',
  'job-applications',
  true,
  5242880,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

DROP POLICY IF EXISTS "Anyone can read job applications" ON storage.objects;
CREATE POLICY "Anyone can read job applications"
ON storage.objects FOR SELECT
USING (bucket_id = 'job-applications');

DROP POLICY IF EXISTS "Authenticated users can upload job applications" ON storage.objects;
CREATE POLICY "Authenticated users can upload job applications"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'job-applications'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);