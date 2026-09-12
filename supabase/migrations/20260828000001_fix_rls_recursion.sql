-- Drop old duplicate policies that are causing infinite recursion
DROP POLICY IF EXISTS "Users can view relevant participant records" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can add conversation participants" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can update own participant record" ON public.conversation_participants;

-- We already have:
-- "Participants read participant rows" (SELECT)
-- "Creators add participants" (INSERT)
-- "Users update own participant row" (UPDATE)
