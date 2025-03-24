import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vanglow - Il primo social network della bellezza',
  description: 'Cerca la tua esperienza e guadagna crediti',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
