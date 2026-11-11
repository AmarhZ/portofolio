'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  return (
    <nav aria-label="Menu admin" className="adm-nav">
      {items.map((i) => {
        const on = i.href === '/admin' ? path === '/admin' : path.startsWith(i.href);
        return (
          <Link key={i.href} href={i.href} aria-current={on ? 'page' : undefined} className={on ? 'on' : ''}>
            {i.label}
            {i.href === '/admin/messages' && unread > 0 && <span className="badge-n">{unread}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
