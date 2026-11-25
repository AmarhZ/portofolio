import './globals.css';
import type { Metadata, Viewport } from 'next';
import { getContent } from '@/lib/content';
import { siteUrl } from '@/lib/site';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F6F0E3',
};

// Menandai bahwa JS aktif (animasi scroll hanya dipakai bila JS jalan).
// Bila animasi gagal siap dalam 4 detik, konten dimunculkan apa adanya.
const jsFlag =
  "(function(){var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!d.classList.contains('rv-ready'))d.classList.add('rv-fail')},4000)})();";

export async function generateMetadata(): Promise<Metadata> {
  const { settings, profile } = await getContent();
  return {
    metadataBase: new URL(siteUrl),
    title: { default: settings.site_title, template: `%s · ${profile.full_name}` },
    description: settings.meta_description,
    applicationName: profile.full_name,
    authors: [{ name: profile.full_name, url: siteUrl }],
    creator: profile.full_name,
    alternates: { canonical: '/' },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      url: siteUrl,
      siteName: profile.full_name,
      title: settings.site_title,
      description: settings.meta_description,
      locale: 'id_ID',
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.site_title,
      description: settings.meta_description,
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
