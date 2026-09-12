-- Drop if exists to avoid errors
DROP POLICY IF EXISTS "Staff can delete any listing" ON public.listings;

-- Create policy for staff to delete any listing
CREATE POLICY "Staff can delete any listing"
ON public.listings
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() 
      AND p.account_status = 'active' 
      AND p.role IN ('admin', 'super_admin', 'moderator')
  )
);
