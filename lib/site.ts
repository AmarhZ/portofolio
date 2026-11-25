// Alamat website. Bisa diganti lewat environment variable NEXT_PUBLIC_SITE_URL (mis. saat pakai domain sendiri).
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://portofolio-67.vercel.app').replace(/\/+$/, '');
export const siteHost = siteUrl.replace(/^https?:\/\//, '');
