import type { Metadata } from 'next';

// Halaman admin tidak boleh muncul di hasil pencarian.
export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
