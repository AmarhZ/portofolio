export default function SetupNotice() {
  return (
    <main className="setup">
      <div className="adm-card">
        <h1>Supabase belum dikonfigurasi</h1>
        <ol>
          <li>Buat project di supabase.com, lalu jalankan <code>supabase/schema.sql</code> di SQL Editor.</li>
          <li>Salin <code>.env.example</code> menjadi <code>.env.local</code> dan isi URL serta anon key.</li>
          <li>Buat 1 akun admin di Supabase → Authentication → Users.</li>
          <li>Jalankan ulang <code>npm run dev</code>, lalu buka <code>/admin</code>.</li>
        </ol>
      </div>
    </main>
  );
}
