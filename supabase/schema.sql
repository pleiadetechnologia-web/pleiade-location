-- PLÉIADE LOCATION : exécuter dans Supabase > SQL Editor.
-- 1) Créez d'abord l'utilisateur dans Authentication > Users.
-- 2) Remplacez l'UUID ci-dessous par l'ID de votre utilisateur Auth.
-- 3) Exécutez ensuite l'INSERT admin_users.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

create table if not exists public.houses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  city text not null,
  neighborhood text default '',
  category text not null default 'Maison',
  price numeric(12,2) not null check (price >= 0),
  currency text not null default 'USD' check (currency in ('USD','CDF')),
  bedrooms integer,
  bathrooms integer,
  photos text[] not null default '{}',
  video_url text default '',
  status text not null default 'available' check (status in ('available','rented')),
  is_published boolean not null default true,
  fingerprint text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint max_three_photos check (cardinality(photos) <= 3)
);

create table if not exists public.rental_requests (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references public.houses(id) on delete restrict,
  request_token uuid not null unique,
  full_name text not null,
  phone text not null,
  current_address text default '',
  profession text default '',
  occupants integer not null default 1 check (occupants between 1 and 50),
  desired_date date,
  message text default '',
  status text not null default 'new' check (status in ('new','contacted','approved','rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'Administrateur',
  avatar_url text default '',
  updated_at timestamptz not null default now()
);

create index if not exists houses_public_idx on public.houses(status,is_published,created_at desc);
create index if not exists requests_created_idx on public.rental_requests(created_at desc);
create index if not exists requests_house_idx on public.rental_requests(house_id);

alter table public.houses enable row level security;
alter table public.rental_requests enable row level security;
alter table public.admin_users enable row level security;
alter table public.admin_profiles enable row level security;

drop policy if exists "Public can read published available houses" on public.houses;
create policy "Public can read published available houses" on public.houses
for select to anon, authenticated using ((status='available' and is_published=true) or public.is_admin());

drop policy if exists "Admins manage houses" on public.houses;
create policy "Admins manage houses" on public.houses
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public can create rental requests" on public.rental_requests;
create policy "Public can create rental requests" on public.rental_requests
for insert to anon, authenticated
with check (
  length(trim(full_name)) between 2 and 120
  and length(trim(phone)) between 6 and 30
  and exists (select 1 from public.houses h where h.id=house_id and h.status='available' and h.is_published=true)
);

drop policy if exists "Admins read and manage requests" on public.rental_requests;
create policy "Admins read and manage requests" on public.rental_requests
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins read admin list" on public.admin_users;
create policy "Admins read admin list" on public.admin_users
for select to authenticated using (public.is_admin());

drop policy if exists "Admins manage own profile" on public.admin_profiles;
create policy "Admins manage own profile" on public.admin_profiles
for all to authenticated using (public.is_admin() and id=auth.uid()) with check (public.is_admin() and id=auth.uid());

-- Storage : bucket privé/public des médias immobiliers.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('house-media','house-media',true,104857600,array['image/jpeg','image/png','image/webp','video/mp4','video/webm','video/quicktime'])
on conflict (id) do update set public=true, file_size_limit=104857600;

drop policy if exists "Public can view house media" on storage.objects;
create policy "Public can view house media" on storage.objects for select
using (bucket_id='house-media');

drop policy if exists "Admins upload house media" on storage.objects;
create policy "Admins upload house media" on storage.objects for insert to authenticated
with check (bucket_id='house-media' and public.is_admin());

drop policy if exists "Admins update house media" on storage.objects;
create policy "Admins update house media" on storage.objects for update to authenticated
using (bucket_id='house-media' and public.is_admin())
with check (bucket_id='house-media' and public.is_admin());

drop policy if exists "Admins delete house media" on storage.objects;
create policy "Admins delete house media" on storage.objects for delete to authenticated
using (bucket_id='house-media' and public.is_admin());

-- Après avoir créé votre utilisateur Auth, exécutez en remplaçant l'UUID :
-- insert into public.admin_users(user_id) values ('UUID-DE-VOTRE-UTILISATEUR');
-- insert into public.admin_profiles(id, full_name) values ('UUID-DE-VOTRE-UTILISATEUR','David Makindu');
