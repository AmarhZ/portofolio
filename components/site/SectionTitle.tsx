export default function SectionTitle({ title, hint }: { title: string; hint: string }) {
  return (
    <h2 className="section-title">
      {title}.<span className="section-hint">{hint}</span>
    </h2>
  );
}
