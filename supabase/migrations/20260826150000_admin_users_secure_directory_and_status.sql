-- RENTOURA.LK: secure admin user directory, account actions, and status enforcement.

create or replace function public.is_account_active(p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1 from public.profiles
    where id = p_user_id and account_status = 'active'
  );
$$;
revoke all on function public.is_account_active(uuid) from public, anon, authenticated;

create or replace function public.protect_profile_authorization_fields()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
begin
  if current_user not in ('postgres', 'service_role')
     and (new.role is distinct from old.role or new.account_status is distinct from old.account_status) then
    raise exception using errcode = '42501', message = 'Role and account status require an authorized server operation';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_authorization_fields on public.profiles;
create trigger protect_profile_authorization_fields
before update on public.profiles
for each row execute function public.protect_profile_authorization_fields();
revoke all on function public.protect_profile_authorization_fields() from public, anon, authenticated;

create or replace function public.admin_user_directory(
  p_search text default null,
  p_status text default null,
  p_page integer default 1,
  p_page_size integer default 20
)
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  v_actor public.profiles%rowtype;
  v_page integer := greatest(coalesce(p_page, 1), 1);
  v_size integer := least(greatest(coalesce(p_page_size, 20), 1), 100);
  v_search text := nullif(btrim(coalesce(p_search, '')), '');
  v_status text := nullif(btrim(coalesce(p_status, '')), '');
  v_total bigint;
  v_rows jsonb;
  v_counts jsonb;
begin
  select * into v_actor from public.profiles where id = auth.uid();
  if not found or v_actor.account_status <> 'active' or v_actor.role not in ('moderator','admin','super_admin') then
    raise exception using errcode='42501', message='Staff authorization required';
  end if;
  if v_status is not null and v_status not in ('active','restricted','suspended','banned') then
    raise exception using errcode='22023', message='Invalid account status filter';
  end if;

  select count(*) into v_total
  from public.profiles p
  where (v_status is null or p.account_status = v_status)
    and (v_search is null or p.full_name ilike '%' || v_search || '%' or p.email ilike '%' || v_search || '%'
         or coalesce(p.phone_normalized, '') ilike '%' || v_search || '%' or p.id::text = v_search);

  select coalesce(jsonb_agg(to_jsonb(x) order by x.created_at desc), '[]'::jsonb) into v_rows
  from (
    select p.id, p.full_name, p.email, p.phone_normalized, p.role, p.account_status,
           p.created_at, p.updated_at,
           coalesce(l.listing_count, 0)::integer as listing_count,
           coalesce(r.report_count, 0)::integer as report_count
    from public.profiles p
    left join lateral (select count(*) listing_count from public.listings l where l.owner_id = p.id) l on true
    left join lateral (select count(*) report_count from public.reports r where r.target_user_id = p.id or r.reporter_id = p.id) r on true
    where (v_status is null or p.account_status = v_status)
      and (v_search is null or p.full_name ilike '%' || v_search || '%' or p.email ilike '%' || v_search || '%'
           or coalesce(p.phone_normalized, '') ilike '%' || v_search || '%' or p.id::text = v_search)
    order by p.created_at desc
    limit v_size offset (v_page - 1) * v_size
  ) x;

  select jsonb_build_object(
    'total', count(*),
    'active', count(*) filter (where account_status='active'),
    'restricted', count(*) filter (where account_status='restricted'),
    'suspended', count(*) filter (where account_status='suspended'),
    'banned', count(*) filter (where account_status='banned')
  ) into v_counts from public.profiles;

  return jsonb_build_object('users', v_rows, 'total', v_total, 'page', v_page, 'page_size', v_size, 'status_counts', v_counts);
end;
$$;
revoke all on function public.admin_user_directory(text,text,integer,integer) from public, anon;
grant execute on function public.admin_user_directory(text,text,integer,integer) to authenticated;

create or replace function public.admin_change_user_status(
  p_user_id uuid,
  p_status text,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_actor public.profiles%rowtype;
  v_target public.profiles%rowtype;
  v_reason text := nullif(btrim(coalesce(p_reason,'')), '');
  v_previous text;
begin
  select * into v_actor from public.profiles where id = auth.uid();
  if not found or v_actor.account_status <> 'active' or v_actor.role not in ('moderator','admin','super_admin') then
    raise exception using errcode='42501', message='Staff authorization required';
  end if;
  if p_status not in ('active','restricted','suspended','banned') then
    raise exception using errcode='22023', message='Invalid account status';
  end if;
  if v_reason is null then
    raise exception using errcode='22023', message='A reason is required for every account status change';
  end if;
  if p_user_id = v_actor.id then
    raise exception using errcode='42501', message='Staff cannot change their own account status';
  end if;

  select * into v_target from public.profiles where id = p_user_id for update;
  if not found then raise exception using errcode='P0002', message='User profile not found'; end if;
  if v_target.account_status = p_status then
    raise exception using errcode='22023', message='Account already has this status';
  end if;
  if v_actor.role = 'moderator' and v_target.role <> 'user' then
    raise exception using errcode='42501', message='Moderators cannot alter staff accounts';
  end if;
  if v_actor.role = 'moderator' and p_status = 'banned' then
    raise exception using errcode='42501', message='Only admins can ban accounts';
  end if;
  if v_actor.role = 'admin' and v_target.role = 'super_admin' then
    raise exception using errcode='42501', message='Admins cannot alter Super Admin accounts';
  end if;

  v_previous := v_target.account_status;
  update public.profiles set account_status=p_status, updated_at=now() where id=p_user_id;

  insert into public.audit_logs(actor_id,actor_name,actor_role,action,target_type,target_id,target_title,details,metadata)
  values(v_actor.id,coalesce(nullif(v_actor.full_name,''),v_actor.email,'Staff member'),v_actor.role,
    'USER_STATUS_' || upper(p_status),'user',v_target.id::text,coalesce(nullif(v_target.full_name,''),v_target.email),v_reason,
    jsonb_build_object('previous_status',v_previous,'new_status',p_status,'reason',v_reason));

  insert into public.notifications(user_id,type,category,title,body,entity_type,entity_id,action_url,priority,dedupe_key)
  values(v_target.id,'ACCOUNT_STATUS_CHANGED','system','Account status updated',
    'Your RENTOURA.LK account status changed from ' || v_previous || ' to ' || p_status || '. Reason: ' || v_reason,
    'user',v_target.id::text,'/profile','high','user-status:' || v_target.id::text || ':' || extract(epoch from clock_timestamp())::text);

  return jsonb_build_object('user_id',v_target.id,'previous_status',v_previous,'status',p_status);
end;
$$;
revoke all on function public.admin_change_user_status(uuid,text,text) from public, anon;
grant execute on function public.admin_change_user_status(uuid,text,text) to authenticated;

-- Active-account checks are restrictive, so they apply in addition to ownership/staff policies.
drop policy if exists "Active accounts can insert listings" on public.listings;
create policy "Active accounts can insert listings" on public.listings as restrictive for insert to authenticated with check (public.is_account_active((select auth.uid())));
drop policy if exists "Active accounts can update listings" on public.listings;
create policy "Active accounts can update listings" on public.listings as restrictive for update to authenticated using (public.is_account_active((select auth.uid()))) with check (public.is_account_active((select auth.uid())));
drop policy if exists "Active accounts can delete listings" on public.listings;
create policy "Active accounts can delete listings" on public.listings as restrictive for delete to authenticated using (public.is_account_active((select auth.uid())));

drop policy if exists "Active accounts can insert listing media" on public.listing_media;
create policy "Active accounts can insert listing media" on public.listing_media as restrictive for insert to authenticated with check (public.is_account_active((select auth.uid())));
drop policy if exists "Active accounts can update listing media" on public.listing_media;
create policy "Active accounts can update listing media" on public.listing_media as restrictive for update to authenticated using (public.is_account_active((select auth.uid()))) with check (public.is_account_active((select auth.uid())));
drop policy if exists "Active accounts can delete listing media" on public.listing_media;
create policy "Active accounts can delete listing media" on public.listing_media as restrictive for delete to authenticated using (public.is_account_active((select auth.uid())));

drop policy if exists "Active accounts can insert saved listings" on public.saved_listings;
create policy "Active accounts can insert saved listings" on public.saved_listings as restrictive for insert to authenticated with check (public.is_account_active((select auth.uid())));
drop policy if exists "Active accounts can delete saved listings" on public.saved_listings;
create policy "Active accounts can delete saved listings" on public.saved_listings as restrictive for delete to authenticated using (public.is_account_active((select auth.uid())));

drop policy if exists "Active accounts can submit reports" on public.reports;
create policy "Active accounts can submit reports" on public.reports as restrictive for insert to authenticated with check (public.is_account_active((select auth.uid())));

create index if not exists audit_logs_actor_id_idx on public.audit_logs(actor_id);
create index if not exists reports_target_user_id_idx on public.reports(target_user_id);
create index if not exists reports_assigned_to_idx on public.reports(assigned_to);
