import { Metadata, Viewport } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://twofriendspizza.pk';

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Two Friends Pizza — Dosti Ka Slice',
    template: '%s | Two Friends Pizza',
  },
  description:
    'Two Friends Pizza — Dosti Ka Slice. Freshly baked pizzas, crispy zinger burgers, fresh shawarma, crispy chicken, and deals in Rawat. Order now: 0331-0479696.',
  keywords: [
    'two friends pizza',
    'dosti ka slice',
    'pizza rawat',
    'burger rawat',
    'shawarma rawat',
    'fast food rawat',
    'pizza chak belli road',
    'pizza al-haaj afridi market',
    'crown crust pizza',
    'malai boti pizza',
    'zinger burger rawat',
    'food rawat islamabad',
  ],
  authors: [{ name: 'Two Friends Pizza' }],
  creator: 'Two Friends Pizza',
  publisher: 'Two Friends Pizza',
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
    locale: 'en_PK',
    url: SITE_URL,
    siteName: 'Two Friends Pizza',
    title: 'Two Friends Pizza — Dosti Ka Slice',
    description:
      'Freshly baked pizzas, crispy zinger burgers, fresh shawarma, and deals in Rawat. Order: 0331-0479696.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Two Friends Pizza — Dosti Ka Slice, Rawat',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Two Friends Pizza — Dosti Ka Slice',
    description:
      'Freshly baked pizzas, crispy zinger burgers, fresh shawarma, and deals in Rawat. Order: 0331-0479696.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const baseViewport: Viewport = {
  themeColor: '#070707',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

/**
 * JSON-LD structured data — Restaurant schema
 * Enables Google rich results (business name, address, phone, menu).
 */
export const restaurantJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Two Friends Pizza',
  description: 'Dosti Ka Slice — Fresh pizzas, crispy burgers, shawarma and deals.',
  url: SITE_URL,
  telephone: '03310479696',
  servesCuisine: ['Pizza', 'Burger', 'Shawarma', 'Fast Food'],
  priceRange: '₨₨',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Al-Haaj Afridi Market, Chota Mera, Main Chak Belli Road Rawat',
    addressLocality: 'Rawat',
    addressCountry: 'PK',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 33.5651, // Rawat approximate — update with exact pin from owner
    longitude: 73.2247,
  },
  hasMenu: `${SITE_URL}/#menu`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '03310479696',
    contactType: 'customer service',
    availableLanguage: ['Urdu', 'English'],
  },
};
