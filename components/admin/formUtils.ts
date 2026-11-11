import type { Field } from '@/lib/admin-config';

type Row = Record<string, unknown>;

// Baris dari database → nilai form (array jadi "a, b, c").
export function toFormValues(fields: Field[], row?: Row | null): Row {
  const v: Row = {};
  for (const f of fields) {
    const raw = row?.[f.name];
    if (f.type === 'tags') v[f.name] = Array.isArray(raw) ? raw.join(', ') : '';
    else if (f.type === 'boolean') v[f.name] = row ? Boolean(raw) : f.name === 'published';
    else if (f.type === 'number') v[f.name] = raw == null ? '0' : String(raw);
    else if (f.type === 'select') v[f.name] = raw == null ? (f.options?.[0] ?? '') : String(raw);
    else v[f.name] = raw == null ? '' : String(raw);
  }
  return v;
}

// Nilai form → payload database.
export function toPayload(fields: Field[], values: Row): Row {
  const out: Row = {};
  for (const f of fields) {
    const raw = values[f.name];
    if (f.type === 'tags') {
      out[f.name] = String(raw ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (f.type === 'number') out[f.name] = Number(raw) || 0;
    else if (f.type === 'boolean') out[f.name] = Boolean(raw);
    else out[f.name] = String(raw ?? '').trim();
  }
  return out;
}
