-- Phase 4 follow-up: slide management is an Admin/Super Admin capability.
-- Public delivery of active hero slides and site assets remains unchanged.

create or replace function public.is_admin_or_super_admin(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = p_user_id
      and p.account_status = 'active'
      and p.role in ('admin', 'super_admin')
  );
$$;

revoke all on function public.is_admin_or_super_admin(uuid) from public, anon;
grant execute on function public.is_admin_or_super_admin(uuid) to authenticated;

drop policy if exists "Authenticated can read permitted home slides" on public.home_slides;
drop policy if exists "Staff can insert home slides" on public.home_slides;
drop policy if exists "Staff can update home slides" on public.home_slides;
drop policy if exists "Staff can delete home slides" on public.home_slides;

create policy "Authenticated can read permitted home slides"
on public.home_slides for select to authenticated
using (
  is_active = true
  or public.is_admin_or_super_admin((select auth.uid()))
);

create policy "Admins can insert home slides"
on public.home_slides for insert to authenticated
with check (public.is_admin_or_super_admin((select auth.uid())));

create policy "Admins can update home slides"
on public.home_slides for update to authenticated
using (public.is_admin_or_super_admin((select auth.uid())))
with check (public.is_admin_or_super_admin((select auth.uid())));

create policy "Admins can delete home slides"
on public.home_slides for delete to authenticated
using (public.is_admin_or_super_admin((select auth.uid())));

drop policy if exists "Staff upload site assets" on storage.objects;
drop policy if exists "Staff update site assets" on storage.objects;
drop policy if exists "Staff delete site assets" on storage.objects;

create policy "Admins upload site assets"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'site-assets'
  and public.is_admin_or_super_admin((select auth.uid()))
);

create policy "Admins update site assets"
on storage.objects for update to authenticated
using (
  bucket_id = 'site-assets'
  and public.is_admin_or_super_admin((select auth.uid()))
)
with check (
  bucket_id = 'site-assets'
  and public.is_admin_or_super_admin((select auth.uid()))
);

create policy "Admins delete site assets"
on storage.objects for delete to authenticated
using (
  bucket_id = 'site-assets'
  and public.is_admin_or_super_admin((select auth.uid()))
);
