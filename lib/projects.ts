import type { Project } from './types';

export type ProjectWithSlug = Project & { slug: string };

// Sama dengan public.slugify() di supabase/projects-detail.sql.
export function slugify(text: string): string {
  const s = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/^-+|-+$/g, '');
  return s || 'project';
}

// Pastikan setiap project punya slug unik. Bila kolom slug belum ada di database,
// slug dibuat dari nama project sehingga website tetap berfungsi.
export function withSlugs(list: Project[]): ProjectWithSlug[] {
  const used = new Set<string>();
  return list.map((p) => {
    const base = slugify(p.slug || p.title);
    let slug = base;
    for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`;
    used.add(slug);
    return { ...p, slug };
  });
}

export function shorten(text: string, max: number): string {
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length <= max ? t : `${t.slice(0, max - 1).trimEnd()}…`;
}
