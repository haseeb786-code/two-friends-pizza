import type { Metadata } from 'next';
import '@/styles/globals.css';
import { BUSINESS_CONFIG } from '@/config/business';

export const metadata: Metadata = {
  title: `${BUSINESS_CONFIG.name} | ${BUSINESS_CONFIG.tagline}`,
  description: 'Premium artisanal pizzas and gourmet flame-grilled burgers made with fresh ingredients.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
