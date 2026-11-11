'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { TableConfig } from '@/lib/admin-config';
import { saveRow, deleteRow } from '@/app/admin/actions';
import FieldInput from './FieldInput';
import { toFormValues, toPayload } from './formUtils';

type Row = Record<string, unknown> & { id: string };

export default function CrudManager({ config, rows }: { config: TableConfig; rows: Row[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState<Row | 'new' | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  function open(row: Row | 'new') {
    setError('');
    setEditing(row);
    setValues(toFormValues(config.fields, row === 'new' ? null : row));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const id = editing && editing !== 'new' ? editing.id : null;
    start(async () => {
      const res = await saveRow(config.table, id, toPayload(config.fields, values));
      if (res.error) return setError(res.error);
      setEditing(null);
      router.refresh();
    });
  }

  function remove(row: Row) {
    if (!window.confirm(`Hapus "${String(row[config.titleKey])}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    start(async () => {
      const res = await deleteRow(config.table, row.id);
      if (res.error) return setError(res.error);
      if (editing && editing !== 'new' && editing.id === row.id) setEditing(null);
      router.refresh();
    });
  }

  const shown = rows.filter((r) => String(r[config.titleKey] ?? '').toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>{config.title}</h1>
          <p>{config.subtitle}</p>
        </div>
        <button type="button" className="btn btn-deep btn-sm" onClick={() => open('new')}>
          + Tambah baru
        </button>
      </div>

      <div className="adm-cols">
        <section className="adm-card adm-grow">
          <input className="search" type="search" placeholder="Cari…" aria-label="Cari" value={query} onChange={(e) => setQuery(e.target.value)} />
          {shown.length === 0 ? (
            <p className="empty">Belum ada data.</p>
          ) : (
            <ul className="rows">
              {shown.map((r) => (
                <li key={r.id} className={editing && editing !== 'new' && editing.id === r.id ? 'row on' : 'row'}>
                  <div className="row-main">
                    <strong>{String(r[config.titleKey] ?? '')}</strong>
                    {config.subKey && <span>{String(r[config.subKey] ?? '')}</span>}
                    {config.table === 'projects' && (
                      <span className={r.published ? 'tag tag-on' : 'tag'}>{r.published ? 'Tayang' : 'Draft'}</span>
                    )}
                  </div>
                  <div className="row-actions">
                    <button type="button" className="link-btn" onClick={() => open(r)}>
                      Edit
                    </button>
                    <button type="button" className="link-btn danger" onClick={() => remove(r)} disabled={pending}>
                      Hapus
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {editing && (
          <form className="adm-card adm-form" onSubmit={submit}>
            <h2>{editing === 'new' ? 'Tambah baru' : 'Edit'}</h2>
            {config.fields.map((f) => (
              <FieldInput key={f.name} field={f} value={values[f.name]} onChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))} />
            ))}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div className="btn-row">
              <button type="submit" className="btn btn-deep" disabled={pending}>
                {pending ? 'Menyimpan…' : 'Simpan'}
              </button>
              <button type="button" className="btn btn-line" onClick={() => setEditing(null)}>
                Batal
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
