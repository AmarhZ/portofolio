'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const LIST_TABLES = ['education', 'experience', 'projects', 'certificates'];
const SINGLE_TABLES = ['profile', 'site_settings'];

type Result = { error?: string };

async function authed() {
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) throw new Error('Tidak diizinkan. Silakan login ulang.');
  return sb;
}

function sanitize(payload: Record<string, unknown>) {
  const out = { ...payload };
  delete out.id;
  delete out.created_at;
  return out;
}

function refresh(table: string) {
  revalidatePath('/');
  revalidatePath('/admin', 'layout');
  revalidatePath(`/admin/${table}`);
}

export async function saveRow(table: string, id: string | null, payload: Record<string, unknown>): Promise<Result> {
  if (!LIST_TABLES.includes(table)) return { error: 'Tabel tidak dikenal.' };
  const sb = await authed();
  const data = sanitize(payload);
  const { error } = id ? await sb.from(table).update(data).eq('id', id) : await sb.from(table).insert(data);
  if (error) return { error: error.message };
  refresh(table);
  return {};
}

export async function deleteRow(table: string, id: string): Promise<Result> {
  if (!LIST_TABLES.includes(table)) return { error: 'Tabel tidak dikenal.' };
  const sb = await authed();
  const { error } = await sb.from(table).delete().eq('id', id);
  if (error) return { error: error.message };
  refresh(table);
  return {};
}

export async function saveSingleton(table: string, payload: Record<string, unknown>): Promise<Result> {
  if (!SINGLE_TABLES.includes(table)) return { error: 'Tabel tidak dikenal.' };
  const sb = await authed();
  const { error } = await sb.from(table).upsert({ ...sanitize(payload), id: 1 });
  if (error) return { error: error.message };
  refresh(table === 'profile' ? 'profile' : 'settings');
  return {};
}

export async function setMessageRead(id: string, read: boolean): Promise<Result> {
  const sb = await authed();
  const { error } = await sb.from('messages').update({ is_read: read }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin', 'layout');
  return {};
}

export async function deleteMessage(id: string): Promise<Result> {
  const sb = await authed();
  const { error } = await sb.from('messages').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin', 'layout');
  return {};
}

export async function signOut() {
  const sb = await createClient();
  await sb.auth.signOut();
  redirect('/admin/login');
}
