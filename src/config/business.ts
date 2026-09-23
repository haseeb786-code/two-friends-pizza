import { BusinessConfig } from '@/types/business';

/**
 * Centralized Business Configuration for Two Friends Pizza.
 * PLACEHOLDERS ONLY: Real contact coordinates and links will be configured by the store owner.
 */
export const BUSINESS_CONFIG: BusinessConfig = {
  name: 'Two Friends Pizza',
  tagline: 'Artisanal Wood-Fired Pizzas & Flame-Grilled Gourmet Burgers',

  contact: {
    phone: process.env.NEXT_PUBLIC_STORE_PHONE || '+00 000 0000000',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+00 000 0000000',
    email: 'contact@twofriendspizza.example.com',
  },

  location: {
    address: 'Store Address Placeholder, Main Food Street',
    city: 'City Name Placeholder',
    googleMapsUrl: 'https://maps.google.com/?q=Two+Friends+Pizza+Placeholder',
    coordinates: {
      latitude: 0.0,
      longitude: 0.0,
    },
  },

  social: {
    instagram: 'https://instagram.com/twofriendspizza_placeholder',
    facebook: 'https://facebook.com/twofriendspizza_placeholder',
  },

  hours: [
    { day: 'Monday', open: '12:00 PM', close: '11:00 PM', isOpen: true },
    { day: 'Tuesday', open: '12:00 PM', close: '11:00 PM', isOpen: true },
    { day: 'Wednesday', open: '12:00 PM', close: '11:00 PM', isOpen: true },
    { day: 'Thursday', open: '12:00 PM', close: '11:00 PM', isOpen: true },
    { day: 'Friday', open: '12:00 PM', close: '12:00 AM', isOpen: true },
    { day: 'Saturday', open: '12:00 PM', close: '12:00 AM', isOpen: true },
    { day: 'Sunday', open: '12:00 PM', close: '11:00 PM', isOpen: true },
  ],

  currency: {
    symbol: '$',
    code: 'USD',
    defaultDeliveryFee: 0,
  },
};
