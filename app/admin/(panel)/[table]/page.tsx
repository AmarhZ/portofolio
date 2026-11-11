import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { listConfigs } from '@/lib/admin-config';
import CrudManager from '@/components/admin/CrudManager';

export default async function ManageListPage({ params }: { params: Promise<{ table: string }> }) {
  const { table } = await params;
  const config = listConfigs[table];
  if (!config) notFound();

  const sb = await createClient();
  const { data } = await sb.from(config.table).select('*').order('sort_order');
  return <CrudManager key={table} config={config} rows={(data ?? []) as any} />;
}
