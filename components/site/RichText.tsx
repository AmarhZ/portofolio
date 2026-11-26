import type { ReactNode } from 'react';

// Pengubah teks sederhana → HTML aman (React otomatis meng-escape; tidak ada HTML mentah).
// Mendukung: paragraf, "## subjudul", "### subjudul kecil", daftar "- ", daftar "1. ",
// **tebal**, `kode`, dan [teks](https://link).
const INLINE = /(\*\*[^*\n]+\*\*|`[^`\n]+`|\[[^\]\n]+\]\(https?:\/\/[^\s)]+\))/g;

function inline(text: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) return <code key={i}>{part.slice(1, -1)}</code>;
    const m = /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/.exec(part);
    if (m)
      return (
        <a key={i} href={m[2]} target="_blank" rel="noopener noreferrer">
          {m[1]}
        </a>
      );
    return part;
  });
}

export default function RichText({ text }: { text: string }) {
  const blocks = text.replace(/\r\n?/g, '\n').trim().split(/\n{2,}/);
  return (
    <div className="rich">
      {blocks.map((block, bi) => {
        const lines = block.split('\n').map((l) => l.trimEnd());
        const first = lines[0];

        if (/^###\s+/.test(first)) return <h3 key={bi}>{inline(first.replace(/^###\s+/, ''))}</h3>;
        if (/^##\s+/.test(first)) {
          const rest = lines.slice(1).join('\n').trim();
          return (
            <div key={bi}>
              <h2>{inline(first.replace(/^##\s+/, ''))}</h2>
              {rest && <p>{lines.slice(1).map((l, i) => (i === 0 ? inline(l) : [<br key={`b${i}`} />, ...inline(l)]))}</p>}
            </div>
          );
        }
        if (lines.every((l) => /^[-*]\s+/.test(l))) {
          return (
            <ul key={bi}>
              {lines.map((l, i) => (
                <li key={i}>{inline(l.replace(/^[-*]\s+/, ''))}</li>
              ))}
            </ul>
          );
        }
        if (lines.every((l) => /^\d+[.)]\s+/.test(l))) {
          return (
            <ol key={bi}>
              {lines.map((l, i) => (
                <li key={i}>{inline(l.replace(/^\d+[.)]\s+/, ''))}</li>
              ))}
            </ol>
          );
        }
        return (
          <p key={bi}>
            {lines.map((l, i) => (i === 0 ? inline(l) : [<br key={`b${i}`} />, ...inline(l)]))}
          </p>
        );
      })}
    </div>
  );
}
