/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    // Halaman yang baru saja dibuka disimpan di browser, jadi bolak-balik antar menu
    // admin terasa instan. Cache otomatis dibuang setelah simpan/hapus data.
    staleTimes: { dynamic: 30, static: 180 },
  },
};

export default nextConfig;
