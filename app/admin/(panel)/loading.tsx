// Tampil seketika saat pindah menu, selama data halaman tujuan masih dimuat.
export default function Loading() {
  return (
    <>
      <span className="sr-only" role="status">
        Memuat…
      </span>
      <div aria-hidden="true">
        <div className="skel skel-title" />
        <div className="skel skel-sub" />
      </div>
      <div className="skel-grid" aria-hidden="true">
        <div className="skel skel-card" />
        <div className="skel skel-card" />
        <div className="skel skel-card" />
        <div className="skel skel-card" />
      </div>
      <div className="skel skel-block" aria-hidden="true" />
    </>
  );
}
