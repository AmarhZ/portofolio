import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Halaman tidak ditemukan' };

export default function NotFound() {
  return (
    <main className="nf">
      <div className="nf-term" aria-hidden="true">
        <div className="term-dots">
          <span />
          <span />
          <span />
        </div>
        <p>
          <span className="tk">$</span> cd /halaman-ini
        </p>
        <p>bash: cd: halaman tidak ditemukan (404)</p>
        <p>
          <span className="tk">$</span>
          <span className="cursor cursor-light" />
        </p>
      </div>
      <h1>Halaman tidak ditemukan</h1>
      <p className="nf-text">Alamat yang kamu buka tidak ada atau sudah dipindahkan.</p>
      <Link className="btn btn-deep" href="/">
        Kembali ke beranda
      </Link>
    </main>
  );
}
