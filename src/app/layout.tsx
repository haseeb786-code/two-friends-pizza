import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import '@/styles/globals.css';
import { SmoothScrollProvider } from '@/components/layout/SmoothScrollProvider';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteBackground } from '@/components/layout/SiteBackground';
import { SkipToContent } from '@/components/ui/SkipToContent';
import { baseMetadata, baseViewport, restaurantJsonLd } from '@/config/metadata';

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
      <head>
        {/* JSON-LD Restaurant Structured Data */}
        <Script
          id="restaurant-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
        />
      </head>
      <body className="antialiased font-sans bg-canvas text-white selection:bg-amber-500/30 selection:text-amber-200">
        <SiteBackground />
        <SkipToContent targetId="main-content" />
        <SiteHeader />
        <SmoothScrollProvider>
          <div
            id="main-content"
            tabIndex={-1}
            className="outline-none min-h-dvh pt-14 sm:pt-16"
          >
            {children}
          </div>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
