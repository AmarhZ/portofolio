-- =====================================================================
-- Skema database portofolio. Jalankan di Supabase → SQL Editor.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------- Tabel ----------
create table if not exists profile (
  id int primary key default 1 check (id = 1),
  full_name text not null default 'Amar Hamzah Al-Ma''sum',
  profession text not null default 'Programmer',
  tagline text default '',
  summary text default '',
  avatar_url text default '/images/profile.png',
  bio_title text default '',
  bio text default '',
  skills text[] not null default '{}',
  interests text[] not null default '{}',
  resume_url text default '',
  email text default '',
  linkedin text default '',
  github text default '',
  instagram text default '',
  open_to_work boolean not null default true
);

create table if not exists education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  major text default '',
  start_year text default '',
  end_year text default '',
  description text default '',
  sort_order int not null default 0
);

create table if not exists experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  position text not null,
  kind text not null default 'Magang',
  start_date text default '',
  end_date text default '',
  responsibilities text default '',   -- satu poin per baris
  sort_order int not null default 0
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Web',
  description text default '',
  image_url text default '',
  tech text[] not null default '{}',
  demo_url text default '',
  repo_url text default '',
  published boolean not null default true,
  sort_order int not null default 0
);

create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  issuer text default '',
  issued_at text default '',
  proof_url text default '',
  sort_order int not null default 0
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists site_settings (
  id int primary key default 1 check (id = 1),
  site_title text not null default 'Amar Hamzah Al-Ma''sum — Programmer',
  meta_description text default 'Portofolio Amar Hamzah Al-Ma''sum, programmer.',
  footer_text text default ''
);

insert into profile (id) values (1) on conflict do nothing;
insert into site_settings (id) values (1) on conflict do nothing;

-- ---------- Row Level Security ----------
-- Pengunjung (anon): boleh membaca konten & mengirim pesan.
-- Admin (authenticated): boleh semuanya.
-- PENTING: matikan "Allow new users to sign up" di Supabase → Authentication,
-- lalu buat 1 akun admin lewat dashboard Supabase.

alter table profile enable row level security;
alter table education enable row level security;
alter table experience enable row level security;
alter table projects enable row level security;
alter table certificates enable row level security;
alter table messages enable row level security;
alter table site_settings enable row level security;

do $$
declare t text;
begin
  foreach t in array array['profile','education','experience','certificates','site_settings'] loop
    execute format('drop policy if exists "public read" on %I', t);
    execute format('create policy "public read" on %I for select to anon, authenticated using (true)', t);
    execute format('drop policy if exists "admin write" on %I', t);
    execute format('create policy "admin write" on %I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

drop policy if exists "public read published" on projects;
create policy "public read published" on projects for select to anon using (published = true);
drop policy if exists "admin all projects" on projects;
create policy "admin all projects" on projects for all to authenticated using (true) with check (true);

drop policy if exists "anyone can send message" on messages;
create policy "anyone can send message" on messages for insert to anon, authenticated
  with check (char_length(name) between 1 and 120 and char_length(message) between 1 and 4000);
drop policy if exists "admin manage messages" on messages;
create policy "admin manage messages" on messages for all to authenticated using (true) with check (true);

-- ---------- Storage (foto, CV, gambar project, bukti sertifikat) ----------
insert into storage.buckets (id, name, public) values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "media admin write" on storage.objects;
create policy "media admin write" on storage.objects for insert to authenticated with check (bucket_id = 'media');
drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects for update to authenticated using (bucket_id = 'media');
drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects for delete to authenticated using (bucket_id = 'media');
