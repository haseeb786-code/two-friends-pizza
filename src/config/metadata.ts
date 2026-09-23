import type { Metadata, Viewport } from 'next';
import { BUSINESS_CONFIG } from './business';

/**
 * Standard Viewport Configuration for Next.js 15
 * Enforces mobile-first responsive viewport and dark status bar theme color.
 */
export const baseViewport: Viewport = {
  themeColor: '#070707',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

/**
 * Centralized SEO & Social Metadata Configuration
 * Uses placeholder site URLs and asset targets (no real business copy or tracking keys).
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://twofriendspizza.example.com'),
  title: {
    default: `${BUSINESS_CONFIG.name} | ${BUSINESS_CONFIG.tagline}`,
    template: `%s | ${BUSINESS_CONFIG.name}`,
  },
  description: 'Premium artisanal wood-fired pizzas and flame-grilled gourmet burgers crafted with signature ingredients.',
  keywords: [
    'pizza',
    'wood-fired pizza',
    'gourmet burgers',
    'craft burgers',
    'fast food',
    'artisan food',
    'food delivery',
  ],
  authors: [{ name: BUSINESS_CONFIG.name }],
  creator: BUSINESS_CONFIG.name,
  publisher: BUSINESS_CONFIG.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: BUSINESS_CONFIG.name,
    title: `${BUSINESS_CONFIG.name} | ${BUSINESS_CONFIG.tagline}`,
    description: 'Experience artisanal wood-fired pizza and flame-grilled gourmet burgers.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${BUSINESS_CONFIG.name} - Artisanal Pizzas & Gourmet Burgers`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BUSINESS_CONFIG.name} | ${BUSINESS_CONFIG.tagline}`,
    description: 'Experience artisanal wood-fired pizza and flame-grilled gourmet burgers.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};
