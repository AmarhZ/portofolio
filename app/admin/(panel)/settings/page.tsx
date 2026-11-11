import { createClient } from '@/lib/supabase/server';
import { settingsFields } from '@/lib/admin-config';
import SingletonForm from '@/components/admin/SingletonForm';

export default async function WebsiteSettingsPage() {
  const sb = await createClient();
  const { data } = await sb.from('site_settings').select('*').eq('id', 1).maybeSingle();
  return (
    <SingletonForm
      table="site_settings"
      title="Website Settings"
      subtitle="Judul situs, deskripsi SEO, dan teks footer."
      fields={settingsFields}
      row={data}
    />
  );
}
