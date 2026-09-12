-- Fix admin_dashboard_metrics ENUM type casting issues
create or replace function public.admin_dashboard_metrics(p_module text default null)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public as $$
declare v_actor public.profiles%rowtype; v_result jsonb;
begin
 select * into v_actor from public.profiles where id=auth.uid();
 if not found or v_actor.account_status::text<>'active' or v_actor.role::text not in ('moderator','admin','super_admin') then raise exception using errcode='42501',message='Staff authorization required'; end if;
 select jsonb_build_object(
  'total_listings',count(*) filter(where p_module is null or l.module::text=p_module),
  'active_listings',count(*) filter(where l.status::text='active' and (p_module is null or l.module::text=p_module)),
  'pending_listings',count(*) filter(where l.status::text='pending' and (p_module is null or l.module::text=p_module)),
  'rejected_listings',count(*) filter(where l.status::text='rejected' and (p_module is null or l.module::text=p_module)),
  'rentals_count',count(*) filter(where l.module::text='rental'),'jobs_count',count(*) filter(where l.module::text='job'),'services_count',count(*) filter(where l.module::text='service'),
  'new_listings_7d',count(*) filter(where l.created_at>=now()-interval '7 days' and (p_module is null or l.module::text=p_module)),
  'previous_listings_7d',count(*) filter(where l.created_at>=now()-interval '14 days' and l.created_at<now()-interval '7 days' and (p_module is null or l.module::text=p_module))) into v_result from public.listings l;
 return v_result||jsonb_build_object(
  'total_users',(select count(*) from public.profiles),
  'new_users_7d',(select count(*) from public.profiles where created_at>=now()-interval '7 days'),
  'previous_users_7d',(select count(*) from public.profiles where created_at>=now()-interval '14 days' and created_at<now()-interval '7 days'),
  'reported_listings',(select count(*) from public.reports where listing_id is not null and status::text in ('submitted','under_review')));
end $$;

-- Fix reports reporter_id foreign key for PostgREST embedding
alter table public.reports
  drop constraint if exists reports_reporter_id_fkey,
  add constraint reports_reporter_id_fkey foreign key (reporter_id) references public.profiles(id) on delete set null;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
