'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Message } from '@/lib/types';
import { setMessageRead, deleteMessage } from '@/app/admin/actions';

export default function MessageList({ messages }: { messages: Message[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const run = (fn: () => Promise<{ error?: string }>) =>
    start(async () => {
      await fn();
      router.refresh();
    });

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Manage Messages</h1>
          <p>Pesan yang masuk dari form Contact di website.</p>
        </div>
      </div>
      <section className="adm-card">
        {messages.length === 0 ? (
          <p className="empty">Belum ada pesan.</p>
        ) : (
          <ul className="msgs">
            {messages.map((m) => (
              <li key={m.id} className={m.is_read ? 'msg' : 'msg unread'}>
                <div className="msg-top">
                  <strong>{m.name}</strong>
                  <a href={`mailto:${m.email}`}>{m.email}</a>
                  <time dateTime={m.created_at}>{new Date(m.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</time>
                </div>
                <p className="msg-body">{m.message}</p>
                <div className="row-actions">
                  <button type="button" className="link-btn" disabled={pending} onClick={() => run(() => setMessageRead(m.id, !m.is_read))}>
                    {m.is_read ? 'Tandai belum dibaca' : 'Tandai sudah dibaca'}
                  </button>
                  <button
                    type="button"
                    className="link-btn danger"
                    disabled={pending}
                    onClick={() => window.confirm('Hapus pesan ini?') && run(() => deleteMessage(m.id))}
                  >
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
