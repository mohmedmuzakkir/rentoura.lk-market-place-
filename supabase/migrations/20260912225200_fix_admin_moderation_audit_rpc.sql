-- Fix structure of query does not match function result type error by recompiling the function
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
