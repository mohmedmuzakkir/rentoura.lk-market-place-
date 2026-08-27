create or replace function public.super_admin_change_staff_role(p_user_id uuid, p_role text, p_reason text)
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
  select * into v_actor from public.profiles where id=auth.uid();
  if not found or v_actor.role <> 'super_admin' or v_actor.account_status <> 'active' then
    raise exception using errcode='42501', message='Only an active Super Admin can manage roles';
  end if;
  if p_role not in ('user','moderator','admin') then raise exception using errcode='22023', message='Invalid managed role'; end if;
  if v_reason is null then raise exception using errcode='22023', message='A role-change reason is required'; end if;
  if p_user_id=v_actor.id then raise exception using errcode='42501', message='Super Admin cannot change their own role'; end if;
  select * into v_target from public.profiles where id=p_user_id for update;
  if not found then raise exception using errcode='P0002', message='Profile not found'; end if;
  if v_target.role='super_admin' then raise exception using errcode='42501', message='Super Admin roles cannot be changed through this operation'; end if;
  v_previous := v_target.role;
  update public.profiles set role=p_role,updated_at=now() where id=p_user_id;
  insert into public.audit_logs(actor_id,actor_name,actor_role,action,target_type,target_id,target_title,details,metadata)
  values(v_actor.id,coalesce(nullif(v_actor.full_name,''),v_actor.email),v_actor.role,'USER_ROLE_CHANGED','user',v_target.id::text,
    coalesce(nullif(v_target.full_name,''),v_target.email),v_reason,jsonb_build_object('previous_role',v_previous,'new_role',p_role,'reason',v_reason));
  insert into public.notifications(user_id,type,category,title,body,entity_type,entity_id,action_url,priority,dedupe_key)
  values(v_target.id,'ACCOUNT_ROLE_CHANGED','system','Account role updated','Your RENTOURA.LK account role changed from '||v_previous||' to '||p_role||'.','user',v_target.id::text,'/profile','high','user-role:'||v_target.id::text||':'||extract(epoch from clock_timestamp())::text);
  return jsonb_build_object('user_id',v_target.id,'role',p_role);
end;
$$;
revoke all on function public.super_admin_change_staff_role(uuid,text,text) from public, anon;
grant execute on function public.super_admin_change_staff_role(uuid,text,text) to authenticated;
