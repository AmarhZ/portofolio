-- =====================================================================
-- Pengamanan tambahan. Jalankan SETELAH schema.sql, di Supabase → SQL Editor.
--
-- LANGKAH WAJIB: ganti nilai admin_email pada blok pertama di bawah dengan
-- email akun admin-mu (yang sama dengan yang dipakai login di /admin/login).
-- Kalau lupa mengganti, skrip berhenti dengan pesan error. Ganti emailnya lalu jalankan ulang.
--
-- Aman dijalankan berulang kali.
-- =====================================================================

-- ---------- 1) Daftar admin ----------
create table if not exists public.admin_emails (
  email text primary key check (email = lower(email))
);
alter table public.admin_emails enable row level security;  -- tanpa policy: tidak bisa diakses lewat API

do $$
declare
  admin_email text := 'GANTI_DENGAN_EMAILMU@gmail.com';   -- <<< GANTI INI
begin
  if admin_email like 'GANTI%' then
    raise exception 'Ganti dulu admin_email di baris atas skrip dengan email akun admin-mu.';
  end if;
  insert into public.admin_emails (email) values (lower(admin_email)) on conflict do nothing;
end $$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_emails
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- 2) Hanya admin yang boleh mengubah konten ----------
do $$
declare t text;
begin
  foreach t in array array['profile','education','experience','certificates','site_settings'] loop
    execute format('drop policy if exists "admin write" on public.%I', t);
    execute format('create policy "admin write" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

drop policy if exists "public read published" on public.projects;
create policy "public read published" on public.projects for select to anon, authenticated using (published = true);
drop policy if exists "admin all projects" on public.projects;
create policy "admin all projects" on public.projects for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- 3) Pesan dari form kontak ----------
drop policy if exists "anyone can send message" on public.messages;
create policy "anyone can send message" on public.messages for insert to anon, authenticated
  with check (
    is_read = false
    and char_length(btrim(name)) between 1 and 120
    and char_length(btrim(message)) between 1 and 4000
    and char_length(email) between 5 and 254
  );
drop policy if exists "admin manage messages" on public.messages;
create policy "admin manage messages" on public.messages for all to authenticated using (public.is_admin()) with check (public.is_admin());

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'messages_email_format') then
    alter table public.messages add constraint messages_email_format
      check (email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$') not valid;
  end if;
end $$;

create index if not exists messages_email_created_idx on public.messages (lower(email), created_at desc);
create index if not exists messages_created_idx on public.messages (created_at desc);

-- Pembatas pesan, dijalankan di database sehingga tetap berlaku
-- walaupun seseorang memanggil API langsung tanpa lewat website:
--   * maks 3 pesan per email dalam 10 menit
--   * pesan yang sama persis dari email yang sama ditolak selama 1 jam
--   * maks 60 pesan per jam secara keseluruhan
create or replace function public.messages_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select count(*) from public.messages
        where lower(email) = lower(new.email)
          and created_at > now() - interval '10 minutes') >= 3 then
    raise exception 'rate_limited_email' using errcode = 'P0001';
  end if;

  if exists (select 1 from public.messages
               where lower(email) = lower(new.email)
                 and message = new.message
                 and created_at > now() - interval '1 hour') then
    raise exception 'duplicate_message' using errcode = 'P0001';
  end if;

  if (select count(*) from public.messages
        where created_at > now() - interval '1 hour') >= 60 then
    raise exception 'rate_limited_global' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists messages_rate_limit on public.messages;
create trigger messages_rate_limit
  before insert on public.messages
  for each row execute function public.messages_rate_limit();

-- ---------- 4) Upload file: hanya admin, batas ukuran dan tipe ----------
update storage.buckets
   set public = true,
       file_size_limit = 10485760,   -- 10 MB
       allowed_mime_types = array['image/png','image/jpeg','image/webp','image/gif','application/pdf']
 where id = 'media';

drop policy if exists "media admin write" on storage.objects;
create policy "media admin write" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());
