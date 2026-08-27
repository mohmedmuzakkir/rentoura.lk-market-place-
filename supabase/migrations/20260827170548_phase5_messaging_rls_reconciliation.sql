-- Phase 5: fix cross-conversation RLS predicates and support persisted read state.
create or replace function public.is_conversation_participant(p_conversation_id uuid, p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1 from public.conversation_participants cp
    where cp.conversation_id = p_conversation_id and cp.user_id = p_user_id
  );
$$;
revoke all on function public.is_conversation_participant(uuid,uuid) from public,anon;
grant execute on function public.is_conversation_participant(uuid,uuid) to authenticated;

drop policy if exists "Participants read participant rows" on public.conversation_participants;
create policy "Participants read participant rows" on public.conversation_participants
for select to authenticated
using (public.is_conversation_participant(conversation_id,(select auth.uid())));

drop policy if exists "Participants read messages" on public.messages;
drop policy if exists "Participants send messages" on public.messages;
create policy "Participants read messages" on public.messages
for select to authenticated
using (public.is_conversation_participant(conversation_id,(select auth.uid())));
create policy "Participants send messages" on public.messages
for insert to authenticated
with check (
  sender_id=(select auth.uid())
  and public.is_conversation_participant(conversation_id,(select auth.uid()))
);

drop policy if exists "Participants update conversations" on public.conversations;
create policy "Participants update conversations" on public.conversations
for update to authenticated
using (public.is_conversation_participant(id,(select auth.uid())))
with check (public.is_conversation_participant(id,(select auth.uid())));
