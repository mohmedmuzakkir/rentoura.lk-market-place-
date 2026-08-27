-- Phase 4: authoritative moderation, measurable staff activity, and atomic hero ordering.

alter table public.listings add column if not exists moderation_reason text;
alter table public.listings add column if not exists moderated_at timestamptz;
alter table public.listings add column if not exists moderated_by uuid references auth.users(id) on delete set null;

create index if not exists listings_pending_submitted_idx
  on public.listings (submitted_at, id) where status = 'pending';
create index if not exists audit_logs_listing_moderation_idx
  on public.audit_logs (created_at desc, actor_id)
  where target_type = 'listing' and action in ('LISTING_APPROVE','LISTING_REJECT','LISTING_REQUEST_CHANGES');
create index if not exists reports_open_listing_idx
  on public.reports (listing_id) where status in ('submitted','under_review');
create index if not exists home_slides_placement_order_idx
  on public.home_slides (placement, display_order, id);

create or replace function public.moderate_listing(p_listing_id uuid, p_action text, p_reason text default null)
returns jsonb language plpgsql security definer set search_path = pg_catalog, public as $$
declare
  v_actor public.profiles%rowtype;
  v_listing public.listings%rowtype;
  v_status text;
  v_reason text := nullif(btrim(coalesce(p_reason, '')), '');
begin
  if auth.uid() is null then raise exception using errcode='42501', message='Authentication required'; end if;
  select * into v_actor from public.profiles where id=auth.uid();
  if not found or v_actor.account_status <> 'active' or v_actor.role not in ('moderator','admin','super_admin') then
    raise exception using errcode='42501', message='Staff authorization required';
  end if;
  if p_action not in ('approve','reject','request_changes') then
    raise exception using errcode='22023', message='Invalid moderation action';
  end if;
  if p_action in ('reject','request_changes') and v_reason is null then
    raise exception using errcode='22023', message='A clear, actionable reason is required';
  end if;
  v_status := case p_action when 'approve' then 'active' when 'reject' then 'rejected' else 'changes_requested' end;

  update public.listings set
    status=v_status,
    published_at=case when p_action='approve' then now() else null end,
    moderation_reason=v_reason,
    moderated_at=now(),
    moderated_by=v_actor.id,
    updated_at=now()
  where id=p_listing_id and status='pending'
  returning * into v_listing;

  if not found then
    if exists(select 1 from public.listings where id=p_listing_id) then
      raise exception using errcode='40001', message='This listing was already handled by another staff member';
    end if;
    raise exception using errcode='P0002', message='Listing not found';
  end if;

  insert into public.audit_logs(actor_id,actor_name,actor_role,action,target_type,target_id,target_title,details,metadata)
  values(v_actor.id,coalesce(nullif(v_actor.full_name,''),v_actor.email,'Staff member'),v_actor.role,
    'LISTING_'||upper(p_action),'listing',v_listing.id::text,v_listing.title,v_reason,
    jsonb_build_object('previous_status','pending','new_status',v_status,'reason',v_reason,'module',v_listing.module));

  insert into public.notifications(user_id,type,category,title,body,entity_type,entity_id,action_url,priority,dedupe_key)
  values(v_listing.owner_id,
    case p_action when 'approve' then 'LISTING_APPROVED' when 'reject' then 'LISTING_REJECTED' else 'LISTING_CHANGES_REQUESTED' end,
    'listings',case p_action when 'approve' then 'Listing approved' when 'reject' then 'Listing rejected' else 'Changes requested' end,
    case p_action when 'approve' then 'Your listing "'||v_listing.title||'" is now active.'
      when 'reject' then 'Your listing "'||v_listing.title||'" was rejected. Reason: '||v_reason
      else 'Please update "'||v_listing.title||'". Requested changes: '||v_reason end,
    'listing',v_listing.id::text,'/my-listings','high','listing-moderation:'||v_listing.id::text||':'||p_action)
  on conflict(dedupe_key) where dedupe_key is not null do nothing;
  return jsonb_build_object('listing_id',v_listing.id,'status',v_status,'reason',v_reason,'moderated_at',v_listing.moderated_at);
end $$;
revoke all on function public.moderate_listing(uuid,text,text) from public,anon;
grant execute on function public.moderate_listing(uuid,text,text) to authenticated;

create or replace function public.admin_moderation_queue(
  p_module text default null, p_category_id uuid default null, p_province_id uuid default null,
  p_submitted_from timestamptz default null, p_submitted_to timestamptz default null,
  p_reported boolean default null, p_search text default null,
  p_cursor_at timestamptz default null, p_cursor_id uuid default null, p_limit integer default 25)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public as $$
declare v_actor public.profiles%rowtype; v_rows jsonb; v_limit integer:=least(greatest(coalesce(p_limit,25),1),100);
begin
  select * into v_actor from public.profiles where id=auth.uid();
  if not found or v_actor.account_status<>'active' or v_actor.role not in ('moderator','admin','super_admin') then
    raise exception using errcode='42501',message='Staff authorization required';
  end if;
  select coalesce(jsonb_agg(to_jsonb(q) order by q.submitted_at desc nulls last,q.created_at desc,q.id desc),'[]'::jsonb) into v_rows
  from (
    select l.id,l.owner_id,l.module,l.category_id,l.province_id,l.title,l.short_summary,l.description,l.price,l.pricing_period,
      l.status,l.submitted_at,l.created_at,l.updated_at,c.name category_name,loc.name province_name,
      coalesce(nullif(p.full_name,''),p.email,'Owner') owner_name,
      exists(select 1 from public.reports r where r.listing_id=l.id and r.status in ('submitted','under_review')) reported,
      (select m.storage_path from public.listing_media m where m.listing_id=l.id order by m.is_cover desc,m.position,m.id limit 1) cover_path
    from public.listings l
    left join public.categories c on c.id=l.category_id
    left join public.locations loc on loc.id=l.province_id
    left join public.profiles p on p.id=l.owner_id
    where l.status='pending'
      and (p_module is null or l.module=p_module)
      and (p_category_id is null or l.category_id=p_category_id)
      and (p_province_id is null or l.province_id=p_province_id)
      and (p_submitted_from is null or coalesce(l.submitted_at,l.created_at)>=p_submitted_from)
      and (p_submitted_to is null or coalesce(l.submitted_at,l.created_at)<=p_submitted_to)
      and (p_reported is null or p_reported=exists(select 1 from public.reports r where r.listing_id=l.id and r.status in ('submitted','under_review')))
      and (nullif(btrim(coalesce(p_search,'')),'') is null or l.title ilike '%'||btrim(p_search)||'%' or l.id::text=btrim(p_search) or p.full_name ilike '%'||btrim(p_search)||'%')
      and (p_cursor_at is null or (coalesce(l.submitted_at,l.created_at),l.id)<(p_cursor_at,coalesce(p_cursor_id,'ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid)))
    order by l.submitted_at desc nulls last,l.created_at desc,l.id desc limit v_limit+1
  ) q;
  return jsonb_build_object('rows',coalesce(v_rows,'[]'::jsonb),'page_size',v_limit,'has_more',jsonb_array_length(coalesce(v_rows,'[]'::jsonb))>v_limit);
end $$;
revoke all on function public.admin_moderation_queue(text,uuid,uuid,timestamptz,timestamptz,boolean,text,timestamptz,uuid,integer) from public,anon;
grant execute on function public.admin_moderation_queue(text,uuid,uuid,timestamptz,timestamptz,boolean,text,timestamptz,uuid,integer) to authenticated;

create or replace function public.admin_listing_for_review(p_listing_id uuid)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public as $$
declare v_actor public.profiles%rowtype; v_result jsonb;
begin
  select * into v_actor from public.profiles where id=auth.uid();
  if not found or v_actor.account_status<>'active' or v_actor.role not in ('moderator','admin','super_admin') then raise exception using errcode='42501',message='Staff authorization required'; end if;
  select to_jsonb(l)||jsonb_build_object('category_name',c.name,'owner_name',coalesce(nullif(p.full_name,''),p.email),'media',coalesce((select jsonb_agg(to_jsonb(m) order by m.position) from public.listing_media m where m.listing_id=l.id),'[]'::jsonb))
  into v_result from public.listings l left join public.categories c on c.id=l.category_id left join public.profiles p on p.id=l.owner_id where l.id=p_listing_id;
  if v_result is null then raise exception using errcode='P0002',message='Listing not found'; end if; return v_result;
end $$;
revoke all on function public.admin_listing_for_review(uuid) from public,anon;
grant execute on function public.admin_listing_for_review(uuid) to authenticated;

create or replace function public.admin_dashboard_metrics(p_module text default null)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public as $$
declare v_actor public.profiles%rowtype; v_result jsonb;
begin
 select * into v_actor from public.profiles where id=auth.uid();
 if not found or v_actor.account_status<>'active' or v_actor.role not in ('moderator','admin','super_admin') then raise exception using errcode='42501',message='Staff authorization required'; end if;
 select jsonb_build_object(
  'total_listings',count(*) filter(where p_module is null or l.module=p_module),
  'active_listings',count(*) filter(where l.status='active' and (p_module is null or l.module=p_module)),
  'pending_listings',count(*) filter(where l.status='pending' and (p_module is null or l.module=p_module)),
  'rejected_listings',count(*) filter(where l.status='rejected' and (p_module is null or l.module=p_module)),
  'rentals_count',count(*) filter(where l.module='rental'),'jobs_count',count(*) filter(where l.module='job'),'services_count',count(*) filter(where l.module='service'),
  'new_listings_7d',count(*) filter(where l.created_at>=now()-interval '7 days' and (p_module is null or l.module=p_module)),
  'previous_listings_7d',count(*) filter(where l.created_at>=now()-interval '14 days' and l.created_at<now()-interval '7 days' and (p_module is null or l.module=p_module))) into v_result from public.listings l;
 return v_result||jsonb_build_object(
  'total_users',(select count(*) from public.profiles),
  'new_users_7d',(select count(*) from public.profiles where created_at>=now()-interval '7 days'),
  'previous_users_7d',(select count(*) from public.profiles where created_at>=now()-interval '14 days' and created_at<now()-interval '7 days'),
  'reported_listings',(select count(*) from public.reports where listing_id is not null and status in ('submitted','under_review')));
end $$;
revoke all on function public.admin_dashboard_metrics(text) from public,anon;
grant execute on function public.admin_dashboard_metrics(text) to authenticated;

create or replace function public.admin_moderation_audit(p_from timestamptz default null,p_to timestamptz default null,p_module text default null,p_limit integer default 100)
returns setof public.audit_logs language plpgsql security definer set search_path=pg_catalog,public as $$
declare v_actor public.profiles%rowtype;
begin
 select * into v_actor from public.profiles where id=auth.uid();
 if not found or v_actor.account_status<>'active' or v_actor.role<>'super_admin' then raise exception using errcode='42501',message='Super Admin authorization required'; end if;
 return query select a.* from public.audit_logs a where a.target_type='listing' and a.action in ('LISTING_APPROVE','LISTING_REJECT','LISTING_REQUEST_CHANGES')
  and (p_from is null or a.created_at>=p_from) and (p_to is null or a.created_at<=p_to) and (p_module is null or a.metadata->>'module'=p_module)
  order by a.created_at desc limit least(greatest(coalesce(p_limit,100),1),500);
end $$;
revoke all on function public.admin_moderation_audit(timestamptz,timestamptz,text,integer) from public,anon;
grant execute on function public.admin_moderation_audit(timestamptz,timestamptz,text,integer) to authenticated;

create or replace function public.admin_staff_moderation_analytics(p_from timestamptz default null,p_to timestamptz default null,p_module text default null)
returns table(actor_id uuid,actor_name text,actor_role text,event_date date,reviewed bigint,approved bigint,rejected bigint,changes_requested bigint)
language plpgsql security definer set search_path=pg_catalog,public as $$
declare v_actor public.profiles%rowtype;
begin
 select * into v_actor from public.profiles where id=auth.uid();
 if not found or v_actor.account_status<>'active' or v_actor.role<>'super_admin' then raise exception using errcode='42501',message='Super Admin authorization required'; end if;
 return query select p.id,coalesce(nullif(p.full_name,''),p.email),p.role,d.event_day,
  count(a.id),count(a.id) filter(where a.action='LISTING_APPROVE'),count(a.id) filter(where a.action='LISTING_REJECT'),count(a.id) filter(where a.action='LISTING_REQUEST_CHANGES')
 from public.profiles p cross join lateral (select generate_series(coalesce(p_from::date,current_date),coalesce(p_to::date,current_date),'1 day')::date as event_day) d
 left join public.audit_logs a on a.actor_id=p.id and a.created_at>=d.event_day and a.created_at<d.event_day+1 and a.target_type='listing' and a.action in ('LISTING_APPROVE','LISTING_REJECT','LISTING_REQUEST_CHANGES') and (p_module is null or a.metadata->>'module'=p_module)
 where p.role in ('moderator','admin','super_admin') group by p.id,p.full_name,p.email,p.role,d.event_day order by d.event_day desc,p.full_name;
end $$;
revoke all on function public.admin_staff_moderation_analytics(timestamptz,timestamptz,text) from public,anon;
grant execute on function public.admin_staff_moderation_analytics(timestamptz,timestamptz,text) to authenticated;

-- Staff-only public site asset writes; public reads remain intentional for hero delivery.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('site-assets','site-assets',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=true,file_size_limit=5242880,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists "Staff upload site assets" on storage.objects;
drop policy if exists "Staff update site assets" on storage.objects;
drop policy if exists "Staff delete site assets" on storage.objects;
create policy "Staff upload site assets" on storage.objects for insert to authenticated with check(bucket_id='site-assets' and public.is_staff((select auth.uid())));
create policy "Staff update site assets" on storage.objects for update to authenticated using(bucket_id='site-assets' and public.is_staff((select auth.uid()))) with check(bucket_id='site-assets' and public.is_staff((select auth.uid())));
create policy "Staff delete site assets" on storage.objects for delete to authenticated using(bucket_id='site-assets' and public.is_staff((select auth.uid())));

create or replace function public.admin_reorder_home_slide(p_slide_id uuid,p_action text)
returns void language plpgsql security definer set search_path=pg_catalog,public as $$
declare v_actor public.profiles%rowtype; v_placement text; v_current integer; v_target integer; v_max integer;
begin
 select * into v_actor from public.profiles where id=auth.uid();
 if not found or v_actor.account_status<>'active' or v_actor.role not in ('admin','super_admin') then raise exception using errcode='42501',message='Admin authorization required'; end if;
 if p_action not in ('up','down','first','normalize') then raise exception using errcode='22023',message='Invalid reorder action'; end if;
 select placement into v_placement from public.home_slides where id=p_slide_id for update;
 if not found then raise exception using errcode='P0002',message='Slide not found'; end if;
 perform pg_advisory_xact_lock(hashtext('home_slides:'||v_placement));
 with ranked as(select id,row_number() over(order by display_order,id)-1 pos from public.home_slides where placement=v_placement)
 update public.home_slides h set display_order=r.pos from ranked r where h.id=r.id;
 select display_order into v_current from public.home_slides where id=p_slide_id;
 select max(display_order) into v_max from public.home_slides where placement=v_placement;
 v_target:=case p_action when 'first' then 0 when 'up' then greatest(v_current-1,0) when 'down' then least(v_current+1,v_max) else v_current end;
 if v_target<>v_current then update public.home_slides set display_order=case when id=p_slide_id then v_target when display_order=v_target then v_current else display_order end,updated_at=now() where placement=v_placement and (id=p_slide_id or display_order=v_target); end if;
end $$;
revoke all on function public.admin_reorder_home_slide(uuid,text) from public,anon;
grant execute on function public.admin_reorder_home_slide(uuid,text) to authenticated;
