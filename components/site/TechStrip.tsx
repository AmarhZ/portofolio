const text = '</> · { } · git push · npm run dev · SELECT * · 01101001 · API · ; · ( ) => · ';

export default function TechStrip() {
  return (
    <div className="strip" aria-hidden="true">
      <div className="strip-track">
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}
