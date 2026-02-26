import type { Metadata } from 'next';
import Providers from './providers';

export const metadata: Metadata = {
  other: {
    'base:app_id': '69a02afe9a3599e1bbf9866c',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}