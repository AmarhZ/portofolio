import type { Profile } from '@/lib/types';
import SectionTitle from './SectionTitle';

export default function About({ profile }: { profile: Profile }) {
  return (
    <section id="about" className="band band-dots">
      <div className="container section">
        <SectionTitle title="about" hint="// who am i" />
        <div className="about-grid">
          <div className="about-text">
            {profile.bio_title && <p className="about-lead">{profile.bio_title}</p>}
            {profile.bio && <p className="about-body">{profile.bio}</p>}
          </div>
          <div className="about-cards">
            <div className="panel">
              <h3>Keahlian</h3>
              <div className="chips">
                {profile.skills.map((s) => (
                  <span className="chip" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="panel">
              <h3>Minat</h3>
              <ul className="dot-list">
                {profile.interests.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
