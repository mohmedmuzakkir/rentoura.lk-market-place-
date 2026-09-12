-- Drop the policy that directly queries conversation_participants, causing infinite recursion
DROP POLICY IF EXISTS "Participants read conversations" ON public.conversations;

-- Recreate it using the SECURITY DEFINER function to break the cyclic RLS dependency
CREATE POLICY "Participants read conversations"
ON public.conversations
FOR SELECT
TO authenticated
USING (public.is_conversation_participant(id, auth.uid()));
