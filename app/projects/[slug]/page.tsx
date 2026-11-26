import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProjectBySlug } from '@/lib/content';
import { shorten } from '@/lib/projects';
import { siteUrl } from '@/lib/site';
import RichText from '@/components/site/RichText';
import RevealOnScroll from '@/components/site/RevealOnScroll';
import Footer from '@/components/site/Footer';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { project, content } = await getProjectBySlug(slug);
  if (!project) return { title: 'Project tidak ditemukan', robots: { index: false } };
  const description = shorten(project.description || `Project ${project.category} oleh ${content.profile.full_name}.`, 160);
  const url = `/projects/${project.slug}`;
  return {
    title: project.title,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'article', url, title: project.title, description, siteName: content.profile.full_name, locale: 'id_ID' },
    twitter: { card: 'summary_large_image', title: project.title, description },
  };
}

const tones = ['#30360E', '#787F56', '#4E5532', '#5E6640'];
const glyphs = ['</>', '{ }', '>_', '01'];

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const { project, prev, next, content } = await getProjectBySlug(slug);
  if (!project) notFound();

  const { profile, settings } = content;
  const idx = content.projects.findIndex((p) => p.id === project.id);
  const hasBody = Boolean(project.details?.trim());
  const meta = [
    project.role ? { k: 'Peran', v: project.role } : null,
    project.year ? { k: 'Tahun', v: project.year } : null,
    { k: 'Kategori', v: project.category },
  ].filter(Boolean) as { k: string; v: string }[];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    url: `${siteUrl}/projects/${project.slug}`,
    genre: project.category,
    keywords: project.tech.join(', '),
    author: { '@type': 'Person', name: profile.full_name, url: siteUrl },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <RevealOnScroll />
      <header className="pd-bar">
        <div className="container pd-bar-in">
          <Link href="/" className="logo" aria-label="Ke beranda">
            {profile.full_name.split(' ')[0].toLowerCase()}.
          </Link>
          <Link href="/#projects" className="pd-back">
            <span aria-hidden="true">←</span> Semua project
          </Link>
        </div>
      </header>

      <main id="top" className="pd">
        <article className="container pd-in">
          <div className="pd-head" data-reveal="up">
            <span className="pd-cat">{project.category}</span>
            <h1>{project.title}</h1>
            {project.description && <p className="pd-lead">{project.description}</p>}
            <div className="btn-row">
              {project.demo_url && (
                <a className="btn btn-deep" href={project.demo_url} target="_blank" rel="noopener noreferrer">
                  Live demo ↗
                </a>
              )}
              {project.repo_url && (
                <a className="btn btn-line" href={project.repo_url} target="_blank" rel="noopener noreferrer">
                  Source code ↗
                </a>
              )}
            </div>
          </div>

          <div className="pd-cover" data-reveal="up" style={{ background: tones[Math.max(idx, 0) % tones.length] }}>
            {project.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.image_url} alt={`Tampilan ${project.title}`} />
            ) : (
              <span className="proj-glyph pd-glyph" aria-hidden="true">
                {glyphs[Math.max(idx, 0) % glyphs.length]}
              </span>
            )}
          </div>

          <div className={hasBody ? 'pd-grid' : 'pd-grid pd-grid-solo'}>
            {hasBody && (
              <div className="pd-body" data-reveal="up">
                <RichText text={project.details ?? ''} />
              </div>
            )}
            <aside className="pd-side" data-reveal="up" aria-label="Informasi project">
              <dl>
                {meta.map((m) => (
                  <div key={m.k}>
                    <dt>{m.k}</dt>
                    <dd>{m.v}</dd>
                  </div>
                ))}
              </dl>
              {project.tech.length > 0 && (
                <div>
                  <h2 className="pd-side-title">Teknologi</h2>
                  <div className="chips chips-sm">
                    {project.tech.map((t) => (
                      <span className="chip" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>

          {(prev || next) && (
            <nav className="pd-nav" aria-label="Project lainnya">
              {prev ? (
                <Link href={`/projects/${prev.slug}`} className="pd-nav-item">
                  <small>← Sebelumnya</small>
                  <span>{prev.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link href={`/projects/${next.slug}`} className="pd-nav-item pd-nav-next">
                  <small>Berikutnya →</small>
                  <span>{next.title}</span>
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </article>

        <section className="pd-cta band-dots">
          <div className="container pd-cta-in">
            <h2>Tertarik bekerja sama?</h2>
            <p>Ceritakan kebutuhanmu, aku senang berdiskusi.</p>
            <Link className="btn btn-deep" href="/#contact">
              Hubungi aku
            </Link>
          </div>
        </section>
      </main>
      <Footer name={profile.full_name} text={settings.footer_text} top="#top" />
    </>
  );
}
