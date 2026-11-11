import { createClient } from '@/lib/supabase/server';
import type { Message } from '@/lib/types';
import MessageList from '@/components/admin/MessageList';

export default async function ManageMessagesPage() {
  const sb = await createClient();
  const { data } = await sb.from('messages').select('*').order('created_at', { ascending: false });
  return <MessageList messages={(data ?? []) as Message[]} />;
}
