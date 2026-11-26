import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';
import { getContent } from '@/lib/content';
import { withSlugs } from '@/lib/projects';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects } = await getContent();
  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    ...withSlugs(projects).map((p) => ({
      url: `${siteUrl}/projects/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
