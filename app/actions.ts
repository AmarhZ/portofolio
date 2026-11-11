'use server';

import { createClient, hasSupabase } from '@/lib/supabase/server';

export type ContactState = { ok: boolean; error: string };

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: bot biasanya mengisi kolom tersembunyi ini.
  if (String(formData.get('website') ?? '').trim() !== '') return { ok: true, error: '' };

  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();

  if (!name || !email || !message) return { ok: false, error: 'Semua kolom wajib diisi.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: 'Format email tidak valid.' };
  if (message.length > 4000) return { ok: false, error: 'Pesan terlalu panjang (maks 4000 karakter).' };
  if (!hasSupabase()) return { ok: false, error: 'Database belum dikonfigurasi.' };

  const sb = await createClient();
  const { error } = await sb.from('messages').insert({ name, email, message });
  if (error) return { ok: false, error: 'Pesan gagal dikirim. Coba lagi nanti.' };
  return { ok: true, error: '' };
}
