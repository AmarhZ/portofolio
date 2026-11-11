'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Field } from '@/lib/admin-config';
import { saveSingleton } from '@/app/admin/actions';
import FieldInput from './FieldInput';
import { toFormValues, toPayload } from './formUtils';

export default function SingletonForm({
  table,
  title,
  subtitle,
  fields,
  row,
}: {
  table: string;
  title: string;
  subtitle: string;
  fields: Field[];
  row: Record<string, unknown> | null;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [values, setValues] = useState<Record<string, unknown>>(() => toFormValues(fields, row));
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    start(async () => {
      const res = await saveSingleton(table, toPayload(fields, values));
      if (res.error) return setMsg({ ok: false, text: res.error });
      setMsg({ ok: true, text: 'Tersimpan. Perubahan sudah tampil di website.' });
      router.refresh();
    });
  }

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      <form className="adm-card adm-form adm-wide" onSubmit={submit}>
        {fields.map((f) => (
          <FieldInput key={f.name} field={f} value={values[f.name]} onChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))} />
        ))}
        {msg && (
          <p className={msg.ok ? 'form-ok' : 'form-error'} role={msg.ok ? 'status' : 'alert'}>
            {msg.text}
          </p>
        )}
        <div className="btn-row">
          <button type="submit" className="btn btn-deep" disabled={pending}>
            {pending ? 'Menyimpan…' : 'Simpan perubahan'}
          </button>
        </div>
      </form>
    </>
  );
}
