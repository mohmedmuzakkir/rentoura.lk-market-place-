-- Fix RLS policy so users can update their own rejected listings (e.g. Edit & Resubmit)
DROP POLICY IF EXISTS "Active owners update editable listings" ON public.listings;

CREATE POLICY "Active owners update editable listings"
ON public.listings FOR UPDATE TO authenticated
USING (
  owner_id = (select auth.uid())
  AND public.is_account_active((select auth.uid()))
  AND status IN ('draft', 'pending', 'changes_requested', 'rejected')
);