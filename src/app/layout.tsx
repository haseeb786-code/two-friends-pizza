import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import '@/styles/globals.css';
import { SmoothScrollProvider } from '@/components/layout/SmoothScrollProvider';
import { SkipToContent } from '@/components/ui/SkipToContent';
import { baseMetadata, baseViewport } from '@/config/metadata';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
  display: 'swap',
  preload: true,
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = baseMetadata;
export const viewport: Viewport = baseViewport;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${playfairDisplay.variable} ${plusJakartaSans.variable}`}
    >
      <body className="antialiased font-sans bg-canvas text-white selection:bg-amber-500/30 selection:text-amber-200">
        <SkipToContent targetId="main-content" />
        <SmoothScrollProvider>
          <div id="main-content" tabIndex={-1} className="outline-none min-h-screen">
            {children}
          </div>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
