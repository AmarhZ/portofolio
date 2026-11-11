export default function Footer({ name, text }: { name: string; text: string }) {
  const first = name.split(' ')[0].toLowerCase();
  return (
    <footer className="footer">
      <div className="container footer-in">
        <span className="logo logo-light">{first}.</span>
        <span>{text || `© ${new Date().getFullYear()} ${name}. Semua hak dilindungi.`}</span>
        <a href="#home">Kembali ke atas ↑</a>
      </div>
    </footer>
  );
}
