const links = ['home', 'about', 'education', 'experience', 'projects', 'certificates', 'resume'];

export default function Header({ name }: { name: string }) {
  const first = name.split(' ')[0].toLowerCase();
  return (
    <header className="header">
      <div className="container header-in">
        <a href="#home" className="logo">
          {first}.
        </a>
        <nav className="nav" aria-label="Navigasi utama">
          {links.map((l) => (
            <a key={l} href={`#${l}`}>
              {l}
            </a>
          ))}
        </nav>
        <a className="btn btn-deep btn-sm" href="#contact">
          contact
        </a>
      </div>
    </header>
  );
}
