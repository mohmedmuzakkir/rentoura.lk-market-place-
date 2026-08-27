-- Close legacy permissive report submission paths and enforce canonical targets.
drop policy if exists "Authenticated users can submit reports" on public.reports;
drop policy if exists "Active accounts can submit reports" on public.reports;

create policy "Active accounts can submit own reports"
on public.reports for insert to authenticated
with check (
  reporter_id = (select auth.uid())
  and public.is_account_active((select auth.uid()))
  and status = 'submitted'
  and assigned_to is null
  and resolution_outcome is null
  and user_facing_message is null
  and internal_notes = '[]'::jsonb
  and history = '[]'::jsonb
  and (
    (target_type = 'listing' and listing_id is not null and review_id is null and target_user_id is null and message_id is null)
    or (target_type = 'review' and review_id is not null and listing_id is null and target_user_id is null and message_id is null)
    or (target_type = 'user' and target_user_id is not null and listing_id is null and review_id is null and message_id is null)
    or (target_type in ('message', 'conversation') and message_id is not null and listing_id is null and review_id is null and target_user_id is null)
  )
);

drop policy if exists "Anon users can submit reports" on public.reports;
create policy "Anonymous users can submit unowned reports"
on public.reports for insert to anon
with check (
  reporter_id is null
  and status = 'submitted'
  and assigned_to is null
  and resolution_outcome is null
  and user_facing_message is null
  and internal_notes = '[]'::jsonb
  and history = '[]'::jsonb
  and target_type = 'listing'
  and listing_id is not null
  and review_id is null
  and target_user_id is null
  and message_id is null
);

create index if not exists reports_moderation_filters_idx
  on public.reports(status, target_type, target_module, created_at desc);
create index if not exists reports_assignee_created_idx
  on public.reports(assigned_to, created_at desc);
create index if not exists reviews_moderation_filters_idx
  on public.reviews(status, rating, created_at desc);

-- The admin client reads report history from the immutable audit stream. Internal
-- notes remain in their staff-only table and are never copied to reporter rows.
grant select on public.audit_logs to authenticated;

notify pgrst, 'reload schema';
