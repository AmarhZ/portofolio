'use client';

import { useEffect } from 'react';

// Memunculkan elemen [data-reveal] dan anak dari [data-stagger] saat masuk layar.
// Elemen yang muncul bersamaan diberi jeda bertahap (--i) supaya terasa berurutan.
export default function RevealOnScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal], [data-stagger] > *'));
    root.classList.add('rv-ready');

    if (!('IntersectionObserver' in window)) {
      targets.forEach((t) => t.classList.add('is-in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        let k = 0;
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          el.style.setProperty('--i', String(Math.min(k++, 6)));
          el.classList.add('is-in');
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return null;
}
