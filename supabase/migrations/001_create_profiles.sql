-- 001_create_profiles.sql
-- Creates a profiles table linked to auth.users and RLS policies for secure access

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  display_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Public select (change to restrict if you want private profiles)
create policy "Public select" on public.profiles
  for select using (true);

-- Allow authenticated users to insert their own profile (id must equal auth.uid())
create policy "Insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Allow authenticated users to update their own profile
create policy "Update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Allow authenticated users to delete their own profile
create policy "Delete own profile" on public.profiles
  for delete using (auth.uid() = id);

-- Trigger to keep updated_at current
create or replace function public.set_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_timestamp on public.profiles;
create trigger set_timestamp
  before update on public.profiles
  for each row execute procedure public.set_timestamp();
