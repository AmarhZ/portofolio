import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient, hasSupabase } from '@/lib/supabase/server';
import AdminNav from '@/components/admin/AdminNav';
import SetupNotice from '@/components/admin/SetupNotice';
import { signOut } from '../actions';

export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!hasSupabase()) return <SetupNotice />;

  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect('/admin/login');

  const { count } = await sb.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false);

  return (
    <div className="adm">
      <aside className="adm-side">
        <div className="adm-brand">
          <span className="login-logo">a.</span>
          <div>
            <strong>Admin Panel</strong>
            <small>Portofolio</small>
          </div>
        </div>
        <AdminNav unread={count ?? 0} />
        <div className="adm-side-foot">
          <Link href="/" target="_blank" className="btn btn-outline-clay btn-sm">
            Lihat website ↗
          </Link>
          <form action={signOut}>
            <button type="submit" className="link-btn light">
              Keluar
            </button>
          </form>
        </div>
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
