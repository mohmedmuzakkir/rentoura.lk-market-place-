-- RENTOURA.LK: authoritative admin listing review and moderation.

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  actor_name text not null,
  actor_role text not null,
  action text not null,
  target_type text,
  target_id text,
  target_title text,
  details text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_logs enable row level security;

drop policy if exists "Staff can SELECT audit logs" on public.audit_logs;
create policy "Staff can SELECT audit logs" on public.audit_logs
  for select to authenticated
  using (public.is_staff((select auth.uid())));

revoke all on public.audit_logs from anon, authenticated;
grant select on public.audit_logs to authenticated;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  category text not null default 'system',
  title text not null,
  body text not null,
  entity_type text,
  entity_id text,
  action_url text,
  priority text not null default 'normal',
  read_at timestamptz,
  created_at timestamptz not null default now(),
  dedupe_key text
);

create unique index if not exists notifications_dedupe_key_unique
  on public.notifications(dedupe_key) where dedupe_key is not null;
create index if not exists notifications_user_created_idx
  on public.notifications(user_id, created_at desc);

alter table public.notifications enable row level security;
drop policy if exists "Users can view own notifications" on public.notifications;
create policy "Users can view own notifications" on public.notifications
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Users can update own notifications" on public.notifications;
create policy "Users can update own notifications" on public.notifications
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

revoke all on public.notifications from anon, authenticated;
grant select, update on public.notifications to authenticated;

create or replace function public.moderate_listing(
  p_listing_id uuid,
  p_action text,
  p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_actor public.profiles%rowtype;
  v_listing public.listings%rowtype;
  v_status text;
  v_reason text := nullif(btrim(coalesce(p_reason, '')), '');
begin
  if auth.uid() is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;

  select * into v_actor from public.profiles where id = auth.uid();
  if not found or v_actor.account_status <> 'active'
     or v_actor.role not in ('moderator', 'admin', 'super_admin') then
    raise exception using errcode = '42501', message = 'Staff authorization required';
  end if;

  if p_action not in ('approve', 'reject', 'request_changes') then
    raise exception using errcode = '22023', message = 'Invalid moderation action';
  end if;
  if p_action in ('reject', 'request_changes') and v_reason is null then
    raise exception using errcode = '22023', message = 'A clear, actionable reason is required';
  end if;

  v_status := case p_action
    when 'approve' then 'active'
    when 'reject' then 'rejected'
    else 'changes_requested'
  end;

  update public.listings
  set status = v_status,
      published_at = case when p_action = 'approve' then now() else published_at end,
      updated_at = now()
  where id = p_listing_id and status = 'pending'
  returning * into v_listing;

  if not found then
    if exists (select 1 from public.listings where id = p_listing_id) then
      raise exception using errcode = '40001', message = 'This listing was already handled by another moderator';
    end if;
    raise exception using errcode = 'P0002', message = 'Listing not found';
  end if;

  insert into public.audit_logs (
    actor_id, actor_name, actor_role, action, target_type, target_id,
    target_title, details, metadata
  ) values (
    v_actor.id, coalesce(nullif(v_actor.full_name, ''), v_actor.email, 'Staff member'),
    v_actor.role, 'LISTING_' || upper(p_action), 'listing', v_listing.id::text,
    v_listing.title, v_reason,
    jsonb_build_object('previous_status', 'pending', 'new_status', v_status, 'reason', v_reason)
  );

  insert into public.notifications (
    user_id, type, category, title, body, entity_type, entity_id,
    action_url, priority, dedupe_key
  ) values (
    v_listing.owner_id,
    case p_action when 'approve' then 'LISTING_APPROVED' when 'reject' then 'LISTING_REJECTED' else 'LISTING_CHANGES_REQUESTED' end,
    'listings',
    case p_action when 'approve' then 'Listing approved' when 'reject' then 'Listing rejected' else 'Changes requested for your listing' end,
    case p_action
      when 'approve' then 'Your listing "' || v_listing.title || '" is now active.'
      when 'reject' then 'Your listing "' || v_listing.title || '" was rejected. Reason: ' || v_reason
      else 'Please update "' || v_listing.title || '". Requested changes: ' || v_reason
    end,
    'listing', v_listing.id::text, '/my-listings', 'high',
    'listing-moderation:' || v_listing.id::text || ':' || p_action
  ) on conflict (dedupe_key) where dedupe_key is not null do nothing;

  return jsonb_build_object(
    'listing_id', v_listing.id,
    'status', v_status,
    'published_at', v_listing.published_at,
    'notification_created', true
  );
end;
$$;

revoke all on function public.moderate_listing(uuid, text, text) from public, anon;
grant execute on function public.moderate_listing(uuid, text, text) to authenticated;

