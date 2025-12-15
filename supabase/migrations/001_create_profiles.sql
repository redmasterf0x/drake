-- 001_create_profiles.sql
-- Creates a profiles table linked to auth.users and RLS policies for secure access

-- Create teams table so users can be assigned to teams by admin
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text,
  created_at timestamptz default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  display_name text,
  avatar_url text,
  team_id uuid references public.teams(id),
  is_admin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Allow owners to select their profile or allow admin users to select any profile
create policy "Select own or admin" on public.profiles
  for select using (
    auth.uid() = id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

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

-- Ensure an initial admin profile exists for the known admin user id
insert into public.profiles (id, email, is_admin)
values ('00626ad2-202f-4454-91a3-5d28d6504525', 'admin@local', true)
on conflict (id) do update set is_admin = excluded.is_admin;
