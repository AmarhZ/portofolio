'use client';

import { useMemo, useState } from 'react';
import type { Project } from '@/lib/types';
import SectionTitle from './SectionTitle';

const glyphs = ['</>', '{ }', '>_', '01'];
const tones = ['#30360E', '#787F56', '#4E5532', '#5E6640'];

export default function ProjectsSection({ items }: { items: Project[] }) {
  const [filter, setFilter] = useState('Semua');
  const cats = useMemo(() => ['Semua', ...Array.from(new Set(items.map((p) => p.category)))], [items]);
  const shown = items.filter((p) => filter === 'Semua' || p.category === filter);

  return (
    <section id="projects" className="container section">
      <div className="section-head">
        <SectionTitle title="projects" hint="// ls ./projects" />
        <div role="group" aria-label="Filter project" className="filters">
          {cats.map((c) => (
            <button key={c} type="button" aria-pressed={filter === c} className={filter === c ? 'filter on' : 'filter'} onClick={() => setFilter(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="empty">Belum ada project.</p>
      ) : (
        <div className="grid-cards" key={filter}>
          {shown.map((p, i) => (
            <article className="card proj" key={p.id} style={{ '--i': Math.min(i, 8) } as React.CSSProperties}>
              <div className="proj-thumb" style={{ background: tones[i % tones.length] }}>
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt={p.title} />
                ) : (
                  <span className="proj-glyph" aria-hidden="true">
                    {glyphs[i % glyphs.length]}
                  </span>
                )}
                <span className="proj-cat">{p.category}</span>
              </div>
              <div className="proj-body">
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <div className="chips chips-sm">
                  {p.tech.map((t) => (
                    <span className="chip" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className="proj-links">
                  {p.demo_url && (
                    <a href={p.demo_url} target="_blank" rel="noopener noreferrer">
                      Live demo ↗
                    </a>
                  )}
                  {p.repo_url && (
                    <a href={p.repo_url} target="_blank" rel="noopener noreferrer">
                      Source ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
