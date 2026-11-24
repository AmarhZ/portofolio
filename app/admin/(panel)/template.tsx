// Dirender ulang setiap pindah halaman, sehingga animasi masuk halaman bermain sekali per navigasi.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
