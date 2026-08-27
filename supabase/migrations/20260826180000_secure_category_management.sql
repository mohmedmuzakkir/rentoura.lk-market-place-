-- Secure, audited management of the canonical public.categories taxonomy.
revoke insert, update, delete on public.categories from anon, authenticated;

create or replace function public.admin_manage_category(p_action text,p_category_id uuid default null,p_values jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public as $$
declare v_actor public.profiles%rowtype; v_cat public.categories%rowtype; v_parent public.categories%rowtype;
 v_module text; v_level int; v_name text; v_slug text; v_parent_id uuid; v_status text; v_id uuid; v_refs bigint; v_children bigint;
begin
 select * into v_actor from public.profiles where id=auth.uid();
 if not found or v_actor.account_status<>'active' or v_actor.role not in ('admin','super_admin') then raise exception using errcode='42501',message='Admin authorization required'; end if;
 if p_action not in ('create','update','set_status','delete') then raise exception using errcode='22023',message='Invalid category action'; end if;

 if p_action='create' then
  v_module:=p_values->>'module'; v_level:=(p_values->>'level')::int; v_name:=nullif(btrim(p_values->>'name'),'');
  v_slug:=lower(nullif(btrim(p_values->>'slug'),'')); v_parent_id:=nullif(p_values->>'parent_id','')::uuid; v_status:=coalesce(p_values->>'status','active');
  if v_module not in ('rental','job','service') or v_level not in (1,2,3) or v_name is null or v_slug is null or v_status not in ('active','inactive') then raise exception using errcode='22023',message='Invalid category values'; end if;
  if v_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then raise exception using errcode='22023',message='Slug must contain lowercase letters, numbers, and single hyphens only'; end if;
  if v_level=1 and v_parent_id is not null then raise exception using errcode='22023',message='Main categories cannot have a parent'; end if;
  if v_level>1 then select * into v_parent from public.categories where id=v_parent_id; if not found then raise exception using errcode='22023',message='Parent category not found'; end if; if v_parent.module<>v_module then raise exception using errcode='22023',message='Cross-module parents are not allowed'; end if; if v_parent.level<>v_level-1 then raise exception using errcode='22023',message='Parent must be exactly one level above'; end if; end if;
  if exists(select 1 from public.categories where module=v_module and parent_id is not distinct from v_parent_id and slug=v_slug) then raise exception using errcode='23505',message='A sibling category already uses this slug'; end if;
  insert into public.categories(module,level,name,slug,parent_id,status,sort_order,icon_key,description)
  values(v_module,v_level,v_name,v_slug,v_parent_id,v_status,coalesce((p_values->>'sort_order')::int,0),nullif(p_values->>'icon_key',''),nullif(btrim(p_values->>'description'),'')) returning id into v_id;
  select * into v_cat from public.categories where id=v_id;
 elsif p_action='update' then
  select * into v_cat from public.categories where id=p_category_id for update; if not found then raise exception using errcode='P0002',message='Category not found'; end if;
  v_name:=coalesce(nullif(btrim(p_values->>'name'),''),v_cat.name); v_slug:=coalesce(lower(nullif(btrim(p_values->>'slug'),'')),v_cat.slug); v_parent_id:=coalesce(nullif(p_values->>'parent_id','')::uuid,v_cat.parent_id);
  if v_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then raise exception using errcode='22023',message='Invalid slug'; end if;
  if v_parent_id=p_category_id then raise exception using errcode='22023',message='A category cannot parent itself'; end if;
  if v_cat.level>1 then select * into v_parent from public.categories where id=v_parent_id; if not found or v_parent.module<>v_cat.module or v_parent.level<>v_cat.level-1 then raise exception using errcode='22023',message='Invalid or cross-module parent'; end if; end if;
  if exists(with recursive descendants as (select id from public.categories where parent_id=p_category_id union all select c.id from public.categories c join descendants d on c.parent_id=d.id) select 1 from descendants where id=v_parent_id) then raise exception using errcode='22023',message='Category cycles are not allowed'; end if;
  if exists(select 1 from public.categories where id<>p_category_id and module=v_cat.module and parent_id is not distinct from v_parent_id and slug=v_slug) then raise exception using errcode='23505',message='A sibling category already uses this slug'; end if;
  update public.categories set name=v_name,slug=v_slug,parent_id=v_parent_id,icon_key=case when p_values?'icon_key' then nullif(p_values->>'icon_key','') else icon_key end,description=case when p_values?'description' then nullif(btrim(p_values->>'description'),'') else description end,sort_order=coalesce((p_values->>'sort_order')::int,sort_order),updated_at=now() where id=p_category_id returning * into v_cat; v_id:=v_cat.id;
 elsif p_action='set_status' then
  v_status:=p_values->>'status'; if v_status not in ('active','inactive') then raise exception using errcode='22023',message='Invalid category status'; end if;
  update public.categories set status=v_status,updated_at=now() where id=p_category_id returning * into v_cat; if not found then raise exception using errcode='P0002',message='Category not found'; end if; v_id:=v_cat.id;
 else
  select * into v_cat from public.categories where id=p_category_id for update; if not found then raise exception using errcode='P0002',message='Category not found'; end if;
  select count(*) into v_refs from public.listings where category_id=p_category_id or subcategory_id=p_category_id or third_level_category_id=p_category_id;
  select count(*) into v_children from public.categories where parent_id=p_category_id;
  if v_refs>0 then raise exception using errcode='23503',message='Referenced categories must be inactivated, not deleted'; end if;
  if v_children>0 then raise exception using errcode='23503',message='Categories with children must be inactivated or emptied first'; end if;
  delete from public.categories where id=p_category_id; v_id:=p_category_id;
 end if;
 insert into public.audit_logs(actor_id,actor_name,actor_role,action,target_type,target_id,target_title,details,metadata)
 values(v_actor.id,coalesce(nullif(v_actor.full_name,''),v_actor.email),v_actor.role,'CATEGORY_'||upper(p_action),'category',v_id::text,coalesce(v_cat.name,v_name),coalesce(p_values->>'reason','Category management action'),jsonb_build_object('action',p_action,'values',p_values));
 return jsonb_build_object('id',v_id,'action',p_action);
end $$;
revoke all on function public.admin_manage_category(text,uuid,jsonb) from public,anon;
grant execute on function public.admin_manage_category(text,uuid,jsonb) to authenticated;

create or replace function public.admin_reorder_category(p_category_id uuid,p_direction text)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public as $$
declare v_actor public.profiles%rowtype; v_current public.categories%rowtype; v_other public.categories%rowtype; v_sort int;
begin
 select * into v_actor from public.profiles where id=auth.uid(); if not found or v_actor.account_status<>'active' or v_actor.role not in ('admin','super_admin') then raise exception using errcode='42501',message='Admin authorization required'; end if;
 if p_direction not in ('up','down') then raise exception using errcode='22023',message='Invalid reorder direction'; end if;
 select * into v_current from public.categories where id=p_category_id for update; if not found then raise exception using errcode='P0002',message='Category not found'; end if;
 select * into v_other from public.categories where module=v_current.module and parent_id is not distinct from v_current.parent_id and id<>v_current.id and ((p_direction='up' and sort_order<v_current.sort_order) or (p_direction='down' and sort_order>v_current.sort_order)) order by case when p_direction='up' then sort_order end desc,case when p_direction='down' then sort_order end asc limit 1 for update;
 if not found then return jsonb_build_object('id',v_current.id,'moved',false); end if;
 v_sort:=v_current.sort_order; update public.categories set sort_order=v_other.sort_order where id=v_current.id; update public.categories set sort_order=v_sort where id=v_other.id;
 insert into public.audit_logs(actor_id,actor_name,actor_role,action,target_type,target_id,target_title,details,metadata) values(v_actor.id,coalesce(nullif(v_actor.full_name,''),v_actor.email),v_actor.role,'CATEGORY_REORDER','category',v_current.id::text,v_current.name,'Reordered category '||p_direction,jsonb_build_object('direction',p_direction,'swapped_with',v_other.id));
 return jsonb_build_object('id',v_current.id,'moved',true);
end $$;
revoke all on function public.admin_reorder_category(uuid,text) from public,anon;
grant execute on function public.admin_reorder_category(uuid,text) to authenticated;
