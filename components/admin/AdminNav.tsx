'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const items = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/profile', label: 'Manage Profile' },
  { href: '/admin/education', label: 'Manage Education' },
  { href: '/admin/experience', label: 'Manage Experience' },
  { href: '/admin/projects', label: 'Manage Projects' },
  { href: '/admin/certificates', label: 'Manage Certificates' },
  { href: '/admin/messages', label: 'Manage Messages' },
  { href: '/admin/settings', label: 'Website Settings' },
];

export default function AdminNav({ unread }: { unread: number }) {
  const path = usePathname();
  // Menu langsung menyala begitu diklik, tanpa menunggu server selesai memuat halaman.
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    setPending(null);
  }, [path]);

  const current = pending ?? path;

  return (
    <nav aria-label="Menu admin" className="adm-nav">
      {items.map((i) => {
        const on = i.href === '/admin' ? current === '/admin' : current.startsWith(i.href);
        return (
          <Link
            key={i.href}
            href={i.href}
            aria-current={on ? 'page' : undefined}
            className={on ? 'on' : ''}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
              setPending(i.href);
            }}
          >
            {i.label}
            {i.href === '/admin/messages' && unread > 0 && <span className="badge-n">{unread}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
