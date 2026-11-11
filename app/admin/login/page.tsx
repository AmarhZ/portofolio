'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError('Email atau password salah.');
    router.push('/admin');
    router.refresh();
  }

  return (
    <main className="login">
      <form className="adm-card login-card" onSubmit={submit}>
        <span className="login-logo">a.</span>
        <h1>Admin Panel</h1>
        <p>Masuk untuk mengelola website portofolio.</p>
        {!configured && <p className="form-error">Supabase belum dikonfigurasi. Lihat README.md.</p>}
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn-deep" disabled={loading || !configured}>
          {loading ? 'Masuk…' : 'Masuk'}
        </button>
      </form>
    </main>
  );
}
