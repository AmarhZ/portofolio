import { getProjectBySlug } from '@/lib/content';
import { renderOg, renderProjectOg } from '@/lib/og';

export const alt = 'Detail project';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { project } = await getProjectBySlug(slug);
  return project ? renderProjectOg(project) : renderOg();
}
