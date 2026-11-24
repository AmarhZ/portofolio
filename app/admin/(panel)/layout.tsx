import { createClient, hasSupabase } from '@/lib/supabase/server';
import AdminShell from '@/components/admin/AdminShell';
import SetupNotice from '@/components/admin/SetupNotice';
import { signOut } from '../actions';

export const dynamic = 'force-dynamic';

// Pemeriksaan login dilakukan di middleware.ts, dan akses data dijaga RLS di database.
// Layout ini sengaja tidak memanggil auth lagi supaya tidak ada putaran jaringan ganda.
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!hasSupabase()) return <SetupNotice />;

  const sb = await createClient();
  const { count } = await sb.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false);

  return (
    <AdminShell unread={count ?? 0} signOutAction={signOut}>
      {children}
    </AdminShell>
  );
}
