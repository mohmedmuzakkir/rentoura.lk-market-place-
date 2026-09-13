-- Auto-Approve and Editable Listings Migration
-- This migration updates RLS policies to allow normal users to manage 'active' listings.
-- It removes the strict requirement that status must be 'draft' or 'pending' for edits,
-- allowing users to edit active listings and keeping them active without requiring staff approval.

-- 1. Update public.listings policies
drop policy if exists "Active owners insert safe listings" on public.listings;
create policy "Active owners insert safe listings"
on public.listings for insert to authenticated
with check (
  owner_id = (select auth.uid())
  and public.is_account_active((select auth.uid()))
  and status in ('draft', 'pending', 'active')
  and is_featured = false
);

drop policy if exists "Active owners update editable listings" on public.listings;
create policy "Active owners update editable listings"
on public.listings for update to authenticated
using (
  owner_id = (select auth.uid())
  and public.is_account_active((select auth.uid()))
  and status in ('draft', 'pending', 'changes_requested', 'active', 'paused', 'expired')
)
with check (
  owner_id = (select auth.uid())
  and public.is_account_active((select auth.uid()))
  and status in ('draft', 'pending', 'changes_requested', 'active', 'paused', 'expired')
  and is_featured = false
);

drop policy if exists "Active owners delete deletable listings" on public.listings;
create policy "Active owners delete deletable listings"
on public.listings for delete to authenticated
using (
  owner_id = (select auth.uid())
  and public.is_account_active((select auth.uid()))
  and status in ('draft', 'pending', 'changes_requested', 'rejected', 'active', 'paused', 'expired')
);


-- 2. Update public.listing_media policies
drop policy if exists "Active owners insert editable listing media" on public.listing_media;
create policy "Active owners insert editable listing media"
on public.listing_media for insert to authenticated
with check (
  public.is_account_active((select auth.uid()))
  and exists (
    select 1 from public.listings listing
    where listing.id = listing_media.listing_id
      and listing.owner_id = (select auth.uid())
      and listing.status in ('draft', 'pending', 'changes_requested', 'active', 'paused', 'expired')
  )
);

drop policy if exists "Active owners update editable listing media" on public.listing_media;
create policy "Active owners update editable listing media"
on public.listing_media for update to authenticated
using (
  public.is_account_active((select auth.uid()))
  and exists (
    select 1 from public.listings listing
    where listing.id = listing_media.listing_id
      and listing.owner_id = (select auth.uid())
      and listing.status in ('draft', 'pending', 'changes_requested', 'active', 'paused', 'expired')
  )
)
with check (
  public.is_account_active((select auth.uid()))
  and exists (
    select 1 from public.listings listing
    where listing.id = listing_media.listing_id
      and listing.owner_id = (select auth.uid())
      and listing.status in ('draft', 'pending', 'changes_requested', 'active', 'paused', 'expired')
  )
);

drop policy if exists "Active owners delete deletable listing media" on public.listing_media;
create policy "Active owners delete deletable listing media"
on public.listing_media for delete to authenticated
using (
  public.is_account_active((select auth.uid()))
  and exists (
    select 1 from public.listings listing
    where listing.id = listing_media.listing_id
      and listing.owner_id = (select auth.uid())
      and listing.status in ('draft', 'pending', 'changes_requested', 'rejected', 'active', 'paused', 'expired')
  )
);


-- 3. Update storage.objects for listing-images
drop policy if exists "Authenticated can upload permitted listing images" on storage.objects;
create policy "Authenticated can upload permitted listing images" on storage.objects for insert to authenticated
with check (
  bucket_id = 'listing-images'
  and (
    public.is_staff((select auth.uid()))
    or (
      public.is_account_active((select auth.uid()))
      and (storage.foldername(name))[1] = (select auth.uid())::text
      and exists (
        select 1 from public.listings listing
        where listing.id::text = (storage.foldername(name))[2]
          and listing.owner_id = (select auth.uid())
          and listing.status in ('draft', 'pending', 'changes_requested', 'active', 'paused', 'expired')
      )
    )
  )
);

drop policy if exists "Authenticated can update permitted listing images" on storage.objects;
create policy "Authenticated can update permitted listing images" on storage.objects for update to authenticated
using (
  bucket_id = 'listing-images'
  and (
    public.is_staff((select auth.uid()))
    or (
      public.is_account_active((select auth.uid()))
      and (storage.foldername(name))[1] = (select auth.uid())::text
      and exists (
        select 1 from public.listings listing
        where listing.id::text = (storage.foldername(name))[2]
          and listing.owner_id = (select auth.uid())
          and listing.status in ('draft', 'pending', 'changes_requested', 'active', 'paused', 'expired')
      )
    )
  )
)
with check (
  bucket_id = 'listing-images'
  and (
    public.is_staff((select auth.uid()))
    or (
      public.is_account_active((select auth.uid()))
      and (storage.foldername(name))[1] = (select auth.uid())::text
      and exists (
        select 1 from public.listings listing
        where listing.id::text = (storage.foldername(name))[2]
          and listing.owner_id = (select auth.uid())
          and listing.status in ('draft', 'pending', 'changes_requested', 'active', 'paused', 'expired')
      )
    )
  )
);

drop policy if exists "Authenticated can delete permitted listing images" on storage.objects;
create policy "Authenticated can delete permitted listing images" on storage.objects for delete to authenticated
using (
  bucket_id = 'listing-images'
  and (
    public.is_staff((select auth.uid()))
    or (
      public.is_account_active((select auth.uid()))
      and (storage.foldername(name))[1] = (select auth.uid())::text
      and exists (
        select 1 from public.listings listing
        where listing.id::text = (storage.foldername(name))[2]
          and listing.owner_id = (select auth.uid())
          and listing.status in ('draft', 'pending', 'changes_requested', 'rejected', 'active', 'paused', 'expired')
      )
    )
  )
);
