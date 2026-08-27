-- RENTOURA.LK Phase 1: forward-only live reconciliation and security hardening.

alter table public.profiles
  add column if not exists display_name text,
  add column if not exists bio text,
  add column if not exists avatar_url text,
  add column if not exists preferred_language text default 'English',
  add column if not exists email_notifications boolean default true,
  add column if not exists push_notifications boolean default true,
  add column if not exists province_id uuid,
  add column if not exists district_id uuid,
  add column if not exists city_id uuid,
  add column if not exists area_id uuid;

create table if not exists public.user_agreement_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  agreement_version text not null,
  agreement_document_hash text not null,
  context text not null check (context in ('registration','post_listing','first_contact_action','material_version_update')),
  accepted_at timestamptz not null default now(),
  user_agent text,
  created_at timestamptz not null default now()
);
create index if not exists user_agreement_acceptances_user_version_idx
  on public.user_agreement_acceptances(user_id, agreement_version, accepted_at desc);
alter table public.user_agreement_acceptances enable row level security;
drop policy if exists "Users read own agreement acceptances" on public.user_agreement_acceptances;
create policy "Users read own agreement acceptances" on public.user_agreement_acceptances
  for select to authenticated using (user_id = (select auth.uid()));
revoke all on public.user_agreement_acceptances from anon, authenticated;
grant select on public.user_agreement_acceptances to authenticated;

create or replace function public.record_user_agreement_acceptance(
  p_context text,
  p_user_agent text default null
) returns public.user_agreement_acceptances
language plpgsql security definer set search_path = pg_catalog, public as $$
declare v_row public.user_agreement_acceptances;
begin
  if auth.uid() is null then raise exception using errcode='42501', message='Authentication required'; end if;
  if p_context not in ('registration','post_listing','first_contact_action','material_version_update') then
    raise exception using errcode='22023', message='Invalid agreement acceptance context';
  end if;
  insert into public.user_agreement_acceptances
    (user_id, agreement_version, agreement_document_hash, context, user_agent)
  values
    (auth.uid(), '1.0', 'sha256:rentoura-user-agreement-v1.0', p_context, left(nullif(p_user_agent,''), 1000))
  returning * into v_row;
  update public.profiles set agreement_version='1.0', agreement_accepted_at=v_row.accepted_at, updated_at=now()
    where id=auth.uid();
  if not found then raise exception using errcode='P0002', message='Profile not found'; end if;
  return v_row;
end $$;
revoke all on function public.record_user_agreement_acceptance(text,text) from public, anon;
grant execute on function public.record_user_agreement_acceptance(text,text) to authenticated;

create or replace function public.complete_marketplace_profile(
  p_full_name text, p_phone text, p_accept_agreement boolean default false, p_user_agent text default null
) returns public.profiles
language plpgsql security definer set search_path = pg_catalog, public as $$
declare v_name text := nullif(btrim(p_full_name),''); v_phone text; v_profile public.profiles;
begin
  if auth.uid() is null then raise exception using errcode='42501', message='Authentication required'; end if;
  if v_name is null or length(v_name) < 2 then raise exception using errcode='22023', message='Full name is required'; end if;
  v_phone := regexp_replace(coalesce(p_phone,''), '[^0-9+]', '', 'g');
  if v_phone ~ '^07(0|1|2|4|5|6|7|8)[0-9]{7}$' then v_phone := '+94' || substring(v_phone from 2);
  elsif v_phone ~ '^\+947(0|1|2|4|5|6|7|8)[0-9]{7}$' then null;
  else raise exception using errcode='22023', message='Enter a valid Sri Lankan mobile number'; end if;
  update public.profiles set full_name=v_name, display_name=coalesce(nullif(display_name,''),v_name),
    phone_normalized=v_phone, updated_at=now() where id=auth.uid() returning * into v_profile;
  if not found then raise exception using errcode='P0002', message='Profile not found'; end if;
  if p_accept_agreement then perform public.record_user_agreement_acceptance('material_version_update',p_user_agent); end if;
  select * into v_profile from public.profiles where id=auth.uid();
  return v_profile;
end $$;
revoke all on function public.complete_marketplace_profile(text,text,boolean,text) from public, anon;
grant execute on function public.complete_marketplace_profile(text,text,boolean,text) to authenticated;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path=pg_catalog,public as $$
declare v_accepted boolean := new.raw_user_meta_data->>'agreement_accepted'='true';
begin
  insert into public.profiles(id,full_name,email,phone_normalized,role,account_status,agreement_version,agreement_accepted_at)
  values(new.id,coalesce(new.raw_user_meta_data->>'full_name',new.raw_user_meta_data->>'name',''),coalesce(new.email,''),
    nullif(new.raw_user_meta_data->>'phone_normalized',''),'user','active',case when v_accepted then '1.0' end,case when v_accepted then now() end)
  on conflict(id) do nothing;
  if v_accepted then
    insert into public.user_agreement_acceptances(user_id,agreement_version,agreement_document_hash,context,user_agent)
    values(new.id,'1.0','sha256:rentoura-user-agreement-v1.0','registration',null);
  end if;
  return new;
end $$;
revoke all on function public.handle_new_user() from public,anon,authenticated;

-- Normal clients receive only safe profile update columns; role/status remain trigger protected.
revoke update on public.profiles from authenticated;
grant update (full_name, display_name, phone_normalized, bio, avatar_url, preferred_language,
  email_notifications, push_notifications, province_id, district_id, city_id, area_id, agreement_version, agreement_accepted_at, updated_at)
  on public.profiles to authenticated;

-- Owner-only listing mutations. Staff moderation is exclusively through checked RPCs.
drop policy if exists "Authenticated can insert permitted listings" on public.listings;
drop policy if exists "Authenticated can update permitted listings" on public.listings;
drop policy if exists "Authenticated can delete permitted listings" on public.listings;
create policy "Owners insert safe listings" on public.listings for insert to authenticated
  with check (owner_id=(select auth.uid()) and status in ('draft','pending') and is_featured=false and published_at is null);
create policy "Owners update safe listing states" on public.listings for update to authenticated
  using (owner_id=(select auth.uid()) and status in ('draft','pending','changes_requested'))
  with check (owner_id=(select auth.uid()) and status in ('draft','pending','changes_requested') and is_featured=false and published_at is null);
create policy "Owners delete safe listing states" on public.listings for delete to authenticated
  using (owner_id=(select auth.uid()) and status in ('draft','pending','changes_requested','rejected'));

drop policy if exists "Authenticated can insert permitted listing media" on public.listing_media;
drop policy if exists "Authenticated can update permitted listing media" on public.listing_media;
drop policy if exists "Authenticated can delete permitted listing media" on public.listing_media;
create policy "Owners insert listing media" on public.listing_media for insert to authenticated with check
  (exists(select 1 from public.listings l where l.id=listing_id and l.owner_id=(select auth.uid()) and l.status in ('draft','pending','changes_requested')));
create policy "Owners update listing media" on public.listing_media for update to authenticated using
  (exists(select 1 from public.listings l where l.id=listing_id and l.owner_id=(select auth.uid()) and l.status in ('draft','pending','changes_requested')))
  with check (exists(select 1 from public.listings l where l.id=listing_id and l.owner_id=(select auth.uid()) and l.status in ('draft','pending','changes_requested')));
create policy "Owners delete listing media" on public.listing_media for delete to authenticated using
  (exists(select 1 from public.listings l where l.id=listing_id and l.owner_id=(select auth.uid()) and l.status in ('draft','pending','changes_requested','rejected')));

-- Recreate saved-listing active-account guards with ownership included as defense in depth.
drop policy if exists "Active accounts can insert saved listings" on public.saved_listings;
drop policy if exists "Active accounts can delete saved listings" on public.saved_listings;
create policy "Active accounts insert own saved listings" on public.saved_listings as restrictive for insert to authenticated
  with check (user_id=(select auth.uid()) and public.is_account_active((select auth.uid())));
create policy "Active accounts delete own saved listings" on public.saved_listings as restrictive for delete to authenticated
  using (user_id=(select auth.uid()) and public.is_account_active((select auth.uid())));

-- Privileged RPC hygiene. Authenticated is the API caller; each function checks DB profile role/status.
alter function public.get_popular_locations(integer,integer) security invoker set search_path=pg_catalog,public;
revoke all on function public.get_popular_locations(integer,integer) from public;
grant execute on function public.get_popular_locations(integer,integer) to anon,authenticated;

-- Missing live feature foundations (safe, owner-scoped policies).
create table if not exists public.job_applications (
 id uuid primary key default gen_random_uuid(), job_listing_id uuid not null references public.listings(id) on delete cascade,
 applicant_id uuid not null references public.profiles(id) on delete cascade, applicant_name text, contact_phone text,
 contact_email text, cover_note text, resume_url text, status text not null default 'submitted' check(status in('submitted','viewed','shortlisted','rejected','withdrawn')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(job_listing_id,applicant_id));
alter table public.job_applications enable row level security;
create policy "Application parties read" on public.job_applications for select to authenticated using
 (applicant_id=(select auth.uid()) or exists(select 1 from public.listings l where l.id=job_listing_id and l.owner_id=(select auth.uid())));
create policy "Applicants submit" on public.job_applications for insert to authenticated with check
 (applicant_id=(select auth.uid()) and status='submitted' and exists(select 1 from public.listings l where l.id=job_listing_id and l.module='job' and l.status='active' and l.owner_id<>(select auth.uid())));
grant select,insert,update on public.job_applications to authenticated;

create table if not exists public.service_inquiries (
 id uuid primary key default gen_random_uuid(), service_listing_id uuid not null references public.listings(id) on delete cascade,
 sender_id uuid not null references public.profiles(id) on delete cascade, sender_name text, sender_phone text, sender_email text,
 preferred_date date, inquiry_details text not null, status text not null default 'pending' check(status in('pending','read','replied','closed','cancelled')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now());
alter table public.service_inquiries enable row level security;
create policy "Inquiry parties read" on public.service_inquiries for select to authenticated using
 (sender_id=(select auth.uid()) or exists(select 1 from public.listings l where l.id=service_listing_id and l.owner_id=(select auth.uid())));
create policy "Senders submit inquiries" on public.service_inquiries for insert to authenticated with check
 (sender_id=(select auth.uid()) and status='pending' and exists(select 1 from public.listings l where l.id=service_listing_id and l.module='service' and l.status='active' and l.owner_id<>(select auth.uid())));
grant select,insert,update on public.service_inquiries to authenticated;

create table if not exists public.conversations (id uuid primary key default gen_random_uuid(), listing_id uuid references public.listings(id) on delete set null, created_by uuid references auth.users(id) on delete set null, last_message_at timestamptz default now(), status text default 'active', created_at timestamptz default now());
create table if not exists public.conversation_participants (conversation_id uuid references public.conversations(id) on delete cascade, user_id uuid references auth.users(id) on delete cascade, role text default 'participant', last_read_at timestamptz default now(), is_muted boolean default false, is_archived boolean default false, primary key(conversation_id,user_id));
create table if not exists public.messages (id uuid primary key default gen_random_uuid(), conversation_id uuid references public.conversations(id) on delete cascade, sender_id uuid references auth.users(id) on delete set null, body text not null, type text default 'text', created_at timestamptz default now(), edited_at timestamptz, deleted_at timestamptz);
alter table public.conversations enable row level security; alter table public.conversation_participants enable row level security; alter table public.messages enable row level security;
create policy "Participants read conversations" on public.conversations for select to authenticated using(exists(select 1 from public.conversation_participants cp where cp.conversation_id=id and cp.user_id=(select auth.uid())));
create policy "Users create conversations" on public.conversations for insert to authenticated with check(created_by=(select auth.uid()));
create policy "Participants read participant rows" on public.conversation_participants for select to authenticated using(exists(select 1 from public.conversation_participants mine where mine.conversation_id=conversation_id and mine.user_id=(select auth.uid())));
create policy "Creators add participants" on public.conversation_participants for insert to authenticated with check(exists(select 1 from public.conversations c where c.id=conversation_id and c.created_by=(select auth.uid())));
create policy "Users update own participant row" on public.conversation_participants for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
create policy "Participants read messages" on public.messages for select to authenticated using(exists(select 1 from public.conversation_participants cp where cp.conversation_id=conversation_id and cp.user_id=(select auth.uid())));
create policy "Participants send messages" on public.messages for insert to authenticated with check(sender_id=(select auth.uid()) and exists(select 1 from public.conversation_participants cp where cp.conversation_id=conversation_id and cp.user_id=(select auth.uid())));
grant select,insert,update on public.conversations,public.conversation_participants,public.messages to authenticated;

create table if not exists public.notification_preferences (user_id uuid primary key references auth.users(id) on delete cascade, messages boolean not null default true, listing_updates boolean not null default true, job_updates boolean not null default true, service_updates boolean not null default true, reviews boolean not null default true, system_announcements boolean not null default true, promotions boolean not null default true, updated_at timestamptz not null default now());
alter table public.notification_preferences enable row level security;
create policy "Users manage own notification preferences" on public.notification_preferences for all to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
grant select,insert,update on public.notification_preferences to authenticated;

create table if not exists public.support_tickets (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null, contact_email text not null, contact_phone text, category text not null default 'general', subject text not null, message text not null, status text not null default 'open' check(status in('open','in_progress','resolved','closed')), source text default 'help_center', created_at timestamptz not null default now(), updated_at timestamptz not null default now());
alter table public.support_tickets enable row level security;
create policy "Submit support ticket" on public.support_tickets for insert to anon,authenticated with check((select auth.uid()) is null and user_id is null or user_id=(select auth.uid()));
create policy "Users read own support tickets" on public.support_tickets for select to authenticated using(user_id=(select auth.uid()));
grant insert on public.support_tickets to anon,authenticated; grant select on public.support_tickets to authenticated;

create table if not exists public.announcements (id uuid primary key default gen_random_uuid(), title text not null, message text not null, target_module text not null default 'all', priority text not null default 'normal', is_active boolean not null default true, created_by text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
alter table public.announcements enable row level security;
create policy "Public reads active announcements" on public.announcements for select to anon,authenticated using(is_active=true);
grant select on public.announcements to anon,authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
 ('avatars','avatars',true,5242880,array['image/jpeg','image/png','image/webp']),
 ('chat-attachments','chat-attachments',false,5242880,array['image/jpeg','image/png','image/webp','image/gif','application/pdf']),
 ('site-assets','site-assets',true,5242880,array['image/jpeg','image/png','image/webp']) on conflict(id) do nothing;
create policy "Public avatar and site asset read" on storage.objects for select to anon,authenticated using(bucket_id in('avatars','site-assets'));
create policy "Owners upload avatars" on storage.objects for insert to authenticated with check(bucket_id='avatars' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "Owners update avatars" on storage.objects for update to authenticated using(bucket_id='avatars' and (storage.foldername(name))[1]=(select auth.uid())::text) with check(bucket_id='avatars' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "Owners delete avatars" on storage.objects for delete to authenticated using(bucket_id='avatars' and (storage.foldername(name))[1]=(select auth.uid())::text);

-- Ensure all named privileged routines have no implicit PUBLIC/anon execution.
revoke all on function public.moderate_listing(uuid,text,text) from public,anon;
revoke all on function public.admin_change_user_status(uuid,text,text) from public,anon;
revoke all on function public.admin_manage_category(text,uuid,jsonb) from public,anon;
revoke all on function public.admin_manage_location(text,uuid,jsonb) from public,anon;
revoke all on function public.admin_moderate_report(uuid,text,text,uuid,text,text,text) from public,anon;
revoke all on function public.admin_moderate_review(uuid,text,text) from public,anon;
revoke all on function public.admin_reorder_category(uuid,text) from public,anon;
revoke all on function public.admin_user_directory(text,text,integer,integer) from public,anon;
revoke all on function public.super_admin_change_staff_role(uuid,text,text) from public,anon;
