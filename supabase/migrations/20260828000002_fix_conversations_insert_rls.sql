-- Drop duplicate legacy policies on conversations
DROP POLICY IF EXISTS "Users can view participating conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;

-- Add a policy allowing creators to read their own conversations. 
-- This is strictly required so that a user can .select() the conversation right after creating it,
-- before they have been inserted into conversation_participants.
CREATE POLICY "Creators can view their created conversations" 
  ON public.conversations 
  FOR SELECT 
  TO authenticated 
  USING (created_by = auth.uid());
