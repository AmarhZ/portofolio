'use client';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="nf">
      <div className="nf-term" aria-hidden="true">
        <div className="term-dots">
          <span />
          <span />
          <span />
        </div>
        <p>
          <span className="tk">$</span> npm run page
        </p>
        <p>Error: sesuatu tidak berjalan semestinya</p>
        <p>
          <span className="tk">$</span>
          <span className="cursor cursor-light" />
        </p>
      </div>
      <h1>Terjadi kesalahan</h1>
      <p className="nf-text">Maaf, ada yang tidak beres di sisi kami. Coba muat ulang halaman ini.</p>
      <div className="btn-row" style={{ justifyContent: 'center' }}>
        <button type="button" className="btn btn-deep" onClick={reset}>
          Coba lagi
        </button>
        <a className="btn btn-line" href="/">
          Ke beranda
        </a>
      </div>
    </main>
  );
}
