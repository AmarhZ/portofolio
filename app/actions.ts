'use server';

import { after } from 'next/server';
import { createClient, hasSupabase } from '@/lib/supabase/server';
import { notifyNewMessage } from '@/lib/notify';

export type ContactState = { ok: boolean; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

// Kode error dari pembatas di database (supabase/security.sql) → pesan untuk pengunjung.
const DB_ERRORS: Record<string, string> = {
  rate_limited_email: 'Kamu baru saja mengirim beberapa pesan. Coba lagi dalam 10 menit.',
  rate_limited_global: 'Form sedang menerima terlalu banyak pesan. Coba lagi nanti, atau hubungi lewat email.',
  duplicate_message: 'Pesan yang sama sudah terkirim sebelumnya.',
};

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: bot biasanya mengisi kolom tersembunyi ini. Dibalas "berhasil" agar bot tidak tahu.
  if (String(formData.get('website') ?? '').trim() !== '') return { ok: true, error: '' };

  // Jebakan waktu: form yang terkirim kurang dari 2,5 detik setelah dibuka hampir pasti bot.
  const openedAt = Number(formData.get('t') ?? 0);
  if (!openedAt || Date.now() - openedAt < 2500) {
    return { ok: false, error: 'Terlalu cepat. Coba kirim lagi sebentar lagi.' };
  }

  const name = String(formData.get('name') ?? '').replace(CONTROL_CHARS, '').replace(/\s+/g, ' ').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const message = String(formData.get('message') ?? '').replace(CONTROL_CHARS, '').trim();

  if (!name || !email || !message) return { ok: false, error: 'Semua kolom wajib diisi.' };
  if (name.length > 120) return { ok: false, error: 'Nama terlalu panjang (maks 120 karakter).' };
  if (email.length > 254 || !EMAIL_RE.test(email)) return { ok: false, error: 'Format email tidak valid.' };
  if (message.length > 4000) return { ok: false, error: 'Pesan terlalu panjang (maks 4000 karakter).' };
  if (!hasSupabase()) return { ok: false, error: 'Database belum dikonfigurasi.' };

  const sb = await createClient();
  const { error } = await sb.from('messages').insert({ name, email, message });
  if (error) {
    const known = Object.keys(DB_ERRORS).find((k) => error.message.includes(k));
    return { ok: false, error: known ? DB_ERRORS[known] : 'Pesan gagal dikirim. Coba lagi nanti.' };
  }
  // Email pemberitahuan dikirim setelah balasan ke pengunjung, jadi tidak memperlambat form.
  after(() => notifyNewMessage({ name, email, message }));
  return { ok: true, error: '' };
}
