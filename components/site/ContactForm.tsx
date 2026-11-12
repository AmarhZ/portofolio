'use client';

import { useActionState } from 'react';
import { sendMessage, type ContactState } from '@/app/actions';

const initial: ContactState = { ok: false, error: '' };

export default function ContactForm() {
  const [state, action, pending] = useActionState(sendMessage, initial);

  if (state.ok) {
    return (
      <div className="form-card form-done" role="status">
        <h3>Terima kasih!</h3>
        <p>Pesan kamu sudah terkirim. Saya akan membalas lewat email secepatnya.</p>
      </div>
    );
  }

  return (
    <form className="form-card" action={action} data-reveal="right">
      <h3>Kirim pesan</h3>
      <label>
        Nama
        <input name="name" type="text" placeholder="Nama kamu" required maxLength={120} />
      </label>
      <label>
        Email
        <input name="email" type="email" placeholder="email@domain.com" required />
      </label>
      <label>
        Pesan
        <textarea name="message" rows={4} placeholder="Tulis pesan kamu" required maxLength={4000} />
      </label>
      {/* Honeypot anti-spam: disembunyikan dari pengguna */}
      <input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp" />
      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" className="btn btn-deep" disabled={pending}>
        {pending ? 'Mengirim…' : 'Kirim pesan'}
      </button>
    </form>
  );
}
