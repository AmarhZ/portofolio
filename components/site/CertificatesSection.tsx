import type { Certificate } from '@/lib/types';
import SectionTitle from './SectionTitle';

export default function CertificatesSection({ items }: { items: Certificate[] }) {
  return (
    <section id="certificates" className="band">
      <div className="container section">
        <SectionTitle title="certificates" hint="// credentials[]" />
        {items.length === 0 ? (
          <p className="empty">Belum ada sertifikat.</p>
        ) : (
          <div className="grid-cert">
            {items.map((c) => (
              <article className="card cert" key={c.id}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#787F56" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="9" r="6" />
                  <path d="M8.5 14.5L7 22l5-3 5 3-1.5-7.5" />
                </svg>
                <h3>{c.name}</h3>
                <p className="tl-sub">
                  {c.issuer} · {c.issued_at}
                </p>
                {c.proof_url && (
                  <a className="cert-link" href={c.proof_url} target="_blank" rel="noopener noreferrer">
                    Lihat bukti →
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
