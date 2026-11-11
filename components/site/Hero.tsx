import type { Profile } from '@/lib/types';

export default function Hero({ profile }: { profile: Profile }) {
  const first = profile.full_name.split(' ')[0];
  return (
    <section id="home" className="container hero">
      <div className="hero-text">
        {profile.open_to_work && (
          <div className="pill">
            <span className="pill-dot" />
            Terbuka untuk magang &amp; pekerjaan
          </div>
        )}
        <p className="prompt">
          &gt; Halo, dunia. Saya<span className="cursor" />
        </p>
        <h1 className="hero-name">{profile.full_name}.</h1>
        <p className="hero-role">{profile.profession}</p>
        {profile.tagline && <p className="hero-tagline">{profile.tagline}</p>}
        {profile.summary && <p className="hero-lead">{profile.summary}</p>}
        <div className="btn-row">
          <a className="btn btn-deep" href="#projects">
            Lihat project
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <a className="btn btn-line" href="#resume">
            Unduh CV
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />
            </svg>
          </a>
        </div>
      </div>

      <div className="hero-photo-col">
        <div className="hero-photo-wrap">
          <div className="orn-blob" aria-hidden="true" />
          <div className="orn-dots" aria-hidden="true" />
          <div className="orn-ring" aria-hidden="true" />
          <div className="orn-badge" aria-hidden="true">
            &lt;/&gt;
          </div>
          <div className="orn-terminal" aria-hidden="true">
            <div className="term-dots">
              <span />
              <span />
              <span />
            </div>
            <div>
              <span className="tk">const</span> dev = {'{'}
            </div>
            <div>
              &nbsp;&nbsp;name: <span className="tk">&quot;{first}&quot;</span>,
            </div>
            <div>
              &nbsp;&nbsp;role: <span className="tk">&quot;{profile.profession}&quot;</span>,
            </div>
            <div>{'};'}</div>
          </div>
          <div className="hero-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profile.avatar_url || '/images/profile.png'} alt={`Foto ${profile.full_name}`} />
          </div>
        </div>
      </div>
    </section>
  );
}
