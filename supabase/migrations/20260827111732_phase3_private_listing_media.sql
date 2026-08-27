-- Phase 3: listing media is private, owner-scoped, and limited to the client contract.
update storage.buckets
set public = false,
    file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'listing-images';

drop policy if exists "Public listing-images read" on storage.objects;
drop policy if exists "User upload listing-images" on storage.objects;
drop policy if exists "User update listing-images" on storage.objects;
drop policy if exists "User delete listing-images" on storage.objects;
drop policy if exists "Listing media owner read" on storage.objects;
drop policy if exists "Active listing media read" on storage.objects;
drop policy if exists "Listing media owner upload" on storage.objects;
drop policy if exists "Listing media owner update" on storage.objects;
drop policy if exists "Listing media owner delete" on storage.objects;

create policy "Listing media owner read" on storage.objects for select to authenticated
using (bucket_id = 'listing-images' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Active listing media read" on storage.objects for select to anon, authenticated
using (
  bucket_id = 'listing-images'
  and (storage.foldername(name))[2] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and exists (
    select 1 from public.listings listing
    where listing.id = case
      when (storage.foldername(name))[2] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      then ((storage.foldername(name))[2])::uuid
      else null
    end
      and listing.status = 'active'
  )
);

create policy "Listing media owner upload" on storage.objects for insert to authenticated
with check (bucket_id = 'listing-images' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Listing media owner update" on storage.objects for update to authenticated
using (bucket_id = 'listing-images' and (storage.foldername(name))[1] = (select auth.uid())::text)
with check (bucket_id = 'listing-images' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Listing media owner delete" on storage.objects for delete to authenticated
using (bucket_id = 'listing-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
