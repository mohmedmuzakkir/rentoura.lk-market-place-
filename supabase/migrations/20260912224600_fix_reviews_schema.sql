-- Fix reviews schema that was skipped due to IF NOT EXISTS
alter table public.reviews
  drop constraint if exists reviews_author_id_fkey,
  add constraint reviews_author_id_fkey foreign key (author_id) references public.profiles(id) on delete cascade,
  add column if not exists moderation_reason text,
  add column if not exists moderated_by uuid references public.profiles(id),
  add column if not exists moderated_at timestamptz,
  drop constraint if exists reviews_listing_id_author_id_key,
  drop constraint if exists unique_listing_author,
  add constraint unique_listing_author unique(listing_id, author_id);

alter table public.reviews
  alter column status set default 'pending_moderation';
