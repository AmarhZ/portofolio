import { ImageResponse } from 'next/og';
import { getContent } from './content';
import { siteHost } from './site';

// Gambar pratinjau (1200x630) yang tampil saat link dibagikan di WhatsApp, LinkedIn, X, dll.
// Nama dan profesi diambil dari Manage Profile, jadi ikut berubah otomatis.
export async function renderOg() {
  const { profile } = await getContent();
  const first = profile.full_name.split(' ')[0];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: '#F6F0E3',
          color: '#30360E',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ position: 'absolute', right: -140, bottom: -170, width: 560, height: 560, borderRadius: 280, background: '#E2D4B9', display: 'flex' }} />
        <div style={{ position: 'absolute', left: -120, top: -120, width: 240, height: 240, borderRadius: 120, border: '6px solid #787F56', display: 'flex' }} />

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', padding: '64px 72px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 18, background: '#30360E', color: '#E2D4B9', fontSize: 40, fontWeight: 700 }}>
              a.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 680 }}>
            <div style={{ display: 'flex', fontSize: 26, color: '#4E5532', marginBottom: 18 }}>{'> portofolio'}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', fontSize: 80, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2 }}>
              {profile.full_name.split(' ').map((w, i) => (
                <div key={i} style={{ display: 'flex', whiteSpace: 'nowrap', marginRight: 22 }}>{w}</div>
              ))}
            </div>
            <div style={{ display: 'flex', fontSize: 40, color: '#4E5532', marginTop: 20 }}>{profile.profession}</div>
          </div>

          <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', background: '#30360E', color: '#E2D4B9', fontSize: 26, padding: '12px 26px', borderRadius: 999 }}>{siteHost}</div>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            right: 72,
            top: 150,
            width: 380,
            display: 'flex',
            flexDirection: 'column',
            background: '#30360E',
            color: '#E2D4B9',
            borderRadius: 24,
            padding: '24px 28px 30px',
            fontFamily: 'monospace',
            fontSize: 25,
            lineHeight: 1.6,
          }}
        >
          <div style={{ display: 'flex', marginBottom: 14 }}>
            <div style={{ display: 'flex', width: 14, height: 14, borderRadius: 7, background: '#E2D4B9', marginRight: 8 }} />
            <div style={{ display: 'flex', width: 14, height: 14, borderRadius: 7, background: '#787F56', marginRight: 8 }} />
            <div style={{ display: 'flex', width: 14, height: 14, borderRadius: 7, background: '#4E5532' }} />
          </div>
          <div style={{ display: 'flex', whiteSpace: 'pre' }}>{'const dev = {'}</div>
          <div style={{ display: 'flex', whiteSpace: 'pre' }}>{`  name: "${first}",`}</div>
          <div style={{ display: 'flex', whiteSpace: 'pre' }}>{`  role: "${profile.profession}",`}</div>
          <div style={{ display: 'flex', whiteSpace: 'pre' }}>{'};'}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

// Gambar pratinjau untuk halaman detail project.
export async function renderProjectOg(project: { title: string; category: string; tech: string[] }) {
  const { profile } = await getContent();
  const title = project.title.length > 70 ? `${project.title.slice(0, 69)}…` : project.title;
  const tech = project.tech.slice(0, 4);

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: '#F6F0E3', color: '#30360E', fontFamily: 'sans-serif' }}>
        <div style={{ position: 'absolute', right: -140, bottom: -170, width: 560, height: 560, borderRadius: 280, background: '#E2D4B9', display: 'flex' }} />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', padding: '64px 72px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 18, background: '#30360E', color: '#E2D4B9', fontSize: 40, fontWeight: 700 }}>
              a.
            </div>
            <div style={{ display: 'flex', marginLeft: 20, fontSize: 28, color: '#4E5532' }}>{profile.full_name}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 940 }}>
            <div style={{ display: 'flex' }}>
              <div style={{ display: 'flex', background: '#30360E', color: '#E2D4B9', fontSize: 24, padding: '8px 22px', borderRadius: 999 }}>{project.category}</div>
            </div>
            <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2, marginTop: 26 }}>{title}</div>
            {tech.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 28 }}>
                {tech.map((t) => (
                  <div key={t} style={{ display: 'flex', fontSize: 26, color: '#4E5532', border: '2px solid #787F56', borderRadius: 999, padding: '6px 20px', marginRight: 12 }}>
                    {t}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', background: '#30360E', color: '#E2D4B9', fontSize: 26, padding: '12px 26px', borderRadius: 999 }}>{siteHost}</div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
