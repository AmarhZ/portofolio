import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Message } from '@/lib/types';

async function count(table: string, filter?: (q: any) => any) {
  const sb = await createClient();
  let q: any = sb.from(table).select('*', { count: 'exact', head: true });
  if (filter) q = filter(q);
  const { count: c } = await q;
  return c ?? 0;
}

export default async function DashboardPage() {
  const sb = await createClient();
  const [projects, certs, exp, unread, recent] = await Promise.all([
    count('projects'),
    count('certificates'),
    count('experience'),
    count('messages', (q) => q.eq('is_read', false)),
    sb.from('messages').select('*').order('created_at', { ascending: false }).limit(4),
  ]);
  const messages = (recent.data ?? []) as Message[];

  const stats = [
    { label: 'Projects', value: projects, hint: 'Total', dark: true },
    { label: 'Sertifikat', value: certs, hint: 'Tercatat' },
    { label: 'Pengalaman', value: exp, hint: 'Magang & kerja' },
    { label: 'Pesan baru', value: unread, hint: 'Belum dibaca', outline: true },
  ];

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Dashboard</h1>
          <p>Ringkasan konten dan aktivitas website portofolio.</p>
        </div>
        <Link href="/admin/projects" className="btn btn-deep btn-sm">
          + Tambah project
        </Link>
      </div>

      <div className="stats">
        {stats.map((s) => (
          <div key={s.label} className={s.dark ? 'stat stat-dark' : s.outline ? 'stat stat-outline' : 'stat'}>
            <span>{s.label}</span>
            <b>{String(s.value).padStart(2, '0')}</b>
            <small>{s.hint}</small>
          </div>
        ))}
      </div>

      <div className="adm-cols">
        <section className="adm-card adm-grow">
          <div className="card-head">
            <h2>Pesan terbaru</h2>
            <Link href="/admin/messages">Lihat semua</Link>
          </div>
          {messages.length === 0 ? (
            <p className="empty">Belum ada pesan.</p>
          ) : (
            <ul className="msgs">
              {messages.map((m) => (
                <li key={m.id} className={m.is_read ? 'msg' : 'msg unread'}>
                  <div className="msg-top">
                    <strong>{m.name}</strong>
                    <time dateTime={m.created_at}>{new Date(m.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</time>
                  </div>
                  <p className="msg-body clamp">{m.message}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="adm-card quick">
          <h2>Aksi cepat</h2>
          <Link href="/admin/projects">Tambah project baru →</Link>
          <Link href="/admin/profile">Unggah CV terbaru →</Link>
          <Link href="/admin/certificates">Tambah sertifikat →</Link>
          <Link href="/admin/settings">Website Settings →</Link>
        </section>
      </div>
    </>
  );
}
