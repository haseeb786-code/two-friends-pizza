import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { SmoothScrollProvider } from '@/components/layout/SmoothScrollProvider';
import { SkipToContent } from '@/components/ui/SkipToContent';
import { baseMetadata, baseViewport } from '@/config/metadata';

export const metadata: Metadata = baseMetadata;
export const viewport: Viewport = baseViewport;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
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
