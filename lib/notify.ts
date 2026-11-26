import { siteUrl } from './site';

export type NewMessage = { name: string; email: string; message: string };

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export function buildEmail(m: NewMessage) {
  const name = m.name.length > 80 ? `${m.name.slice(0, 79)}…` : m.name;
  const inbox = `${siteUrl}/admin/messages`;
  const subject = `Pesan baru dari ${name}`;
  const text = `${m.name} (${m.email}) mengirim pesan lewat websitemu:\n\n${m.message}\n\n— Balas langsung email ini untuk membalas ${m.name}.\nLihat semua pesan: ${inbox}`;
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#30360E">
  <h2 style="margin:0 0 4px">Pesan baru di portofoliomu</h2>
  <p style="margin:0 0 20px;color:#4E5532">${esc(m.name)} &lt;${esc(m.email)}&gt;</p>
  <div style="background:#F6F0E3;border-radius:12px;padding:18px 20px;white-space:pre-wrap;line-height:1.6">${esc(m.message)}</div>
  <p style="margin:20px 0 0;color:#4E5532;font-size:14px">Balas langsung email ini untuk membalas ${esc(m.name)}.</p>
  <p style="margin:8px 0 0"><a href="${inbox}" style="color:#30360E;font-weight:bold">Buka kotak pesan →</a></p>
</div>`;
  return { subject, text, html };
}

// Mengirim email pemberitahuan lewat Resend (https://resend.com).
// Tidak pernah melempar error: pesan sudah tersimpan di database, email hanya tambahan.
// Aktif bila RESEND_API_KEY dan NOTIFY_EMAIL_TO diisi; bila tidak, dilewati diam-diam.
export async function notifyNewMessage(m: NewMessage): Promise<{ sent: boolean; reason?: string }> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL_TO;
  if (!key || !to) return { sent: false, reason: 'not_configured' };

  const from = process.env.NOTIFY_EMAIL_FROM || 'Portofolio <onboarding@resend.dev>';
  const { subject, text, html } = buildEmail(m);
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: to.split(',').map((s) => s.trim()).filter(Boolean),
        reply_to: m.email,
        subject,
        text,
        html,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(`[notify] Resend menolak (HTTP ${res.status}): ${(await res.text()).slice(0, 300)}`);
      return { sent: false, reason: `http_${res.status}` };
    }
    return { sent: true };
  } catch (e) {
    console.error('[notify] Gagal mengirim email:', e instanceof Error ? e.message : e);
    return { sent: false, reason: 'network' };
  }
}
