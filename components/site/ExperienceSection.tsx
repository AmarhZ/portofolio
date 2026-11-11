import type { Experience } from '@/lib/types';
import SectionTitle from './SectionTitle';

export default function ExperienceSection({ items }: { items: Experience[] }) {
  return (
    <section id="experience" className="band">
      <div className="container section">
        <SectionTitle title="experience" hint="// work history" />
        {items.length === 0 ? (
          <p className="empty">Belum ada data pengalaman.</p>
        ) : (
          <div className="stack">
            {items.map((x) => (
              <article className="card exp-card" key={x.id}>
                <div className="exp-meta">
                  <p className="eyebrow">
                    {x.start_date} — {x.end_date}
                  </p>
                  <span className="chip">{x.kind}</span>
                </div>
                <div className="exp-body">
                  <h3>{x.position}</h3>
                  <p className="tl-sub">{x.company}</p>
                  <ul className="bullets">
                    {x.responsibilities
                      .split('\n')
                      .map((l) => l.trim())
                      .filter(Boolean)
                      .map((l, i) => (
                        <li key={i}>{l}</li>
                      ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
