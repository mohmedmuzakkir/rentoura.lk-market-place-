-- Fix admin_user_directory to handle account_status enum comparison correctly
create or replace function public.admin_user_directory(
  p_search text default null,
  p_status text default null,
  p_page integer default 1,
  p_page_size integer default 20
)
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  v_actor public.profiles%rowtype;
  v_page integer := greatest(coalesce(p_page, 1), 1);
  v_size integer := least(greatest(coalesce(p_page_size, 20), 1), 100);
  v_search text := nullif(btrim(coalesce(p_search, '')), '');
  v_status text := nullif(btrim(coalesce(p_status, '')), '');
  v_total bigint;
  v_rows jsonb;
  v_counts jsonb;
begin
  select * into v_actor from public.profiles where id = auth.uid();
  if not found or v_actor.account_status::text <> 'active' or v_actor.role not in ('moderator','admin','super_admin') then
    raise exception using errcode='42501', message='Staff authorization required';
  end if;
  if v_status is not null and v_status not in ('active','restricted','suspended','banned') then
    raise exception using errcode='22023', message='Invalid account status filter';
  end if;

  select count(*) into v_total
  from public.profiles p
  where (v_status is null or p.account_status::text = v_status)
    and (v_search is null or p.full_name ilike '%' || v_search || '%' or p.email ilike '%' || v_search || '%'
         or coalesce(p.phone_normalized, '') ilike '%' || v_search || '%' or p.id::text = v_search);

  select coalesce(jsonb_agg(to_jsonb(x) order by x.created_at desc), '[]'::jsonb) into v_rows
  from (
    select p.id, p.full_name, p.email, p.phone_normalized, p.role, p.account_status,
           p.created_at, p.updated_at,
           coalesce(l.listing_count, 0)::integer as listing_count,
           coalesce(r.report_count, 0)::integer as report_count
    from public.profiles p
    left join lateral (select count(*) listing_count from public.listings l where l.owner_id = p.id) l on true
    left join lateral (select count(*) report_count from public.reports r where r.target_user_id = p.id or r.reporter_id = p.id) r on true
    where (v_status is null or p.account_status::text = v_status)
      and (v_search is null or p.full_name ilike '%' || v_search || '%' or p.email ilike '%' || v_search || '%'
           or coalesce(p.phone_normalized, '') ilike '%' || v_search || '%' or p.id::text = v_search)
    order by p.created_at desc
    offset (v_page - 1) * v_size
    limit v_size
  ) x;

  select jsonb_build_object(
    'total', count(*),
    'active', count(*) filter (where account_status::text = 'active'),
    'restricted', count(*) filter (where account_status::text = 'restricted'),
    'suspended', count(*) filter (where account_status::text = 'suspended'),
    'banned', count(*) filter (where account_status::text = 'banned')
  ) into v_counts
  from public.profiles;

  return jsonb_build_object(
    'users', v_rows,
    'total', v_total,
    'page', v_page,
    'page_size', v_size,
    'status_counts', v_counts
  );
end;
$$;
