'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

const links = ['home', 'about', 'education', 'experience', 'projects', 'certificates', 'resume'];
const sectionIds = [...links, 'contact'];

export default function Header({ name }: { name: string }) {
  const first = name.split(' ')[0].toLowerCase();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const bar = useRef<HTMLDivElement>(null);

  // Progress bar + bayangan header saat di-scroll.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.current?.style.setProperty('--p', String(max > 0 ? Math.min(1, y / max) : 0));
      setScrolled(y > 8);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Menandai menu sesuai section yang sedang tampil.
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const els = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Tutup menu mobile dengan Escape atau saat layar melebar.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onResize = () => window.innerWidth > 1024 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={scrolled ? 'header scrolled' : 'header'}>
      <div className="container header-in">
        <a href="#home" className="logo" onClick={close}>
          {first}.
        </a>
        <nav id="site-nav" className={open ? 'nav open' : 'nav'} aria-label="Navigasi utama">
          {links.map((l, i) => (
            <a
              key={l}
              href={`#${l}`}
              className={active === l ? 'active' : undefined}
              aria-current={active === l ? 'true' : undefined}
              style={{ '--k': i } as CSSProperties}
              onClick={close}
            >
              {l}
            </a>
          ))}
          <a href="#contact" className="nav-contact" style={{ '--k': links.length } as CSSProperties} onClick={close}>
            contact
          </a>
        </nav>
        <a className="btn btn-deep btn-sm header-cta" href="#contact">
          contact
        </a>
        <button
          type="button"
          className="burger"
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <div ref={bar} className="progress" aria-hidden="true" />
    </header>
  );
}
