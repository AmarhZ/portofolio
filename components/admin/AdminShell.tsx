'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminNav from './AdminNav';

type Props = {
  unread: number;
  signOutAction: () => Promise<void>;
  children: React.ReactNode;
};

export default function AdminShell({ unread, signOutAction, children }: Props) {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  // Drawer menutup otomatis setelah pindah halaman.
  useEffect(() => {
    setOpen(false);
  }, [path]);

  // Saat drawer terbuka: Escape menutup, dan halaman di belakangnya tidak ikut ter-scroll.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onResize = () => window.innerWidth > 900 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return (
    <div className="adm">
      <header className="adm-top">
        <div className="adm-brand">
          <span className="login-logo">a.</span>
          <strong>Admin Panel</strong>
        </div>
        <button
          type="button"
          className="burger"
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={open}
          aria-controls="adm-drawer"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <div className={open ? 'adm-scrim open' : 'adm-scrim'} onClick={() => setOpen(false)} aria-hidden="true" />

      <aside id="adm-drawer" className={open ? 'adm-side open' : 'adm-side'}>
        <div className="adm-brand">
          <span className="login-logo">a.</span>
          <div>
            <strong>Admin Panel</strong>
            <small>Portofolio</small>
          </div>
        </div>
        <AdminNav unread={unread} />
        <div className="adm-side-foot">
          <Link href="/" target="_blank" className="btn btn-outline-clay btn-sm">
            Lihat website ↗
          </Link>
          <form action={signOutAction}>
            <button type="submit" className="link-btn light">
              Keluar
            </button>
          </form>
        </div>
      </aside>

      <main className="adm-main">{children}</main>
    </div>
  );
}
