import { ImageResponse } from 'next/og';

// Favicon: kotak hijau tua dengan huruf "a." berwarna clay.
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
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
          fontSize: 46,
          fontWeight: 700,
          borderRadius: 14,
        }}
      >
        a.
      </div>
    ),
    { ...size }
  );
}
