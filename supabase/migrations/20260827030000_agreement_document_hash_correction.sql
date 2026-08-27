-- Pin the acceptance evidence to the SHA-256 of the v1.0 agreement source document.
create or replace function public.record_user_agreement_acceptance(p_context text,p_user_agent text default null)
returns public.user_agreement_acceptances language plpgsql security definer set search_path=pg_catalog,public as $$
declare v_row public.user_agreement_acceptances;
begin
 if auth.uid() is null then raise exception using errcode='42501',message='Authentication required'; end if;
 if p_context not in('registration','post_listing','first_contact_action','material_version_update') then raise exception using errcode='22023',message='Invalid agreement acceptance context'; end if;
 insert into public.user_agreement_acceptances(user_id,agreement_version,agreement_document_hash,context,user_agent)
 values(auth.uid(),'1.0','sha256:67d8b68ef2cd7703032c066659320644f79280579788880e8cddd2c495526b30',p_context,left(nullif(p_user_agent,''),1000)) returning * into v_row;
 update public.profiles set agreement_version='1.0',agreement_accepted_at=v_row.accepted_at,updated_at=now() where id=auth.uid();
 if not found then raise exception using errcode='P0002',message='Profile not found'; end if;
 return v_row;
end $$;
revoke all on function public.record_user_agreement_acceptance(text,text) from public,anon;
grant execute on function public.record_user_agreement_acceptance(text,text) to authenticated;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=pg_catalog,public as $$
declare v_accepted boolean := new.raw_user_meta_data->>'agreement_accepted'='true';
begin
 insert into public.profiles(id,full_name,email,phone_normalized,role,account_status,agreement_version,agreement_accepted_at)
 values(new.id,coalesce(new.raw_user_meta_data->>'full_name',new.raw_user_meta_data->>'name',''),coalesce(new.email,''),nullif(new.raw_user_meta_data->>'phone_normalized',''),'user','active',case when v_accepted then '1.0' end,case when v_accepted then now() end) on conflict(id) do nothing;
 if v_accepted then insert into public.user_agreement_acceptances(user_id,agreement_version,agreement_document_hash,context,user_agent)
 values(new.id,'1.0','sha256:67d8b68ef2cd7703032c066659320644f79280579788880e8cddd2c495526b30','registration',null); end if;
 return new;
end $$;
revoke all on function public.handle_new_user() from public,anon,authenticated;
