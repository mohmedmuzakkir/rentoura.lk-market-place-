-- Phase 3 live reconciliation: consolidate ownership, active-account, and state
-- checks into each user mutation policy. Staff policies and moderation RPCs are
-- intentionally left intact.

alter table public.listings enable row level security;
alter table public.listing_media enable row level security;
alter table public.saved_listings enable row level security;

-- Listings: remove legacy permissive and split restrictive policies.
drop policy if exists "Active accounts can insert listings" on public.listings;
drop policy if exists "Active accounts can update listings" on public.listings;
drop policy if exists "Active accounts can delete listings" on public.listings;
drop policy if exists "Authenticated users can create listing" on public.listings;
drop policy if exists "Owners or admins can update listing" on public.listings;
drop policy if exists "Owners or admins can delete listing" on public.listings;
drop policy if exists "Users can insert own listings" on public.listings;
drop policy if exists "Owners can update own listings" on public.listings;
drop policy if exists "Owners can delete own listings" on public.listings;
drop policy if exists "Authenticated can insert permitted listings" on public.listings;
drop policy if exists "Authenticated can update permitted listings" on public.listings;
drop policy if exists "Authenticated can delete permitted listings" on public.listings;
drop policy if exists "Owners insert safe listings" on public.listings;
drop policy if exists "Owners update safe listing states" on public.listings;
drop policy if exists "Owners delete safe listing states" on public.listings;
drop policy if exists "Active owners insert safe listings" on public.listings;
drop policy if exists "Active owners update editable listings" on public.listings;
drop policy if exists "Active owners delete deletable listings" on public.listings;

create policy "Active owners insert safe listings"
on public.listings for insert to authenticated
with check (
  owner_id = (select auth.uid())
  and public.is_account_active((select auth.uid()))
  and status in ('draft', 'pending')
  and is_featured = false
  and published_at is null
);

create policy "Active owners update editable listings"
on public.listings for update to authenticated
using (
  owner_id = (select auth.uid())
  and public.is_account_active((select auth.uid()))
  and status in ('draft', 'pending', 'changes_requested')
)
with check (
  owner_id = (select auth.uid())
  and public.is_account_active((select auth.uid()))
  and status in ('draft', 'pending', 'changes_requested')
  and is_featured = false
  and published_at is null
);

create policy "Active owners delete deletable listings"
on public.listings for delete to authenticated
using (
  owner_id = (select auth.uid())
  and public.is_account_active((select auth.uid()))
  and status in ('draft', 'pending', 'changes_requested', 'rejected')
);

-- Listing media: every user mutation resolves ownership and editable state from
-- the referenced listing in the same predicate.
drop policy if exists "Active accounts can insert listing media" on public.listing_media;
drop policy if exists "Active accounts can update listing media" on public.listing_media;
drop policy if exists "Active accounts can delete listing media" on public.listing_media;
drop policy if exists "Listing media writable by owner or admin" on public.listing_media;
drop policy if exists "Owners can insert media for own listings" on public.listing_media;
drop policy if exists "Owners can update media for own listings" on public.listing_media;
drop policy if exists "Owners can delete media for own listings" on public.listing_media;
drop policy if exists "Authenticated can insert permitted listing media" on public.listing_media;
drop policy if exists "Authenticated can update permitted listing media" on public.listing_media;
drop policy if exists "Authenticated can delete permitted listing media" on public.listing_media;
drop policy if exists "Owners insert listing media" on public.listing_media;
drop policy if exists "Owners update listing media" on public.listing_media;
drop policy if exists "Owners delete listing media" on public.listing_media;
drop policy if exists "Active owners insert editable listing media" on public.listing_media;
drop policy if exists "Active owners update editable listing media" on public.listing_media;
drop policy if exists "Active owners delete deletable listing media" on public.listing_media;

create policy "Active owners insert editable listing media"
on public.listing_media for insert to authenticated
with check (
  public.is_account_active((select auth.uid()))
  and exists (
    select 1 from public.listings listing
    where listing.id = listing_media.listing_id
      and listing.owner_id = (select auth.uid())
      and listing.status in ('draft', 'pending', 'changes_requested')
  )
);

create policy "Active owners update editable listing media"
on public.listing_media for update to authenticated
using (
  public.is_account_active((select auth.uid()))
  and exists (
    select 1 from public.listings listing
    where listing.id = listing_media.listing_id
      and listing.owner_id = (select auth.uid())
      and listing.status in ('draft', 'pending', 'changes_requested')
  )
)
with check (
  public.is_account_active((select auth.uid()))
  and exists (
    select 1 from public.listings listing
    where listing.id = listing_media.listing_id
      and listing.owner_id = (select auth.uid())
      and listing.status in ('draft', 'pending', 'changes_requested')
  )
);

create policy "Active owners delete deletable listing media"
on public.listing_media for delete to authenticated
using (
  public.is_account_active((select auth.uid()))
  and exists (
    select 1 from public.listings listing
    where listing.id = listing_media.listing_id
      and listing.owner_id = (select auth.uid())
      and listing.status in ('draft', 'pending', 'changes_requested', 'rejected')
  )
);

-- Saved listings: retain only same-user mutation policies with the active check
-- in the same predicate.
drop policy if exists "Active accounts can insert saved listings" on public.saved_listings;
drop policy if exists "Active accounts can delete saved listings" on public.saved_listings;
drop policy if exists "Users can save listing" on public.saved_listings;
drop policy if exists "Users can unsave listing" on public.saved_listings;
drop policy if exists "Users can save listings for themselves" on public.saved_listings;
drop policy if exists "Users can remove own saved listings" on public.saved_listings;
drop policy if exists "Users can insert own saved listings" on public.saved_listings;
drop policy if exists "Users can delete own saved listings" on public.saved_listings;
drop policy if exists "Active accounts insert own saved listings" on public.saved_listings;
drop policy if exists "Active accounts delete own saved listings" on public.saved_listings;
drop policy if exists "Active users save listings for themselves" on public.saved_listings;
drop policy if exists "Active users remove own saved listings" on public.saved_listings;

create policy "Active users save listings for themselves"
on public.saved_listings for insert to authenticated
with check (
  user_id = (select auth.uid())
  and public.is_account_active((select auth.uid()))
  and exists (
    select 1 from public.listings listing
    where listing.id = saved_listings.listing_id
      and listing.status = 'active'
  )
);

create policy "Active users remove own saved listings"
on public.saved_listings for delete to authenticated
using (
  user_id = (select auth.uid())
  and public.is_account_active((select auth.uid()))
);

-- Reassert the Phase 3 private bucket contract and owner-scoped object writes.
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
drop policy if exists "Anon can read active listing images" on storage.objects;
drop policy if exists "Authenticated can read permitted listing images" on storage.objects;
drop policy if exists "Authenticated can upload permitted listing images" on storage.objects;
drop policy if exists "Authenticated can update permitted listing images" on storage.objects;
drop policy if exists "Authenticated can delete permitted listing images" on storage.objects;

create policy "Anon can read active listing images" on storage.objects for select to anon
using (
  bucket_id = 'listing-images'
  and exists (
    select 1 from public.listings listing
    where listing.id::text = (storage.foldername(name))[2]
      and listing.owner_id::text = (storage.foldername(name))[1]
      and listing.status = 'active'
  )
);

create policy "Authenticated can read permitted listing images" on storage.objects for select to authenticated
using (
  bucket_id = 'listing-images'
  and (
    public.is_staff((select auth.uid()))
    or (storage.foldername(name))[1] = (select auth.uid())::text
    or exists (
      select 1 from public.listings listing
      where listing.id::text = (storage.foldername(name))[2]
        and listing.owner_id::text = (storage.foldername(name))[1]
        and listing.status = 'active'
    )
  )
);

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
          and listing.status in ('draft', 'pending', 'changes_requested')
      )
    )
  )
);

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
          and listing.status in ('draft', 'pending', 'changes_requested')
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
          and listing.status in ('draft', 'pending', 'changes_requested')
      )
    )
  )
);

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
          and listing.status in ('draft', 'pending', 'changes_requested', 'rejected')
      )
    )
  )
);
