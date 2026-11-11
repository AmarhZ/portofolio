'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Field } from '@/lib/admin-config';

type Props = {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
};

export default function FieldInput({ field, value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const id = `f-${field.name}`;
  const str = value == null ? '' : String(value);

  async function upload(file: File) {
    setUploading(true);
    setUploadError('');
    try {
      const sb = createClient();
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `${field.folder ?? 'misc'}/${Date.now()}-${safe}`;
      const { error } = await sb.storage.from('media').upload(path, file);
      if (error) throw error;
      const { data } = sb.storage.from('media').getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Gagal mengunggah file.');
    } finally {
      setUploading(false);
    }
  }

  if (field.type === 'boolean') {
    return (
      <label className="check">
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
        <span>{field.label}</span>
      </label>
    );
  }

  return (
    <div className="field">
      <label htmlFor={id}>{field.label}</label>

      {field.type === 'textarea' && (
        <textarea id={id} rows={4} value={str} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} />
      )}

      {field.type === 'select' && (
        <select id={id} value={str} onChange={(e) => onChange(e.target.value)}>
          {field.options?.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      )}

      {(field.type === 'text' || field.type === 'url' || field.type === 'email' || field.type === 'tags') && (
        <input
          id={id}
          type={field.type === 'url' ? 'url' : field.type === 'email' ? 'email' : 'text'}
          value={str}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
        />
      )}

      {field.type === 'number' && (
        <input id={id} type="number" value={str} onChange={(e) => onChange(e.target.value)} />
      )}

      {(field.type === 'image' || field.type === 'file') && (
        <div className="upload">
          {field.type === 'image' && str && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="upload-preview" src={str} alt="Pratinjau" />
          )}
          <input id={id} type="text" value={str} onChange={(e) => onChange(e.target.value)} placeholder="Tempel link, atau unggah file →" />
          <label className="btn btn-line btn-sm upload-btn">
            {uploading ? 'Mengunggah…' : 'Unggah'}
            <input
              type="file"
              hidden
              accept={field.type === 'image' ? 'image/*' : '.pdf,image/*'}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void upload(f);
                e.target.value = '';
              }}
            />
          </label>
        </div>
      )}

      {field.help && <small>{field.help}</small>}
      {uploadError && <small className="err">{uploadError}</small>}
    </div>
  );
}
