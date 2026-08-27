create table if not exists public.reviews (
 id uuid primary key default gen_random_uuid(), listing_id uuid not null references public.listings(id) on delete cascade,
 author_id uuid not null references public.profiles(id) on delete cascade, rating smallint not null check(rating between 1 and 5),
 title text, body text not null check(char_length(btrim(body)) between 3 and 4000), subratings jsonb not null default '{}'::jsonb,
 status text not null default 'pending_moderation' check(status in('pending_moderation','published','removed')),
 moderation_reason text, moderated_by uuid references public.profiles(id), moderated_at timestamptz,
 owner_reply text, owner_reply_at timestamptz, helpful_count integer not null default 0, helpful_user_ids uuid[] not null default '{}',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(listing_id,author_id)
);
create index if not exists reviews_listing_status_idx on public.reviews(listing_id,status,created_at desc);
create index if not exists reviews_author_idx on public.reviews(author_id,created_at desc);
alter table public.reviews enable row level security;
drop policy if exists "Published reviews or own review readable" on public.reviews;
create policy "Published reviews or own review readable" on public.reviews for select to authenticated using(status='published' or author_id=(select auth.uid()) or public.is_staff((select auth.uid())));
drop policy if exists "Published reviews readable publicly" on public.reviews;
create policy "Published reviews readable publicly" on public.reviews for select to anon using(status='published');
drop policy if exists "Active users submit pending reviews" on public.reviews;
create policy "Active users submit pending reviews" on public.reviews for insert to authenticated with check(author_id=(select auth.uid()) and status='pending_moderation' and exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.account_status='active'));
drop policy if exists "Authors update pending reviews" on public.reviews;
create policy "Authors update pending reviews" on public.reviews for update to authenticated using(author_id=(select auth.uid()) and status='pending_moderation') with check(author_id=(select auth.uid()) and status='pending_moderation');
drop policy if exists "Authors delete pending reviews" on public.reviews;
create policy "Authors delete pending reviews" on public.reviews for delete to authenticated using(author_id=(select auth.uid()) and status='pending_moderation');

create table if not exists public.report_internal_notes (
 id uuid primary key default gen_random_uuid(), report_id uuid not null references public.reports(id) on delete cascade,
 actor_id uuid not null references public.profiles(id), note text not null check(char_length(btrim(note)) between 2 and 4000), created_at timestamptz not null default now()
);
alter table public.report_internal_notes enable row level security;
drop policy if exists "Staff read report internal notes" on public.report_internal_notes;
create policy "Staff read report internal notes" on public.report_internal_notes for select to authenticated using(public.is_staff((select auth.uid())));
revoke insert,update,delete on public.reports,public.reviews,public.report_internal_notes from anon,authenticated;
grant insert on public.reports to anon,authenticated;
grant execute on function public.is_account_active(uuid) to authenticated;
grant insert,update,delete on public.reviews to authenticated;
grant select on public.reviews to anon,authenticated;
grant select on public.report_internal_notes to authenticated;

create or replace function public.admin_moderate_report(p_report_id uuid,p_action text,p_note text default null,p_assignee uuid default null,p_outcome text default null,p_user_message text default null,p_linked_action text default null)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public as $$
declare a public.profiles%rowtype;r public.reports%rowtype; target_owner uuid; review_author uuid;
begin
 select * into a from public.profiles where id=auth.uid(); if not found or a.account_status<>'active' or a.role not in('moderator','admin','super_admin') then raise exception using errcode='42501',message='Staff authorization required'; end if;
 select * into r from public.reports where id=p_report_id for update; if not found then raise exception using errcode='P0002',message='Report not found'; end if;
 if p_action='note' then if nullif(btrim(p_note),'') is null then raise exception using errcode='22023',message='Internal note is required'; end if; insert into public.report_internal_notes(report_id,actor_id,note) values(r.id,a.id,btrim(p_note));
 elsif p_action='assign' then update public.reports set assigned_to=coalesce(p_assignee,a.id),status='under_review',status_note='Assigned for staff review',updated_at=now() where id=r.id;
 elsif p_action='under_review' then update public.reports set assigned_to=coalesce(p_assignee,a.id),status='under_review',status_note=coalesce(nullif(btrim(p_note),''),'Under staff review'),updated_at=now() where id=r.id;
 elsif p_action in('resolve','dismiss') then
  if nullif(btrim(p_note),'') is null or nullif(btrim(p_outcome),'') is null then raise exception using errcode='22023',message='Resolution note and outcome are required'; end if;
  update public.reports set status=case when p_action='resolve' then 'resolved' else 'dismissed' end,status_note=btrim(p_note),resolution_outcome=btrim(p_outcome),user_facing_message=nullif(btrim(p_user_message),''),assigned_to=coalesce(assigned_to,a.id),updated_at=now() where id=r.id;
  if r.reporter_id is not null then insert into public.notifications(user_id,type,category,title,body,entity_type,entity_id,dedupe_key) values(r.reporter_id,'REPORT_UPDATE','system','Report updated',coalesce(nullif(btrim(p_user_message),''),'Your report has been reviewed.'),'report',r.id::text,'report-resolution-'||r.id::text); end if;
 else raise exception using errcode='22023',message='Invalid report action'; end if;
 if p_linked_action is not null then
  if nullif(btrim(p_note),'') is null then raise exception using errcode='22023',message='Linked moderation requires a reason'; end if;
  if p_linked_action='remove_listing' and r.listing_id is not null then update public.listings set status='paused',updated_at=now() where id=r.listing_id and status='active' returning owner_id into target_owner;
  elsif p_linked_action='remove_review' and r.review_id is not null then update public.reviews set status='removed',moderation_reason=p_note,moderated_by=a.id,moderated_at=now(),updated_at=now() where id=r.review_id::uuid returning author_id into review_author;
  elsif p_linked_action='restrict_user' and r.target_user_id is not null then if a.role not in('admin','super_admin') then raise exception using errcode='42501',message='Only admins may restrict users'; end if; perform public.admin_change_user_status(r.target_user_id,'restricted',p_note);
  else raise exception using errcode='22023',message='Linked action does not match report target'; end if;
 end if;
 insert into public.audit_logs(actor_id,actor_name,actor_role,action,target_type,target_id,target_title,details,metadata) values(a.id,coalesce(nullif(a.full_name,''),a.email),a.role,'REPORT_'||upper(p_action),'report',r.id::text,r.target_title,coalesce(p_note,p_outcome,p_action),jsonb_build_object('outcome',p_outcome,'linked_action',p_linked_action));
 return jsonb_build_object('id',r.id,'action',p_action);
end $$;
revoke all on function public.admin_moderate_report(uuid,text,text,uuid,text,text,text) from public,anon;
grant execute on function public.admin_moderate_report(uuid,text,text,uuid,text,text,text) to authenticated;

create or replace function public.admin_moderate_review(p_review_id uuid,p_status text,p_reason text)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public as $$
declare a public.profiles%rowtype;r public.reviews%rowtype;
begin
 select * into a from public.profiles where id=auth.uid(); if not found or a.account_status<>'active' or a.role not in('moderator','admin','super_admin') then raise exception using errcode='42501',message='Staff authorization required'; end if;
 if p_status not in('pending_moderation','published','removed') or nullif(btrim(p_reason),'') is null then raise exception using errcode='22023',message='Valid status and moderation reason are required'; end if;
 update public.reviews set status=p_status,moderation_reason=btrim(p_reason),moderated_by=a.id,moderated_at=now(),updated_at=now() where id=p_review_id returning * into r; if not found then raise exception using errcode='P0002',message='Review not found'; end if;
 insert into public.notifications(user_id,type,category,title,body,entity_type,entity_id,dedupe_key) values(r.author_id,'SYSTEM_UPDATE','system','Review moderation update','Your review status is now '||replace(p_status,'_',' ')||'.','review',r.id::text,'review-moderation-'||r.id::text||'-'||p_status);
 insert into public.audit_logs(actor_id,actor_name,actor_role,action,target_type,target_id,target_title,details,metadata) values(a.id,coalesce(nullif(a.full_name,''),a.email),a.role,'REVIEW_'||upper(p_status),'review',r.id::text,'Review',p_reason,jsonb_build_object('status',p_status));
 return jsonb_build_object('id',r.id,'status',r.status);
end $$;
revoke all on function public.admin_moderate_review(uuid,text,text) from public,anon;
grant execute on function public.admin_moderate_review(uuid,text,text) to authenticated;

create or replace function public.get_published_review_summary(p_listing_id uuid)
returns table(average_rating numeric,total_count bigint,rating smallint,rating_count bigint) language sql stable security invoker set search_path=pg_catalog,public as $$
 with x as(select rating from public.reviews where listing_id=p_listing_id and status='published'), agg as(select round(avg(rating),2) average_rating,count(*) total_count from x), dist as(select g::smallint rating,count(x.rating) rating_count from generate_series(1,5)g left join x on x.rating=g group by g)
 select coalesce(agg.average_rating,0),agg.total_count,dist.rating,dist.rating_count from agg cross join dist order by dist.rating desc
$$;
grant execute on function public.get_published_review_summary(uuid) to anon,authenticated;
do $$ begin if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='reviews') then alter publication supabase_realtime add table public.reviews; end if; end $$;
