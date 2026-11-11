import SectionTitle from './SectionTitle';

export default function ResumeSection({ resumeUrl }: { resumeUrl: string }) {
  return (
    <section id="resume" className="container section">
      <SectionTitle title="resume" hint="// cv.pdf" />
      <div className="resume-card">
        <div className="resume-text">
          <h3>CV terbaru, siap dibawa melamar.</h3>
          <p>Format PDF. Ringkasan pendidikan, pengalaman, keahlian, dan project dalam satu dokumen.</p>
          {resumeUrl ? (
            <a className="btn btn-clay" href={resumeUrl} target="_blank" rel="noopener noreferrer" download>
              Unduh CV (PDF)
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />
              </svg>
            </a>
          ) : (
            <p className="resume-empty">CV belum diunggah. Unggah dari dashboard admin → Manage Profile.</p>
          )}
        </div>
        <div className="resume-doc" aria-hidden="true">
          <i style={{ width: '60%', height: 14, background: '#30360E' }} />
          <i style={{ width: '40%', background: '#787F56' }} />
          <i style={{ width: '100%', marginTop: 12 }} />
          <i style={{ width: '92%' }} />
          <i style={{ width: '96%' }} />
          <i style={{ width: '35%', height: 10, background: '#787F56', marginTop: 14 }} />
          <i style={{ width: '100%' }} />
          <i style={{ width: '88%' }} />
          <i style={{ width: '94%' }} />
        </div>
      </div>
    </section>
  );
}
