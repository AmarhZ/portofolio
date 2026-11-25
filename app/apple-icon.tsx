import { ImageResponse } from 'next/og';

// Ikon untuk layar utama iPhone/iPad (sudut dibulatkan otomatis oleh iOS).
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#30360E',
          color: '#E2D4B9',
          fontSize: 128,
          fontWeight: 700,
        }}
      >
        a.
      </div>
    ),
    { ...size }
  );
}
