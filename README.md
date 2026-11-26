# Portofolio — Amar Hamzah Al-Ma'sum

Website portofolio satu halaman + dashboard admin. Dibangun dengan **Next.js 15 (App Router, TypeScript)** dan **Supabase** (Postgres, Auth, Storage).

Palet warna: Deep Green `#30360E`, Olive `#787F56`, Clay Beige `#E2D4B9`.

## Fitur

**Website utama** (`/`): Home, About, Education, Experience, Projects (dengan filter kategori), Certificates, Resume (unduh CV), Contact (form pesan masuk ke database).

**Dashboard admin** (`/admin`): Dashboard, Manage Profile, Manage Education, Manage Experience, Manage Projects, Manage Certificates, Manage Messages, Website Settings. Mendukung unggah foto, gambar project, CV (PDF), dan bukti sertifikat.

## Menjalankan

```bash
npm install
cp .env.example .env.local   # lalu isi nilainya (langkah 2)
npm run dev
```

Buka http://localhost:3000. **Tanpa Supabase pun website tetap tampil** dengan konten contoh; admin dan form kontak baru aktif setelah Supabase terhubung.

## Setup Supabase

1. Buat project di https://supabase.com.
2. **Project Settings → API**: salin `Project URL` dan `anon public key` ke `.env.local`.
3. **SQL Editor**: tempel seluruh isi `supabase/schema.sql`, lalu Run. Ini membuat tabel, aturan keamanan (RLS), dan bucket `media`.
4. **Authentication → Providers → Email**: matikan **Allow new users to sign up**. Ini penting karena semua pengguna yang login dianggap admin.
5. **Authentication → Users → Add user**: buat satu akun admin (email + password).
6. Buka `/admin/login`, masuk, lalu isi **Manage Profile** (termasuk unggah CV).

## Struktur

```
app/
  page.tsx                  Website utama (satu halaman)
  actions.ts                Server action form kontak
  admin/login/              Halaman login
  admin/(panel)/            Dashboard + halaman Manage (dilindungi login)
components/site/            Section website utama
components/admin/           Form CRUD, upload, daftar pesan
lib/                        Klien Supabase, tipe, konfigurasi field admin
middleware.ts               Menyegarkan sesi & melindungi /admin
supabase/schema.sql         Skema database + RLS + storage
```

## Menambah field atau halaman Manage baru

Halaman Education/Experience/Projects/Certificates digerakkan oleh konfigurasi di `lib/admin-config.ts`. Untuk menambah field: tambahkan kolom di `supabase/schema.sql` (atau `alter table` di SQL Editor), lalu tambahkan entri field di konfigurasi tersebut.

## Deploy

Deploy ke Vercel: impor repo, isi dua environment variable yang sama dengan `.env.local`, lalu deploy.

## Catatan keamanan

- Akses tulis dijaga oleh RLS di database, bukan hanya oleh tampilan admin.
- Jangan membuka pendaftaran pengguna publik di Supabase Auth.
- Form kontak memakai honeypot sederhana; tambahkan CAPTCHA atau rate limit bila spam meningkat.

## Performa admin

- `vercel.json` memilih region **Singapore (sin1)** supaya server dekat dengan database Supabase. Ini faktor kecepatan terbesar. Pastikan region Supabase-mu juga Singapore.
- `middleware.ts` memeriksa login dari cookie lokal (tanpa panggilan jaringan). Keamanan data tetap dijaga RLS, dan aksi simpan/hapus tetap memverifikasi pengguna di server.
- `app/admin/(panel)/loading.tsx` menampilkan skeleton seketika saat pindah menu.
- `next.config.mjs` menyimpan halaman yang baru dibuka selama 30 detik di browser (`staleTimes`). Cache otomatis dibuang setelah simpan/hapus. Pesan baru dari form kontak bisa tertunda sampai 30 detik muncul bila kamu bolak-balik ke halaman Messages.

## SEO & pratinjau link

- Domain dibaca dari `NEXT_PUBLIC_SITE_URL` (opsional; bawaannya `https://portofolio-67.vercel.app`). Isi di Vercel bila nanti memakai domain sendiri, lalu Redeploy.
- Otomatis tersedia: `/sitemap.xml`, `/robots.txt`, favicon (`/icon`, `/apple-icon`), gambar pratinjau Open Graph/Twitter (`/opengraph-image`, `/twitter-image`), data terstruktur JSON-LD (Person), dan halaman 404.
- Nama dan profesi pada gambar pratinjau diambil dari **Manage Profile**. WhatsApp/LinkedIn menyimpan cache pratinjau, jadi link lama mungkin butuh beberapa waktu untuk berubah.
- Halaman `/admin` memakai `noindex` dan di-Disallow pada robots.txt.

## Keamanan

1. Di Supabase → SQL Editor, jalankan `supabase/schema.sql` (jika belum), lalu `supabase/security.sql`.
   **Ganti dulu** `GANTI_DENGAN_EMAILMU@gmail.com` di baris atas `security.sql` dengan email akun admin. Jika lupa, skrip berhenti dengan error.
   Jika email salah, admin tidak bisa menyimpan data. Perbaiki dengan menjalankan `insert into admin_emails values ('emailmu@...');` (huruf kecil).
2. Yang dilakukan `security.sql`: hanya email di `admin_emails` yang bisa mengubah data atau mengunggah file; form kontak dibatasi di database (maks 3 pesan/email per 10 menit, pesan identik ditolak 1 jam, maks 60 pesan/jam total); bucket `media` dibatasi 10 MB dan PNG/JPG/WebP/GIF/PDF (tanpa SVG).
3. Form kontak juga memakai honeypot dan jeda minimal pengisian.
4. Header keamanan (nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy, HSTS) diatur di `next.config.mjs`.
5. Belum ada: Content-Security-Policy, CAPTCHA (mis. Turnstile), dan pembatasan per IP.
6. Jika `sb_secret_...` / service_role key pernah terlihat orang lain, putar (rotate) di Supabase → Project Settings → API Keys. Website ini hanya memakai anon/publishable key.

## Halaman detail project

- Setiap project punya halaman sendiri di `/projects/alamat-project`. Kartu di bagian Projects otomatis menautkan ke sana.
- **Jalankan sekali** `supabase/projects-detail.sql` di Supabase → SQL Editor. Skrip ini menambah kolom `slug`, `details`, `role`, `year`, memberi slug pada project yang sudah ada, dan aman dijalankan berulang. Sebelum dijalankan, menyimpan project dari admin akan menampilkan pesan yang mengarahkan ke skrip ini.
- Di **Manage Projects** ada kolom baru: Alamat halaman (slug, otomatis bila kosong), Detail project, Peran, Tahun. Mengganti nama project tidak mengubah slug, jadi link yang sudah dibagikan tetap berlaku.
- Format kolom Detail: baris kosong memisahkan paragraf; `## Subjudul`; `### Subjudul kecil`; daftar dengan `- ` atau `1. `; `**tebal**`; `` `kode` ``; `[teks](https://link)`. HTML mentah tidak dijalankan.
- Tiap halaman punya judul, deskripsi, gambar pratinjau Open Graph sendiri, dan masuk ke `sitemap.xml`. Project dengan "Tampilkan di website" nonaktif akan 404.

## Notifikasi email pesan baru

Saat ada pesan dari form kontak, email pemberitahuan dikirim lewat [Resend](https://resend.com). Pesan tetap tersimpan di database walaupun email gagal terkirim.

1. Daftar di resend.com (gratis) → **API Keys** → buat key.
2. Di Vercel → Settings → Environment Variables, tambahkan:
   - `RESEND_API_KEY` = key tadi
   - `NOTIFY_EMAIL_TO` = email tempat notifikasi diterima (boleh beberapa, pisahkan koma)
   - `NOTIFY_EMAIL_FROM` (opsional) = mis. `Portofolio <halo@domainmu.com>`, hanya jika domain sudah diverifikasi di Resend
3. Redeploy.

Tanpa domain sendiri, Resend hanya mau mengirim ke email yang dipakai mendaftar akun Resend, jadi daftarkan dengan email yang sama dengan `NOTIFY_EMAIL_TO`. Tombol Reply di email langsung membalas pengirim pesan. Jika dua variabel pertama kosong, fitur ini dilewati. Batas 60 pesan/jam dari `security.sql` juga membatasi jumlah email.
