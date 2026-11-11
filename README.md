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
