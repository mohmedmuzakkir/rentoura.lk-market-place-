-- Update admin_manage_location RPC to handle is_featured_popular and image_url
create or replace function public.admin_manage_location(p_action text, p_location_id uuid default null, p_values jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public as $$
declare
  v_actor public.profiles%rowtype; v_loc public.locations%rowtype; v_parent public.locations%rowtype;
  v_id uuid; v_type text; v_name text; v_code text; v_parent_id uuid; v_status text;
  v_province uuid; v_district uuid; v_city uuid; v_lat numeric; v_lng numeric; v_refs bigint; v_children bigint;
begin
  select * into v_actor from public.profiles where id=auth.uid();
  if not found or v_actor.account_status<>'active' or v_actor.role not in ('admin','super_admin') then
    raise exception using errcode='42501',message='Admin authorization required';
  end if;
  if p_action not in ('create','update','set_status','delete') then raise exception using errcode='22023',message='Invalid location action'; end if;

  if p_action in ('create','update') then
    if p_action='update' then
      select * into v_loc from public.locations where id=p_location_id for update;
      if not found then raise exception using errcode='P0002',message='Location not found'; end if;
      v_type:=v_loc.type; v_name:=coalesce(nullif(btrim(p_values->>'name'),''),v_loc.name);
      v_code:=coalesce(lower(nullif(btrim(p_values->>'code'),'')),v_loc.code);
      v_parent_id:=case when p_values?'parent_id' then nullif(p_values->>'parent_id','')::uuid else v_loc.parent_id end;
      if v_parent_id is distinct from v_loc.parent_id and exists(select 1 from public.locations where parent_id=v_loc.id) then raise exception using errcode='23503',message='Locations with descendants cannot be moved'; end if;
    else
      v_type:=p_values->>'type'; v_name:=nullif(btrim(p_values->>'name'),''); v_code:=lower(nullif(btrim(p_values->>'code'),'')); v_parent_id:=nullif(p_values->>'parent_id','')::uuid;
    end if;
    if v_type not in ('province','district','city','area') or v_name is null or v_code is null then raise exception using errcode='22023',message='Type, name and deterministic code are required'; end if;
    if v_code !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then raise exception using errcode='22023',message='Code must contain lowercase letters, numbers and single hyphens only'; end if;
    if exists(select 1 from public.locations where code=v_code and id is distinct from p_location_id) then raise exception using errcode='23505',message='Location code already exists'; end if;
    if v_type='province' then
      if v_parent_id is not null then raise exception using errcode='22023',message='Province cannot have a parent'; end if;
      v_province:=null; v_district:=null; v_city:=null;
    else
      select * into v_parent from public.locations where id=v_parent_id;
      if not found then raise exception using errcode='22023',message='Parent location not found'; end if;
      if (v_type='district' and v_parent.type<>'province') or (v_type='city' and v_parent.type<>'district') or (v_type='area' and v_parent.type<>'city') then raise exception using errcode='22023',message='Parent must be exactly one hierarchy level above'; end if;
      if v_parent.id=p_location_id then raise exception using errcode='22023',message='A location cannot parent itself'; end if;
      v_province:=case when v_type='district' then v_parent.id else v_parent.province_id end;
      v_district:=case when v_type='city' then v_parent.id when v_type='area' then v_parent.district_id else null end;
      v_city:=case when v_type='area' then v_parent.id else null end;
    end if;
    v_lat:=case when p_values?'latitude' and nullif(p_values->>'latitude','') is not null then (p_values->>'latitude')::numeric when p_action='update' then v_loc.latitude else null end;
    v_lng:=case when p_values?'longitude' and nullif(p_values->>'longitude','') is not null then (p_values->>'longitude')::numeric when p_action='update' then v_loc.longitude else null end;
    if (v_lat is null)<>(v_lng is null) or v_lat not between -90 and 90 or v_lng not between -180 and 180 then raise exception using errcode='22023',message='Latitude and longitude must be supplied together within valid bounds'; end if;
    v_status:=coalesce(p_values->>'status',case when p_action='update' then v_loc.status else 'active' end);
    if v_status not in ('active','inactive') then raise exception using errcode='22023',message='Invalid location status'; end if;
    if p_action='create' then
      insert into public.locations(code,name,type,parent_id,province_id,district_id,city_id,latitude,longitude,postal_code,name_si,name_ta,status,sort_order,is_featured_popular,image_url)
      values(v_code,v_name,v_type,v_parent_id,v_province,v_district,v_city,v_lat,v_lng,nullif(btrim(p_values->>'postal_code'),''),nullif(btrim(p_values->>'name_si'),''),nullif(btrim(p_values->>'name_ta'),''),v_status,coalesce((p_values->>'sort_order')::int,10),coalesce((p_values->>'is_featured_popular')::boolean,false),nullif(btrim(p_values->>'image_url'),'')) returning * into v_loc;
    else
      update public.locations set code=v_code,name=v_name,parent_id=v_parent_id,province_id=v_province,district_id=v_district,city_id=v_city,latitude=v_lat,longitude=v_lng,
       postal_code=case when p_values?'postal_code' then nullif(btrim(p_values->>'postal_code'),'') else postal_code end,
       name_si=case when p_values?'name_si' then nullif(btrim(p_values->>'name_si'),'') else name_si end,
       name_ta=case when p_values?'name_ta' then nullif(btrim(p_values->>'name_ta'),'') else name_ta end,
       is_featured_popular=case when p_values?'is_featured_popular' then (p_values->>'is_featured_popular')::boolean else is_featured_popular end,
       image_url=case when p_values?'image_url' then nullif(btrim(p_values->>'image_url'),'') else image_url end,
       status=v_status,sort_order=coalesce((p_values->>'sort_order')::int,sort_order),updated_at=now() where id=p_location_id returning * into v_loc;
    end if;
    v_id:=v_loc.id;
  elsif p_action='set_status' then
    v_status:=p_values->>'status'; if v_status not in ('active','inactive') then raise exception using errcode='22023',message='Invalid location status'; end if;
    update public.locations set status=v_status,updated_at=now() where id=p_location_id returning * into v_loc;
    if not found then raise exception using errcode='P0002',message='Location not found'; end if;
    v_id:=v_loc.id;
  elsif p_action='delete' then
    select * into v_loc from public.locations where id=p_location_id;
    if not found then raise exception using errcode='P0002',message='Location not found'; end if;
    select count(*) into v_children from public.locations where parent_id=p_location_id;
    if v_children>0 then raise exception using errcode='23503',message='Cannot delete location with descendants'; end if;
    select count(*) into v_refs from public.listings where city_id=p_location_id or district_id=p_location_id or province_id=p_location_id;
    if v_refs>0 then raise exception using errcode='23503',message='Cannot delete location referenced by listings'; end if;
    delete from public.locations where id=p_location_id;
    v_id:=p_location_id;
  end if;

  insert into public.audit_logs(actor_id,action,entity_type,entity_id,details)
  values(auth.uid(),p_action,'location',v_id,jsonb_build_object('reason',p_values->>'reason','type',v_loc.type,'name',v_loc.name));

  return jsonb_build_object('success',true,'location',row_to_json(v_loc));
end;
$$;
