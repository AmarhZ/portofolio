-- =====================================================================
-- Halaman detail project. Jalankan di Supabase → SQL Editor (setelah schema.sql).
-- Aman dijalankan berulang kali dan tidak menghapus data yang ada.
--
-- Menambah kolom: slug (alamat halaman), details (isi detail/studi kasus),
-- role (peran), year (tahun). Slug dibuat otomatis dari nama project dan
-- dijamin unik. Project lama otomatis mendapat slug.
-- =====================================================================

alter table public.projects add column if not exists slug text;
alter table public.projects add column if not exists details text default '';
alter table public.projects add column if not exists role text default '';
alter table public.projects add column if not exists year text default '';

create or replace function public.slugify(t text)
returns text
language sql
immutable
as $$
  select coalesce(
    nullif(trim(both '-' from left(trim(both '-' from regexp_replace(lower(coalesce(t, '')), '[^a-z0-9]+', '-', 'g')), 60)), ''),
    'project'
  );
$$;

create or replace function public.projects_set_slug()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base text;
  candidate text;
  n int := 1;
begin
  base := public.slugify(coalesce(nullif(btrim(new.slug), ''), new.title));
  candidate := base;
  while exists (select 1 from public.projects where slug = candidate and id <> new.id) loop
    n := n + 1;
    candidate := base || '-' || n;
  end loop;
  new.slug := candidate;
  return new;
end;
$$;

drop trigger if exists projects_set_slug on public.projects;
create trigger projects_set_slug
  before insert or update on public.projects
  for each row execute function public.projects_set_slug();

-- Beri slug pada project yang sudah ada (memicu trigger di atas).
update public.projects set title = title where slug is null or btrim(slug) = '';

create unique index if not exists projects_slug_key on public.projects (slug);
