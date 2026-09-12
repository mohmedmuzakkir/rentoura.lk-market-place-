-- Fix structure of query does not match function result type error by explicitly casting to text
create or replace function public.admin_staff_moderation_analytics(p_from timestamptz default null,p_to timestamptz default null,p_module text default null)
returns table(actor_id uuid,actor_name text,actor_role text,event_date date,reviewed bigint,approved bigint,rejected bigint,changes_requested bigint)
language plpgsql security definer set search_path=pg_catalog,public as $$
declare v_actor public.profiles%rowtype;
begin
 select * into v_actor from public.profiles where id=auth.uid();
 if not found or v_actor.account_status::text<>'active' or v_actor.role::text<>'super_admin' then raise exception using errcode='42501',message='Super Admin authorization required'; end if;
 return query select p.id,coalesce(nullif(p.full_name,''),p.email),p.role::text,d.event_day,
  count(a.id),count(a.id) filter(where a.action='LISTING_APPROVE'),count(a.id) filter(where a.action='LISTING_REJECT'),count(a.id) filter(where a.action='LISTING_REQUEST_CHANGES')
 from public.profiles p cross join lateral (select generate_series(coalesce(p_from::date,current_date),coalesce(p_to::date,current_date),'1 day')::date as event_day) d
 left join public.audit_logs a on a.actor_id=p.id and a.created_at>=d.event_day and a.created_at<d.event_day+1 and a.target_type='listing' and a.action in ('LISTING_APPROVE','LISTING_REJECT','LISTING_REQUEST_CHANGES') and (p_module is null or a.metadata->>'module'=p_module)
 where p.role::text in ('moderator','admin','super_admin') group by p.id,p.full_name,p.email,p.role,d.event_day order by d.event_day desc,p.full_name;
end $$;
