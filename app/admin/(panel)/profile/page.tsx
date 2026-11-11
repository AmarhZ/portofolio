import { createClient } from '@/lib/supabase/server';
import { profileFields } from '@/lib/admin-config';
import SingletonForm from '@/components/admin/SingletonForm';

export default async function ManageProfilePage() {
  const sb = await createClient();
  const { data } = await sb.from('profile').select('*').eq('id', 1).maybeSingle();
  return (
    <SingletonForm
      table="profile"
      title="Manage Profile"
      subtitle="Data utama untuk Home, About, Resume, dan Contact."
      fields={profileFields}
      row={data}
    />
  );
}
