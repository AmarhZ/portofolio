import type { Profile } from '@/lib/types';
import SectionTitle from './SectionTitle';
import ContactForm from './ContactForm';

function Row({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <li>
      <a className="contact-row" href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer">
        <span className="contact-ico">{icon}</span>
        {label}
      </a>
    </li>
  );
}

const stroke = { fill: 'none', stroke: '#E2D4B9', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export default function ContactSection({ profile }: { profile: Profile }) {
  const clean = (u: string) => u.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const link = (u: string) => (u.startsWith('http') ? u : `https://${u}`);
  return (
    <section id="contact" className="band band-dots">
      <div className="container section contact-grid">
        <div className="contact-info">
          <SectionTitle title="contact" hint="// say hello()" />
          <p className="contact-lead">Tertarik bekerja sama, atau ada lowongan magang? Kirim pesan, saya akan membalas secepatnya.</p>
          <ul className="contact-list">
            {profile.email && (
              <Row
                href={`mailto:${profile.email}`}
                label={profile.email}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7l9 6 9-6" />
                  </svg>
                }
              />
            )}
            {profile.linkedin && (
              <Row href={link(profile.linkedin)} label={clean(profile.linkedin)} icon={<b className="ico-text">in</b>} />
            )}
            {profile.github && (
              <Row
                href={link(profile.github)}
                label={clean(profile.github)}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
                    <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" />
                  </svg>
                }
              />
            )}
            {profile.instagram && (
              <Row
                href={link(profile.instagram)}
                label={clean(profile.instagram)}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
                    <rect x="4" y="4" width="16" height="16" rx="5" />
                    <circle cx="12" cy="12" r="3.5" />
                  </svg>
                }
              />
            )}
          </ul>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
