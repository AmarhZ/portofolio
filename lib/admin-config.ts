export type Field = {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'tags' | 'boolean' | 'image' | 'file' | 'number' | 'url' | 'email';
  options?: string[];
  placeholder?: string;
  help?: string;
  required?: boolean;
  folder?: string; // subfolder di bucket "media"
};

export type TableConfig = {
  table: string;
  title: string;
  subtitle: string;
  titleKey: string;
  subKey?: string;
  fields: Field[];
};

export const listConfigs: Record<string, TableConfig> = {
  education: {
    table: 'education',
    title: 'Manage Education',
    subtitle: 'Riwayat pendidikan yang tampil di bagian Education.',
    titleKey: 'institution',
    subKey: 'major',
    fields: [
      { name: 'institution', label: 'Institusi', type: 'text', required: true },
      { name: 'major', label: 'Jurusan', type: 'text' },
      { name: 'start_year', label: 'Tahun mulai', type: 'text', placeholder: '2022' },
      { name: 'end_year', label: 'Tahun selesai', type: 'text', placeholder: '2026 / Sekarang' },
      { name: 'description', label: 'Deskripsi', type: 'textarea' },
      { name: 'sort_order', label: 'Urutan', type: 'number', help: 'Angka kecil tampil lebih dulu.' },
    ],
  },
  experience: {
    table: 'experience',
    title: 'Manage Experience',
    subtitle: 'Magang dan pekerjaan.',
    titleKey: 'position',
    subKey: 'company',
    fields: [
      { name: 'company', label: 'Nama perusahaan', type: 'text', required: true },
      { name: 'position', label: 'Posisi', type: 'text', required: true },
      { name: 'kind', label: 'Jenis', type: 'select', options: ['Magang', 'Pekerjaan', 'Freelance'] },
      { name: 'start_date', label: 'Mulai', type: 'text', placeholder: 'Jan 2025' },
      { name: 'end_date', label: 'Selesai', type: 'text', placeholder: 'Mar 2025 / Sekarang' },
      { name: 'responsibilities', label: 'Tanggung jawab', type: 'textarea', help: 'Satu poin per baris.' },
      { name: 'sort_order', label: 'Urutan', type: 'number' },
    ],
  },
  projects: {
    table: 'projects',
    title: 'Manage Projects',
    subtitle: 'Tambah, ubah, atau sembunyikan project yang tampil di website.',
    titleKey: 'title',
    subKey: 'category',
    fields: [
      { name: 'title', label: 'Nama project', type: 'text', required: true },
      { name: 'category', label: 'Kategori', type: 'select', options: ['Web', 'Mobile', 'UI/UX', 'Lainnya'] },
      { name: 'description', label: 'Deskripsi', type: 'textarea' },
      { name: 'image_url', label: 'Gambar project', type: 'image', folder: 'projects' },
      { name: 'tech', label: 'Teknologi', type: 'tags', help: 'Pisahkan dengan koma.' },
      { name: 'demo_url', label: 'Link demo', type: 'url', placeholder: 'https://' },
      { name: 'repo_url', label: 'Link repository', type: 'url', placeholder: 'https://github.com/…' },
      { name: 'published', label: 'Tampilkan di website', type: 'boolean' },
      { name: 'sort_order', label: 'Urutan', type: 'number' },
    ],
  },
  certificates: {
    table: 'certificates',
    title: 'Manage Certificates',
    subtitle: 'Sertifikat dan prestasi.',
    titleKey: 'name',
    subKey: 'issuer',
    fields: [
      { name: 'name', label: 'Nama sertifikat', type: 'text', required: true },
      { name: 'issuer', label: 'Penerbit', type: 'text' },
      { name: 'issued_at', label: 'Tanggal terbit', type: 'text', placeholder: 'Mar 2025' },
      { name: 'proof_url', label: 'Bukti (file/link)', type: 'file', folder: 'certificates' },
      { name: 'sort_order', label: 'Urutan', type: 'number' },
    ],
  },
};

export const profileFields: Field[] = [
  { name: 'full_name', label: 'Nama lengkap', type: 'text', required: true },
  { name: 'profession', label: 'Profesi', type: 'text', required: true },
  { name: 'tagline', label: 'Tagline', type: 'text' },
  { name: 'summary', label: 'Ringkasan (Home)', type: 'textarea' },
  { name: 'avatar_url', label: 'Foto profil', type: 'image', folder: 'profile', help: 'Foto hitam-putih dengan latar putih paling cocok dengan desain.' },
  { name: 'open_to_work', label: 'Tampilkan label "Terbuka untuk magang & pekerjaan"', type: 'boolean' },
  { name: 'bio_title', label: 'Kalimat pembuka (About)', type: 'textarea' },
  { name: 'bio', label: 'Biografi (About)', type: 'textarea' },
  { name: 'skills', label: 'Keahlian', type: 'tags', help: 'Pisahkan dengan koma.' },
  { name: 'interests', label: 'Minat', type: 'tags', help: 'Pisahkan dengan koma.' },
  { name: 'resume_url', label: 'CV (PDF)', type: 'file', folder: 'resume' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'linkedin', label: 'LinkedIn', type: 'url' },
  { name: 'github', label: 'GitHub', type: 'url' },
  { name: 'instagram', label: 'Instagram', type: 'url' },
];

export const settingsFields: Field[] = [
  { name: 'site_title', label: 'Judul website', type: 'text', required: true },
  { name: 'meta_description', label: 'Deskripsi (SEO)', type: 'textarea' },
  { name: 'footer_text', label: 'Teks footer', type: 'text', help: 'Kosongkan untuk memakai teks hak cipta otomatis.' },
];
