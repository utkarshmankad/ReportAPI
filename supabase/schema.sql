-- Sprint 1 schema: profiles, api_keys, reports
-- Applied via `supabase db push` once a project is linked.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  plan text not null default 'starter' check (plan in ('starter', 'growth', 'enterprise')),
  stripe_customer_id text unique,
  stripe_subscription_id text,
  subscription_status text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using ( (select auth.uid()) = id );

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using ( (select auth.uid()) = id )
  with check ( (select auth.uid()) = id );

-- auto-create a profile row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  key_hash text not null unique,
  key_prefix text not null,
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

alter table public.api_keys enable row level security;

create policy "api_keys_select_own"
  on public.api_keys for select
  to authenticated
  using ( (select auth.uid()) = user_id );

create policy "api_keys_insert_own"
  on public.api_keys for insert
  to authenticated
  with check ( (select auth.uid()) = user_id );

create policy "api_keys_update_own"
  on public.api_keys for update
  to authenticated
  using ( (select auth.uid()) = user_id )
  with check ( (select auth.uid()) = user_id );

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  input_summary text,
  output text,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed')),
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

create policy "reports_select_own"
  on public.reports for select
  to authenticated
  using ( (select auth.uid()) = user_id );

create policy "reports_insert_own"
  on public.reports for insert
  to authenticated
  with check ( (select auth.uid()) = user_id );

create policy "reports_update_own"
  on public.reports for update
  to authenticated
  using ( (select auth.uid()) = user_id )
  with check ( (select auth.uid()) = user_id );

-- Per-IP daily counter for the unauthenticated demo endpoint. No policies:
-- only the service-role key (used server-side) can read/write this table.
create table if not exists public.demo_usage (
  ip_hash text not null,
  day date not null,
  count int not null default 1,
  primary key (ip_hash, day)
);

alter table public.demo_usage enable row level security;

-- Atomic per-request increment-and-check via ON CONFLICT DO UPDATE, which
-- takes a row lock and is safe under concurrency (a plain count-then-insert
-- is NOT — verified this the hard way after a race-condition finding).
create or replace function public.increment_demo_usage(p_ip_hash text, p_day date, p_limit int)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_count int;
begin
  insert into public.demo_usage (ip_hash, day, count)
  values (p_ip_hash, p_day, 1)
  on conflict (ip_hash, day)
  do update set count = public.demo_usage.count + 1
  returning count into new_count;

  return new_count <= p_limit;
end;
$$;

revoke execute on function public.increment_demo_usage(text, date, int) from public, anon, authenticated;

-- Per-user monthly report quota counter, same atomic ON CONFLICT pattern.
create table if not exists public.usage_counters (
  user_id uuid not null references public.profiles(id) on delete cascade,
  month date not null,
  count int not null default 0,
  primary key (user_id, month)
);

alter table public.usage_counters enable row level security;

create policy "usage_counters_select_own"
  on public.usage_counters for select
  to authenticated
  using ( (select auth.uid()) = user_id );

-- Reserves a report slot atomically: increments the caller's monthly counter
-- and only inserts the pending report row if still under quota. SECURITY
-- DEFINER (bypasses RLS to write usage_counters). Ownership is only checked
-- for session-authenticated callers — service-role calls (the API-key auth
-- path, after we've already validated the key server-side) have no
-- auth.uid() and are trusted by construction.
create or replace function public.reserve_report_slot(p_user_id uuid, p_quota int, p_input_summary text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_count int;
  new_id uuid;
  this_month date := date_trunc('month', now())::date;
begin
  if auth.role() = 'authenticated' and p_user_id != auth.uid() then
    raise exception 'p_user_id must match the authenticated caller';
  end if;

  insert into public.usage_counters (user_id, month, count)
  values (p_user_id, this_month, 1)
  on conflict (user_id, month)
  do update set count = public.usage_counters.count + 1
  returning count into new_count;

  if p_quota is not null and new_count > p_quota then
    update public.usage_counters set count = count - 1 where user_id = p_user_id and month = this_month;
    return null;
  end if;

  insert into public.reports (user_id, input_summary, status)
  values (p_user_id, p_input_summary, 'pending')
  returning id into new_id;

  return new_id;
end;
$$;

grant execute on function public.reserve_report_slot(uuid, int, text) to authenticated;
