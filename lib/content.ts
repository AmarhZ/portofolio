import { createClient, hasSupabase } from './supabase/server';
import { defaults } from './defaults';
import type { Content } from './types';

// Buang nilai null supaya tidak menimpa nilai default.
function clean<T extends object>(base: T, incoming: Partial<T> | null | undefined): T {
  if (!incoming) return base;
  const out = { ...base } as Record<string, unknown>;
  for (const [k, v] of Object.entries(incoming)) {
    if (v !== null && v !== undefined) out[k] = v;
  }
  return out as T;
}

export async function getContent(): Promise<Content> {
  if (!hasSupabase()) return defaults;
  try {
    const sb = await createClient();
    const [p, e, x, pr, c, s] = await Promise.all([
      sb.from('profile').select('*').eq('id', 1).maybeSingle(),
      sb.from('education').select('*').order('sort_order'),
      sb.from('experience').select('*').order('sort_order'),
      sb.from('projects').select('*').eq('published', true).order('sort_order'),
      sb.from('certificates').select('*').order('sort_order'),
      sb.from('site_settings').select('*').eq('id', 1).maybeSingle(),
    ]);
    return {
      profile: clean(defaults.profile, p.data),
      education: e.data ?? [],
      experience: x.data ?? [],
      projects: pr.data ?? [],
      certificates: c.data ?? [],
      settings: clean(defaults.settings, s.data),
    };
  } catch {
    return defaults;
  }
}
