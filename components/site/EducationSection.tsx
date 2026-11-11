import type { Education } from '@/lib/types';
import SectionTitle from './SectionTitle';

export default function EducationSection({ items }: { items: Education[] }) {
  return (
    <section id="education" className="container section">
      <SectionTitle title="education" hint="// git log --school" />
      {items.length === 0 ? (
        <p className="empty">Belum ada data pendidikan.</p>
      ) : (
        <div className="timeline">
          {items.map((e, i) => (
            <div className="tl-item" key={e.id}>
              <span className={i === 0 ? 'tl-dot tl-dot-main' : 'tl-dot'} />
              <p className="eyebrow">
                {e.start_year} — {e.end_year}
              </p>
              <h3>{e.institution}</h3>
              {e.major && <p className="tl-sub">{e.major}</p>}
              {e.description && <p className="tl-desc">{e.description}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
